<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditNotification;
use Illuminate\Http\Request;

class AuditNotificationController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'unread_only' => ['nullable', 'boolean'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $notifications = AuditNotification::query()
            ->with('event:id,event_code,business_domain,actor_name,action,subject_label,description,occurred_at')
            ->where('user_id', $request->user()->id)
            ->when($validated['unread_only'] ?? false, fn ($query) => $query->whereNull('read_at'))
            ->latest()
            ->paginate($validated['per_page'] ?? 20);

        return response()->json([
            'data' => $notifications->items(),
            'meta' => [
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'per_page' => $notifications->perPage(),
                'total' => $notifications->total(),
            ],
        ]);
    }

    public function unreadCount(Request $request)
    {
        return response()->json([
            'data' => [
                'count' => AuditNotification::query()
                    ->where('user_id', $request->user()->id)
                    ->whereNull('read_at')
                    ->count(),
            ],
        ]);
    }

    public function markRead(Request $request, string $id)
    {
        $notification = AuditNotification::query()
            ->where('user_id', $request->user()->id)
            ->find($id);

        if (! $notification) {
            return response()->json(['message' => 'Notifikasi tidak ditemukan.'], 404);
        }

        $notification->update(['read_at' => $notification->read_at ?? now()]);

        return response()->json(['data' => $notification->fresh()]);
    }

    public function markAllRead(Request $request)
    {
        $updated = AuditNotification::query()
            ->where('user_id', $request->user()->id)
            ->whereNull('read_at')
            ->update(['read_at' => now(), 'updated_at' => now()]);

        return response()->json(['data' => ['updated' => $updated]]);
    }
}
