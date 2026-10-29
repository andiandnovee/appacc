<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class UserManagementController extends Controller
{
    /**
     * GET /api/admin/users
     * List all users with their assigned roles (paginated).
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::with('roles')
            ->when($request->search, fn ($q, $search) =>
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
            )
            ->latest();

        $users = $query->paginate($request->per_page ?? 10);

        return response()->json([
            'data' => $users->map(fn ($user) => [
                'id'         => $user->id,
                'name'       => $user->name,
                'email'      => $user->email,
                'avatar'     => $user->avatar ?? null,
                'roles'      => $user->roles->pluck('name'),
                'created_at' => $user->created_at->format('d M Y'),
            ]),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page'    => $users->lastPage(),
                'per_page'     => $users->perPage(),
                'total'        => $users->total(),
            ],
        ]);
    }

    /**
     * GET /api/admin/roles
     * List all available roles.
     */
    public function roles(): JsonResponse
    {
        $roles = Role::orderBy('name')->get(['id', 'name']);

        return response()->json(['data' => $roles]);
    }

    /**
     * PUT /api/admin/users/{user}/roles
     * Sync roles for a user. Replaces all existing roles.
     */
    public function assignRoles(Request $request, User $user, AuditService $auditService): JsonResponse
    {
        $request->merge([
            'roles' => array_map(
                fn ($role) => strtolower(trim($role)),
                $request->input('roles', [])
            ),
        ]);
        $request->validate([
            'roles'   => ['required', 'array'],
            'roles.*' => ['string', 'exists:roles,name'],
        ]);

        // Prevent superadmin from removing their own superadmin role
        if ($user->id === auth()->id() && in_array('superadmin', $user->getRoleNames()->toArray())) {
            $roles = collect($request->roles)->push('superadmin')->unique()->values()->toArray();
        } else {
            $roles = $request->roles;
        }

        $before = $user->getRoleNames()->values()->all();
        $user->syncRoles($roles);
        $auditService->record('admin.user.roles.changed', [
            'business_domain' => 'admin',
            'action' => 'update',
            'severity' => 'notice',
            'auditable_type' => User::class,
            'auditable_id' => $user->id,
            'subject_label' => $user->name,
            'description' => 'Role user diperbarui.',
            'changes_before' => ['roles' => $before],
            'changes_after' => ['roles' => $user->getRoleNames()->values()->all()],
        ], $request);

        return response()->json([
            'message' => "Roles for {$user->name} updated successfully.",
            'data'    => [
                'id'    => $user->id,
                'name'  => $user->name,
                'roles' => $user->fresh()->roles->pluck('name'),
            ],
        ]);
    }

    /**
     * DELETE /api/admin/users/{user}
     * Soft delete a user (requires SoftDeletes on User model).
     */
    public function destroy(User $user, AuditService $auditService): JsonResponse
    {
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'You cannot delete your own account.'], 403);
        }

        $userId = $user->id;
        $userName = $user->name;
        $user->delete();
        $auditService->record('admin.user.deleted', [
            'business_domain' => 'admin',
            'action' => 'delete',
            'auditable_type' => User::class,
            'auditable_id' => $userId,
            'subject_label' => $userName,
            'description' => 'User dihapus dari panel admin.',
            'metadata' => ['user_id' => $userId],
        ]);

        return response()->json(['message' => "{$user->name} has been removed."]);
    }
}
