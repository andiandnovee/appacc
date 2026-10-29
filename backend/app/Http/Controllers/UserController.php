<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * List all users
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Search by name or email
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
        }

        // Filter by role
        if ($request->has('role')) {
            $query->role($request->role);
        }

        $users = $query->paginate($request->get('per_page', 15));

        // Add roles to each user
        $users->getCollection()->transform(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'is_active' => $user->is_active,
                'roles' => $user->role_names,
                'permissions' => $user->permission_names,
                'created_at' => $user->created_at,
                'sap_user' => $user->sap_user,
                'sap_server_con' => $user->sap_server_con,
            ];
        });
        return response()->json([
            'success' => true,
            'data' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'total' => $users->total(),
                'per_page' => $users->perPage(),
            ],
        ]);
    }

    /**
     * Get single user
     */
    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'is_active' => $user->is_active,
                'roles' => $user->role_names,
                'permissions' => $user->permission_names,
                'created_at' => $user->created_at,
                'sap_user' => $user->sap_user,
                'sap_server_con' => $user->sap_server_con,
            ],
        ]);
    }

    /**
     * Create new user
     */
    public function store(UserRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_active' => true,
        ]);
        app(AuditService::class)->record('admin.user.created', [
            'business_domain' => 'admin',
            'action' => 'create',
            'auditable_type' => User::class,
            'auditable_id' => $user->id,
            'subject_label' => $user->name,
            'description' => 'User baru dibuat.',
            'metadata' => ['user_id' => $user->id],
        ], $request);

        return response()->json([
            'success' => true,
            'message' => 'User created successfully',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ], 201);
    }

    /**
     * Update user
     */
    public function update(UserRequest $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }

        $data = $request->only(['name', 'email', 'is_active']);
        $before = $user->only(['name', 'is_active']);

        if ($request->has('password') && $request->password) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);
        app(AuditService::class)->record('admin.user.updated', [
            'business_domain' => 'admin',
            'action' => 'update',
            'auditable_type' => User::class,
            'auditable_id' => $user->id,
            'subject_label' => $user->name,
            'description' => 'Data user diperbarui.',
            'changes_before' => $before,
            'changes_after' => $user->only(array_keys($before)),
        ], $request);

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_active' => $user->is_active,
            ],
        ]);
    }

    /**
 * Update SAP credentials for current authenticated user
 */
public function updateSapProfile(Request $request)
{
    $request->validate([
        'sap_user'       => 'nullable|string|max:255',
        'sap_server_con' => 'nullable|string|max:255',
    ]);

    $user = auth()->user();

    $user->update($request->only(['sap_user', 'sap_server_con']));

    return response()->json([
        'success' => true,
        'message' => 'SAP profile updated successfully',
        'data' => [
            'id'             => $user->id,
            'sap_user'       => $user->sap_user,
            'sap_server_con' => $user->sap_server_con,
        ],
    ]);
}
    /**
     * Delete user
     */
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }

        $userName = $user->name;
        $user->delete();
        app(AuditService::class)->record('admin.user.deleted', [
            'business_domain' => 'admin',
            'action' => 'delete',
            'auditable_type' => User::class,
            'auditable_id' => (int) $id,
            'subject_label' => $userName,
            'description' => 'User dihapus.',
            'metadata' => ['user_id' => (int) $id],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully',
        ]);
    }

    /**
     * Assign role to user
     */
    public function assignRole(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }

        $request->merge(['role' => strtolower(trim((string) $request->input('role')))]);
        $request->validate([
            'role' => 'required|string',
        ]);

        $before = $user->getRoleNames()->values()->all();
        $user->syncRoles([$request->role]);
        app(AuditService::class)->record('admin.user.roles.changed', [
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
            'success' => true,
            'message' => 'Role assigned successfully',
            'data' => [
                'id' => $user->id,
                'roles' => $user->role_names,
                'permissions' => $user->permission_names,
            ],
        ]);
    }
}
