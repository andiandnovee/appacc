<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Console\Kernel');
$kernel->bootstrap();

// Get Super Admin user
$superAdmin = \App\Models\User::where('email', 'admin@admin.com')->first();

echo "╔════════════════════════════════════════════════════════════════════════════════╗\n";
echo "║                    DEBUG: LOGIN RESPONSE CHECK                                 ║\n";
echo "╚════════════════════════════════════════════════════════════════════════════════╝\n\n";

echo "USER DETAILS:\n";
echo 'ID: '.$superAdmin->id."\n";
echo 'Name: '.$superAdmin->name."\n";
echo 'Email: '.$superAdmin->email."\n";
echo 'Avatar: '.($superAdmin->avatar ?: 'NULL')."\n";
echo 'Provider: '.($superAdmin->provider ?: 'NULL')."\n";

echo "\n".str_repeat('─', 80)."\n\n";

echo "CHECKING ATTRIBUTES:\n";
echo '✓ getRoleNames(): '.json_encode($superAdmin->getRoleNames()->toArray())."\n";
echo '✓ role_names attribute (cast): '.json_encode($superAdmin->role_names)."\n";
echo '✓ getRoleNamesAttribute(): '.json_encode($superAdmin->getRoleNamesAttribute())."\n";

echo "\n";

echo "✓ getAllPermissions()->pluck('name'): ".json_encode($superAdmin->getAllPermissions()->pluck('name')->toArray())."\n";
echo '✓ permission_names attribute (cast): '.json_encode($superAdmin->permission_names)."\n";
echo '✓ getPermissionNamesAttribute(): '.json_encode($superAdmin->getPermissionNamesAttribute())."\n";

echo "\n".str_repeat('─', 80)."\n\n";

echo "LOGIN RESPONSE STRUCTURE:\n";
$loginResponse = [
    'success' => true,
    'message' => 'Login successful',
    'data' => [
        'token' => 'placeholder_token',
        'user' => [
            'id' => $superAdmin->id,
            'name' => $superAdmin->name,
            'email' => $superAdmin->email,
            'avatar' => $superAdmin->avatar,
            'provider' => $superAdmin->provider,
            'roles' => $superAdmin->role_names,
            'permissions' => $superAdmin->permission_names,
        ],
    ],
];

echo json_encode($loginResponse, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

echo "\n\n".str_repeat('─', 80)."\n\n";

echo "VERIFICATION:\n";
$permsInResponse = $superAdmin->permission_names;
$requiredPerms = ['view users', 'view roles', 'view settings'];

foreach ($requiredPerms as $perm) {
    $exists = in_array($perm, $permsInResponse);
    $status = $exists ? '✓ YES' : '✗ NO';
    echo $status." - Permission '{$perm}' in response\n";
}
