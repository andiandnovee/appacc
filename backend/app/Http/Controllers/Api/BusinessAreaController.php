<?php
// app/Http/Controllers/Api/BusinessAreaController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BusinessAreaResource;
use App\Http\Requests\BusinessAreaRequest;
use App\Models\BusinessArea;
use Illuminate\Http\Request;
//use Illuminate\Support\Facades\Log;


class BusinessAreaController extends Controller
{
    public function index(Request $request)
    {
        $query = BusinessArea::query()->with('company');

        if ($request->filled('company_id')) {
            $query->where('company_id', $request->company_id);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('name_long', 'like', "%{$request->search}%")
                  ->orWhere('sap_id', 'like', "%{$request->search}%");
            });
        }

        return BusinessAreaResource::collection(
            $query->orderBy('name')->get()
        );
    }

    public function show(BusinessArea $businessArea)
    {
        $businessArea->load('company');
        return new BusinessAreaResource($businessArea);
    }


Public function store(BusinessAreaRequest $request)
    {
       
        $businessArea = BusinessArea::create($request->validated());
        $businessArea->load(['company']);
        return new BusinessAreaResource($businessArea);
    }

    public function update(BusinessAreaRequest $request, BusinessArea $businessArea)
    {
       
    //      \Log::info('UPDATE HIT', [
    //     'all'       => $request->all(),
    //     'validated' => $request->validated(),
    //     'id'        => $businessArea->id,
    // ]);


        $businessArea->update($request->validated());
        $businessArea->load(['company']);
        return new BusinessAreaResource($businessArea);
    }

    public function destroy(BusinessAreaRequest $request, BusinessArea $businessArea)
    {
        $businessArea->delete();
        return response()->noContent();
    }

}
