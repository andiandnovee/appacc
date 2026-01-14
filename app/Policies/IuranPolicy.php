<?php

namespace App\Policies;

use App\Models\Core\User;
use App\Models\Iuran;
use App\Policies\Traits\OwnsAnggotaData;

class IuranPolicy
{
    use OwnsAnggotaData;

    public function view(User $user, Iuran $iuran): bool
    {
        return $this->checkPermission($user, $iuran, 'Iuran.View', 'IuranSelf.View');
    }

    public function update(User $user, Iuran $iuran): bool
    {
        return $this->checkPermission($user, $iuran, 'Iuran.Update', 'IuranSelf.Update');
    }

    public function delete(User $user, Iuran $iuran): bool
    {
        return $this->checkPermission($user, $iuran, 'Iuran.Delete', 'IuranSelf.Delete');
    }
}
