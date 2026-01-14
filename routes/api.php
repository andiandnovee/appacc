<?php

use App\Http\Controllers\Api\AuthController as ApiAuthController;
use App\Http\Controllers\Api\SocialController;
use App\Http\Controllers\Api\v1\AccountsController;
use App\Http\Controllers\Api\v1\AnggotaController;
use App\Http\Controllers\Api\v1\CashbookController;
use App\Http\Controllers\Api\v1\IuranAnggotaController;
use App\Http\Controllers\Api\v1\IuranSelfController;
use App\Http\Controllers\Api\v1\JournalController;
use App\Http\Controllers\Api\v1\KolektorReceiptController;
use App\Http\Controllers\Api\v1\RefIuranController;
use App\Http\Controllers\Api\v1\RolePermissionController;
use App\Http\Controllers\Api\v1\SetoranKolektorController;
use App\Http\Controllers\Api\v1\UserAnggotaApprovalController;
use App\Http\Controllers\Api\v1\UserAnggotaRequestController;
use App\Http\Controllers\Api\v1\UserDeviceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES (tanpa autentikasi)
|--------------------------------------------------------------------------
*/

Route::get('/status', function () {
    return response()->json([
        'app' => 'BSKM API',
        'mode' => 'passport',
        'version' => app()->version(),
        'status' => 'running',
    ]);
});

/*
|--------------------------------------------------------------------------
| Google OAuth (SPA)
|--------------------------------------------------------------------------
*/

Route::get('/socialite/google', function () {
    $url = \Laravel\Socialite\Facades\Socialite::driver('google')
        ->stateless()
        ->redirect()
        ->getTargetUrl();

    return response()->json(['url' => $url]);
});

Route::get('/auth/google/callback', [SocialController::class, 'handleGoogleCallback']);

