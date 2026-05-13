<?php
// app/Policies/StagePolicy.php
namespace App\Policies;

use App\Models\Stage;
use App\Models\User;

class StagePolicy
{
    private function isAccounting(User $user): bool
    {
        return $user->hasRole(['accounting', 'admin'], 'api');
    }

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Stage $stage): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $this->isAccounting($user);
    }

    public function update(User $user, Stage $stage): bool
    {
        return $this->isAccounting($user);
    }

    public function delete(User $user, Stage $stage): bool
    {
        return $this->isAccounting($user);
    }
}