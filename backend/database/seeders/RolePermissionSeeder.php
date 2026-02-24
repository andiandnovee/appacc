<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

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
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(['name' => $permission]);
        }

        // Create Roles
        $superAdminRole = Role::updateOrCreate(['name' => 'super-admin']);
        $adminRole = Role::updateOrCreate(['name' => 'admin']);
        $editorRole = Role::updateOrCreate(['name' => 'editor']);
        $viewerRole = Role::updateOrCreate(['name' => 'viewer']);

        // Assign permissions to super-admin (all permissions)
        $superAdminRole->syncPermissions($permissions);

        // Assign permissions to admin (all except role management)
        $adminPermissions = [
            'view users', 'create users', 'edit users', 'delete users',
            'view settings', 'edit settings',
            'view dashboard',
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
