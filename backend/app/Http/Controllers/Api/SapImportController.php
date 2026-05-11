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

    public function importPo(Request $request)
    {
        $request->validate([
            'file'     => 'required|file|mimes:xlsx,xls,csv|max:10240',
            'batch_id' => 'nullable|string|max:50',
        ]);

        try {
            $file   = $request->file('file');
            $data   = $this->parseExcel($file);
            $result = $this->importService->importPoData($data, $request->batch_id);
            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memproses file: ' . $e->getMessage(),
            ], 500);
        }
    }

    protected function parseExcel($file)
    {
        $spreadsheet = IOFactory::load($file->getRealPath());
        $sheet       = $spreadsheet->getActiveSheet();
        $rows        = $sheet->toArray();
        $headers     = array_shift($rows);

        $data = [];
        foreach ($rows as $row) {
            if (empty(array_filter($row))) continue;
            $data[] = array_combine($headers, $row);
        }

        return $data;
    }

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

    /**
     * GET /api/sap/po-lookup?po_number=xxx
     */
    public function poLookup(Request $request)
    {
        $request->validate([
            'po_number' => 'required|string',
        ]);

        $items = SapPoImport::where('po_number', $request->po_number)->get();

        if ($items->isEmpty()) {
            return response()->json(['found' => false, 'message' => 'PO tidak ditemukan.'], 404);
        }

        $first = $items->first();

        // Resolve vendor
        $vendor = \App\Models\Vendor::where('sap_id', $first->sap_vendor_id)->first();
        $isPkp  = $vendor ? (bool) $vendor->is_pkp : false;

        // Resolve company via business_area
        $businessArea = \App\Models\BusinessArea::where('sap_id', $first->sap_business_area_id)->first();
        $companyId    = $businessArea?->company_id;
        $company      = $companyId ? \App\Models\Company::find($companyId) : null;

        // Hitung amount
        $dpp   = (float) $items->sum('net_value');
        $ppn   = $isPkp ? round($dpp * 0.11) : 0;
        $total = $dpp + $ppn;

        return response()->json([
            'found'                => true,
            'po_number'            => $first->po_number,
            'sap_vendor_id'        => $first->sap_vendor_id,
            'vendor_id'            => $vendor?->id,
            'vendor_name'          => $first->vendor_name,
            'is_pkp'               => $isPkp,
            'sap_business_area_id' => $first->sap_business_area_id,
            'business_area_code'   => $first->sap_business_area_id,
            'buyer_name'           => $first->Buyer_name,
            'purc_grp'             => $first->purc_grp,

            // Amount breakdown
            'dpp'                  => $dpp,
            'ppn'                  => $ppn,
            'amount'               => $total, // total yg dipakai di receipt

            // Company auto-resolve
            'company_id'           => $companyId,
            'company_name'         => $company?->name,

            'items' => $items->map(fn($i) => [
                'item_no'   => $i->item_no,
                'po_uom'    => $i->po_uom,
                'po_qty'    => $i->po_qty,
                'net_value' => $i->net_value,
            ]),
        ]);
    }
}
