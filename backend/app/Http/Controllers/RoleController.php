<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Role;
use App\Services\AuditService;

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
    public function store(Request $request, AuditService $auditService)
    {
        $request->merge([
            'name' => strtolower(trim((string) $request->input('name'))),
            'permissions' => array_map(
                fn ($permission) => strtolower(trim($permission)),
                $request->input('permissions', [])
            ),
        ]);
        $request->validate([
            'name' => 'required|string|unique:roles',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string',
        ]);

        $role = Role::create(['name' => $request->name, 'guard_name' => 'api']);

        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }
        $auditService->record('admin.role.created', [
            'business_domain' => 'admin',
            'action' => 'create',
            'auditable_type' => Role::class,
            'auditable_id' => $role->id,
            'subject_label' => $role->name,
            'description' => 'Role baru dibuat.',
            'changes_after' => ['permissions' => $role->permissions->pluck('name')->all()],
        ], $request);

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
    public function update(Request $request, $id, AuditService $auditService)
    {
        $request->merge([
            'name' => strtolower(trim((string) $request->input('name'))),
            'permissions' => array_map(
                fn ($permission) => strtolower(trim($permission)),
                $request->input('permissions', [])
            ),
        ]);
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

        $before = [
            'name' => $role->name,
            'permissions' => $role->permissions->pluck('name')->all(),
        ];
        $role->update(['name' => $request->name]);

        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }
        $auditService->record('admin.role.updated', [
            'business_domain' => 'admin',
            'action' => 'update',
            'auditable_type' => Role::class,
            'auditable_id' => $role->id,
            'subject_label' => $role->name,
            'description' => 'Role diperbarui.',
            'changes_before' => $before,
            'changes_after' => [
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name')->all(),
            ],
        ], $request);

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
    public function destroy($id, AuditService $auditService)
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

        $roleName = $role->name;
        $roleId = $role->id;
        $role->delete();
        $auditService->record('admin.role.deleted', [
            'business_domain' => 'admin',
            'action' => 'delete',
            'auditable_type' => Role::class,
            'auditable_id' => $roleId,
            'subject_label' => $roleName,
            'description' => 'Role dihapus.',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Role deleted successfully',
        ]);
    }
}
