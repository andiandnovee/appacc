<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    /**
     * Login — return JWT token
     * POST /api/auth/login
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $credentials = $request->only('email', 'password');

        // Cek apakah user aktif
        $user = \App\Models\User::where('email', $request->email)->first();

        if ($user && !$user->is_active) {
            return response()->json([
                'message' => 'Akun Anda tidak aktif. Hubungi administrator.',
            ], 403);
        }

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json([
                'message' => 'Email atau password salah.',
            ], 401);
        }

        return $this->respondWithToken($token, auth('api')->user());
    }

    /**
     * Me — return authenticated user
     * GET /api/auth/me
     */
    public function me()
    {
        return response()->json([
            'data' => auth('api')->user(),
        ]);
    }

    /**
     * Logout — invalidate token
     * POST /api/auth/logout
     */
    public function logout()
    {
        try {
            auth('api')->logout();
            return response()->json([
                'message' => 'Logout berhasil.',
            ]);
        } catch (JWTException $e) {
            return response()->json([
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
            $token = auth('api')->refresh();
            return $this->respondWithToken($token, auth('api')->user());
        } catch (JWTException $e) {
            return response()->json([
                'message' => 'Token tidak valid atau sudah expired.',
            ], 401);
        }
    }

    /**
     * Format token response
     */
    private function respondWithToken(string $token, $user): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'message'    => 'Login berhasil.',
            'token'      => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user'       => [
                'id'          => $user->id,
                'name'        => $user->name,
                'email'       => $user->email,
                'avatar'      => $user->avatar,
                'is_active'   => $user->is_active,
                'roles'       => $user->role_names,
                'permissions' => $user->permission_names,
            ],
        ]);
    }
}