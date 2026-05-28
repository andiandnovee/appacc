<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\F53ImportService;
use App\Models\SapF53Upload;
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

        // Validasi header — pastikan kolom wajib ada
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
     * List data F53 by stage
     * GET /sap/f53-data?stage_sap_id=xxx
     */
    public function getData(Request $request): JsonResponse
    {
        $request->validate([
            'stage_sap_id' => 'required|integer',
        ]);

        $stageSapId = (int) $request->input('stage_sap_id');

        $records = SapF53Upload::where('stage_sap_id', $stageSapId)
            ->orderBy('doc_date')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $records,
            'total'   => $records->count(),
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