<?php

// ─────────────────────────────────────────────────────────────
// File: routes/api.php  (tambahkan di dalam grup auth:api)
// ─────────────────────────────────────────────────────────────

use App\Http\Controllers\Admin\UserManagementController;

// Grup ini butuh: auth:api  +  role:superadmin (via middleware)
Route::middleware(['auth:api', 'role:superadmin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        // User management
        Route::get('/users',                    [UserManagementController::class, 'index'])->name('users.index');
        Route::put('/users/{user}/roles',       [UserManagementController::class, 'assignRoles'])->name('users.roles');
        Route::delete('/users/{user}',          [UserManagementController::class, 'destroy'])->name('users.destroy');

        // Roles list (untuk populate dropdown/multiselect)
        Route::get('/roles',                    [UserManagementController::class, 'roles'])->name('roles.index');
    });


// ─────────────────────────────────────────────────────────────
// Middleware alias — daftarkan di bootstrap/app.php atau Kernel
// ─────────────────────────────────────────────────────────────
//
// Jika pakai Laravel 11 (bootstrap/app.php):
//
//   ->withMiddleware(function (Middleware $middleware) {
//       $middleware->alias([
//           'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
//       ]);
//   })
//
// Jika pakai Laravel 10 (app/Http/Kernel.php):
//
//   protected $middlewareAliases = [
//       'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
//   ];
//
// ─────────────────────────────────────────────────────────────
