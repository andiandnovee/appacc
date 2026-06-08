<?php
// ════════════════════════════════════════════════════════════
// app/Http/Controllers/Api/VehicleController.php
// ════════════════════════════════════════════════════════════

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\VehicleRequest;
use App\Http\Resources\VehicleResource;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class VehicleController extends Controller
{
    /**
     * GET /vehicles
     */
    public function index(Request $request): ResourceCollection
    {
        $query = Vehicle::query();

        // Search
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('plate_number',       'like', "%{$search}%")
                    ->orWhere('plate_number_old', 'like', "%{$search}%")
                    ->orWhere('description',      'like', "%{$search}%")
                    ->orWhere('company_code',     'like', "%{$search}%")
                    ->orWhere('cost_center',      'like', "%{$search}%")
                    ->orWhere('chassis_number',   'like', "%{$search}%")
                    ->orWhere('engine_number',    'like', "%{$search}%");
            });
        }

        // Filters
        if ($type = $request->input('vehicle_type')) {
            $query->where('vehicle_type', $type);
        }
        if ($company = $request->input('company_code')) {
            $query->where('company_code', $company);
        }
        if ($ba = $request->input('business_area_code')) {
            $query->where('business_area_code', $ba);
        }
        if ($request->has('is_active')) {
            $query->where('is_active', $request->input('is_active'));
        }

        // Sort
        $sortBy  = in_array($request->input('sort_by'), [
            'plate_number',
            'vehicle_type',
            'company_code',
            'stnkb_valid_until',
            'pkb_valid_until',
            'kier_valid_until',
            'created_at',
        ]) ? $request->input('sort_by') : 'created_at';

        $sortDir = $request->input('sort_dir', 'desc') === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sortBy, $sortDir);

        $perPage = min((int) $request->input('per_page', 15), 100);

        return VehicleResource::collection($query->paginate($perPage));
    }

    /**
     * POST /vehicles
     */
    public function store(VehicleRequest $request): VehicleResource
    {
        $vehicle = Vehicle::create($request->validated());

        return new VehicleResource($vehicle);
    }

    /**
     * GET /vehicles/{vehicle}
     */
    public function show(Vehicle $vehicle): VehicleResource
    {
        return new VehicleResource($vehicle);
    }

    /**
     * PUT /vehicles/{vehicle}
     */
    public function update(VehicleRequest $request, Vehicle $vehicle): VehicleResource
    {
        $vehicle->update($request->validated());

        return new VehicleResource($vehicle);
    }

    /**
     * DELETE /vehicles/{vehicle}
     */
    public function destroy(Vehicle $vehicle): JsonResponse
    {
        $vehicle->delete();

        return response()->json(['message' => 'Kendaraan berhasil dihapus.']);
    }
}