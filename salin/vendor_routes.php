<?php

// ─── Tambahkan di dalam group auth middleware di routes/api.php ───────────────
//
// Route::middleware(['auth:api'])->group(function () {
//
//     ... route lain ...
//

use App\Http\Controllers\Api\Vendor\VendorController;

// Vendor lookup (search ringan untuk form dropdown) — taruh SEBELUM apiResource
// agar /vendors/search tidak bentrok dengan /vendors/{vendor}
Route::get('vendors/search', [VendorController::class, 'search']);

// CRUD lengkap
Route::apiResource('vendors', VendorController::class);

// Catatan:
// apiResource akan generate:
//   GET    /api/vendors              → index
//   POST   /api/vendors              → store
//   GET    /api/vendors/{vendor}     → show
//   PUT    /api/vendors/{vendor}     → update
//   DELETE /api/vendors/{vendor}     → destroy
//
// });
