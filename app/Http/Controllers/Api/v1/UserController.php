<?php 
namespace App\Http\Controllers\Api\v1;;

use App\Models\Core\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
public function search(Request $request)
{
$query = $request->input('q');

$users = User::query()
->when($query, fn($q) =>
$q->where('name', 'like', "%{$query}%")
->orWhere('email', 'like', "%{$query}%")
)
->limit(10)
->get();

return response()->json($users);
}
}