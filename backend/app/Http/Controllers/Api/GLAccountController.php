<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\GLAccountRequest;
use App\Http\Resources\GLAccountResource;
use App\Models\GLAccount;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GLAccountController extends Controller
{
    public function index(Request $request)
    {
        $query = GLAccount::query();

        if ($search = trim((string) $request->input('search'))) {
            $query->where(function ($query) use ($search) {
                $query->where('gl_acc', 'like', "%{$search}%")
                    ->orWhere('gl_text', 'like', "%{$search}%")
                    ->orWhere('gl_group', 'like', "%{$search}%")
                    ->orWhere('group_src', 'like', "%{$search}%")
                    ->orWhere('desc', 'like', "%{$search}%")
                    ->orWhere('other_desc', 'like', "%{$search}%");
            });
        }

        $allowedSorts = ['gl_acc', 'gl_text', 'gl_group', 'group_src', 'desc', 'other_desc'];
        $sortBy = in_array($request->input('sort_by'), $allowedSorts, true)
            ? $request->input('sort_by')
            : 'gl_acc';
        $sortDir = $request->input('sort_dir') === 'desc' ? 'desc' : 'asc';
        $perPage = min(max((int) $request->input('per_page', 15), 1), 100);

        return GLAccountResource::collection(
            $query->orderBy($sortBy, $sortDir)->orderBy('id')->paginate($perPage)
        );
    }

    public function store(GLAccountRequest $request): GLAccountResource
    {
        return new GLAccountResource(GLAccount::create($request->validated()));
    }

    public function show(GLAccount $glAccount): GLAccountResource
    {
        return new GLAccountResource($glAccount);
    }

    public function update(GLAccountRequest $request, GLAccount $glAccount): GLAccountResource
    {
        $glAccount->update($request->validated());

        return new GLAccountResource($glAccount);
    }

    public function destroy(GLAccount $glAccount): JsonResponse
    {
        $glAccount->delete();

        return response()->json(['message' => 'GL Account berhasil dihapus.']);
    }
}
