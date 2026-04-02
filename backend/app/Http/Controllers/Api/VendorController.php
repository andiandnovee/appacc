<?php
// app/Http/Controllers/Api/VendorController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\VendorResource;
use App\Models\Vendor;
use Illuminate\Http\Request;

class VendorController extends Controller
{
    public function index(Request $request)
    {
        $query = Vendor::query();

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

    public function show(Vendor $vendor)
    {
        return new VendorResource($vendor);
    }
}
