<?php

namespace App\Http\Controllers\Api\v1;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserAnggotaRequestResource;
use App\Models\Core\User;
use App\Models\Keanggotaan\Alamat;
use App\Models\Keanggotaan\UserAnggotaRequest;
use App\Services\FcmService;
use Illuminate\Support\Facades\DB;

class UserAnggotaApprovalController extends Controller
{
    protected FcmService $fcm;

    public function __construct(FcmService $fcm)
    {
        $this->fcm = $fcm;
    }

    /**
     * GET /api/v1/anggota-requests
     * Hanya sekretaris.
     */
    public function index()
    {
        try {

            $data = UserAnggotaRequest::with(['user', 'anggota', 'perum', 'village'])
                ->where('status', 'pending')
                ->latest()
                ->paginate(10);

            return ResponseFormatter::paginate(
                UserAnggotaRequestResource::collection($data),
                'Daftar pengajuan anggota berhasil dimuat'
            );
        } catch (\Exception $e) {
            return ResponseFormatter::error(
                ['error' => $e->getMessage()],
                'Gagal memuat daftar pengajuan',
                500
            );
        }
    }

    /**
     * POST /api/v1/anggota-requests/{id}/approve
     */
    public function approve($id)
    {
        try {
            $req = UserAnggotaRequest::with(['user', 'anggota'])
                ->findOrFail($id);

            if ($req->status !== 'pending') {
                return ResponseFormatter::error(
                    null,
                    'Status tidak valid',
                    422
                );
            }

            DB::transaction(function () use ($req) {

                // Hubungkan user ke anggota
                $req->user->update([
                    'anggota_id' => $req->anggota_id,
                ]);

                // Update no hp dan email kalau diberikan
                $updateData = [];
                if ($req->no_hp) {
                    $updateData['no_hp'] = $req->no_hp;
                }
                if ($req->email) {
                    $updateData['email'] = $req->email;
                }
                if (!empty($updateData)) {
                    $req->anggota->update($updateData);
                }

                // Tambahkan alamat baru
                Alamat::create([
                    'anggota_id' => $req->anggota_id,
                    'perum_id' => $req->perum_id,
                    'no_rumah' => $req->no_rumah,
                    'alamat_lainnya' => $req->alamat_lainnya,
                    'village_id' => $req->village_id,
                ]);

                // ====== NEW: Tambahkan role anggota ======
                if (! $req->user->hasRole('anggota')) {
                    $req->user->assignRole('anggota');
                }

                // Update status request
                $req->update(['status' => 'approved']);
            });

            // Kirim notifikasi ke semua device milik user pemohon
            $user = $req->user;
            $anggota = $req->anggota;

            if ($user) {
                $devices = $user->devices()->where('is_active', true)->get();

                if ($devices->isNotEmpty()) {
                    $this->fcm->sendToUserDevices(
                        $devices,
                        [
                            'type' => 'anggota_request_approved',
                            'title' => 'Pengajuan keanggotaan disetujui',
                            'body' => $anggota
                                ? "Pengajuan keanggotaan Anda untuk {$anggota->nama} telah disetujui."
                                : 'Pengajuan keanggotaan Anda telah disetujui.',
                            'data' => [
                                'request_id' => $req->id,
                                'status' => $req->status,
                                'anggota_id' => $anggota?->id,
                                'role' => 'pemohon',
                            ],
                        ],
                        $anggota
                    );
                }
            }

            // Kirim notifikasi ke semua user yang terhubung dengan anggota (anggota baru)
            if ($anggota) {
                $anggotaUsers = User::where('anggota_id', $anggota->id)
                    ->when($user, function ($q) use ($user) {
                        $q->where('id', '!=', $user->id);
                    })
                    ->with(['devices' => function ($q) {
                        $q->where('is_active', true);
                    }])
                    ->get();

                foreach ($anggotaUsers as $anggotaUser) {
                    $devices = $anggotaUser->devices;
                    if ($devices->isEmpty()) {
                        continue;
                    }

                    $this->fcm->sendToUserDevices(
                        $devices,
                        [
                            'type' => 'anggota_request_approved',
                            'title' => 'Keanggotaan terhubung ke aplikasi',
                            'body' => "Data keanggotaan {$anggota->nama} kini sudah aktif di aplikasi.",
                            'data' => [
                                'request_id' => $req->id,
                                'status' => $req->status,
                                'anggota_id' => $anggota->id,
                                'role' => 'anggota',
                            ],
                        ],
                        $anggota
                    );
                }
            }

            return ResponseFormatter::success(
                null,
                'Pengajuan berhasil disetujui dan role anggota diberikan'
            );
        } catch (\Exception $e) {
            return ResponseFormatter::error(
                ['error' => $e->getMessage()],
                'Gagal memproses approval',
                500
            );
        }
    }

    /**
     * POST /api/v1/anggota-requests/{id}/reject
     */
    public function reject($id)
    {
        try {
            $req = UserAnggotaRequest::findOrFail($id);

            if ($req->status !== 'pending') {
                return ResponseFormatter::error(
                    null,
                    'Status tidak valid',
                    422
                );
            }

            $req->update(['status' => 'rejected']);

            return ResponseFormatter::success(
                null,
                'Pengajuan ditolak'
            );
        } catch (\Exception $e) {
            return ResponseFormatter::error(
                ['error' => $e->getMessage()],
                'Gagal menolak pengajuan',
                500
            );
        }
    }
}
