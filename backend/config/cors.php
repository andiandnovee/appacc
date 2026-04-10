<?php

return [
    'paths' => [
        'api/*',
        'auth/*',
        'sanctum/csrf-cookie',
        'login',
        'logout',
        'register',
        'user',
        'auth/google/*',
        'auth/google/redirect',
        'auth/google/callback',
        'google/*'  // tambahkan fallback
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        // Production
        'https://appacc.warga007.web.id',
        'https://api-appacc.warga007.web.id',
        
        // Development - Localhost
        'http://localhost',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:5173',  // Vite default
        'http://localhost:8080',   // Webpack default
        'http://localhost:8000',
        
        // Development - 127.0.0.1
        'http://127.0.0.1',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:8080',
        'http://127.0.0.1:8000',
        
        // Jika menggunakan IP lain untuk development
        'http://192.168.1.*',  // Tidak support wildcard seperti ini, harus spesifik
    ],

    'allowed_origins_patterns' => [
        // Pattern untuk localhost dengan port berapa saja
        '/^http:\/\/localhost:\d+$/',
        '/^http:\/\/127\.0\.0\.1:\d+$/',
        '/^http:\/\/192\.168\.\d+\.\d+:\d+$/',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];