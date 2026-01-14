<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Core\AuthLog;
use App\Models\Core\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialController extends Controller
{
    public function handleGoogleCallback(Request $request)
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $user = User::updateOrCreate(
                ['google_id' => $googleUser->id],
                [
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'avatar' => $googleUser->avatar,
                    'email_verified_at' => now(),
                    'password' => bcrypt(Str::random(16)),
                ]
            );

            if (! $user->hasRole('guser')) {
                $user->assignRole('guser');
            }

            // Revoke token lama
            $user->tokens()->update(['revoked' => true]);

            // Buat token passport baru
            $tokenResult = $user->createToken('bskm-token');
            $accessToken = $tokenResult->accessToken;

            AuthLog::create([
                'user_id' => $user->id,
                'action' => 'login',
                'ip_address' => $request->ip(),
                'user_agent' => $request->header('User-Agent'),
            ]);

            // Redirect ke SPA
            $redirectUrl = sprintf(
                '%s/auth/callback?token=%s&name=%s&email=%s',
                env('FRONTEND_URL', 'http://localhost:5173'),
                $accessToken,
                urlencode($user->name),
                urlencode($user->email)
            );

            return redirect()->away($redirectUrl);

        } catch (\Throwable $e) {

            \Log::error('Google OAuth callback error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Login via Google gagal',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}