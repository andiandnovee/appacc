<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Route;

/**
 * Helper untuk membuat resource routes + middleware permission per action
 * dengan pola permission: "{$permissionBase}.View|Manage|Delete"
 *
 * Istilah:
 * - permissionBase: nama domain permission (mis. "Anggota", "Iuran"), sesuai seeder.
 * - strict: jika true, hanya daftarkan route kalau method ada di controller.
 */
class RouteHelper
{
    /**
     * Generate resource routes dengan mapping permission otomatis.
     *
     * @param  string $uri             // prefix URI, mis. 'manajemen-anggota'
     * @param  string $controller      // FQCN controller, mis. AnggotaController::class
     * @param  string $permissionBase  // basis permission, mis. 'Anggota'
     * @param  array  $options         // include, except, map, namesPrefix, strict
     * @return void
     */
    public static function resourceWithPermissions(
        string $uri,
        string $controller,
        string $permissionBase,
        array $options = []
    ): void {
        // Default daftar action + (HTTP methods, URI suffix, permission suffix)
        // NOTE: 'search' ditaruh PALING AWAL supaya tidak bentrok dengan '{id}'
        // Tambahkan sebelum $defaultActions
$paramName = $options['param'] ?? str_replace('-', '_', $uri);

$defaultActions = [
    'search' => [
        'methods' => ['GET'],
        'uri'     => '/search',
        'perm'    => 'View',
    ],
    'index' => [
        'methods' => ['GET'],
        'uri'     => '',
        'perm'    => 'View',
    ],
    'show' => [
        'methods' => ['GET'],
        'uri'     => '/{' . $paramName . '}',
        'perm'    => 'View',
    ],
    'create' => [
        'methods' => ['GET'],
        'uri'     => '/create',
        'perm'    => 'Manage',
    ],
    'store' => [
        'methods' => ['POST'],
        'uri'     => '',
        'perm'    => 'Manage',
    ],
    'edit' => [
        'methods' => ['GET'],
        'uri'     => '/{' . $paramName . '}/edit',
        'perm'    => 'Manage',
    ],
    'update' => [
        'methods' => ['PUT', 'PATCH'],
        'uri'     => '/{' . $paramName . '}',
        'perm'    => 'Manage',
    ],
    'destroy' => [
        'methods' => ['DELETE'],
        'uri'     => '/{' . $paramName . '}',
        'perm'    => 'Delete',
    ],
];


        // Opsi
        $include     = $options['include']     ?? array_keys($defaultActions); // actions yang dipakai
        $except      = $options['except']      ?? [];                           // actions yang dikecualikan
        $map         = $options['map']         ?? [];                           // override permission per action
        $namesPrefix = $options['namesPrefix'] ?? $uri;                         // prefix nama route
        $strict      = $options['strict']      ?? true;                         // cek method_exists

        // Filter actions sesuai include/except, dan pertahankan urutan default
        $actions = array_values(array_filter(array_keys($defaultActions), function ($a) use ($include, $except) {
            return in_array($a, $include, true) && !in_array($a, $except, true);
        }));

        foreach ($actions as $action) {
            $meta = $defaultActions[$action];

            // Cek method di controller (agar tidak bikin route untuk method yang tidak ada)
            if ($strict && !method_exists($controller, $action)) {
                continue;
            }

            // Tentukan permission
            // Jika di $map disediakan value BERISI TITIK (.) → dianggap full permission name (mis. "Anggota.SuperDelete")
            // Jika tidak, gunakan "{$permissionBase}.{$meta['perm']}"
            $perm = $map[$action] ?? "{$permissionBase}.{$meta['perm']}";

            // Daftarkan route
            Route::match($meta['methods'], $uri . $meta['uri'], [$controller, $action])
                ->name("{$namesPrefix}.{$action}")
                ->middleware("can:{$perm}");
        }
    }
}