<?php

namespace App\Services;

use App\Models\AuditEvent;
use App\Models\AuditNotification;
use App\Models\AuditNotificationRule;
use App\Models\User;
use App\Models\UserDevice;
use Illuminate\Support\Collection;
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
