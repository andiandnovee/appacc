<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Role;

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

    public function store(Request $request, AuditService $auditService): JsonResponse
    {
        $request->merge(['name' => strtolower(trim((string) $request->input('name')))]);
        $request->validate([
            'name' => ['required', 'string', 'max:64', 'unique:roles,name'],
        ]);

        $role = Role::create([
            'name'       => strtolower(trim($request->name)),
            'guard_name' => 'api',
        ]);
        $auditService->record('admin.role.created', [
            'business_domain' => 'admin',
            'action' => 'create',
            'auditable_type' => Role::class,
            'auditable_id' => $role->id,
            'subject_label' => $role->name,
            'description' => 'Role baru dibuat.',
        ], $request);

        return response()->json([
            'message' => "Role \"{$role->name}\" berhasil dibuat.",
            'data'    => ['id' => $role->id, 'name' => $role->name, 'guard_name' => $role->guard_name, 'users_count' => 0],
        ], 201);
    }

    public function update(Request $request, Role $role, AuditService $auditService): JsonResponse
    {
        $request->merge(['name' => strtolower(trim((string) $request->input('name')))]);
        $request->validate([
            'name' => ['required', 'string', 'max:64', "unique:roles,name,{$role->id}"],
        ]);

        $old = $role->name;
        $role->update(['name' => strtolower(trim($request->name))]);
        $auditService->record('admin.role.updated', [
            'business_domain' => 'admin',
            'action' => 'update',
            'auditable_type' => Role::class,
            'auditable_id' => $role->id,
            'subject_label' => $role->name,
            'description' => 'Role diperbarui.',
            'changes_before' => ['name' => $old],
            'changes_after' => ['name' => $role->name],
        ], $request);

        return response()->json([
            'message' => "Role \"{$old}\" diubah menjadi \"{$role->name}\".",
            'data'    => ['id' => $role->id, 'name' => $role->name, 'guard_name' => $role->guard_name, 'users_count' => $role->users()->count()],
        ]);
    }

    public function destroy(Role $role, AuditService $auditService): JsonResponse
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
        $roleId = $role->id;
        $role->delete();
        $auditService->record('admin.role.deleted', [
            'business_domain' => 'admin',
            'action' => 'delete',
            'auditable_type' => Role::class,
            'auditable_id' => $roleId,
            'subject_label' => $name,
            'description' => 'Role dihapus dari panel admin.',
        ]);

        return response()->json(['message' => "Role \"{$name}\" berhasil dihapus."]);
    }
}
