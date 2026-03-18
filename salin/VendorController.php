<?php

namespace App\Http\Controllers\Api\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vendor\StoreVendorRequest;
use App\Http\Requests\Vendor\UpdateVendorRequest;
use App\Http\Resources\Vendor\VendorResource;
use App\Http\Resources\Vendor\VendorSearchResource;
use App\Models\Vendor\Vendor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class VendorController extends Controller
{
    /**
     * GET /api/vendors
     * List semua vendor dengan filter, search, dan pagination.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Vendor::query()->with('refPph');

        // Search: name, vendor_code, npwp
        if ($search = $request->input('search')) {
            $query->search($search);
        }

        // Filter status
        if ($request->has('is_active')) {
            $query->where('is_active', filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN));
        }

        // Filter PPh
        if ($pphId = $request->input('ref_pph_id')) {
            $query->where('ref_pph_id', $pphId);
        }

        $vendors = $query
            ->orderBy('name')
            ->paginate($request->input('per_page', 15));

        return VendorResource::collection($vendors);
    }

    /**
     * GET /api/vendors/search?q=keyword
     * Lightweight endpoint untuk dropdown lookup di form penerimaan.
     * Hanya return active vendors, max 20 hasil.
     */
    public function search(Request $request): AnonymousResourceCollection
    {
        $keyword = $request->input('q', '');

        $vendors = Vendor::active()
            ->search($keyword)
            ->orderBy('name')
            ->limit(20)
            ->get();

        return VendorSearchResource::collection($vendors);
    }

    /**
     * POST /api/vendors
     */
    public function store(StoreVendorRequest $request): VendorResource
    {
        $vendor = Vendor::create($request->validated());

        return new VendorResource($vendor->load('refPph'));
    }

    /**
     * GET /api/vendors/{vendor}
     */
    public function show(Vendor $vendor): VendorResource
    {
        return new VendorResource($vendor->load('refPph'));
    }

    /**
     * PUT /api/vendors/{vendor}
     */
    public function update(UpdateVendorRequest $request, Vendor $vendor): VendorResource
    {
        $vendor->update($request->validated());

        return new VendorResource($vendor->load('refPph'));
    }

    /**
     * DELETE /api/vendors/{vendor}
     * Soft delete: toggle is_active ke false.
     * Vendor dengan transaksi aktif tidak boleh dihapus permanen.
     */
    public function destroy(Vendor $vendor): JsonResponse
    {
        // Cukup non-aktifkan, jangan hard delete
        // karena vendor mungkin sudah terikat di penerimaan_invoices
        $vendor->update(['is_active' => false]);

        return response()->json([
            'message' => "Vendor {$vendor->name} dinonaktifkan.",
        ]);
    }
}
