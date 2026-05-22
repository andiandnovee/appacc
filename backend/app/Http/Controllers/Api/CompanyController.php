<?php
// app/Http/Controllers/Api/CompanyController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CompanyResource;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CompanyController extends Controller
{
    public function index(Request $request)
    {
        $companies = Company::query()
            ->when($request->filled('search'), fn($q) =>
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('npwp', 'like', "%{$request->search}%")
            )
            ->orderBy('name')
            ->get();

        return CompanyResource::collection($companies);
    }

    public function show(Company $company)
    {
        return new CompanyResource($company);
    }


    /**
 * List companies untuk select dropdown (value = sap_id)
 * GET /companies/select-options
 */
public function selectOptions(Request $request): JsonResponse
{
    $query = Company::orderBy('name');
    
    if ($request->filled('search')) {
        $query->where('name', 'like', '%' . $request->search . '%');
    }
    
    $companies = $query->get(['sap_id', 'name'])
        ->map(fn($c) => [
            'id'   => (string) $c->sap_id,
            'name' => $c->name,
        ]);

    return response()->json(['data' => $companies]);
}
}
