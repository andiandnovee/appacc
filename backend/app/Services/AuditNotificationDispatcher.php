<?php

namespace App\Services;

use App\Models\AuditEvent;
use App\Models\AuditNotification;
use App\Models\AuditNotificationRule;
use App\Models\NotificationLog;
use App\Models\User;
use App\Models\UserDevice;
use Illuminate\Support\Collection;
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

        $logbookGroup = $event->event_code === 'vehicle.logbook.created'
            ? data_get($event->metadata, 'vehicle_cost_header_id')
            : null;

        if ($logbookGroup !== null) {
            $header = DB::table('vehicle_cost_headers')
                ->join('vehicles', 'vehicles.id', '=', 'vehicle_cost_headers.vehicle_id')
                ->where('vehicle_cost_headers.id', $logbookGroup)
                ->select('vehicles.plate_number', 'vehicle_cost_headers.month', 'vehicle_cost_headers.year')
                ->first();
            $subject = $header
                ? sprintf('%s · %02d/%s', $header->plate_number, $header->month, $header->year)
                : 'kendaraan';
            $notificationTitle = 'Logbook diperbarui';
            $notificationBody = 'Baris logbook ditambahkan untuk '.$subject.'.';

            foreach ($users as $user) {
                if ($rule->notify_in_app) {
                    $existing = AuditNotification::query()
                        ->where('user_id', $user->id)
                        ->where('title', $notificationTitle)
                        ->where('created_at', '>=', now()->subMinutes(5))
                        ->whereHas('event', fn ($query) => $query
                            ->where('event_code', 'vehicle.logbook.created')
                            ->where('metadata->vehicle_cost_header_id', $logbookGroup))
                        ->latest('created_at')
                        ->first();

                    if ($existing) {
                        $existing->update(['audit_event_id' => $event->id, 'body' => $notificationBody]);
                    } else {
                        AuditNotification::create([
                            'user_id' => $user->id,
                            'audit_event_id' => $event->id,
                            'title' => $notificationTitle,
                            'body' => $notificationBody,
                            'link' => '/notifications',
                        ]);
                    }
                }

                if ($rule->notify_push && config('services.fcm.enabled')) {
                    $devices = UserDevice::query()
                        ->where('user_id', $user->id)
                        ->where('is_active', true)
                        ->get();

                    foreach ($devices as $device) {
                        $alreadySentForGroup = NotificationLog::query()
                            ->where('user_device_id', $device->id)
                            ->where('channel', 'fcm')
                            ->where('status', 'sent')
                            ->where('created_at', '>=', now()->subMinutes(5))
                            ->whereHas('auditEvent', fn ($query) => $query
                                ->where('event_code', 'vehicle.logbook.created')
                                ->where('metadata->vehicle_cost_header_id', $logbookGroup));

                        if ($alreadySentForGroup->exists()) {
                            continue;
                        }

                        $this->fcmService->sendToDevice($device, $event, null, $notificationTitle, $notificationBody);
                    }
                }
            }

            return;
        }

        foreach ($users as $user) {
            $notification = null;
            if ($rule->notify_in_app) {
                $notification = AuditNotification::firstOrCreate(
                    ['audit_event_id' => $event->id, 'user_id' => $user->id],
                    [
                        'title' => $rule->label,
                        'body' => $event->description,
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
                    $event->description
                );
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
