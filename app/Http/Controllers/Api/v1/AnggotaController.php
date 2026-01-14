<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\AnggotaRequest;
use App\Http\Resources\AnggotaResource;
use App\Models\Keanggotaan\Anggota;
use Illuminate\Http\Request;
use App\Helpers\ResponseFormatter;

class AnggotaController extends Controller
{
    /**
     * GET /api/v1/anggotas
     * List anggota dengan pagination + search + relasi alamat
     */
    public function index(Request $request)
    {
        try {
            $search = $request->input('q');
            // pastikan per_page adalah integer dan batas aman
            $perPage = (int) $request->input('per_page', 10);
            $perPage = $perPage > 0 ? min($perPage, 100) : 10;

            $query = Anggota::query()
                ->with([
                    'alamats' => function ($q) {
                        $q->select('id', 'anggota_id', 'perum_id', 'village_id', 'no_rumah', 'alamat_lainnya')
                          ->with([
                              'perum:id,nama',
                              'village:id,name'
                          ]);
                    }
                ]);

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('no_hp', 'like', "%{$search}%")
                      ->orWhere('no_kk', 'like', "%{$search}%")
                      ->orWhere('no_ktp', 'like', "%{$search}%")
                      ->orWhereHas('alamats', function ($q2) use ($search) {
                          $q2->where('no_rumah', 'like', "%{$search}%")
                             ->orWhere('alamat_lainnya', 'like', "%{$search}%")
                             ->orWhereHas('perum', function ($q3) use ($search) {
                                 $q3->where('nama', 'like', "%{$search}%");
                             })
                             ->orWhereHas('village', function ($q4) use ($search) {
                                 $q4->where('name', 'like', "%{$search}%");
                             });
                      });
                });
            }

            $anggotaPaginator = $query->paginate($perPage);

            // Gunakan resource collection agar format data konsisten untuk frontend
            $resourceCollection = AnggotaResource::collection($anggotaPaginator);

            // ResponseFormatter::paginate diharapkan meng-handle paginator atau resource collection.
            // Jika implementasimu mengharapkan paginator, ganti param pertama menjadi $anggotaPaginator.
            return ResponseFormatter::paginate($resourceCollection, 'Daftar anggota berhasil dimuat');

        } catch (\Exception $e) {
            return ResponseFormatter::error([
                'message' => 'Gagal memuat data anggota',
                'error' => $e->getMessage(),
            ], 'Error', 500);
        }
    }

    /**
     * GET /api/v1/anggotas/{id}
     */
    public function show($id)
    {
        try {
            $anggota = Anggota::with([
                'alamats' => function ($q) {
                    $q->select('id', 'anggota_id', 'perum_id', 'village_id', 'no_rumah', 'alamat_lainnya')
                      ->with([
                          'perum:id,nama',
                          'village:id,name'
                      ]);
                }
            ])->find($id);

            if (!$anggota) {
                return ResponseFormatter::error(null, 'Anggota tidak ditemukan', 404);
            }

            return ResponseFormatter::success(new AnggotaResource($anggota), 'Detail anggota berhasil dimuat');

        } catch (\Exception $e) {
            return ResponseFormatter::error([
                'message' => 'Gagal memuat detail anggota',
                'error' => $e->getMessage(),
            ], 'Error', 500);
        }
    }

    /**
     * POST /api/v1/anggotas
     */
    public function store(AnggotaRequest $request)
    {
        try {
            $data = $request->validated();

            // normalisasi nomor
            $data['no_hp'] = isset($data['no_hp']) ? preg_replace('/\D/', '', $data['no_hp']) : null;
            $data['no_ktp'] = isset($data['no_ktp']) ? preg_replace('/\D/', '', $data['no_ktp']) : null;
            $data['no_kk'] = isset($data['no_kk']) ? preg_replace('/\D/', '', $data['no_kk']) : null;

            $anggota = Anggota::create($data);

            return ResponseFormatter::success(new AnggotaResource($anggota), 'Anggota berhasil ditambahkan');

        } catch (\Exception $e) {
            return ResponseFormatter::error([
                'message' => 'Gagal menyimpan anggota',
                'error' => $e->getMessage(),
            ], 'Error', 500);
        }
    }

    /**
     * PUT /api/v1/anggotas/{id}
     */
    public function update(AnggotaRequest $request, $id)
    {
        try {
            $anggota = Anggota::find($id);

            if (!$anggota) {
                return ResponseFormatter::error(null, 'Anggota tidak ditemukan', 404);
            }

            $data = $request->validated();
            $data['no_hp'] = isset($data['no_hp']) ? preg_replace('/\D/', '', $data['no_hp']) : $anggota->no_hp;
            $data['no_ktp'] = isset($data['no_ktp']) ? preg_replace('/\D/', '', $data['no_ktp']) : $anggota->no_ktp;
            $data['no_kk'] = isset($data['no_kk']) ? preg_replace('/\D/', '', $data['no_kk']) : $anggota->no_kk;

            $anggota->update($data);

            return ResponseFormatter::success(new AnggotaResource($anggota->fresh()), 'Anggota berhasil diperbarui');

        } catch (\Exception $e) {
            return ResponseFormatter::error([
                'message' => 'Gagal memperbarui anggota',
                'error' => $e->getMessage(),
            ], 'Error', 500);
        }
    }

    /**
     * DELETE /api/v1/anggotas/{id}
     */
    public function destroy($id)
{
    try {
        $anggota = Anggota::withCount(['iurans', 'alamats'])->find($id);

        if (!$anggota) {
            return ResponseFormatter::error(null, 'Anggota tidak ditemukan', 404);
        }

        // Cegah hapus jika punya iuran
        if ($anggota->iurans_count > 0) {
            return ResponseFormatter::error([
                'reason' => 'DEPENDENT_IURANS'
            ], 'Tidak dapat menghapus: anggota memiliki riwayat iuran.', 422);
        }

        // Cegah hapus jika punya alamat
        if ($anggota->alamats_count > 0) {
            return ResponseFormatter::error([
                'reason' => 'DEPENDENT_ALAMATS'
            ], 'Tidak dapat menghapus: anggota memiliki data alamat.', 422);
        }

        $anggota->delete();

        return ResponseFormatter::success(null, 'Anggota berhasil dihapus');

    } catch (\Exception $e) {
        return ResponseFormatter::error([
            'message' => 'Gagal menghapus anggota',
            'error' => $e->getMessage(),
        ], 'Error', 500);
    }
}

}