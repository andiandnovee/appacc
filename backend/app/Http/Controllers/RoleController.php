<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    /**
     * List all roles with permissions
     */
    public function index()
    {
        $roles = Role::with('permissions')->get()->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name')->toArray(),
                'users_count' => $role->users()->count(),
                'permissions_count' => $role->permissions->count(),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $roles,
        ]);
    }

    /**
     * Create new role
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:roles',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string',
        ]);

        $role = Role::create(['name' => $request->name]);

        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        return response()->json([
            'success' => true,
            'message' => 'Role created successfully',
            'data' => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name')->toArray(),
            ],
        ], 201);
    }

    /**
     * Update role
     */
    public function update(Request $request, $id)
    {
        $role = Role::find($id);

        if (!$role) {
            return response()->json([
                'success' => false,
                'message' => 'Role not found',
            ], 404);
        }

        $request->validate([
            'name' => 'required|string|unique:roles,name,' . $id,
            'permissions' => 'nullable|array',
            'permissions.*' => 'string',
        ]);

        $role->update(['name' => $request->name]);

        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        return response()->json([
            'success' => true,
            'message' => 'Role updated successfully',
            'data' => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name')->toArray(),
            ],
        ]);
    }

    /**
     * Delete role
     */
    public function destroy($id)
    {
        $role = Role::find($id);

        if (!$role) {
            return response()->json([
                'success' => false,
                'message' => 'Role not found',
            ], 404);
        }

        // Prevent deletion of super-admin role
        if ($role->name === 'super-admin') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete super-admin role',
            ], 403);
        }

        $role->delete();

        return response()->json([
            'success' => true,
            'message' => 'Role deleted successfully',
        ]);
    }
}
