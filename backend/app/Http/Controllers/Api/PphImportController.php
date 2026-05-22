<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PphImportService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\ImportPph;
//use App\Models\Company;
class PphImportController extends Controller
{
    public function __construct(private PphImportService $service) {}

    /**
     * Chunk import — auto detect jenis upload dari kolom header
     * Main data  : ada kolom G/L
     * Vendor data: ada kolom Vendor, tidak ada G/L
     */
    public function importChunk(Request $request): JsonResponse
    {
        $request->validate([
            'rows'   => 'required|array',
            'rows.*' => 'array',
        ]);

        $rows    = $request->input('rows');
        $headers = array_keys($rows[0] ?? []);

        $hasGl     = in_array('G/L Account', $headers);
        $hasVendor = in_array('Vendor', $headers);

        // Deteksi jenis upload
        if ($hasGl) {
            $result = $this->service->importMainData($rows);
        } elseif ($hasVendor) {
            $result = $this->service->importVendorData($rows);
        } else {
            return response()->json([
                'success' => false,
                'error'   => 'Format file tidak dikenali. Pastikan kolom G/L atau Vendor tersedia.',
            ], 422);
        }

        if (!$result['success']) {
            return response()->json($result, 500);
        }

        return response()->json($result);
    }

    /**
     * List batch yang belum complete (masih ada vendor NULL)
     */
    public function incompleteBatches(): JsonResponse
    {
        $batches = \App\Models\ImportPph::incompleteBatches()->get()
            ->map(function ($item) {
                return [
                    'batch_id'       => $item->batch_id,
                    'company_code'   => $item->company_code,
                    'gl_account_code' => $item->gl_account_code,
                    'pph_type'       => \App\Models\ImportPph::getPphType($item->gl_account_code),
                    'periode'        => \Carbon\Carbon::parse($item->periode)->format('F Y'),
                    'total_rows'     => $item->total_rows,
                    'missing_vendor' => $item->missing_vendor,
                ];
            });

        return response()->json([
            'success' => true,
            'data'    => $batches,
        ]);
    }

    /**
     * Generate data laporan PPh berdasar batch_id
     * GET /sap/pph-report?batch_id=3800-21510001-2026-05
     */
    public function report(Request $request): JsonResponse
    {
        $request->validate([
            'batch_id' => 'required|string',
        ]);

        $batchId = $request->input('batch_id');

        // Ambil semua record batch ini, eager load vendor & company
        $records = ImportPph::where('batch_id', $batchId)
            ->with(['vendor', 'company'])
            ->orderBy('posting_date')
            ->get();

        if ($records->isEmpty()) {
            return response()->json([
                'success' => false,
                'error'   => 'Batch tidak ditemukan atau belum ada data',
            ], 404);
        }

        // Info perusahaan — ambil dari record pertama
        $firstRecord = $records->first();
        $company     = $firstRecord->company;

        // Parse batch_id untuk periode
        // Format: company_code-gl_account_code-YYYY-MM
        $batchParts = explode('-', $batchId);
        $periode    = \Carbon\Carbon::createFromFormat(
            'Y-m',
            $batchParts[count($batchParts) - 2] . '-' . $batchParts[count($batchParts) - 1]
        )->locale('id')->isoFormat('MMMM YYYY');

        // Build rows laporan
        $rows = $records->map(function ($item) {
            $vendor  = $item->vendor;
            $pphRate = $vendor?->pph_rate ?? 0;
            $pph     = abs($item->amount_in_local_currency);
            $bruto   = $pphRate > 0 ? round($pph / ($pphRate / 100)) : 0;
            $dpp     = $bruto; // PPh 23: DPP = Bruto

            return [
                'no_bukti_potong' => null, // diisi manual petugas
                'gl_account'      => $item->gl_account_code,
                'tgl_faktur'      => $item->posting_date?->format('d.m.Y'),
                'no_faktur'       => $item->reference,
                'vendor_name'     => $vendor?->name ?? $item->vendor_code,
                'npwp'            => $vendor?->npwp,
                'address'         => $vendor?->address,
                'service_type'    => $vendor?->service_type,
                'doc_number'      => $item->document_number,
                'po_text'         => $item->po_number,
                'bruto'           => $bruto,
                'dpp'             => $dpp,
                'tarif'           => $pphRate,
                'pph_dipotong'    => $pph,
                'pph_type'        => ImportPph::getPphType($item->gl_account_code),
            ];
        });

        // Total
        $totalPph   = $rows->sum('pph_dipotong');
        $totalBruto = $rows->sum('bruto');

        return response()->json([
            'success' => true,
            'data'    => [
                'batch_id'     => $batchId,
                'periode'      => $periode,
                'pph_type'     => ImportPph::getPphType($firstRecord->gl_account_code),
                'company'      => [
                    'name'    => $company?->name,
                    'npwp'    => $company?->npwp,
                    'address' => $company?->address,
                ],
                'rows'         => $rows,
                'total_pph'    => $totalPph,
                'total_bruto'  => $totalBruto,
            ],
        ]);
    }

