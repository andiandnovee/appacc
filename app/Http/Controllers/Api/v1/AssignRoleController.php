<?php

// app/Http/Controllers/AssignRoleController.php
namespace App\Http\Controllers\Api\v1;;

use App\Models\Core\User;
use App\Models\Keanggotaan\Anggota;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class AssignRoleController extends Controller
{
    // app/Http/Controllers/AssignRoleController.php

public function index()
{
    return Inertia::render('AssignRole/Index', [
        'users' => User::with(['roles:id,name', 'anggota:id,nama'])->get(['id','name','email','anggota_id']),
        'anggota' => Anggota::all(['id','nama']),
        'roles' => Role::all(['id','name']),
    ]);
}
    Public function destroy(Request $request, $userId, $roleName)
    {
        $user = User::findOrFail($userId);

        if ($user->hasRole($roleName)) {
            $user->removeRole($roleName);
            return redirect()
                ->route('role-anggota.index')
                ->with('success', 'Role berhasil dihapus dari user.');
        }

        return redirect()
            ->route('role-anggota.index')
            ->with('error', 'User tidak memiliki role tersebut.');
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'anggota_id' => 'required|exists:anggotas,id',
            'roles' => 'required|array',
        ]);

        $user = User::findOrFail($request->user_id);

       // Hubungkan ke anggota
    $user->anggota_id = $request->anggota_id;
    $user->save();

    // Assign role baru TANPA menghapus role lama
    foreach ($request->roles as $role) {
        $user->assignRole($role);
    }

    return redirect()
        ->route('role-anggota.index')
        ->with('success', 'Role berhasil ditambahkan ke user.');

    }
}