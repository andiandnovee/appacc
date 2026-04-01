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
use App\Http\Controllers\Api\InvoiceReceiptController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ── PUBLIC ────────────────────────────────────────────────────────────────

Route::prefix('auth')->group(function () {
    Route::post('/login',   [AuthController::class, 'login']);
    Route::post('/refresh', [AuthController::class, 'refresh']);

    Route::prefix('{provider}')->group(function () {
        Route::get('/redirect', [SocialAuthController::class, 'redirect']);
        Route::get('/callback', [SocialAuthController::class, 'callback']);
    });
});

// ── PROTECTED (JWT) ───────────────────────────────────────────────────────

Route::middleware('auth:api')->group(function () {

    // Auth
    Route::prefix('auth')->group(function () {
        Route::get('/me',      [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    // Dashboard
    Route::prefix('dashboard')->group(function () {
        Route::get('/stats',    [DashboardController::class, 'stats']);
        Route::get('/activity', [DashboardController::class, 'activity']);
    });

    // Users
    Route::prefix('users')->group(function () {
        Route::get('/',    [UserController::class, 'index']);
        Route::post('/',   [UserController::class, 'store'])->middleware('check-permission:create users');
        Route::get('/{id}',    [UserController::class, 'show']);
        Route::put('/{id}',    [UserController::class, 'update'])->middleware('check-permission:edit users');
        Route::delete('/{id}', [UserController::class, 'destroy'])->middleware('check-permission:delete users');
        Route::post('/{id}/assign-role', [UserController::class, 'assignRole'])->middleware('check-permission:edit users');
    });

    // Roles
    Route::prefix('roles')->group(function () {
        Route::get('/',    [RoleController::class, 'index'])->middleware('check-permission:view roles');
        Route::post('/',   [RoleController::class, 'store'])->middleware('check-permission:create roles');
        Route::put('/{id}',    [RoleController::class, 'update'])->middleware('check-permission:edit roles');
        Route::delete('/{id}', [RoleController::class, 'destroy'])->middleware('check-permission:delete roles');
    });

    // Permissions
    Route::get('/permissions', [PermissionController::class, 'index']);

    // Settings
    Route::prefix('settings')->group(function () {
        Route::get('/',  [SettingController::class, 'index']);
        Route::put('/',  [SettingController::class, 'update'])->middleware('check-permission:edit settings');
    });

    // ── ROLE: accounting ──────────────────────────────────────────────────
    Route::middleware('role:accounting')->group(function () {
        Route::get('vendors/search', [VendorController::class, 'search']); // sebelum apiResource!
        Route::apiResource('vendors', VendorController::class);


        Route::apiResource('invoice-receipts', InvoiceReceiptController::class);

    // Status endpoints
    Route::get('invoice-receipts/{invoiceReceipt}/statuses',
        [InvoiceReceiptController::class, 'statuses']);
    Route::post('invoice-receipts/{invoiceReceipt}/statuses',
        [InvoiceReceiptController::class, 'addStatus']);






    });

    // ── ROLE: super-admin ─────────────────────────────────────────────────
    Route::middleware('role:super-admin')->prefix('admin')->name('admin.')->group(function () {

        // Admin - Users
        Route::get('/users',                   [UserManagementController::class, 'index']);
        Route::put('/users/{user}/roles',      [UserManagementController::class, 'assignRoles']);
        Route::delete('/users/{user}',         [UserManagementController::class, 'destroy']);

        // Admin - Roles
        Route::get('/roles',          [RoleManagementController::class, 'index']);
        Route::post('/roles',         [RoleManagementController::class, 'store']);
        Route::put('/roles/{role}',   [RoleManagementController::class, 'update']);
        Route::delete('/roles/{role}',[RoleManagementController::class, 'destroy']);
    });
});