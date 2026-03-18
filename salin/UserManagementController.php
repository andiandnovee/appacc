<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
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
    public function assignRoles(Request $request, User $user): JsonResponse
    {
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

        $user->syncRoles($roles);

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
    public function destroy(User $user): JsonResponse
    {
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'You cannot delete your own account.'], 403);
        }

        $user->delete();

        return response()->json(['message' => "{$user->name} has been removed."]);
    }
}
