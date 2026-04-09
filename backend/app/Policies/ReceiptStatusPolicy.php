<?php

namespace App\Policies;

use App\Models\ReceiptStatus;
use App\Models\User;

class ReceiptStatusPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole(['accounting', 'management']);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ReceiptStatus $receiptStatus): bool
    {
        return $user->hasRole(['accounting', 'management']);
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
    public function update(User $user, ReceiptStatus $receiptStatus): bool
    {
        return $user->hasRole('accounting');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ReceiptStatus $receiptStatus): bool
    {
        return $user->hasRole('accounting');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ReceiptStatus $receiptStatus): bool
    {
        return $user->hasRole('accounting');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ReceiptStatus $receiptStatus): bool
    {
        return $user->hasRole('accounting');
    }
}
