<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\AuthController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;

class SocialAuthController extends Controller
{
    protected array $allowed = ['google', 'facebook'];

    /**
     * Return OAuth redirect URL ke client
     * GET /api/auth/{provider}/redirect
     */
    public function redirect(string $provider)
    {
        if (!in_array($provider, $this->allowed)) {
            return response()->json([
                'success' => false,
                'message' => 'Provider tidak didukung.',
            ], 400);
        }

        $redirectUrl = Socialite::driver($provider)->stateless()->redirect()->getTargetUrl();

        return response()->json([
            'success' => true,
            'data'    => ['redirect_url' => $redirectUrl],
        ]);
    }

    /**
     * Handle OAuth callback dari Google/Facebook
     * GET /api/auth/{provider}/callback
     */
    public function callback(string $provider)
    {
        if (!in_array($provider, $this->allowed)) {
            return $this->redirectWithError('Provider tidak didukung.');
        }

        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();
        } catch (\Exception $e) {
            Log::error("OAuth [{$provider}] gagal ambil user: " . $e->getMessage());
            return $this->redirectWithError('Gagal autentikasi dengan ' . $provider . '.');
        }

        try {
            $user = $this->findOrCreateUser($socialUser, $provider);
        } catch (\Exception $e) {
            Log::error("OAuth [{$provider}] gagal find/create user: " . $e->getMessage());
            return $this->redirectWithError('Gagal memproses akun.');
        }

        if (!$user->is_active) {
            return $this->redirectWithError('Akun Anda tidak aktif. Hubungi administrator.');
        }

        try {
            $token = auth('api')->login($user);
        } catch (JWTException $e) {
            Log::error("OAuth [{$provider}] gagal issue JWT: " . $e->getMessage());
            return $this->redirectWithError('Gagal membuat token. Silakan coba lagi.');
        }

        $frontendUrl = config('app.frontend_url') . '/auth/callback';
        $isProd      = app()->environment('production');

        if ($isProd) {
            // Production: jangan taruh token di redirect!
            // Simpan di cache, kirim short-lived code ke frontend
            $code = Str::random(64);
            Cache::put("oauth_code:{$code}", $token, now()->addMinutes(5));

            return redirect($frontendUrl . '?code=' . $code);
        }

        // Local/dev: token langsung di URL (HTTP, cookie tidak bisa Secure)
        return redirect($frontendUrl . '?token=' . $token);
    }

    /**
     * Tukar short-lived code → HttpOnly cookie
     * POST /api/auth/exchange
     */
   public function exchange(Request $request)
{
    $code = $request->input('code');

    if (!$code) {
        return response()->json([
            'success' => false,
            'message' => 'Code diperlukan.',
        ], 422);
    }

    $token = Cache::pull("oauth_code:{$code}");

    if (!$token) {
        return response()->json([
            'success' => false,
            'message' => 'Code tidak valid atau sudah expired.',
        ], 401);
    }

    try {
        // Gunakan JWTAuth facade langsung
        $user = \PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth::setToken($token)->authenticate();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Token tidak valid.',
            ], 401);
        }
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Token tidak valid.',
        ], 401);
    }

    return app(AuthController::class)->respondWithTokenPublic($token, $user);
}

    // ─── Helpers ─────────────────────────────────────────────────────────────

    protected function findOrCreateUser($socialUser, string $provider): User
    {
        $user = User::where('provider', $provider)
            ->where('provider_id', $socialUser->getId())
            ->first();

        if (!$user && $socialUser->getEmail()) {
            $user = User::where('email', $socialUser->getEmail())->first();
        }

        if ($user) {
            $user->update([
                'provider'    => $provider,
                'provider_id' => $socialUser->getId(),
                'avatar'      => $socialUser->getAvatar(),
            ]);

            return $user;
        }

        $user = User::create([
            'name'        => $socialUser->getName() ?? $socialUser->getNickname() ?? 'User',
            'email'       => $socialUser->getEmail(),
            'avatar'      => $socialUser->getAvatar(),
            'provider'    => $provider,
            'provider_id' => $socialUser->getId(),
            'password'    => bcrypt(Str::random(32)),
            'is_active'   => true,
        ]);

        if (method_exists($user, 'assignRole')) {
            try {
                $user->assignRole('viewer');
            } catch (\Exception $e) {
                // Role belum exist — skip
            }
        }

        return $user;
    }

    protected function redirectWithError(string $message): \Illuminate\Http\RedirectResponse
    {
        $url = config('app.frontend_url') . '/login?error=' . urlencode($message);
        return redirect($url);
    }
}