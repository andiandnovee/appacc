<?php

namespace App\Helpers;

class MaskingHelper
{
    public static function maskByAuth(
    ?string $value, // ubah jadi nullable
    array $onlyRoles = [],
    array $exceptRoles = [],
    array $onlyPermissions = [],
    array $exceptPermissions = [],
    int $visibleCount = 4,
    ?int $ownerId = null,
    bool $allowSelf = true
): string {
    $user = auth()->user();

    // Tambahin pengecekan awal
    if (is_null($value) || $value === '') {
        return ''; // return kosong, bukan null
    }

    if (!$user) {
        return self::mask($value, $visibleCount);
    }

    // ✅ cek apakah ini data milik user login
    if ($allowSelf && $ownerId) {
        // kasus 1 → tabel anggota punya user_id
        if ($user->id === $ownerId) {
            return $value;
        }

        // kasus 2 → tabel users punya anggota_id
        if (property_exists($user, 'anggota_id') && $user->anggota_id === $ownerId) {
            return $value;
        }
    }

    // cek onlyRoles
    if (!empty($onlyRoles)) {
        return $user->hasAnyRole($onlyRoles)
            ? $value
            : self::mask($value, $visibleCount);
    }

    // cek exceptRoles
    if (!empty($exceptRoles)) {
        return $user->hasAnyRole($exceptRoles)
            ? self::mask($value, $visibleCount)
            : $value;
    }

    // cek onlyPermissions
    if (!empty($onlyPermissions)) {
        return $user->canAny($onlyPermissions)
            ? $value
            : self::mask($value, $visibleCount);
    }

    // cek exceptPermissions
    if (!empty($exceptPermissions)) {
        return $user->canAny($exceptPermissions)
            ? self::mask($value, $visibleCount)
            : $value;
    }

    // default sensor
    return self::mask($value, $visibleCount);
}

}