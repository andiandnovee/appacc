<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class RoleManagementController extends Controller
{
    public function index(): JsonResponse
    {
        $roles = Role::withCount('users')->orderBy('name')->get()
            ->map(fn($role) => [
                'id'          => $role->id,
                'name'        => $role->name,
                'guard_name'  => $role->guard_name,
                'users_count' => $role->users_count,
            ]);

        return response()->json(['data' => $roles]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:64', 'unique:roles,name'],
        ]);

        $role = Role::create([
            'name'       => strtolower(trim($request->name)),
            'guard_name' => 'api',
        ]);

        return response()->json([
            'message' => "Role \"{$role->name}\" berhasil dibuat.",
            'data'    => ['id' => $role->id, 'name' => $role->name, 'guard_name' => $role->guard_name, 'users_count' => 0],
        ], 201);
    }

    public function update(Request $request, Role $role): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:64', "unique:roles,name,{$role->id}"],
        ]);

        $old = $role->name;
        $role->update(['name' => strtolower(trim($request->name))]);

        return response()->json([
            'message' => "Role \"{$old}\" diubah menjadi \"{$role->name}\".",
            'data'    => ['id' => $role->id, 'name' => $role->name, 'guard_name' => $role->guard_name, 'users_count' => $role->users()->count()],
        ]);
    }

    public function destroy(Role $role): JsonResponse
    {
        if ($role->name === 'superadmin') {
            return response()->json(['message' => 'Role superadmin tidak dapat dihapus.'], 403);
        }

        $count = $role->users()->count();
        if ($count > 0) {
            return response()->json([
                'message' => "Role \"{$role->name}\" masih dipakai {$count} user.",
            ], 422);
        }

        $name = $role->name;
        $role->delete();

        return response()->json(['message' => "Role \"{$name}\" berhasil dihapus."]);
    }
}
