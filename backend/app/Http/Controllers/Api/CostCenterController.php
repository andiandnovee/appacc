<?php 
// ════════════════════════════════════════════════════════════
// app/Http/Controllers/Api/CostCenterController.php
// ════════════════════════════════════════════════════════════
 
namespace App\Http\Controllers\Api;
 
use App\Http\Controllers\Controller;
use App\Http\Requests\CostCenterRequest;
use App\Http\Resources\CostCenterResource;
use App\Models\CostCenter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
 
class CostCenterController extends Controller
{
    public function index(Request $request)
    {
        $query = CostCenter::query();
 
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('sap_id',      'like', "%{$search}%")
                  ->orWhere('description','like', "%{$search}%")
                  ->orWhere('short_name', 'like', "%{$search}%");
            });
        }
 
        $sortBy  = in_array($request->input('sort_by'), ['sap_id', 'description', 'short_name', 'created_at'])
            ? $request->input('sort_by') : 'sap_id';
        $sortDir = $request->input('sort_dir', 'asc') === 'desc' ? 'desc' : 'asc';
        $query->orderBy($sortBy, $sortDir);
 
        $perPage = min((int) $request->input('per_page', 15), 100);
 
        return CostCenterResource::collection($query->paginate($perPage));
    }
 
    public function store(CostCenterRequest $request): CostCenterResource
    {
        return new CostCenterResource(CostCenter::create($request->validated()));
    }
 
    public function show(CostCenter $costCenter): CostCenterResource
    {
        return new CostCenterResource($costCenter);
    }
 
    public function update(CostCenterRequest $request, CostCenter $costCenter): CostCenterResource
    {
        $costCenter->update($request->validated());
        return new CostCenterResource($costCenter);
    }
 
    public function destroy(CostCenter $costCenter): JsonResponse
    {
        $costCenter->delete();
        return response()->json(['message' => 'Cost Center berhasil dihapus.']);
    }
}
 