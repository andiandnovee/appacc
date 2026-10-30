<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()['cache']->forget('spatie.permission.cache');

        // Create Permissions
        $permissions = [
            // User permissions
            'view users',
            'create users',
            'edit users',
            'delete users',
            // Role permissions
            'view roles',
            'create roles',
            'edit roles',
            'delete roles',
            // Settings permissions
            'view settings',
            'edit settings',
            // Dashboard permissions
            'view dashboard',
            // GL account master
            'view gl accounts',
            'create gl accounts',
            'edit gl accounts',
            'delete gl accounts',
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(['name' => strtolower(trim($permission)), 'guard_name' => 'api']);
        }

        // Create Roles
        $superAdminRole = Role::updateOrCreate(['name' => 'super-admin', 'guard_name' => 'api']);
        $adminRole = Role::updateOrCreate(['name' => 'admin', 'guard_name' => 'api']);
        $editorRole = Role::updateOrCreate(['name' => 'editor', 'guard_name' => 'api']);
        $viewerRole = Role::updateOrCreate(['name' => 'viewer', 'guard_name' => 'api']);

        // Assign permissions to super-admin (all permissions)
        $superAdminRole->syncPermissions($permissions);

        // Assign permissions to admin (all except role management)
        $adminPermissions = [
            'view users', 'create users', 'edit users', 'delete users',
            'view settings', 'edit settings',
            'view dashboard',
            'view gl accounts', 'create gl accounts', 'edit gl accounts', 'delete gl accounts',
        ];
        $adminRole->syncPermissions($adminPermissions);

        // Assign permissions to editor
        $editorPermissions = ['view users', 'view dashboard'];
        $editorRole->syncPermissions($editorPermissions);

        // Assign permissions to viewer
        $viewerPermissions = ['view dashboard'];
        $viewerRole->syncPermissions($viewerPermissions);
    }
}