// Login → menghasilkan token Passport
Route::post('/login', [ApiAuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| PROTECTED ROUTES (wajib token Passport)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:api')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    */
    Route::post('/logout', [ApiAuthController::class, 'logout']);
    Route::post('/refresh', [ApiAuthController::class, 'refresh']);

    /*
    |--------------------------------------------------------------------------
    | User session
    |--------------------------------------------------------------------------
    */
    Route::get('/user', function (Request $request) {
        $user = $request->user()->load(['anggota']);

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'anggota' => $user->anggota,
                'roles' => $user->getRoleNames()->values(),
                'permissions' => $user->getAllPermissions()->pluck('name')->values(),
            ],
        ]);
    });

    // Route opsional
    Route::get('/me', [ApiAuthController::class, 'me'])->name('api.me');

    /*
    |--------------------------------------------------------------------------
    | API v1 (semua endpoint bisnis)
    |--------------------------------------------------------------------------
    */
    Route::prefix('v1')->group(function () {
        /*
        |--------------------------------------------------------------------------
        | Iuran Self (Anggota melihat iuran sendiri)
        |--------------------------------------------------------------------------
        */
        Route::middleware('permission:AnggotaSelf.View')
            ->get('iuran/self', [IuranSelfController::class, 'index'])
            ->name('iuran.self');

        /*
        |--------------------------------------------------------------------------
        | Iuran Anggota (Pengurus melihat iuran anggota lain)
        |--------------------------------------------------------------------------
        */
        Route::middleware('permission:Iuran.View')->group(function () {
            Route::get('iuran/anggota', [IuranAnggotaController::class, 'index'])
                ->name('iuran.anggota.index');

            Route::get('iuran/anggota/{anggotaId}', [IuranAnggotaController::class, 'show'])
                ->name('iuran.anggota.show');
        });

        /*
        |--------------------------------------------------------------------------
        | Ref Iuran
        |--------------------------------------------------------------------------
        */
        Route::middleware('permission:RefIuran.View')->group(function () {
            Route::get('ref-iuran', [RefIuranController::class, 'index'])
                ->name('ref-iuran.index');

            Route::get('ref-iuran/{id}', [RefIuranController::class, 'show'])
                ->name('ref-iuran.show');
        });

        Route::middleware('permission:RefIuran.Manage')->group(function () {
            Route::post('ref-iuran', [RefIuranController::class, 'store'])
                ->name('ref-iuran.store');

            Route::match(['put', 'patch'], 'ref-iuran/{id}', [RefIuranController::class, 'update'])
                ->name('ref-iuran.update');
        });

        Route::delete('ref-iuran/{id}', [RefIuranController::class, 'destroy'])
            ->middleware('permission:RefIuran.Delete')
            ->name('ref-iuran.destroy');

        /*
        |--------------------------------------------------------------------------
        | Iuran Anggota
        |--------------------------------------------------------------------------
        */

        Route::middleware('permission:Iuran.View')->group(function () {
            Route::get('iuran-anggota', [RefIuranController::class, 'index'])
                ->name('iuran-anggota.index');

            Route::get('iuran-anggota/{id}', [RefIuranController::class, 'show'])
                ->name('iuran-anggota.show');
        });

        Route::middleware('permission:Iuran.Manage')->group(function () {
            Route::post('iuran-anggota', [RefIuranController::class, 'store'])
                ->name('iuran-anggota.store');

            Route::match(['put', 'patch'], 'iuran-anggota/{id}', [RefIuranController::class, 'update'])
                ->name('iuran-anggota.update');
        });

        Route::delete('iuran-anggota/{id}', [RefIuranController::class, 'destroy'])
            ->middleware('permission:Iuran.Delete')
            ->name('iuran-anggota.destroy');

        /*
        |--------------------------------------------------------------------------
        | Kas Masuk / Keluar (Cashbook)
        |--------------------------------------------------------------------------
        */
        // Kas Masuk/Keluar + Posisi Kas (versi sederhana)
        Route::middleware('permission:Kas.Manage')->group(function () {
            Route::post('kas/masuk', [CashbookController::class, 'kasMasuk']);
            Route::post('kas/keluar', [CashbookController::class, 'kasKeluar']);
        });
        Route::middleware('permission:Kas.View')->group(function () {
            Route::get('kas/accounts', [CashbookController::class, 'getAccounts']);
            Route::get('kas/position', [CashbookController::class, 'kasPosition']);
            Route::get('kas/masuk/history', [CashbookController::class, 'kasMasukHistory']);
            Route::get('kas/keluar/history', [CashbookController::class, 'kasKeluarHistory']);
        });

        // =========================
        //   PERMISSION: Account.View
        // =========================
        Route::get('/accounts', [AccountsController::class, 'index'])
            ->middleware('permission:Account.View');

        Route::get('/accounts/tree', [AccountsController::class, 'tree'])
            ->middleware('permission:Account.View');

        Route::get('/accounts/{id}', [AccountsController::class, 'show'])
            ->middleware('permission:Account.View');

        // =========================
        //   PERMISSION: Account.Manage
        // =========================
        Route::post('/accounts', [AccountsController::class, 'store'])
            ->middleware('permission:Account.Manage');

        Route::put('/accounts/{id}', [AccountsController::class, 'update'])
            ->middleware('permission:Account.Manage');

        // =========================
        //   PERMISSION: Account.Delete
        // =========================
        Route::delete('/accounts/{id}', [AccountsController::class, 'destroy'])
            ->middleware('permission:Account.Delete');

        // =========================
        //   JOURNAL ROUTES
        // =========================
        Route::get('/journal', [JournalController::class, 'index'])
            ->middleware('permission:Account.View');

        Route::get('/journal/{id}', [JournalController::class, 'show'])
            ->middleware('permission:Account.View');

        /*
        |--------------------------------------------------------------------------
        | Anggota
        |--------------------------------------------------------------------------
        */
        Route::middleware('permission_combo:Anggota.View|Guser.View')->group(function () {
            Route::get('anggotas', [AnggotaController::class, 'index'])
                ->name('anggotas.index');

            Route::get('anggotas/{id}', [AnggotaController::class, 'show'])
                ->name('anggotas.show');
        });

        Route::middleware('permission:Anggota.Manage')->group(function () {
            Route::post('anggotas', [AnggotaController::class, 'store'])
                ->name('anggotas.store');

            Route::put('anggotas/{id}', [AnggotaController::class, 'update'])
                ->name('anggotas.update');
        });

        Route::delete('anggotas/{id}', [AnggotaController::class, 'destroy'])
            ->middleware('permission:Anggota.Delete')
            ->name('anggotas.destroy');

        /*
        |--------------------------------------------------------------------------
        | User Devices (FCM token)
        |--------------------------------------------------------------------------
        */
        Route::post('user/devices', [UserDeviceController::class, 'store'])
            ->name('user.devices.store');

        /*
        |--------------------------------------------------------------------------
        | User → Ajukan Penautan Anggota
        |--------------------------------------------------------------------------
        */
        Route::post('user/anggota-request', [UserAnggotaRequestController::class, 'store'])
            ->name('user-anggota-request.store');

        Route::get('user/anggota-request/status', [UserAnggotaRequestController::class, 'status'])
            ->name('user-anggota-request.status');

        /*
        |--------------------------------------------------------------------------
        | Sekretaris – Approval Request
        |--------------------------------------------------------------------------
        */
        Route::prefix('anggota-requests')
            ->middleware('permission:Anggota.Manage')
            ->group(function () {

                Route::get('/', [UserAnggotaApprovalController::class, 'index'])
                    ->name('anggota-requests.index');

                Route::post('{id}/approve', [UserAnggotaApprovalController::class, 'approve'])
                    ->name('anggota-requests.approve');

                Route::post('{id}/reject', [UserAnggotaApprovalController::class, 'reject'])
                    ->name('anggota-requests.reject');
            });

        /*
        |--------------------------------------------------------------------------
        | Kolektor – Terima Iuran
        |--------------------------------------------------------------------------
        | Endpoints untuk kolektor mencari anggota dan mencatat penerimaan iuran.
        | Akses baca bisa pakai IuranSetor.View ATAU IuranSetor.Manage.
        | Akses tulis tetap wajib IuranSetor.Manage.
        */
        Route::middleware('permission_combo:IuranSetor.View|IuranSetor.Manage')->group(function () {
            Route::get('kolektor/anggotas/search', [KolektorReceiptController::class, 'searchAnggota']);
            Route::get('kolektor/receipts/pending', [KolektorReceiptController::class, 'pendingSetor']);
            Route::get('kolektor/receipts/{id}', [KolektorReceiptController::class, 'show'])
                ->whereNumber('id');

            // Kolektor – Setor ke bendahara (baca daftar pending)
            Route::get('kolektor/setoran/pending-receipts', [SetoranKolektorController::class, 'pendingReceipts']);
        });

        // Kolektor membuat batch setoran
        Route::middleware('permission:IuranSetor.Manage')->group(function () {
            Route::post('kolektor/receipts', [KolektorReceiptController::class, 'store']);
            Route::post('kolektor/receipts/pending/cancel', [KolektorReceiptController::class, 'cancelPending']);

            Route::post('kolektor/setoran', [SetoranKolektorController::class, 'store']);
        });

        /*
        |--------------------------------------------------------------------------
        | Bendahara – Terima Setoran Kolektor
        |--------------------------------------------------------------------------
        */
        Route::middleware('permission_combo:Kas.View|Kas.Manage')->group(function () {
            Route::get('bendahara/setoran/summary', [SetoranKolektorController::class, 'summaryUntukBendahara']);
            Route::get('bendahara/setoran/pending', [SetoranKolektorController::class, 'pendingSetoranUntukBendahara']);
        });

        Route::middleware('permission:Kas.Manage')->group(function () {
            Route::post('bendahara/setoran/{id}/approve', [SetoranKolektorController::class, 'approve'])
                ->whereNumber('id');
        });

        /*
        |--------------------------------------------------------------------------
        | Manajemen Role & Permission (AssignRole.*)
        |--------------------------------------------------------------------------
        */
        Route::middleware('permission:AssignRole.View')->group(function () {
            Route::get('admin/roles/summary', [RolePermissionController::class, 'rolesSummary']);
            Route::get('admin/roles/{role}/detail', [RolePermissionController::class, 'roleDetail'])
                ->whereNumber('role');

            Route::get('admin/permissions', [RolePermissionController::class, 'permissionsIndex']);
            Route::get('admin/permissions/{permissionName}/holders', [RolePermissionController::class, 'permissionHolders'])
                ->where('permissionName', '.*');

            Route::get('admin/users', [RolePermissionController::class, 'usersIndex']);
            Route::get('admin/users/{user}/permissions', [RolePermissionController::class, 'userPermissions'])
                ->whereNumber('user');
        });

        Route::middleware('permission:AssignRole.Manage')->group(function () {
            Route::put('admin/roles/{role}/permissions', [RolePermissionController::class, 'updateRolePermissions'])
                ->whereNumber('role');

            Route::put('admin/users/{user}/permissions', [RolePermissionController::class, 'updateUserPermissions'])
                ->whereNumber('user');
        });
    });
});
