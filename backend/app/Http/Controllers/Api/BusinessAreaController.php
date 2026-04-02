<?php
// app/Http/Controllers/Api/BusinessAreaController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BusinessAreaResource;
use App\Models\BusinessArea;
use Illuminate\Http\Request;

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
                  ->orWhere('name_long', 'like', "%{$request->search}%");
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
}
