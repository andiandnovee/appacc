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

        // Filter by company
        if ($request->filled('company_id')) {
            $query->where('company_id', $request->company_id);
        }

        // Filter by vendor
        if ($request->filled('vendor_id')) {
            $query->where('vendor_id', $request->vendor_id);
        }

        // Filter by stage
        if ($request->filled('stage_id')) {
            $query->where('stage_id', $request->stage_id);
        }

        // Filter by business_area_code
        if ($request->filled('business_area_code')) {
            $query->where('business_area_code', $request->business_area_code);
        }

        // Filter by status_value (via latestStatus)
        if ($request->filled('status_value')) {
            $query->whereHas('latestStatus', function ($q) use ($request) {
                $q->where('status_value', $request->status_value);
            });
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('receipt_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('receipt_date', '<=', $request->date_to);
        }

        $perPage = $request->get('per_page', 25);
        $receipts = $query->orderByDesc('receipt_date')->paginate($perPage);

        return InvoiceReceiptResource::collection($receipts);
    }

    // -------------------------------------------------------
    // GET /invoice-receipts/{id}
    // -------------------------------------------------------
    public function show(InvoiceReceipt $invoiceReceipt)
    {
        $invoiceReceipt->load(['vendor', 'company', 'stage', 'statuses', 'latestStatus']);

        return new InvoiceReceiptResource($invoiceReceipt);
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
    public function update(InvoiceReceiptRequest $request, InvoiceReceipt $invoiceReceipt)
    {
        $invoiceReceipt->update($request->validated());
        $invoiceReceipt->load(['vendor', 'company', 'stage', 'latestStatus']);

        return new InvoiceReceiptResource($invoiceReceipt);
    }

    // -------------------------------------------------------
    // DELETE /invoice-receipts/{id}
    // -------------------------------------------------------
    public function destroy(InvoiceReceipt $invoiceReceipt)
    {
        $invoiceReceipt->delete();

        return response()->json(['message' => 'Invoice receipt deleted.']);
    }

    // -------------------------------------------------------
    // GET /invoice-receipts/{id}/statuses
    // -------------------------------------------------------
    public function statuses(InvoiceReceipt $invoiceReceipt)
    {
        $statuses = $invoiceReceipt->statuses()->orderByDesc('status_date')->get();

        return ReceiptStatusResource::collection($statuses);
    }

    // -------------------------------------------------------
    // POST /invoice-receipts/{id}/statuses
    // -------------------------------------------------------
    public function addStatus(ReceiptStatusRequest $request, InvoiceReceipt $invoiceReceipt)
    {
        $status = $invoiceReceipt->statuses()->create($request->validated());

        return (new ReceiptStatusResource($status))
            ->response()
            ->setStatusCode(201);
    }
}
