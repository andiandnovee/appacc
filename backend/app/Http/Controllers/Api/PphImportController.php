<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PphImportService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

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
                    'gl_account_code'=> $item->gl_account_code,
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
}
