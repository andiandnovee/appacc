<?php

return [
    'paths' => [
        'api/*',              // mengcover semua endpoint di routes/api.php
        'api/auth/google/redirect',
        'auth/google/redirect',
        'sanctum/csrf-cookie',
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'https://appacc.warga007.web.id',
        'http://localhost:3000',      // jika perlu development lokal
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,   // penting jika pakai session/cookie
];