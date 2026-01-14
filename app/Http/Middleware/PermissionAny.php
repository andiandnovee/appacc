namespace App\Http\Middleware;

use Closure;

class PermissionAny
{
public function handle($request, Closure $next, ...$permissions)
{
$user = auth()->user();

foreach ($permissions as $permission) {
if ($user->can($permission)) { // ← Ini merujuk ke Spatie
return $next($request);
}
}

abort(403, 'Tidak punya permission.');
}
}