<?php

namespace App\Http\Controllers\Api\v1;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserAnggotaLinkRequest;
use App\Http\Resources\UserAnggotaRequestResource;
use App\Models\Keanggotaan\UserAnggotaRequest;
use App\Services\FcmService;
use Illuminate\Support\Facades\Auth;

class UserAnggotaRequestController extends Controller
{
    protected FcmService $fcm;

    public function __construct(FcmService $fcm)
    {
        $this->fcm = $fcm;
    }

    /**
     * POST /api/v1/user/anggota-request
     * User mengajukan permintaan penautan anggota.
     */
    public function store(UserAnggotaLinkRequest $request)
    {
        try {

            $user = Auth::user();

            if ($user->anggota_id !== null) {
                return ResponseFormatter::error(
                    null,
                    'Anda sudah terhubung ke data anggota.',
                    422
                );
            }

            $pending = UserAnggotaRequest::where('user_id', $user->id)
                ->where('status', 'pending')
                ->first();

            if ($pending) {
                return ResponseFormatter::error(
                    null,
                    'Anda masih memiliki pengajuan yang menunggu approval.',
                    422
                );
            }

            $data = $request->validated();

            $data['user_id'] = $user->id;

            $req = UserAnggotaRequest::create($data);

            // Kirim notifikasi ke semua device milik user pemohon (jika ada)
            $devices = $user->devices()->where('is_active', true)->get();
            if ($devices->isNotEmpty()) {
                $this->fcm->sendToUserDevices(
                    $devices,
                    [
                        'type' => 'anggota_request_created',
                        'title' => 'Pengajuan keanggotaan terkirim',
                        'body' => 'Pengajuan keanggotaan Anda sedang menunggu persetujuan pengurus.',
                        'data' => [
                            'request_id' => $req->id,
                            'status' => $req->status,
                        ],
                    ],
                    $req->anggota // biasanya null pada saat ini
                );
            }

            return ResponseFormatter::success(
                new UserAnggotaRequestResource($req),
                'Pengajuan berhasil dikirim'
            );

        } catch (\Exception $e) {
            return ResponseFormatter::error(
                ['error' => $e->getMessage()],
                'Terjadi kesalahan',
                500
            );
        }
    }

    /**
     * GET /api/v1/user/anggota-request/status
     */
    public function status()
    {
        try {
            $user = Auth::user();

            $req = UserAnggotaRequest::with(['anggota', 'perum', 'village'])
                ->where('user_id', $user->id)
                ->latest()
                ->first();

            return ResponseFormatter::success(
                $req ? new UserAnggotaRequestResource($req) : null,
                'Status pengajuan berhasil dimuat'
            );

        } catch (\Exception $e) {
            return ResponseFormatter::error(
                ['error' => $e->getMessage()],
                'Gagal memuat status',
                500
            );
        }
    }
}
