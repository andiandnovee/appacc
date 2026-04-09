<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SapImportService;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;

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
}