<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Console\Kernel');
$kernel->bootstrap();

echo "╔════════════════════════════════════════════════════════════════════════════════╗\n";
echo "║                    PERMISSION & SIDEBAR LINK VERIFICATION                      ║\n";
echo "╚════════════════════════════════════════════════════════════════════════════════╝\n\n";

// Sidebar menu items dan required permissions
$menuItems = [
    ['path' => '/dashboard', 'label' => 'Dashboard', 'permission' => null],
    ['path' => '/users', 'label' => 'Users', 'permission' => 'view users'],
    ['path' => '/roles', 'label' => 'Roles', 'permission' => 'view roles'],
    ['path' => '/settings', 'label' => 'Settings', 'permission' => 'view settings'],
];

$users = \App\Models\User::all();

foreach ($users as $user) {
    echo "┌─────────────────────────────────────────────────────────────────────────────┐\n";
    echo "│ USER: {$user->name} ({$user->email})\n";
    echo '│ ROLE(S): '.implode(', ', $user->getRoleNames()->toArray())."\n";
    echo "├─────────────────────────────────────────────────────────────────────────────┤\n";

    $userPermissions = $user->getAllPermissions()->pluck('name')->toArray();
    echo '│ PERMISSIONS: '.implode(', ', $userPermissions)."\n";
    echo "├─────────────────────────────────────────────────────────────────────────────┤\n";
    echo "│ SIDEBAR MENU VISIBILITY:\n";

    foreach ($menuItems as $item) {
        $hasPermission = ! $item['permission'] || in_array($item['permission'], $userPermissions);
        $status = $hasPermission ? '✓ VISIBLE' : '✗ HIDDEN';
        $requiredPerm = $item['permission'] ? "({$item['permission']})" : '(no permission required)';
        $label = str_pad($item['label'], 20);
        $statusPad = str_pad($status, 15);
        echo '│   • '.$label.' '.$statusPad.' '.$requiredPerm."\n";
    }

    echo "└─────────────────────────────────────────────────────────────────────────────┘\n\n";
}

// Test login response format
echo "╔════════════════════════════════════════════════════════════════════════════════╗\n";
echo "║                      LOGIN RESPONSE DATA STRUCTURE                              ║\n";
echo "╚════════════════════════════════════════════════════════════════════════════════╝\n\n";

$testUser = $users->first();
echo 'Example response for: '.$testUser->name."\n\n";

$loginResponse = [
    'success' => true,
    'message' => 'Login successful',
    'data' => [
        'token' => 'sample_token_here',
        'user' => [
            'id' => $testUser->id,
            'name' => $testUser->name,
            'email' => $testUser->email,
            'avatar' => $testUser->avatar,
            'provider' => $testUser->provider,
            'roles' => $testUser->getRoleNames()->toArray(),
            'permissions' => $testUser->getAllPermissions()->pluck('name')->toArray(),
        ],
    ],
];

echo json_encode($loginResponse, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
echo "\n\n";

// Check permission flow
echo "╔════════════════════════════════════════════════════════════════════════════════╗\n";
echo "║                         PERMISSION FLOW SUMMARY                                ║\n";
echo "╚════════════════════════════════════════════════════════════════════════════════╝\n\n";

echo "1. USER LOGS IN\n";
echo "   ↓ AuthController::login() queries user from database\n";
echo "   ↓ Returns user->role_names and user->permission_names attributes\n\n";

echo "2. FRONTEND STORES:\n";
echo "   ↓ localStorage['user'] = JSON with roles and permissions\n";
echo "   ↓ useAuthStore.user = user object with permissions array\n\n";

echo "3. SIDEBAR RENDERING:\n";
echo "   ↓ AppSidebar.vue filters menuItems using hasPermission() composable\n";
echo "   ↓ hasPermission(permission) checks if permission exists in auth.userPermissions\n";
echo "   ↓ Only menu items with matching permissions are rendered\n\n";

echo "4. RESULT:\n";
echo "   ✓ super-admin user sees: Dashboard, Users, Roles, Settings\n";
echo "   ✗ viewer user sees: Dashboard ONLY\n\n";
