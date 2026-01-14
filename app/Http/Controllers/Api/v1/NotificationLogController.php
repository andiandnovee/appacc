<?php

namespace App\Http\Controllers\Api\v1;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Models\Core\NotificationLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NotificationLogController extends Controller
{
    /**
     * Endpoint sederhana untuk melihat daftar log notifikasi (opsional, untuk debugging).
     */
    public function index(Request $request)
    {
        $query = NotificationLog::query()->latest();

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->integer('user_id'));
        }

        if ($request->filled('anggota_id')) {
            $query->where('anggota_id', $request->integer('anggota_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->get('status'));
        }

        if ($request->filled('type')) {
            $query->where('type', $request->get('type'));
        }

        $perPage = (int) $request->get('per_page', 20);

        $logs = $query->paginate($perPage);

        return ResponseFormatter::success($logs, 'Daftar log notifikasi berhasil dimuat');
    }

    /**
     * Endpoint untuk mencatat satu log notifikasi via HTTP (misalnya dari tooling).
     */
    public function store(Request $request)
    {
        $rules = [
            'user_id' => 'nullable|exists:users,id',
            'anggota_id' => 'nullable|exists:anggotas,id',
            'device_token' => 'nullable|string|max:255',
            'channel' => 'nullable|string|max:50',
            'type' => 'required|string|max:100',
            'title' => 'nullable|string|max:255',
            'body' => 'nullable|string',
            'data_payload' => 'nullable|array',
            'status' => 'nullable|in:pending,sent,failed',
            'sent_at' => 'nullable|date',
            'fcm_response' => 'nullable',
            'error_message' => 'nullable|string',
        ];

        $v = Validator::make($request->all(), $rules);
        if ($v->fails()) {
            return ResponseFormatter::error('Validasi gagal', $v->errors(), 422);
        }

        $log = self::logNotification([
            'user_id' => $request->input('user_id'),
            'anggota_id' => $request->input('anggota_id'),
            'device_token' => $request->input('device_token'),
            'channel' => $request->input('channel', 'fcm'),
            'type' => $request->input('type'),
            'title' => $request->input('title'),
            'body' => $request->input('body'),
            'data_payload' => $request->input('data_payload'),
            'status' => $request->input('status', 'pending'),
            'sent_at' => $request->input('sent_at'),
            'fcm_response' => $request->input('fcm_response'),
            'error_message' => $request->input('error_message'),
        ]);

        return ResponseFormatter::success($log, 'Log notifikasi berhasil disimpan', 201);
    }

    /**
     * Method statis yang bisa dipanggil dari controller lain
     * untuk mencatat log notifikasi tanpa perlu membuat Request.
     *
     * Contoh di controller lain:
     * NotificationLogController::logNotification([
     *     'user_id' => $user->id ?? null,
     *     'anggota_id' => $anggota->id ?? null,
     *     'device_token' => $token,
     *     'type' => 'tagihan_iuran',
     *     'title' => 'Tagihan Iuran',
     *     'body' => 'Silakan bayar iuran bulan ini',
     *     'data_payload' => [...],
     *     'status' => 'sent',
     *     'fcm_response' => $fcmResponseArray,
     * ]);
     */
    public static function logNotification(array $attributes): NotificationLog
    {
        $dataPayload = $attributes['data_payload'] ?? null;
        $fcmResponse = $attributes['fcm_response'] ?? null;

        return NotificationLog::create([
            'user_id' => $attributes['user_id'] ?? null,
            'anggota_id' => $attributes['anggota_id'] ?? null,
            'device_token' => $attributes['device_token'] ?? null,
            'channel' => $attributes['channel'] ?? 'fcm',
            'type' => $attributes['type'] ?? null,
            'title' => $attributes['title'] ?? null,
            'body' => $attributes['body'] ?? null,
            'data_payload' => $dataPayload,
            'status' => $attributes['status'] ?? 'pending',
            'sent_at' => $attributes['sent_at'] ?? null,
            'fcm_response' => $fcmResponse ? json_encode($fcmResponse) : null,
            'error_message' => $attributes['error_message'] ?? null,
        ]);
    }
}

