<?php

use App\Http\Controllers\Admin\RoleManagementController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Vendor\VendorController;
use App\Http\Controllers\Auth\SocialAuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ── Public: Auth ──────────────────────────────────────────────────────────
Route::prefix('auth')->group(function () {

    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/refresh', [AuthController::class, 'refresh']);

    // Social Auth
    Route::get('/{provider}/redirect', [SocialAuthController::class, 'redirect']);
    Route::get('/{provider}/callback', [SocialAuthController::class, 'callback']);

});

// ── Protected: JWT ────────────────────────────────────────────────────────
Route::middleware('auth:api')->group(function () {

    // Auth
    Route::prefix('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    // Dashboard
    Route::prefix('dashboard')->group(function () {
        Route::get('/stats', [DashboardController::class, 'stats']);
        Route::get('/activity', [DashboardController::class, 'activity']);
    });

    // Users
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::get('/{id}', [UserController::class, 'show']);
        Route::post('/', [UserController::class, 'store'])
            ->middleware('check-permission:create users');
        Route::put('/{id}', [UserController::class, 'update'])
            ->middleware('check-permission:edit users');
        Route::delete('/{id}', [UserController::class, 'destroy'])
            ->middleware('check-permission:delete users');
        Route::post('/{id}/assign-role', [UserController::class, 'assignRole'])
            ->middleware('check-permission:edit users');
    });

    Route::middleware(['auth:api', 'role:accounting'])->group(function () {

        // Taruh SEBELUM apiResource agar /vendors/search tidak
        // bentrok dengan /vendors/{vendor}
        Route::get('vendors/search', [VendorController::class, 'search']);

        // CRUD lengkap
        // GET    /api/vendors              → index
        // POST   /api/vendors              → store
        // GET    /api/vendors/{vendor}     → show
        // PUT    /api/vendors/{vendor}     → update
        // DELETE /api/vendors/{vendor}     → destroy
        Route::apiResource('vendors', VendorController::class);

    });

    Route::middleware(['auth:api', 'role:superadmin'])
        ->prefix('admin')
        ->name('admin.')
        ->group(function () {
            // Users
            Route::get('/users', [UserManagementController::class, 'index']);
            Route::put('/users/{user}/roles', [UserManagementController::class, 'assignRoles']);
            Route::delete('/users/{user}', [UserManagementController::class, 'destroy']);

            // Roles
            Route::get('/roles', [RoleManagementController::class, 'index']);
            Route::post('/roles', [RoleManagementController::class, 'store']);
            Route::put('/roles/{role}', [RoleManagementController::class, 'update']);
            Route::delete('/roles/{role}', [RoleManagementController::class, 'destroy']);
        });
    // Roles
    Route::prefix('roles')->group(function () {
        Route::get('/', [RoleController::class, 'index'])
            ->middleware('check-permission:view roles');
        Route::post('/', [RoleController::class, 'store'])
            ->middleware('check-permission:create roles');
        Route::put('/{id}', [RoleController::class, 'update'])
            ->middleware('check-permission:edit roles');
        Route::delete('/{id}', [RoleController::class, 'destroy'])
            ->middleware('check-permission:delete roles');
    });

    // Permissions
    Route::get('/permissions', [PermissionController::class, 'index']);

    // Settings
    Route::prefix('settings')->group(function () {
        Route::get('/', [SettingController::class, 'index']);
        Route::put('/', [SettingController::class, 'update'])
            ->middleware('check-permission:edit settings');
    });

});
