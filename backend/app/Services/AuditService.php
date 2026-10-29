<?php

namespace App\Services;

use App\Jobs\DispatchAuditNotificationJob;
use App\Models\AuditEvent;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AuditService
{
    private const SENSITIVE_KEYS = [
        'password',
        'current_password',
        'new_password',
        'new_password_confirmation',
        'token',
        'access_token',
        'refresh_token',
        'id_token',
        'authorization',
        'cookie',
        'device_token',
        'api_key',
        'client_secret',
        'secret',
        'credential',
        'email',
        'sap_user',
        'sap_server_con',
    ];

    public function record(string $eventCode, array $attributes = [], ?Request $request = null): AuditEvent
    {
        $request ??= request();
        $actor = $attributes['actor'] ?? $request?->user();
        $event = AuditEvent::create([
            'actor_user_id' => $actor?->id,
            'actor_name' => $actor?->name,
            'actor_roles' => $actor instanceof User ? $actor->getRoleNames()->values()->all() : [],
            'business_domain' => $attributes['business_domain'] ?? Str::before($eventCode, '.'),
            'event_code' => $eventCode,
            'action' => $attributes['action'] ?? 'access',
            'severity' => $attributes['severity'] ?? 'info',
            'outcome' => $attributes['outcome'] ?? 'success',
            'auditable_type' => $attributes['auditable_type'] ?? null,
            'auditable_id' => $attributes['auditable_id'] ?? null,
            'subject_label' => $attributes['subject_label'] ?? null,
            'description' => $attributes['description'] ?? $eventCode,
            'metadata' => $this->sanitize($attributes['metadata'] ?? []),
            'changes_before' => $this->sanitize($attributes['changes_before'] ?? []),
            'changes_after' => $this->sanitize($attributes['changes_after'] ?? []),
            'request_id' => $attributes['request_id'] ?? null,
            'batch_id' => $attributes['batch_id'] ?? null,
            'route_name' => $request?->route()?->getName(),
            'http_method' => $request?->method(),
            'http_status' => $attributes['http_status'] ?? null,
            'ip_address' => $request?->ip(),
            'user_agent' => Str::limit((string) $request?->userAgent(), 1000, ''),
            'occurred_at' => $attributes['occurred_at'] ?? now(),
            'created_at' => now(),
        ]);

        DispatchAuditNotificationJob::dispatch($event->id)->afterCommit();

        return $event;
    }

    public function sanitize(array $payload): array
    {
        return collect($payload)->mapWithKeys(function ($value, $key) {
            $normalizedKey = Str::lower((string) $key);
            $sensitive = in_array($normalizedKey, self::SENSITIVE_KEYS, true)
                || Str::contains($normalizedKey, ['password', 'token', 'secret', 'credential']);

            if ($sensitive) {
                return [$key => '[REDACTED]'];
            }

            return [$key => is_array($value) ? $this->sanitize($value) : $value];
        })->all();
    }
}
