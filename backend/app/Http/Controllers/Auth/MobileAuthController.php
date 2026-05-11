<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;

class MobileAuthController extends Controller
{
    /**
     * Login via Google ID Token dari Android
     * POST /api/auth/google/mobile
     */
    public function googleMobile(Request $request)
    {
        $request->validate([
            'id_token' => 'required|string',
        ]);

        try {
            // Verifikasi id_token ke Google
            $response = Http::get('https://oauth2.googleapis.com/tokeninfo', [
                'id_token' => $request->id_token,
            ]);

            if (!$response->successful()) {
                return response()->json([
                    'success' => false,
                    'message' => 'ID token tidak valid.',
                ], 401);
            }

            $payload = $response->json();

            // Validasi audience — pastikan token untuk app kita
            $validAudiences = [
                config('services.google.client_id'),                          // web client
                '478317070172-mrfj2aed4cab9kqff7mj5sbbhs807ciq.apps.googleusercontent.com', // android client
            ];

            if (!in_array($payload['aud'] ?? '', $validAudiences)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token tidak ditujukan untuk aplikasi ini.',
                ], 401);
            }

            // Ambil data user dari payload Google
            $googleId = $payload['sub'];
            $email    = $payload['email'] ?? null;
            $name     = $payload['name'] ?? $email;
            $avatar   = $payload['picture'] ?? null;

            if (!$email) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email tidak tersedia dari akun Google.',
                ], 422);
            }

            // Find or create user
            $user = User::where('provider', 'google')
                ->where('provider_id', $googleId)
                ->first();

            if (!$user) {
                $user = User::where('email', $email)->first();
            }

            if ($user) {
                $user->update([
                    'provider'    => 'google',
                    'provider_id' => $googleId,
                    'avatar'      => $avatar,
                ]);
            } else {
                $user = User::create([
                    'name'        => $name,
                    'email'       => $email,
                    'avatar'      => $avatar,
                    'provider'    => 'google',
                    'provider_id' => $googleId,
                    'password'    => bcrypt(Str::random(32)),
                    'is_active'   => true,
                ]);

                if (method_exists($user, 'assignRole')) {
                    try {
                        $user->assignRole('accounting');
                    } catch (\Exception $e) {
                        // Role belum exist — skip
                    }
                }
            }

            if (!$user->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Akun tidak aktif. Hubungi administrator.',
                ], 403);
            }

            // Issue JWT
            $token = auth('api')->login($user);

            return response()->json([
                'success' => true,
                'message' => 'Login berhasil.',
                'token'   => $token,
                'user'    => [
                    'id'     => $user->id,
                    'name'   => $user->name,
                    'email'  => $user->email,
                    'avatar' => $user->avatar,
                    'roles'  => $user->getRoleNames(),
                ],
            ]);

        } catch (JWTException $e) {
            Log::error('Mobile auth JWT error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat token.',
            ], 500);
        } catch (\Exception $e) {
            Log::error('Mobile auth error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }
}
