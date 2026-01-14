<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Core\AuthLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Login via Passport JWT (gunakan ini untuk SPA / Mobile)
     */
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (! Auth::guard('web')->attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah',
            ], 401);
        }

        $user = Auth::guard('web')->user();
        $token = $user->createToken('BSKM_API')->accessToken;
        $refreshToken = $user->createToken('BSKM_REFRESH')->accessToken;

        AuthLog::create([
            'user_id' => $user->id,
            'action' => 'login',
            'ip_address' => $request->ip(),
            'user_agent' => $request->header('User-Agent'),
        ]);

        return response()->json([
            'success' => true,
            'token' => $token,
            'refresh_token' => $refreshToken,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ],
        ]);
    }

    /**
     * Logout: mencabut token aktif
     */
    public function logout(Request $request)
    {
        $token = $request->user()->token();
        $token->revoke(); // cabut token aktif

        AuthLog::create([
            'user_id' => $request->user()->id,
            'action' => 'logout',
            'ip_address' => $request->ip(),
            'user_agent' => $request->header('User-Agent'),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil, token dicabut',
        ]);
    }

    /**
     * Refresh token: dapatkan token baru menggunakan refresh token
     */
    public function refresh(Request $request)
    {
        $user = $request->user();

        // Create new access token
        $newToken = $user->createToken('BSKM_API')->accessToken;

        return response()->json([
            'success' => true,
            'token' => $newToken,
            'message' => 'Token berhasil di-refresh',
        ]);
    }

    /**
     * Endpoint identitas pengguna aktif
     */
    public function me(Request $request)
    {
        $user = $request->user()->load('anggota');

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'anggota' => $user->anggota,
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ],
        ]);
    }
}
