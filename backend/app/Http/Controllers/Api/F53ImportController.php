<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\F53ImportService;
use App\Models\SapF53Upload;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class F53ImportController extends Controller
{
    public function __construct(private F53ImportService $service) {}

    /**
     * Chunk import F53
     * POST /sap/f53-import
     */
    public function importChunk(Request $request): JsonResponse
    {
        $request->validate([
            'rows'         => 'required|array',
            'rows.*'       => 'array',
            'stage_sap_id' => 'required|integer',
        ]);

        $rows       = $request->input('rows');
        $stageSapId = (int) $request->input('stage_sap_id');

        $headers  = array_keys($rows[0] ?? []);
        $required = [
            'Document Date', 'Assignment', 'Business Area',
            'Vendor', 'Amount in local currency', 'Text',
            'Document Number',
        ];

        $missing = array_diff($required, $headers);
        if (!empty($missing)) {
            return response()->json([
                'success' => false,
                'error'   => 'Kolom tidak lengkap: ' . implode(', ', $missing),
            ], 422);
        }

        $result = $this->service->importData($rows, $stageSapId);

        if (!$result['success']) {
            return response()->json($result, 500);
        }

        return response()->json($result);
    }

    /**
     * List data F53 by stage + company + business_area + vendor (opsional)
     * GET /sap/f53-data
     *
     * Params:
     *   stage_id      (required) integer — stage_sap_id
     *   company_id    (required) integer — company_sap_id
     *   business_area (required) integer — business_area sap_id
     *   vendor_sap_id (optional) integer — filter per vendor
     */
    public function getData(Request $request): JsonResponse
    {
        $request->validate([
            'stage_id'      => 'required|integer',
            'company_id'    => 'required|integer',
            'business_area' => 'required|integer',
            'vendor_sap_id' => 'nullable|integer',
        ]);

        $stageSapId   = (int) $request->input('stage_id');
        $companySapId = (int) $request->input('company_id');
        $businessArea = (int) $request->input('business_area');

        $query = SapF53Upload::where('stage_sap_id', $stageSapId)
            ->where('company_sap_id', $companySapId)
            ->where('business_area', $businessArea)
            ->whereNull('deleted_at');

        // Filter vendor — opsional
        if ($request->filled('vendor_sap_id')) {
            $query->where('vendor_sap_id', (int) $request->input('vendor_sap_id'));
        }

        $records = $query->orderBy('doc_date')->get();

        // Enrich dengan vendor_name dari tabel vendors
        // Ambil semua vendor yang relevan sekaligus (N+1 prevention)
        $vendorSapIds = $records->pluck('vendor_sap_id')->unique()->filter();
        $vendorMap    = Vendor::whereIn('sap_id', $vendorSapIds)
            ->pluck('name', 'sap_id'); // [sap_id => name]

        $data = $records->map(function ($row) use ($vendorMap) {
            return [
                'id'            => $row->id,
                'doc_number'    => $row->doc_number,
                'doc_date'      => $row->doc_date,
                'business_area' => $row->business_area,
                'amount'        => $row->amount,
                'po_number'     => $row->po_number,
                'po_text'       => $row->po_text,
                'reference'     => $row->reference,
                'assignment'    => $row->assignment,
                'vendor_sap_id' => (string) $row->vendor_sap_id,
                'vendor_name'   => $vendorMap[$row->vendor_sap_id] ?? "Vendor {$row->vendor_sap_id}",
                'company_code'  => (string) $row->company_sap_id,
            ];
        });

        return response()->json([
            'success' => true,
            'data'    => $data,
            'total'   => $data->count(),
            'amount'  => $records->sum('amount'),
        ]);
    }

    /**
     * Hapus data F53 by stage
     * DELETE /sap/f53-data?stage_sap_id=xxx
     */
    public function destroy(Request $request): JsonResponse
    {
        $request->validate([
            'stage_sap_id' => 'required|integer',
        ]);

        $stageSapId = (int) $request->input('stage_sap_id');

        $deleted = SapF53Upload::where('stage_sap_id', $stageSapId)->delete();

        if ($deleted === 0) {
            return response()->json([
                'success' => false,
                'error'   => 'Tidak ada data untuk stage tersebut.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => "{$deleted} baris data berhasil dihapus.",
        ]);
    }
}