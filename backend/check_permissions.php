<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Console\Kernel');
$kernel->bootstrap();

echo "=== USERS ===\n";
$users = \App\Models\User::all();
foreach ($users as $user) {
    echo "ID: {$user->id}, Name: {$user->name}, Email: {$user->email}, Active: {$user->is_active}\n";
}

echo "\n=== ROLES ===\n";
$roles = \Spatie\Permission\Models\Role::all();
foreach ($roles as $role) {
    echo "ID: {$role->id}, Name: {$role->name}\n";
}

echo "\n=== PERMISSIONS ===\n";
$permissions = \Spatie\Permission\Models\Permission::all();
foreach ($permissions as $permission) {
    echo "ID: {$permission->id}, Name: {$permission->name}\n";
}

echo "\n=== USER-ROLE RELATIONSHIPS ===\n";
foreach ($users as $user) {
    $roles = $user->getRoleNames();
    echo "User: {$user->name} => Roles: ".implode(', ', $roles->toArray())."\n";
}

echo "\n=== ROLE-PERMISSION RELATIONSHIPS ===\n";
$allRoles = \Spatie\Permission\Models\Role::all();
foreach ($allRoles as $role) {
    $permissions = $role->getAllPermissions();
    echo "Role: {$role->name} => Permissions: ".implode(', ', $permissions->pluck('name')->toArray())."\n";
}

echo "\n=== DIRECT USER PERMISSIONS ===\n";
foreach ($users as $user) {
    $permissions = $user->getAllPermissions();
    echo "User: {$user->name} => Permissions: ".implode(', ', $permissions->pluck('name')->toArray())."\n";
}
