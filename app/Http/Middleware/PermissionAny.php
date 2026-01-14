<?php

namespace App\Http\Middleware;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

use Closure;

class PermissionAny
{
    public function handle($request, Closure $next, ...$permissions)
    {
        
    /** @var User $user */
$user = Auth::user();

        foreach ($permissions as $permission) {
            if ($user->can($permission)) { // ← Ini merujuk ke Spatie
                return $next($request);
            }
        }

        abort(403, 'Tidak punya permission.');
    }
}
