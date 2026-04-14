// app/Http/Middleware/RefreshToken.php
<?php

namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class RefreshToken extends BaseMiddleware
{
    public function handle($request, Closure $next)
    {
        $this->checkForToken($request);
        
        try {
            if ($this->auth->parseToken()->authenticate()) {
                return $next($request);
            }
            throw new UnauthorizedHttpException('jwt-auth', 'User not found');
        } catch (TokenExpiredException $e) {
            try {
                // Refresh token (otomatis mem-blacklist token lama)
                $token = $this->auth->refresh();
                
                // Authentikasi user untuk request ini
                $user = $this->auth->setToken($token)->user();
                auth()->setUser($user);
            } catch (JWTException $e) {
                throw new UnauthorizedHttpException('jwt-auth', $e->getMessage());
            }
        }
        
        return $this->setAuthenticationHeader($next($request), $token);
    }
}
