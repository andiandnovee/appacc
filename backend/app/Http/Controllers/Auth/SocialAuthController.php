<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    protected $allowed = ['google', 'facebook'];

    public function redirect($provider)
    {
        if (! in_array($provider, $this->allowed)) {
            return response()->json(['success' => false, 'message' => 'Unsupported provider'], 400);
        }

        $redirectUrl = Socialite::driver($provider)->stateless()->redirect()->getTargetUrl();

        return response()->json([
            'success' => true,
            'data' => ['redirect_url' => $redirectUrl],
        ]);
    }

    public function callback(Request $request, $provider)
    {
        if (! in_array($provider, $this->allowed)) {
            return response()->json(['success' => false, 'message' => 'Unsupported provider'], 400);
        }

        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();

            // Find by provider_id
            $user = User::where('provider', $provider)
                ->where('provider_id', $socialUser->getId())
                ->first();

            if (! $user && $socialUser->getEmail()) {
                $user = User::where('email', $socialUser->getEmail())->first();
            }

            if ($user) {
                $user->update([
                    'provider' => $provider,
                    'provider_id' => $socialUser->getId(),
                    'avatar' => $socialUser->getAvatar(),
                ]);
            } else {
                $user = User::create([
                    'name' => $socialUser->getName() ?? $socialUser->getNickname(),
                    'email' => $socialUser->getEmail(),
                    'avatar' => $socialUser->getAvatar(),
                    'provider' => $provider,
                    'provider_id' => $socialUser->getId(),
                    'password' => Str::random(16),
                    'is_active' => true,
                ]);

                // Assign default role if roles package is used
                if (method_exists($user, 'assignRole')) {
                    try {
                        $user->assignRole('viewer');
                    } catch (\Exception $e) {
                        // ignore if role doesn't exist
                    }
                }
            }

            $token = $user->createToken('api-token')->plainTextToken;

            return response()->json([
                'success' => true,
                'data' => [
                    'token' => $token,
                    'user' => $user,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'OAuth failed'], 500);
        }
    }
}
