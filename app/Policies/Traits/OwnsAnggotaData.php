<?php

namespace App\Policies\Traits;

use App\Models\Core\User;

trait OwnsAnggotaData
{
    /**
     * Cek apakah user adalah pemilik data berbasis relasi anggota.
     *
     * @param  \App\Models\Core\User  $user
     * @param  mixed $model  Model apapun yang punya relasi `anggota`
     */
    protected function isOwner(User $user, $model): bool
    {
         // Jika model Anggota, cek langsung user_id
    if ($model instanceof \App\Models\Keanggotaan\Anggota) {
        return $model->user_id === $user->id;
    }

    // Jika model lain yang punya relasi anggota
    return $model->anggota 
        && $model->anggota->user_id === $user->id;
    }

    /**
     * Cek izin akses generik.
     *
     * @param  \App\Models\Core\User  $user
     * @param  mixed $model
     * @param  string $permissionGlobal → misal "Iuran.View"
     * @param  string $permissionSelf   → misal "IuranSelf.View"
     */
    protected function checkPermission(User $user, $model, string $permissionGlobal, string $permissionSelf): bool
    {
        // 1. Global access
        if ($user->can($permissionGlobal)) {
            return true;
        }

        // 2. Self access
        if ($user->can($permissionSelf)) {
            return $this->isOwner($user, $model);
        }

        // 3. Default: dilarang
        return false;
    }
}
