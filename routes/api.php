<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Example API endpoints
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'API is working',
        'timestamp' => now(),
    ]);
});

// Add your API routes here
// Route::get('/items', [ItemController::class, 'index']);
// Route::post('/items', [ItemController::class, 'store']);
// Route::get('/items/{id}', [ItemController::class, 'show']);
// Route::put('/items/{id}', [ItemController::class, 'update']);
// Route::delete('/items/{id}', [ItemController::class, 'destroy']);
