<?php
// app/Http/Controllers/Api/StageController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StageRequest;
use App\Http\Resources\StageResource;
use App\Models\Stage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;

class StageController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Stage::class);

        $query = Stage::query()
            ->when($request->filled('year'), fn($q) =>
                $q->where('year', $request->year)
            )
            ->when($request->filled('search'), fn($q) =>
                $q->where('name', 'like', "%{$request->search}%")
            )
            ->orderByDesc('year')
            ->orderBy('name');

        // Jika ada request paginate (dari Table component), gunakan paginate
        if ($request->boolean('paginate', true) && $request->filled('per_page')) {
            $perPage = min((int) $request->per_page, 100);
            return StageResource::collection($query->paginate($perPage));
        }

        return StageResource::collection($query->get());
    }

    public function show(Stage $stage): StageResource
    {
        $this->authorize('view', $stage);

        return new StageResource($stage);
    }

    public function store(StageRequest $request): StageResource
    {
        $this->authorize('create', Stage::class);

        $stage = Stage::create($request->validated());

        return new StageResource($stage);
    }

    public function update(StageRequest $request, Stage $stage): StageResource
    {
        $this->authorize('update', $stage);

        $stage->update($request->validated());

        return new StageResource($stage);
    }

    public function destroy(Stage $stage): JsonResponse
    {
        $this->authorize('delete', $stage);

        $stage->delete();

        return response()->json(['message' => 'Stage berhasil dihapus.']);
    }
}