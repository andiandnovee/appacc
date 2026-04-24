<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class JwtFromCookie
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->bearerToken()) {
            return $next($request); // APK sudah kirim header → skip
        }

        $token = $request->cookie('appacc_token');
        if ($token) {
            $request->headers->set('Authorization', 'Bearer ' . $token);
        }

        return $next($request);
    }
}