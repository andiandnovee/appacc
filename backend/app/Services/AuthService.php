<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    /**
     * Attempt to login user
     */
    public function login($email, $password)
    {
        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            return null;
        }

        if (!$user->is_active) {
            return null;
        }

        return $user;
    }

    /**
     * Create API token for user
     */
    public function createToken(User $user)
    {
        return $user->createToken('api-token')->plainTextToken;
    }

    /**
     * Get user data with roles and permissions
     */
    public function getUserData(User $user)
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => $user->avatar,
            'provider' => $user->provider,
            'roles' => $user->role_names,
            'permissions' => $user->permission_names,
        ];
    }
}
