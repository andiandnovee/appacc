<?php

use App\Http\Controllers\Auth\SocialController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

// =====================================================
// 1️⃣. CSRF Cookie (untuk Sanctum lama, tetap dipertahankan)
// =====================================================

// =====================================================
// 2️⃣. Social Login (Google OAuth via Passport Integration)
// =====================================================
// Pastikan URL ini cocok dengan konfigurasi di Google Cloud Console
// Route::middleware('web')->group(function () {
//     Route::get('auth/google', [SocialController::class, 'redirectToGoogle'])
//         ->name('google.redirect');

//     Route::get('auth/google/callback', [SocialController::class, 'handleGoogleCallback'])
//         ->name('google.callback');
// });

// =====================================================
// 3️⃣. Root Route (Landing / Dashboard Redirect)
// =====================================================
// - Jika user login → redirect ke dashboard
// - Jika belum login → tampilkan landing page dari build Vue SPA
Route::get('/', function () {
    if (Auth::check()) {
        return redirect('/dashboard');
    }

    $indexFile = public_path('spa/index.html');

    if (file_exists($indexFile)) {
        // Kirimkan file hasil build SPA (landing guest)
        return file_get_contents($indexFile);
    }

    // Jika SPA belum dibuild → tampilkan pesan fallback
    return response(
        '<h1>Frontend belum dibuild</h1>
         <p>Jalankan <code>npm run build</code> di folder <code>resources/js/spa</code>, 
         lalu salin hasil <code>dist</code> ke folder <code>public/</code>.</p>',
        503
    );
});

// =====================================================
// 3️⃣ BONUS. Serve SPA Assets if Web Server Can't
// =====================================================
// Fallback: If web server doesn't serve /spa/assets/ directly,
// this route serves them with proper MIME types
Route::get('/assets/{filename}', function ($filename) {
    $filePath = public_path("spa/assets/{$filename}");

    if (! file_exists($filePath)) {
        return response('Not Found', 404);
    }

    // Determine MIME type
    $mimeTypes = [
        'js' => 'application/javascript',
        'css' => 'text/css',
        'svg' => 'image/svg+xml',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif' => 'image/gif',
        'woff' => 'font/woff',
        'woff2' => 'font/woff2',
        'ttf' => 'font/ttf',
        'eot' => 'application/vnd.ms-fontobject',
    ];

    $ext = pathinfo($filePath, PATHINFO_EXTENSION);
    $mimeType = $mimeTypes[$ext] ?? 'application/octet-stream';

    return response(file_get_contents($filePath), 200, [
        'Content-Type' => $mimeType,
        'Cache-Control' => 'public, max-age=31536000, immutable',
    ]);
})->where('filename', '.*');

// Also handle rewrites from .htaccess that map /assets/* to /spa/assets/*
Route::get('/spa/assets/{filename}', function ($filename) {
    $filePath = public_path("spa/assets/{$filename}");

    if (! file_exists($filePath)) {
        return response('Not Found', 404);
    }

    // Determine MIME type
    $mimeTypes = [
        'js' => 'application/javascript',
        'css' => 'text/css',
        'svg' => 'image/svg+xml',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif' => 'image/gif',
        'woff' => 'font/woff',
        'woff2' => 'font/woff2',
        'ttf' => 'font/ttf',
        'eot' => 'application/vnd.ms-fontobject',
    ];

    $ext = pathinfo($filePath, PATHINFO_EXTENSION);
    $mimeType = $mimeTypes[$ext] ?? 'application/octet-stream';

    return response(file_get_contents($filePath), 200, [
        'Content-Type' => $mimeType,
        'Cache-Control' => 'public, max-age=31536000, immutable',
    ]);
})->where('filename', '.*');

// =====================================================
// 4️⃣. SPA Entry Point (Fallback untuk semua route Vue Router)
// =====================================================
// Setelah login, semua routing SPA (misalnya /dashboard, /profile, dll)
// ditangani oleh Vue Router yang di-serve dari index.html build-an.

Route::fallback(function () {
    // SPA handler - serve spa/index.html untuk routing SPA
    $indexFile = public_path('spa/index.html');

    if (file_exists($indexFile)) {
        return file_get_contents($indexFile);
    }

    return response(
        '<h1>Frontend belum dibuild</h1>
         <p>Jalankan <code>npm run build</code> di folder <code>resources/js/spa</code>, 
         lalu salin hasil <code>dist</code> ke folder <code>public/</code>.</p>',
        503
    );
});