    /**
     * Filter data PPh untuk preview laporan
     * GET /sap/pph-data?company_code=3800&gl_account_code=21510001&month=2025-12
     */
    public function getData(Request $request): JsonResponse
    {
        $request->validate([
            'company_code'    => 'required|string',
            'gl_account_code' => 'required|string',
            'month'           => 'required|string|date_format:Y-m',
        ]);

        $companyCode    = $request->input('company_code');
        $glAccountCode  = $request->input('gl_account_code');
        $month          = $request->input('month');

        $startDate = \Carbon\Carbon::createFromFormat('Y-m', $month)->startOfMonth()->toDateString();
        $endDate   = \Carbon\Carbon::createFromFormat('Y-m', $month)->endOfMonth()->toDateString();

        $records = ImportPph::where('company_code', $companyCode)
            ->where('gl_account_code', $glAccountCode)
            ->whereBetween('posting_date', [$startDate, $endDate])
            ->with(['vendor', 'company'])
            ->orderBy('posting_date')
            ->get();

        $rows = $records->map(function ($item) {
            $vendor  = $item->vendor;
            $pphRate = $vendor?->pph_rate ?? 0;
            $pph     = abs($item->amount_in_local_currency);
            $bruto   = $pphRate > 0 ? round($pph / ($pphRate / 100)) : 0;

            return [
                'id'              => $item->id,
                'no_bukti_potong' => null,
                'gl_account'      => $item->gl_account_code,
                'tgl_faktur'      => $item->posting_date?->format('d.m.Y'),
                'no_faktur'       => $item->reference,
                'vendor_name'     => $vendor?->name ?? $item->vendor_code,
                'vendor_sap_id'   => $item->vendor_code,
                'npwp'            => $vendor?->npwp,
                'address'         => $vendor?->address,
                'service_type'    => $vendor?->service_type,
                'gl_cost_account' => $vendor?->gl_cost_account,
                'doc_number'      => $item->document_number,
                'po_text'         => $item->po_number,
                'bruto'           => $bruto,
                'dpp'             => $bruto,
                'tarif'           => $pphRate,
                'pph_dipotong'    => $pph,
                'pph_type'        => ImportPph::getPphType($item->gl_account_code),
            ];
        });

        $company = $records->first()?->company;

        return response()->json([
            'success' => true,
            'data'    => [
                'company'      => [
                    'name'    => $company?->name,
                    'npwp'    => $company?->npwp,
                    'address' => $company?->address,
                ],
                'periode'      => \Carbon\Carbon::createFromFormat('Y-m', $month)
                    ->locale('id')->isoFormat('MMMM YYYY'),
                'pph_type'     => ImportPph::getPphType($glAccountCode),
                'total_pph'    => $rows->sum('pph_dipotong'),
                'total_bruto'  => $rows->sum('bruto'),
                'rows'         => $rows,
            ],
        ]);
    }

