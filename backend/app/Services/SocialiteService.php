<?php

namespace App\Services;

use Laravel\Socialite\Facades\Socialite;

class SocialiteService
{
    /**
     * Get Google redirect URL
     */
    public function getGoogleRedirectUrl()
    {
        return Socialite::driver('google')->stateless()->redirect()->getTargetUrl();
    }

    /**
     * Get Google user
     */
    public function getGoogleUser()
    {
        return Socialite::driver('google')->stateless()->user();
    }

    /**
     * Get Facebook redirect URL
     */
    public function getFacebookRedirectUrl()
    {
        return Socialite::driver('facebook')->stateless()->redirect()->getTargetUrl();
    }

    /**
     * Get Facebook user
     */
    public function getFacebookUser()
    {
        return Socialite::driver('facebook')->stateless()->user();
    }
}
