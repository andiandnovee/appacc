<?php

namespace App\Policies;

use App\Models\BusinessArea;
use App\Models\User;

class BusinessAreaPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole('accounting');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, BusinessArea $businessArea): bool
    {
        return $user->hasRole('accounting');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole('accounting');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, BusinessArea $businessArea): bool
    {
        return $user->hasRole('accounting');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, BusinessArea $businessArea): bool
    {
        return $user->hasRole('accounting');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, BusinessArea $businessArea): bool
    {
        return $user->hasRole('accounting');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, BusinessArea $businessArea): bool
    {
        return $user->hasRole('accounting');
    }
}
