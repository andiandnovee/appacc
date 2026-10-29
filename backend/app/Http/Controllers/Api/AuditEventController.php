<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditEvent;
use App\Models\AuditNotificationRule;
use App\Services\AuditService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;

class AuditEventController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'business_domain' => ['nullable', 'string', 'max:50'],
            'event_code' => ['nullable', 'string', 'max:100'],
            'actor_user_id' => ['nullable', 'integer'],
            'severity' => ['nullable', Rule::in(['info', 'notice', 'warning', 'critical'])],
            'outcome' => ['nullable', Rule::in(['success', 'failed', 'denied', 'partial'])],
            'search' => ['nullable', 'string', 'max:100'],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $events = AuditEvent::query()
            ->with('actor:id,name')
            ->when($validated['business_domain'] ?? null, fn ($query, $value) => $query->where('business_domain', $value))
            ->when($validated['event_code'] ?? null, fn ($query, $value) => $query->where('event_code', $value))
            ->when($validated['actor_user_id'] ?? null, fn ($query, $value) => $query->where('actor_user_id', $value))
            ->when($validated['severity'] ?? null, fn ($query, $value) => $query->where('severity', $value))
            ->when($validated['outcome'] ?? null, fn ($query, $value) => $query->where('outcome', $value))
            ->when($validated['date_from'] ?? null, fn ($query, $value) => $query->whereDate('occurred_at', '>=', $value))
            ->when($validated['date_to'] ?? null, fn ($query, $value) => $query->whereDate('occurred_at', '<=', $value))
            ->when($validated['search'] ?? null, function ($query, $search) {
                $term = '%'.addcslashes($search, '%_\\').'%';
                $query->where(function ($searchQuery) use ($term) {
                    $searchQuery->where('description', 'like', $term)
                        ->orWhere('event_code', 'like', $term)
                        ->orWhere('subject_label', 'like', $term)
                        ->orWhere('actor_name', 'like', $term);
                });
            })
            ->latest('occurred_at')
            ->paginate($validated['per_page'] ?? 25);

        return response()->json([
            'data' => $events->getCollection()->map(fn (AuditEvent $event) => [
                'id' => $event->id,
                'event_code' => $event->event_code,
                'business_domain' => $event->business_domain,
                'action' => $event->action,
                'severity' => $event->severity,
                'outcome' => $event->outcome,
                'subject_label' => $event->subject_label,
                'description' => $event->description,
                'actor_user_id' => $event->actor_user_id,
                'actor_name' => $event->actor_name,
                'actor' => $event->actor,
                'metadata' => $event->metadata,
                'changes_before' => $event->changes_before,
                'changes_after' => $event->changes_after,
                'ip_address' => $event->ip_address,
                'user_agent' => $event->user_agent,
                'occurred_at' => $event->occurred_at,
            ]),
            'meta' => [
                'current_page' => $events->currentPage(),
                'last_page' => $events->lastPage(),
                'per_page' => $events->perPage(),
                'total' => $events->total(),
            ],
        ]);
    }

    public function catalog()
    {
        return response()->json([
            'data' => AuditNotificationRule::query()
                ->orderBy('business_domain')
                ->orderBy('event_code')
                ->get(),
        ]);
    }

    public function updateRule(Request $request, AuditNotificationRule $rule, AuditService $auditService)
    {
        $validated = $request->validate([
            'notify_in_app' => ['required', 'boolean'],
            'notify_push' => ['required', 'boolean'],
            'is_active' => ['required', 'boolean'],
            'recipient_targets' => ['nullable', 'array', 'max:20'],
            'recipient_targets.*' => ['string', 'max:100', 'regex:/^(actor|role:[A-Za-z0-9._-]+|user:[0-9]+)$/'],
        ]);

        $targets = collect($validated['recipient_targets'] ?? [])->unique()->values();
        foreach ($targets as $target) {
            if (str_starts_with($target, 'role:')) {
                $exists = Role::query()
                    ->where('name', substr($target, 5))
                    ->where('guard_name', 'api')
                    ->exists();
                if (! $exists) {
                    return response()->json(['message' => "Role penerima {$target} tidak ditemukan."], 422);
                }
            } elseif (str_starts_with($target, 'user:')) {
                $exists = \App\Models\User::query()->whereKey(substr($target, 5))->exists();
                if (! $exists) {
                    return response()->json(['message' => "User penerima {$target} tidak ditemukan."], 422);
                }
            }
        }

        $wantsDelivery = $validated['notify_in_app'] || $validated['notify_push'];
        if ($validated['is_active'] && $wantsDelivery && $targets->isEmpty()) {
            return response()->json([
                'message' => 'Tentukan minimal satu penerima sebelum mengaktifkan notifikasi.',
            ], 422);
        }

        $before = $rule->only(['notify_in_app', 'notify_push', 'is_active', 'recipient_targets']);
        $rule->update([
            'notify_in_app' => $validated['notify_in_app'],
            'notify_push' => $validated['notify_push'],
            'is_active' => $validated['is_active'],
            'recipient_targets' => $targets->all(),
            'mode' => $wantsDelivery ? 'notify' : 'log_only',
            'updated_by' => $request->user()->id,
        ]);

        $auditService->record('admin.audit_rule.updated', [
            'business_domain' => 'admin',
            'action' => 'update',
            'severity' => 'notice',
            'auditable_type' => AuditNotificationRule::class,
            'auditable_id' => $rule->id,
            'subject_label' => $rule->event_code,
            'description' => "Aturan notifikasi {$rule->event_code} diperbarui.",
            'changes_before' => $before,
            'changes_after' => $rule->only(array_keys($before)),
        ], $request);

        return response()->json(['data' => $rule->fresh()]);
    }
}
