<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SapImportService;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;
use App\Models\SapPoImport;

class SapImportController extends Controller
{
    protected $importService;

    public function __construct(SapImportService $importService)
    {
        $this->importService = $importService;
    }

    /**
     * Import SAP PO data
     * POST /api/sap/import-po
     */
    public function importPo(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:10240', // 10MB
            'batch_id' => 'nullable|string|max:50',
        ]);

        try {
            $file = $request->file('file');
            $data = $this->parseExcel($file);

            $result = $this->importService->importPoData($data, $request->batch_id);

            return response()->json($result);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memproses file: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Parse Excel/CSV ke array
     */
    protected function parseExcel($file)
    {
        $spreadsheet = IOFactory::load($file->getRealPath());
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray();

        // Ambil header (row pertama)
        $headers = array_shift($rows);

        // Convert ke associative array
        $data = [];
        foreach ($rows as $row) {
            if (empty(array_filter($row))) continue; // Skip empty rows

            $data[] = array_combine($headers, $row);
        }

        return $data;
    }

    /**
 * GET /api/sap/po-lookup?po_number=xxx
 */
/**
 * GET /api/sap/po-lookup?po_number=xxx
 */
/**
 * POST /api/sap/import-po-chunk
 * Menerima array rows JSON (bukan file), proses per chunk
 */
public function importPoChunk(Request $request)
{
    $request->validate([
        'rows'     => 'required|array|min:1',
        'batch_id' => 'required|string|max:50',
    ]);

    $result = $this->importService->importPoData(
        $request->input('rows'),
        $request->input('batch_id')
    );

    return response()->json($result);
}
public function poLookup(Request $request)
{
    $request->validate([
        'po_number' => 'required|string',
    ]);

    // Ambil semua item untuk PO ini
    $items = SapPoImport::where('po_number', $request->po_number)
        ->get();

    if ($items->isEmpty()) {
        return response()->json(['found' => false], 404);
    }

    $first = $items->first();

    // Cari vendor_id di master vendors
    $vendor = \App\Models\Vendor::where('sap_id', $first->sap_vendor_id)->first();

    return response()->json([
        'found'                => true,
        'po_number'            => $first->po_number,
        'sap_vendor_id'        => $first->sap_vendor_id,
        'vendor_id'            => $vendor?->id,
        'vendor_name'          => $first->vendor_name,
        'sap_business_area_id' => $first->sap_business_area_id,
          'buyer_name'           => $first->Buyer_name,
          'purc_grp'             => $first->purc_grp,         // ← tambah
        'amount'               => $items->sum('net_value'), // ← sum semua item_no
        'items'                => $items->map(fn($i) => [
            'item_no'   => $i->item_no,
            'po_uom'    => $i->po_uom,
            'po_qty'    => $i->po_qty,
            'net_value' => $i->net_value,
        ]),
    ]);
}
}