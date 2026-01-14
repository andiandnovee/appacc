<?php

namespace App\Http\Controllers\Api\v1;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Models\Keanggotaan\Anggota;
use App\Models\Keuangan\Iuran;
use App\Models\Master\RefIuran;
use Carbon\Carbon;
use Illuminate\Http\Request;

class IuranAnggotaController extends Controller
{
    /**
     * Dapatkan data iuran anggota tertentu (untuk pengurus)
     *
     * @param  int  $anggotaId  - ID anggota yang datanya akan dilihat
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request, $anggotaId)
    {
        // Cari anggota berdasarkan ID
        $anggota = Anggota::find($anggotaId);

        if (! $anggota) {
            return ResponseFormatter::error(
                'Data anggota tidak ditemukan.',
                null,
                404
            );
        }

        // Validasi permission: pengurus hanya bisa lihat anggota dari company_code yang sama
        $user = $request->user();
        if ($user->anggota && $user->anggota->company_code !== $anggota->company_code) {
            return ResponseFormatter::error(
                'Anda tidak memiliki akses ke data anggota ini.',
                null,
                403
            );
        }

        $companyCode = $anggota->company_code;

        // Ambil jenis iuran aktif di company yang sama
        $refIurans = RefIuran::where('company_code', $companyCode)
            ->orderBy('nama_iuran')
            ->get();

        // Hitung total kewajiban per anggota (sama untuk semua anggota di company ini)
        $totalKewajiban = 0;

        foreach ($refIurans as $ref) {
            $jumlah = (float) $ref->jumlah;

            if ($ref->periode === 'bulanan') {
                $totalKewajiban += $jumlah * 12;
            } elseif (in_array($ref->periode, ['tahunan', 'sekali'], true)) {
                $totalKewajiban += $jumlah;
            }
        }

        // Ambil riwayat pembayaran anggota (hanya transaksi aktif, yang tidak dibatalkan)
        $pembayaran = Iuran::where('anggota_id', $anggotaId)
            ->where('is_canceled', false)
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
        // Hanya hitung transaksi yang belum dibatalkan
        $totalSudah = Iuran::where('anggota_id', $anggotaId)
            ->where('is_canceled', false)
            ->sum('jumlah');
        $totalBelum = max(0, $totalKewajiban - $totalSudah);

        return ResponseFormatter::success([
            'anggota' => [
                'id' => $anggota->id,
                'nama' => $anggota->nama,
                'no_induk' => $anggota->no_induk,
                'email' => $anggota->email,
                'status' => $anggota->status,
                'jenis_kelamin' => $anggota->jenis_kelamin,
                'alamat' => $anggota->alamat ? [
                    'alamat_lainnya' => $anggota->alamat->alamat_lainnya,
                    'perum' => $anggota->alamat->perum?->nama,
                    'no_rumah' => $anggota->alamat->no_rumah,
                    'village' => $anggota->alamat->village?->name,
                ] : null,
            ],
            'summary' => [
                'total_sudah_dibayar' => $totalSudah,
                'total_belum_dibayar' => $totalBelum,
                'total_kewajiban' => $totalKewajiban,
                'total_jenis_iuran' => $refIurans->count(),
            ],
            'iurans' => $result,
        ]);
    }

    /**
     * Dapatkan daftar iuran semua anggota dalam company_code yang sama
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if (! $user->anggota_id) {
            return ResponseFormatter::error(
                'Akun Anda belum terhubung dengan data anggota.',
                null,
                400
            );
        }

        $companyCode = $user->anggota->company_code;

        // Ambil semua anggota dalam company_code yang sama beserta alamat utamanya
        $anggotas = Anggota::where('company_code', $companyCode)
            ->with(['alamats.perum', 'alamats.village'])
            ->orderBy('nama')
            ->get();

        // Ambil semua ref iuran aktif di company ini sekali saja
        $refIurans = RefIuran::where('company_code', $companyCode)
            ->orderBy('nama_iuran')
            ->get();

        // Hitung total kewajiban per anggota (sama untuk semua anggota di company ini)
        $totalKewajiban = 0;

        foreach ($refIurans as $ref) {
            $jumlah = (float) $ref->jumlah;

            if ($ref->periode === 'bulanan') {
                $totalKewajiban += $jumlah * 12;
            } elseif (in_array($ref->periode, ['tahunan', 'sekali'], true)) {
                $totalKewajiban += $jumlah;
            }
        }

        $result = [];

        foreach ($anggotas as $anggota) {
            $alamat = $anggota->alamat;

            // Summary per anggota
            $totalSudah = Iuran::where('anggota_id', $anggota->id)
                ->where('is_canceled', false)
                ->sum('jumlah');
            $totalBelum = max(0, $totalKewajiban - $totalSudah);

            $result[] = [
                'anggota_id' => $anggota->id,
                'nama' => $anggota->nama,
                'kode' => $anggota->kode,
                'no_induk' => $anggota->no_induk,
                'email' => $anggota->email,
                 // Info alamat ringkas untuk list
                'perum' => $alamat?->perum?->nama,
                'no_rumah' => $alamat?->no_rumah,
                'village' => $alamat?->village?->name,
                'total_sudah_dibayar' => $totalSudah,
                'total_belum_dibayar' => $totalBelum,
                'total_kewajiban' => $totalKewajiban,
            ];
        }

        return ResponseFormatter::success([
            'company_code' => $companyCode,
            'total_anggota' => count($result),
            'total_kewajiban_per_anggota' => $totalKewajiban,
            'anggotas' => $result,
        ]);
    }
}
