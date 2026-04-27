<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use PHPOpenSourceSaver\JWTAuth\JWTGuard; //

class AuthController extends Controller
{
    /**
     * Login — return JWT token
     * POST /api/auth/login
     * 
     * 
     */

     private function jwtGuard(): JWTGuard
    {
        /** @var JWTGuard */
          return auth('api'); // 
    }
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $credentials = $request->only('email', 'password');

        $user = User::where('email', $request->email)->first();

        if ($user && !$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Akun Anda tidak aktif. Hubungi administrator.',
            ], 403);
        }

        if (!$token =$this->jwtGuard()->attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah.',
            ], 401);
        }

        return $this->respondWithToken($token,$this->jwtGuard()->user());
    }

    /**
     * Me — return authenticated user
     * GET /api/auth/me
     */
    public function me()
    {
        return response()->json([
            'success' => true,
            'data'    => $this->formatUser(auth('api')->user()),
        ]);
    }

    /**
     * Logout — invalidate token
     * POST /api/auth/logout
     */
   public function logout()
{
    try {
       $this->jwtGuard()->logout();
        $isProd = app()->environment('production');

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil.',
        ])->withCookie(
            cookie()->forget('appacc_token', '/', $isProd ? '.warga007.web.id' : null)
        );

    } catch (JWTException $e) {
        return response()->json([
            'success' => false,
            'message' => 'Gagal logout.',
        ], 500);
    }
}

    /**
     * Refresh token
     * POST /api/auth/refresh
     */
    public function refresh()
    {
        try {
            $token =$this->jwtGuard()->refresh();
            return $this->respondWithToken($token,$this->jwtGuard()->user());
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token tidak valid atau sudah expired.',
            ], 401);
        }
    }

    // ─── Helpers ────────────────────────────────────────────────────────────

   private function respondWithToken(string $token, $user): \Illuminate\Http\JsonResponse
{
    $ttl        =$this->jwtGuard()->factory()->getTTL();
    $refreshTtl =$this->jwtGuard()->factory()->getRefreshTTL();
    $clientType = request()->header('X-Client-Type', 'browser');
    $isProd     = app()->environment('production');

    $payload = [
        'success'    => true,
        'message'    => 'Login berhasil.',
        'token_type' => 'bearer',
        'expires_in' => $ttl * 60,
        'data'       => $this->formatUser($user),
    ];

    if ($clientType !== 'browser') {
        // APK: token di body
        $payload['token'] = $token;
        return response()->json($payload);
    }

    // Browser: token di HttpOnly cookie
    return response()->json($payload)->withCookie(
        cookie(
            name:     'appacc_token',
            value:    $token,
            minutes:  $refreshTtl,
            path:     '/',
            domain:   $isProd ? '.warga007.web.id' : null,
            secure:   env('COOKIE_SECURE', false),
            httpOnly: true,
            sameSite: $isProd ? 'None' : 'Lax',
        )
    );
}

    private function formatUser($user): array
    {
        return [
            'id'          => $user->id,
            'name'        => $user->name,
            'email'       => $user->email,
            'avatar'      => $user->avatar,
            'provider'    => $user->provider ?? null,
            'is_active'   => $user->is_active,
            'roles'       => $user->role_names,
            'permissions' => $user->permission_names,
        ];
    }
}