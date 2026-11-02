<?php
// app/Http/Controllers/Api/CompanyController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CompanyResource;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

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

    public function store(Request $request): CompanyResource
    {
        $data = $request->validate([
            'sap_id' => ['required', 'integer', 'unique:companies,sap_id'],
            'name' => ['required', 'string', 'max:100'],
            'npwp' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:255'],
            'accbank' => ['nullable', 'string', 'max:255'],
        ]);

        return new CompanyResource(Company::create($data));
    }

    public function update(Request $request, Company $company): CompanyResource
    {
        $data = $request->validate([
            'sap_id' => ['required', 'integer', Rule::unique('companies', 'sap_id')->ignore($company->id)],
            'name' => ['required', 'string', 'max:100'],
            'npwp' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:255'],
            'accbank' => ['nullable', 'string', 'max:255'],
        ]);

        $company->update($data);

        return new CompanyResource($company->refresh());
    }

    public function destroy(Company $company): JsonResponse
    {
        if ($company->businessAreas()->exists() || $company->invoiceReceipts()->exists()) {
            return response()->json([
                'message' => 'Company tidak dapat dihapus karena masih digunakan oleh Business Area atau Invoice Receipt.',
            ], 422);
        }

        $company->delete();

        return response()->json(['message' => 'Company berhasil dihapus.']);
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
    
    $companies = $query->get(['id', 'sap_id', 'name', 'npwp', 'address', 'accbank'])
    ->map(fn($c) => [
        'id'         => (string) $c->sap_id,
        'company_id' => (string) $c->id,
        'name'       => $c->name,
        'npwp'       => $c->npwp,
        'address'    => $c->address,
        'accbank'    => $c->accbank,
    ]);

    return response()->json(['data' => $companies]);
}
}
