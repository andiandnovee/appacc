<?php

use App\Http\Controllers\Api\AuthController;
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
