<?php

namespace App\Http\Controllers\Api\v1;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Models\Keuangan\Iuran;
use App\Models\Master\RefIuran;
use Carbon\Carbon;
use Illuminate\Http\Request;

class IuranSelfController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if (! $user->anggota_id) {
            return ResponseFormatter::error(
                'Akun ini belum terhubung dengan data anggota.',
                null,
                400
            );
        }

        $anggotaId = $user->anggota_id;

        // Ambil jenis iuran
        $companyCode = $user->anggota->company_code;

        $refIurans = RefIuran::where('company_code', $companyCode)
            ->orderBy('nama_iuran')
            ->get();

        // Ambil riwayat pembayaran anggota
        $pembayaran = Iuran::where('anggota_id', $anggotaId)
            ->orderBy('tanggal_bayar', 'desc')
            ->get()
            ->groupBy('ref_iuran_id');

        $result = [];

        foreach ($refIurans as $ref) {

            $riwayat = $pembayaran[$ref->id] ?? collect([]);

            // ===== Status iuran bulanan =====
            $statusBulan = [];

            if ($ref->periode === 'bulanan') {
                for ($i = 1; $i <= 12; $i++) {
                    $bulan = str_pad($i, 2, '0', STR_PAD_LEFT);

                    $isPaid = $riwayat->contains(function ($item) use ($bulan) {

                        // normalisasi, ubah "JANUARI" → "01"
                        $periode = strtoupper($item->periode_bulan);

                        $map = [
                            'JANUARI' => '01',
                            'FEBRUARI' => '02',
                            'MARET' => '03',
                            'APRIL' => '04',
                            'MEI' => '05',
                            'JUNI' => '06',
                            'JULI' => '07',
                            'AGUSTUS' => '08',
                            'SEPTEMBER' => '09',
                            'OKTOBER' => '10',
                            'NOVEMBER' => '11',
                            'DESEMBER' => '12',
                        ];

                        // jika bulan text → convert ke numeric
                        if (isset($map[$periode])) {
                            $periode = $map[$periode];
                        }

                        return $periode === $bulan;
                    });

                    $statusBulan[$bulan] = $isPaid ? 'paid' : 'unpaid';
                }
            }

            // ===== Status iuran tahunan / sekali =====
            $statusUmum = null;

            if ($ref->periode === 'sekali') {
                $statusUmum = $riwayat->count() > 0 ? 'paid' : 'unpaid';
            }

            if ($ref->periode === 'tahunan') {
                $tahun = Carbon::now()->year;
                $isPaid = $riwayat->contains(function ($item) use ($tahun) {
                    return Carbon::parse($item->tanggal_bayar)->year == $tahun;
                });
                $statusUmum = $isPaid ? 'paid' : 'unpaid';
            }

            $result[] = [
                'id' => $ref->id,
                'nama_iuran' => $ref->nama_iuran,
                'periode' => $ref->periode,
                'jumlah' => floatval($ref->jumlah),
                'periode_start' => $ref->tgl_awal_periode,
                'periode_end' => $ref->tgl_akhir_periode,
                'status_bulan' => $statusBulan,
                'status' => $statusUmum,
                'payments' => $riwayat->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'tanggal_bayar' => $item->tanggal_bayar,
                        'jumlah' => $item->jumlah,
                        'periode_bulan' => $item->periode_bulan,
                        'catatan' => $item->catatan,
                    ];
                }),
            ];
        }

        // ===== Summary =====
        $totalSudah = Iuran::where('anggota_id', $anggotaId)->sum('jumlah');
        $totalBelum = 0;

        foreach ($refIurans as $ref) {

            if ($ref->periode === 'sekali') {
                if (! isset($pembayaran[$ref->id])) {
                    $totalBelum += $ref->jumlah;
                }
            }

            if ($ref->periode === 'bulanan') {
                $paid = isset($pembayaran[$ref->id])
                    ? $pembayaran[$ref->id]->count()
                    : 0;

                $totalBelum += max(0, 12 - $paid) * $ref->jumlah;
            }
        }

        return ResponseFormatter::success([
            'summary' => [
                'total_sudah_dibayar' => $totalSudah,
                'total_belum_dibayar' => $totalBelum,
                'total_jenis_iuran' => $refIurans->count(),
            ],
            'iurans' => $result,
        ]);
    }
}
