<?php

use Illuminate\Support\Facades\Route;

// Serve the SPA for all routes
Route::get('/', function () {
    return view('app');
});

// Catch-all route for Vue Router
Route::get('{any}', function () {
    return view('app');
})->where('any', '.*');
