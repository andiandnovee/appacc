<?php

namespace App\Policies;

use App\Models\Core\User;
use App\Models\Keluarga;
use App\Policies\Traits\OwnsAnggotaData;

class KeluargaPolicy
{
    use OwnsAnggotaData;

    public function view(User $user, Keluarga $keluarga): bool
    {
        return $this->checkPermission($user, $keluarga, 'Keluarga.View', 'KeluargaSelf.View');
    }

    public function update(User $user, Keluarga $keluarga): bool
    {
        return $this->checkPermission($user, $keluarga, 'Keluarga.Update', 'KeluargaSelf.Update');
    }

    public function delete(User $user, Keluarga $keluarga): bool
    {
        return $this->checkPermission($user, $keluarga, 'Keluarga.Delete', 'KeluargaSelf.Delete');
    }
}
