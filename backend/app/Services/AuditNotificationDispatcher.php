<?php

namespace App\Services;

use App\Models\AuditEvent;
use App\Models\AuditNotification;
use App\Models\AuditNotificationRule;
use App\Models\NotificationLog;
use App\Models\User;
use App\Models\UserDevice;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class AuditNotificationDispatcher
{
    public function __construct(private FcmService $fcmService) {}

    public function dispatch(AuditEvent $event): void
    {
        $rule = AuditNotificationRule::query()
            ->where('event_code', $event->event_code)
            ->where('is_active', true)
            ->first();

        if (! $rule || $rule->mode === 'log_only'
            || (! $rule->notify_in_app && ! $rule->notify_push)) {
            return;
        }

        $users = $this->resolveRecipients($event, $rule->recipient_targets ?? []);
        if ($users->isEmpty()) {
            return;
        }

        $group = $this->notificationGroup($event);
        if ($group !== null) {
            $this->dispatchGrouped($event, $rule, $users, $group);

            return;
        }

        foreach ($users as $user) {
            $notification = null;
            if ($rule->notify_in_app) {
                $notification = AuditNotification::firstOrCreate(
                    ['audit_event_id' => $event->id, 'user_id' => $user->id],
                    [
                        'title' => $rule->label,
                        'body' => ($event->actor_name ?? ($event->event_code === 'auth.login.failed' ? 'Pengguna tidak terautentikasi' : 'Sistem')).' · '.$event->description,
                        'link' => '/notifications',
                    ]
                );
            }

            if (! $rule->notify_push || ! config('services.fcm.enabled')) {
                continue;
            }

            $devices = UserDevice::query()
                ->where('user_id', $user->id)
                ->where('is_active', true)
                ->get();

            foreach ($devices as $device) {
                $this->fcmService->sendToDevice(
                    $device,
                    $event,
                    $notification,
                    $rule->label,
                    ($event->actor_name ?? ($event->event_code === 'auth.login.failed' ? 'Pengguna tidak terautentikasi' : 'Sistem')).' · '.$event->description
                );
            }
        }
    }

    /** @return array{field: string, value: int|string, title: string, body: string}|null */
    private function notificationGroup(AuditEvent $event): ?array
    {
        $metadata = $event->metadata ?? [];
        $field = match ($event->event_code) {
            'vehicle.logbook.created', 'vehicle.logbook.updated', 'vehicle.logbook.deleted' => 'vehicle_cost_header_id',
            'receipt.status.created' => 'receipt_id',
            'import.po.completed', 'import.f53.completed', 'import.pph.completed', 'receipt.icat.imported',
            'import.po.failed', 'import.f53.failed', 'import.pph.failed' => 'notification_batch_id',
            default => null,
        };
        $value = $field ? data_get($metadata, $field) : null;

        if (! $field || ! is_scalar($value) || (string) $value === '') {
            return null;
        }

        $title = str_starts_with($event->event_code, 'vehicle.logbook.')
            ? 'Logbook diperbarui'
            : ($event->event_code === 'receipt.status.created' ? 'Status receipt diperbarui' : 'Impor diproses');

        return ['field' => $field, 'value' => $value, 'title' => $title, 'body' => $event->description];
    }

    private function dispatchGrouped(AuditEvent $event, AuditNotificationRule $rule, Collection $users, array $group): void
    {
        $lockKey = 'audit-notification-group:'.hash('sha256', implode('|', [
            $event->event_code,
            $group['field'],
            (string) $group['value'],
            $group['field'] === 'notification_batch_id' ? (string) $event->actor_user_id : '',
        ]));

        Cache::lock($lockKey, 60)->block(20, function () use ($event, $rule, $users, $group): void {
            $this->dispatchGroupedWithLock($event, $rule, $users, $group);
        });
    }

    private function dispatchGroupedWithLock(AuditEvent $event, AuditNotificationRule $rule, Collection $users, array $group): void
    {
        $field = $group['field'];
        $value = $group['value'];
        $windowStart = $field === 'notification_batch_id' ? null : now()->subMinutes(5);
        $groupEvents = fn () => AuditEvent::query()
            ->where('event_code', $event->event_code)
            ->where("metadata->{$field}", $value)
            ->when($field === 'notification_batch_id', fn ($query) => $query->where('actor_user_id', $event->actor_user_id));

        $body = $group['body'];
        $actorName = $event->actor_name ?? 'Sistem';
        if ($field === 'vehicle_cost_header_id') {
            $header = DB::table('vehicle_cost_headers')
                ->join('vehicles', 'vehicles.id', '=', 'vehicle_cost_headers.vehicle_id')
                ->where('vehicle_cost_headers.id', $value)
                ->select('vehicles.plate_number', 'vehicle_cost_headers.month', 'vehicle_cost_headers.year')
                ->first();
            $subject = $header
                ? sprintf('%s · %02d/%s', $header->plate_number, $header->month, $header->year)
                : 'kendaraan';
            $count = $groupEvents()->where('created_at', '>=', $windowStart)->count();
            $body = sprintf('%d aktivitas: %s %s; terakhir oleh %s.', $count, $event->description, $subject, $actorName);
        } elseif ($field === 'receipt_id') {
            $count = $groupEvents()->where('created_at', '>=', $windowStart)->count();
            $status = data_get($event->changes_after, 'status_value');
            $statusDetail = $status ? ' Status terbaru: '.$status.'.' : '';
            $body = sprintf('%d perubahan status pada Receipt #%s oleh %s.%s', $count, $value, $actorName, $statusDetail);
        } elseif ($field === 'notification_batch_id') {
            $batchEvents = $groupEvents()->get(['metadata']);
            $partCount = $batchEvents->count();
            $rowCount = $batchEvents->sum(fn (AuditEvent $batchEvent) => (int) data_get($batchEvent->metadata, 'row_count', 0));
            $body = sprintf('%s %d baris dalam %d bagian; oleh %s.', $event->description, $rowCount, $partCount, $actorName);
        }

        foreach ($users as $user) {
            $notification = null;
            if ($rule->notify_in_app) {
                $notification = AuditNotification::query()
                    ->where('user_id', $user->id)
                    ->where('title', $group['title'])
                    ->when($windowStart, fn ($query) => $query->where('created_at', '>=', $windowStart))
                    ->whereHas('event', fn ($query) => $query
                        ->where('event_code', $event->event_code)
                        ->where("metadata->{$field}", $value)
                        ->when($field === 'notification_batch_id', fn ($query) => $query->where('actor_user_id', $event->actor_user_id)))
                    ->latest('created_at')
                    ->first();

                if ($notification) {
                    $notification->update(['audit_event_id' => $event->id, 'body' => $body]);
                } else {
                    $notification = AuditNotification::create([
                        'user_id' => $user->id,
                        'audit_event_id' => $event->id,
                        'title' => $group['title'],
                        'body' => $body,
                        'link' => '/notifications',
                    ]);
                }
            }

            if (! $rule->notify_push || ! config('services.fcm.enabled')) {
                continue;
            }

            $devices = UserDevice::query()->where('user_id', $user->id)->where('is_active', true)->get();
            foreach ($devices as $device) {
                $alreadySent = NotificationLog::query()
                    ->where('user_device_id', $device->id)
                    ->where('channel', 'fcm')
                    ->when($windowStart, fn ($query) => $query->where('created_at', '>=', $windowStart))
                    ->whereHas('auditEvent', fn ($query) => $query
                        ->where('event_code', $event->event_code)
                        ->where("metadata->{$field}", $value)
                        ->when($field === 'notification_batch_id', fn ($query) => $query->where('actor_user_id', $event->actor_user_id)))
                    ->exists();

                if (! $alreadySent) {
                    $this->fcmService->sendToDevice($device, $event, $notification, $group['title'], $body);
                }
            }
        }
    }

    /** @param array<int, string> $targets
     * @return Collection<int, User>
     */
    private function resolveRecipients(AuditEvent $event, array $targets): Collection
    {
        $users = collect();

        foreach ($targets as $target) {
            if ($target === 'actor' && $event->actor_user_id) {
                $users->push(User::find($event->actor_user_id));

                continue;
            }

            if (preg_match('/^user:(\d+)$/', $target, $matches)) {
                $users->push(User::find((int) $matches[1]));

                continue;
            }

            if (str_starts_with($target, 'role:')) {
                $role = Role::query()
                    ->where('name', substr($target, 5))
                    ->where('guard_name', 'api')
                    ->first();
                if ($role) {
                    $users = $users->merge($role->users()->get());
                }
            }
        }

        return $users->filter(fn ($user) => $user instanceof User && $user->is_active)
            ->unique('id')
            ->values();
    }
}
