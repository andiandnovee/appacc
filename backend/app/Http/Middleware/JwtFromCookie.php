<?php
// app/Http/Middleware/JwtFromCookie.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class JwtFromCookie
{
    public function handle(Request $request, Closure $next)
    {
        // Kalau Authorization header sudah ada (mode APK) → skip
        if ($request->bearerToken()) {
            return $next($request);
        }

        // Ambil dari cookie → inject ke header
        $token = $request->cookie('appacc_token');
        if ($token) {
            $request->headers->set('Authorization', 'Bearer ' . $token);
        }

        return $next($request);
    }
}
