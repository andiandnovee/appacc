<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVendorRequest;
use App\Http\Requests\UpdateVendorRequest;
use App\Http\Resources\VendorResource;
use App\Models\Vendor;
use Illuminate\Http\Request;

class VendorController extends Controller
{
    /**
     * Display a listing of vendors.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Vendor::class);

        $query = Vendor::query();

        // Filter soft deleted
        if ($request->filled('trash_filter')) {
            switch ($request->trash_filter) {
                case 'only_trash':
                    $query->onlyTrashed();
                    break;
                case 'with_trash':
                    $query->withTrashed();
                    break;
                case 'without_trash':
                default:
                    // Default query (tanpa soft deleted)
                    break;
            }
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('npwp', 'like', "%{$request->search}%")
                    ->orWhere('service_type', 'like', "%{$request->search}%");
            });
        }

        if ($request->filled('pph_type')) {
            $query->where('pph_type', $request->pph_type);
        }

        // Mode dropdown — return semua tanpa pagination
        if ($request->boolean('all')) {
            return VendorResource::collection(
                $query->orderBy('name')->get()
            );
        }

        return VendorResource::collection(
            $query->orderBy('name')->paginate($request->get('per_page', 25))
        );
    }

    /**
     * Store a newly created vendor in storage.
     */
    public function store(StoreVendorRequest $request)
    {
        $this->authorize('create', Vendor::class);

        $vendor = Vendor::create($request->validated());

        return new VendorResource($vendor);
    }

    /**
     * Display the specified vendor.
     */
    public function show(Vendor $vendor)
    {
        $this->authorize('view', $vendor);

        return new VendorResource($vendor);
    }

    /**
     * Update the specified vendor in storage.
     */
    public function update(UpdateVendorRequest $request, Vendor $vendor)
    {
        $this->authorize('update', $vendor);

        $vendor->update($request->validated());

        return new VendorResource($vendor);
    }

    /**
     * Soft delete the specified vendor (with cascade to invoiceReceipts).
     */
    public function destroy(Vendor $vendor)
    {
        $this->authorize('delete', $vendor);

        // Soft delete semua invoice receipts yang terkait
        $vendor->invoiceReceipts()->delete();

        // Soft delete vendor (set deleted_at = NOW())
        $vendor->delete();

        return response()->json([
            'success' => true,
            'message' => 'Vendor berhasil dinonaktifkan.',
            'data'    => new VendorResource($vendor),
        ], 200);
    }

    /**
     * Restore a soft deleted vendor.
     */
    public function restore($id)
    {
        $vendor = Vendor::withTrashed()->findOrFail($id);
        $this->authorize('restore', $vendor);

        // Restore vendor
        $vendor->restore();

        // Restore semua invoice receipts yang terkait
        $vendor->invoiceReceipts()->withTrashed()->restore();

        return response()->json([
            'success' => true,
            'message' => 'Vendor berhasil diaktifkan kembali.',
            'data'    => new VendorResource($vendor),
        ], 200);
    }

    /**
     * Permanently delete a vendor (force delete).
     */
    public function forceDelete($id)
    {
        $vendor = Vendor::withTrashed()->findOrFail($id);
        $this->authorize('forceDelete', $vendor);

        // Force delete semua invoice receipts yang terkait
        $vendor->invoiceReceipts()->withTrashed()->forceDelete();

        // Force delete vendor
        $vendor->forceDelete();

        return response()->json([
            'success' => true,
            'message' => 'Vendor berhasil dihapus permanen.',
        ], 200);
    }
}