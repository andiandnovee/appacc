<?php
// app/Http/Controllers/Api/StageController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StageResource;
use App\Models\Stage;
use Illuminate\Http\Request;

class StageController extends Controller
{
    public function index(Request $request)
    {
        $stages = Stage::query()
            ->when($request->filled('year'), fn($q) =>
                $q->where('year', $request->year)
            )
            ->when($request->filled('search'), fn($q) =>
                $q->where('name', 'like', "%{$request->search}%")
            )
            ->orderByDesc('year')
            ->orderBy('name')
            ->get();

        return StageResource::collection($stages);
    }

    public function show(Stage $stage)
    {
        return new StageResource($stage);
    }
}