    /**
     * Update gl_cost_account vendor
     * PATCH /sap/vendor-gl-cost?vendor_sap_id=xxx&gl_cost_account=xxx
     */
    public function updateVendorGlCost(Request $request): JsonResponse
    {
        $request->validate([
            'vendor_sap_id'   => 'required',
            'gl_cost_account' => 'required|string|max:30',
        ]);

        $vendor = \App\Models\Vendor::where('sap_id', $request->input('vendor_sap_id'))->first();

        if (!$vendor) {
            return response()->json(['success' => false, 'error' => 'Vendor tidak ditemukan'], 404);
        }

        $vendor->update(['gl_cost_account' => $request->input('gl_cost_account')]);

        return response()->json(['success' => true]);
    }
    /**
 * Hapus data PPh berdasar company_code + gl_account_code + bulan
 * DELETE /sap/pph-data?company_code=3800&gl_account_code=21510001&month=2025-12
 */
public function destroy(Request $request): JsonResponse
{
    $request->validate([
        'company_code'    => 'required|string',
        'gl_account_code' => 'required|string',
        'month'           => 'required|string|date_format:Y-m',
    ]);

    $companyCode   = $request->input('company_code');
    $glAccountCode = $request->input('gl_account_code');
    $month         = $request->input('month');

    $startDate = \Carbon\Carbon::createFromFormat('Y-m', $month)->startOfMonth()->toDateString();
    $endDate   = \Carbon\Carbon::createFromFormat('Y-m', $month)->endOfMonth()->toDateString();

    $deleted = ImportPph::where('company_code', $companyCode)
        ->where('gl_account_code', $glAccountCode)
        ->whereBetween('posting_date', [$startDate, $endDate])
        ->delete();

    if ($deleted === 0) {
        return response()->json([
            'success' => false,
            'error'   => 'Tidak ada data yang ditemukan untuk kriteria tersebut.',
        ], 404);
    }

    return response()->json([
        'success' => true,
        'message' => "{$deleted} baris data berhasil dihapus.",
    ]);
}
    /**
     * List company codes yang ada di importpphs
     * GET /sap/pph-companies
     */
    public function companyList(): JsonResponse
    {
        $companyCodes = ImportPph::select('company_code')
            ->distinct()
            ->pluck('company_code');

        $companies = \App\Models\Company::whereIn('sap_id', $companyCodes)
            ->get(['sap_id', 'name'])
            ->map(fn($c) => ['value' => (string) $c->sap_id, 'label' => $c->name]);

        return response()->json(['success' => true, 'data' => $companies]);
    }

    /**
     * List semua batch yang tersedia untuk dipilih user
     * GET /sap/pph-batches
     */
    public function batchList(): JsonResponse
    {
        $batches = ImportPph::select(
            'batch_id',
            'company_code',
            'gl_account_code'
        )
            ->selectRaw('MIN(posting_date) as periode')
            ->selectRaw('COUNT(*) as total_rows')
            ->selectRaw('SUM(CASE WHEN vendor_code IS NULL THEN 1 ELSE 0 END) as missing_vendor')
            ->whereNotNull('batch_id')
            ->groupBy('batch_id', 'company_code', 'gl_account_code')
            ->orderBy('periode', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'batch_id'       => $item->batch_id,
                    'company_code'   => $item->company_code,
                    'gl_account_code' => $item->gl_account_code,
                    'pph_type'       => ImportPph::getPphType($item->gl_account_code),
                    'periode'        => \Carbon\Carbon::parse($item->periode)
                        ->locale('id')
                        ->isoFormat('MMMM YYYY'),
                    'total_rows'     => $item->total_rows,
                    'missing_vendor' => $item->missing_vendor,
                    'is_complete'    => $item->missing_vendor === 0,
                ];
            });

        return response()->json([
            'success' => true,
            'data'    => $batches,
        ]);
    }
}