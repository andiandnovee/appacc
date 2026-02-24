<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\SocialiteService;
use Illuminate\Http\Request;

class SocialiteController extends Controller
{
    protected $socialiteService;

    public function __construct(SocialiteService $socialiteService)
    {
        $this->socialiteService = $socialiteService;
    }

    /**
     * Google redirect
     */
    public function googleRedirect()
    {
        $redirectUrl = $this->socialiteService->getGoogleRedirectUrl();

        return response()->json([
            'success' => true,
            'data' => [
                'redirect_url' => $redirectUrl,
            ],
        ]);
    }

    /**
     * Google callback
     */
    public function googleCallback(Request $request)
    {
        try {
            $googleUser = $this->socialiteService->getGoogleUser();

            $user = $this->findOrCreateUser($googleUser, 'google');
            $token = $user->createToken('api-token')->plainTextToken;

            $redirectUrl = config('app.frontend_url') . '/auth/callback?token=' . $token;

            return redirect($redirectUrl);
        } catch (\Exception $e) {
            return redirect(config('app.frontend_url') . '/login?error=OAuth failed');
        }
    }

    /**
     * Facebook redirect
     */
    public function facebookRedirect()
    {
        $redirectUrl = $this->socialiteService->getFacebookRedirectUrl();

        return response()->json([
            'success' => true,
            'data' => [
                'redirect_url' => $redirectUrl,
            ],
        ]);
    }

    /**
     * Facebook callback
     */
    public function facebookCallback(Request $request)
    {
        try {
            $facebookUser = $this->socialiteService->getFacebookUser();

            $user = $this->findOrCreateUser($facebookUser, 'facebook');
            $token = $user->createToken('api-token')->plainTextToken;

            $redirectUrl = config('app.frontend_url') . '/auth/callback?token=' . $token;

            return redirect($redirectUrl);
        } catch (\Exception $e) {
            return redirect(config('app.frontend_url') . '/login?error=OAuth failed');
        }
    }

    /**
     * Find or create user
     */
    protected function findOrCreateUser($socialiteUser, $provider)
    {
        // Try to find by provider_id
        $user = User::where('provider', $provider)
            ->where('provider_id', $socialiteUser->getId())
            ->first();

        if ($user) {
            return $user;
        }

        // Try to find by email
        $user = User::where('email', $socialiteUser->getEmail())->first();

        if ($user) {
            $user->update([
                'provider' => $provider,
                'provider_id' => $socialiteUser->getId(),
                'avatar' => $socialiteUser->getAvatar(),
            ]);
            return $user;
        }

        // Create new user
        $user = User::create([
            'name' => $socialiteUser->getName() ?? $socialiteUser->getNickname(),
            'email' => $socialiteUser->getEmail(),
            'avatar' => $socialiteUser->getAvatar(),
            'provider' => $provider,
            'provider_id' => $socialiteUser->getId(),
            'password' => \Illuminate\Support\Str::random(16),
            'is_active' => true,
        ]);

        // Assign viewer role
        $user->assignRole('viewer');

        return $user;
    }
}
