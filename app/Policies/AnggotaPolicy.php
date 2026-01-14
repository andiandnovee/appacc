<?php

namespace App\Policies;

use App\Models\Core\User;
use App\Models\Keanggotaan\Anggota;
use App\Policies\Traits\OwnsAnggotaData;

class AnggotaPolicy
{
    use OwnsAnggotaData;

    public function view(User $user, Anggota $anggota): bool
    {
        return $this->checkPermission($user, $anggota, 'Anggota.View', 'AnggotaSelf.View');
    }

    public function update(User $user, Anggota $anggota): bool
    {
        return $this->checkPermission($user, $anggota, 'Anggota.Manage', 'AnggotaSelf.Manage');
    }

    public function delete(User $user, Anggota $anggota): bool
    {
        return $this->checkPermission($user, $anggota, 'Anggota.Delete', 'AnggotaSelf.Delete');
    }
}
