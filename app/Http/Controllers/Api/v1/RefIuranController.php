<?php

namespace App\Http\Controllers\Api\v1;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Http\Requests\RefIuranRequest;
use App\Models\Master\RefIuran;
use Illuminate\Http\Request;

class RefIuranController extends Controller
{
    private string $company = 'BSKM';

    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index(Request $request)
    {
        $query = RefIuran::where('company_code', $this->company);

        /*
        |--------------------------------------------------------------------------
        | 1. Filter Enum Periode
        |--------------------------------------------------------------------------
        | contoh URL:
        |   /api/v1/ref-iuran?periode=bulanan
        |
        | nilai periode: bulanan | tahunan | sekali
        */
        if ($request->filled('periode')) {
            $query->where('periode', $request->periode);
        }

        /*
        |--------------------------------------------------------------------------
        | 2. Filter Tanggal (tgl_awal_periode – tgl_akhir_periode)
        |--------------------------------------------------------------------------
        | contoh:
        |   /api/v1/ref-iuran?tgl_awal=2025-01-01&tgl_akhir=2025-12-31
        |
        | controller ini fleksibel: boleh kirim salah satu atau keduanya.
        */
        if ($request->filled('tgl_awal')) {
            $query->whereDate('tgl_awal_periode', '>=', $request->tgl_awal);
        }

        if ($request->filled('tgl_akhir')) {
            $query->whereDate('tgl_akhir_periode', '<=', $request->tgl_akhir);
        }

        /*
        |--------------------------------------------------------------------------
        | 3. Filter Search (nama_iuran)
        |--------------------------------------------------------------------------
        */
        if ($request->filled('search')) {
            $query->where('nama_iuran', 'like', '%'.$request->search.'%');
        }

        /*
        |--------------------------------------------------------------------------
        | 4. Sorting
        |--------------------------------------------------------------------------
        */
        $query->orderBy('tgl_awal_periode', 'asc');

        /*
        |--------------------------------------------------------------------------
        | 5. Pagination
        |--------------------------------------------------------------------------
        */
        $data = $query->paginate(10);

        return ResponseFormatter::success($data, 'Daftar iuran berhasil diambil');
    }

    public function store(RefIuranRequest $request)
    {
        $data = RefIuran::create([
            ...$request->validated(),
            'company_code' => $this->company,
        ]);

        return ResponseFormatter::success($data, 'Iuran baru berhasil ditambahkan', 201);

    }

    public function show($id)
    {
        $iuran = RefIuran::where('company_code', $this->company)->findOrFail($id);

        return ResponseFormatter::success($iuran, 'Daftar iuran berhasil diambil');
    }

    public function update(RefIuranRequest $request, $id)
    {
        $iuran = RefIuran::where('company_code', $this->company)->findOrFail($id);

        $iuran->update($request->validated());

        return ResponseFormatter::success($iuran, 'Iuran berhasil diperbarui');
    }

    public function destroy($id)
    {
        $iuranRef = RefIuran::where('company_code', $this->company)
            ->findOrFail($id);

        // Cek: apakah ref_iurans sudah dipakai di tabel iurans?
        $dipakai = \DB::table('iurans')
            ->where('ref_iuran_id', $id)
            ->exists();

        if ($dipakai) {
            return ResponseFormatter::error(
                null,
                'Tidak dapat menghapus: iuran ini sudah dipakai dalam transaksi.',
                422
            );
        }

        $iuranRef->delete();

        return ResponseFormatter::success(null, 'Iuran berhasil dihapus');
    }

    // private function company()
    // {
    //     return auth()->user()->anggota->company_code ?? 'BSKM';
    // }
}