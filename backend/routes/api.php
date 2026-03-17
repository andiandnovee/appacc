<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\SocialiteController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public Auth Routes
Route::post('/auth/login', [AuthController::class, 'login']);
// Social auth endpoints using SocialiteController (Google & Facebook)
Route::get('/auth/google/redirect', [SocialiteController::class, 'googleRedirect']);
Route::get('/auth/google/callback', [SocialiteController::class, 'googleCallback']);
Route::get('/auth/facebook/redirect', [SocialiteController::class, 'facebookRedirect']);
Route::get('/auth/facebook/callback', [SocialiteController::class, 'facebookCallback']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/activity', [DashboardController::class, 'activity']);

    // Users
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::post('/users', [UserController::class, 'store'])->middleware('check-permission:create users');
    Route::put('/users/{id}', [UserController::class, 'update'])->middleware('check-permission:edit users');
    Route::delete('/users/{id}', [UserController::class, 'destroy'])->middleware('check-permission:delete users');
    Route::post('/users/{id}/assign-role', [UserController::class, 'assignRole'])->middleware('check-permission:edit users');

    // Roles
    Route::get('/roles', [RoleController::class, 'index'])->middleware('check-permission:view roles');
    Route::post('/roles', [RoleController::class, 'store'])->middleware('check-permission:create roles');
    Route::put('/roles/{id}', [RoleController::class, 'update'])->middleware('check-permission:edit roles');
    Route::delete('/roles/{id}', [RoleController::class, 'destroy'])->middleware('check-permission:delete roles');

    // Permissions
    Route::get('/permissions', [PermissionController::class, 'index']);

    // Settings
    Route::get('/settings', [SettingController::class, 'index']);
    Route::put('/settings', [SettingController::class, 'update'])->middleware('check-permission:edit settings');
});
