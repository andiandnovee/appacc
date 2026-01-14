<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Laravel CORS Configuration for BSKM (SPA + Passport + Socialite)
    |--------------------------------------------------------------------------
    */

    'paths' => [
        'api/*',
        'auth/*',
        'oauth/*',
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://127.0.0.1:5173',
        'http://localhost:5173',
        'http://127.0.0.1:5174',
        'http://localhost:5174',
    ],

    // Izinkan semua subdomain warga007.com (termasuk bskm.warga007.com)
    'allowed_origins_patterns' => [
        '#https?://([a-z0-9-]+\.)*warga007\.com#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
