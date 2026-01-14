<?php

namespace App\Http\Controllers\Api\v1;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Models\Core\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionController extends Controller
{
    /**
     * Ringkasan role untuk kartu: jumlah user dan contoh anggota.
     */
    public function rolesSummary()
    {
        $roles = Role::query()
            ->orderBy('name')
            ->get();

        $data = $roles->map(function (Role $role) {
            $users = User::query()
                ->role($role->name)
                ->with(['anggota:id,nama'])
                ->orderBy('name')
                ->limit(5)
                ->get(['id', 'name', 'email', 'anggota_id']);

            return [
                'id' => $role->id,
                'name' => $role->name,
                'users_count' => $users->count(),
                'sample_users' => $users->map(function (User $user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'anggota' => $user->anggota ? [
                            'id' => $user->anggota->id,
                            'nama' => $user->anggota->nama,
                        ] : null,
                    ];
                })->values(),
            ];
        })->values();

        return ResponseFormatter::success(
            $data,
            'Ringkasan role berhasil dimuat.'
        );
    }

    /**
     * Detail satu role: user & daftar permission (assigned / not).
     */
    public function roleDetail(Role $role)
    {
        $allPermissions = Permission::query()
            ->orderBy('name')
            ->get();

        $rolePermissionNames = $role->permissions->pluck('name')->all();

        $permissions = $allPermissions->map(function (Permission $perm) use ($rolePermissionNames) {
            $name = $perm->name;
            $parts = explode('.', $name, 2);
            $group = $parts[0] ?? 'Lainnya';

            return [
                'id' => $perm->id,
                'name' => $name,
                'group' => $group,
                'assigned' => in_array($name, $rolePermissionNames, true),
            ];
        })->values();

        $users = User::query()
            ->role($role->name)
            ->with(['anggota:id,nama'])
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'anggota_id']);

        $userPayload = $users->map(function (User $user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'anggota' => $user->anggota ? [
                    'id' => $user->anggota->id,
                    'nama' => $user->anggota->nama,
                ] : null,
            ];
        })->values();

        return ResponseFormatter::success(
            [
                'role' => [
                    'id' => $role->id,
                    'name' => $role->name,
                ],
                'users' => $userPayload,
                'permissions' => $permissions,
            ],
            'Detail role berhasil dimuat.'
        );
    }

    /**
     * Update permission untuk satu role (sync).
     */
    public function updateRolePermissions(Request $request, Role $role)
    {
        $data = $request->validate([
            'permissions' => ['array'],
            'permissions.*' => ['string'],
        ]);

        $names = $data['permissions'] ?? [];

        $validNames = Permission::whereIn('name', $names)->pluck('name')->all();

        $role->syncPermissions($validNames);

        return ResponseFormatter::success(
            null,
            'Permission role berhasil diperbarui.'
        );
    }

    /**
     * Daftar semua permission (untuk explorer).
     */
    public function permissionsIndex()
    {
        $permissions = Permission::query()
            ->orderBy('name')
            ->get();

        $data = $permissions->map(function (Permission $perm) {
            $parts = explode('.', $perm->name, 2);
            $group = $parts[0] ?? 'Lainnya';

            return [
                'id' => $perm->id,
                'name' => $perm->name,
                'group' => $group,
            ];
        })->values();

        return ResponseFormatter::success(
            $data,
            'Daftar permission berhasil dimuat.'
        );
    }

    /**
     * Siapa saja yang punya satu permission: role & user.
     */
    public function permissionHolders(string $permissionName)
    {
        /** @var Permission|null $perm */
        $perm = Permission::where('name', $permissionName)->first();
        if (! $perm) {
            return ResponseFormatter::error(
                null,
                'Permission tidak ditemukan.',
                404
            );
        }

        $roles = $perm->roles()
            ->withCount('users')
            ->orderBy('name')
            ->get()
            ->map(function (Role $role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'users_count' => $role->users_count ?? 0,
                ];
            })->values();

        $users = $perm->users()
            ->with(['roles:id,name', 'anggota:id,nama'])
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'anggota_id'])
            ->map(function (User $user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->roles->pluck('name')->values(),
                    'anggota' => $user->anggota ? [
                        'id' => $user->anggota->id,
                        'nama' => $user->anggota->nama,
                    ] : null,
                ];
            })->values();

        $parts = explode('.', $perm->name, 2);
        $group = $parts[0] ?? 'Lainnya';

        return ResponseFormatter::success(
            [
                'permission' => [
                    'id' => $perm->id,
                    'name' => $perm->name,
                    'group' => $group,
                ],
                'roles' => $roles,
                'users' => $users,
            ],
            'Daftar pemilik permission berhasil dimuat.'
        );
    }

    /**
     * Daftar user untuk manajemen per user (ringkas).
     */
    public function usersIndex(Request $request)
    {
        $query = User::query()
            ->with(['roles:id,name', 'anggota:id,nama'])
            ->orderBy('name');

        if ($search = trim((string) $request->get('q', ''))) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->limit(100)->get(['id', 'name', 'email', 'anggota_id']);

        $data = $users->map(function (User $user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->pluck('name')->values(),
                'anggota' => $user->anggota ? [
                    'id' => $user->anggota->id,
                    'nama' => $user->anggota->nama,
                ] : null,
            ];
        })->values();

        return ResponseFormatter::success(
            $data,
            'Daftar user untuk manajemen permission berhasil dimuat.'
        );
    }

    /**
     * Detail permission untuk satu user (role vs direct).
     */
    public function userPermissions(User $user)
    {
        $allPermissions = Permission::query()
            ->orderBy('name')
            ->get();

        $direct = $user->permissions->pluck('name')->all();
        $viaRoles = $user->getPermissionsViaRoles()->pluck('name')->all();

        $permissions = $allPermissions->map(function (Permission $perm) use ($direct, $viaRoles) {
            $name = $perm->name;
            $parts = explode('.', $name, 2);
            $group = $parts[0] ?? 'Lainnya';

            return [
                'id' => $perm->id,
                'name' => $name,
                'group' => $group,
                'from_roles' => in_array($name, $viaRoles, true),
                'direct' => in_array($name, $direct, true),
            ];
        })->values();

        return ResponseFormatter::success(
            [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'permissions' => $permissions,
            ],
            'Detail permission user berhasil dimuat.'
        );
    }

    /**
     * Update direct permission untuk user (override).
     */
    public function updateUserPermissions(Request $request, User $user)
    {
        $data = $request->validate([
            'permissions' => ['array'],
            'permissions.*' => ['string'],
        ]);

        $names = $data['permissions'] ?? [];

        $validNames = Permission::whereIn('name', $names)->pluck('name')->all();

        // Hanya sync direct permission; role tetap.
        $user->syncPermissions($validNames);

        return ResponseFormatter::success(
            null,
            'Permission langsung user berhasil diperbarui.'
        );
    }
}

