<?php

// app/Http/Controllers/Api/InvoiceReceiptController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\InvoiceReceiptRequest;
use App\Http\Requests\ReceiptStatusRequest;
use App\Http\Resources\InvoiceReceiptResource;
use App\Http\Resources\ReceiptStatusResource;
use App\Models\InvoiceReceipt;
use App\Models\ReceiptStatus;
use Illuminate\Http\Request;


class InvoiceReceiptController extends Controller
{
    // -------------------------------------------------------
    // GET /invoice-receipts
    // -------------------------------------------------------
    public function index(Request $request)
{
    $query = InvoiceReceipt::query()
        ->with(['vendor', 'company', 'stage', 'latestStatus']);

    // ========== SEARCH GLOBAL ==========
    if ($request->filled('search')) {
        $search = $request->search;
        $query->where(function ($q) use ($search) {
            $q->where('po_number', 'like', "%{$search}%")
              ->orWhere('invoice_number', 'like', "%{$search}%")
            //   ->orWhereHas('vendor', function ($vendorQuery) use ($search) {
            //       $vendorQuery->where('name', 'like', "%{$search}%");
            //   })
              ;
        });
    }

    // ========== FILTER PER KOLOM (dari serverSideFiltering) ==========
    if ($request->has('filter')) {
        $filters = $request->input('filter');
        $allowedColumns = ['po_number', 'invoice_number', 'vendor_id', 'company_id', 'stage_id', 'business_area_code', 'category'];
        foreach ($filters as $column => $value) {
            if (in_array($column, $allowedColumns) && !empty($value)) {
                // Untuk kolom yang merupakan foreign key (vendor_id, company_id, stage_id) gunakan pencarian exact
                if (in_array($column, ['vendor_id', 'company_id', 'stage_id', 'category'])) {
                    $query->where($column, $value);
                } else {
                    $query->where($column, 'like', "%{$value}%");
                }
            }
        }
    }

    // ========== FILTER LANGSUNG (non-filter array) ==========
    if ($request->filled('company_id')) {
        $query->where('company_id', $request->company_id);
    }
    if ($request->filled('vendor_id')) {
        $query->where('vendor_id', $request->vendor_id);
    }
    if ($request->filled('stage_id')) {
        $query->where('stage_id', $request->stage_id);
    }
    if ($request->filled('business_area_code')) {
        $query->where('business_area_code', $request->business_area_code);
    }
    if ($request->filled('status_value')) {
        $query->whereHas('latestStatus', function ($q) use ($request) {
            $q->where('status_value', $request->status_value);
        });
    }
    if ($request->filled('date_from')) {
        $query->whereDate('receipt_date', '>=', $request->date_from);
    }
    if ($request->filled('date_to')) {
        $query->whereDate('receipt_date', '<=', $request->date_to);
    }

    // ========== SORTING ==========
    $sortBy = $request->get('sort_by');
    $sortDir = $request->get('sort_dir', 'asc');
    if ($sortBy && in_array($sortBy, ['po_number', 'invoice_number', 'receipt_date', 'amount'])) {
        $query->orderBy($sortBy, $sortDir === 'asc' ? 'asc' : 'desc');
    } else {
        $query->orderByDesc('receipt_date');
    }

    // ========== PAGINATION ==========
    $perPage = $request->get('per_page', 25);
    $receipts = $query->paginate($perPage);

    return InvoiceReceiptResource::collection($receipts);
}

    // -------------------------------------------------------
    // GET /invoice-receipts/{id}
    // -------------------------------------------------------
    public function show(InvoiceReceipt $receipt)
    {
        $receipt->load(['vendor', 'company', 'stage', 'statuses', 'latestStatus']);

        return new InvoiceReceiptResource(  $receipt);
    }

    // -------------------------------------------------------
    // POST /invoice-receipts
    // -------------------------------------------------------
    public function store(InvoiceReceiptRequest $request)
    {
        $receipt = InvoiceReceipt::create($request->validated());
        $receipt->load(['vendor', 'company', 'stage', 'latestStatus']);

        return (new InvoiceReceiptResource($receipt))
            ->response()
            ->setStatusCode(201);
    }

    // -------------------------------------------------------
    // PUT /invoice-receipts/{id}
    // -------------------------------------------------------
    public function update(InvoiceReceiptRequest $request, InvoiceReceipt $receipt)
    {
        $receipt->update($request->validated());
     //

        $receipt->load(['vendor', 'company', 'stage', 'latestStatus']);

        return new InvoiceReceiptResource($receipt);
    }

    // -------------------------------------------------------
    // DELETE /invoice-receipts/{id}
    // -------------------------------------------------------
    public function destroy(InvoiceReceipt $receipt)
    {
        $receipt->delete();

        return response()->json(['message' => 'Invoice receipt deleted.']);
    }

    // -------------------------------------------------------
    // GET /invoice-receipts/{id}/statuses
    // -------------------------------------------------------
    public function statuses(InvoiceReceipt $receipt)
    {
        $statuses = $receipt->statuses()->orderByDesc('status_date')->get();

        return ReceiptStatusResource::collection($statuses);
    }

    // -------------------------------------------------------
    // POST /invoice-receipts/{id}/statuses
    // -------------------------------------------------------
    public function addStatus(ReceiptStatusRequest $request, InvoiceReceipt $receipt)
    {
        $status = $receipt->statuses()->create($request->validated());

        return (new ReceiptStatusResource($status))
            ->response()
            ->setStatusCode(201);
    }
}
