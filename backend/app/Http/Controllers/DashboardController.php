<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class DashboardController extends Controller
{
    /**
     * Get dashboard stats
     */
    public function stats()
    {
        $today = now()->format('Y-m-d');

        $totalUsers = User::count();
        $activeUsers = User::where('is_active', true)->count();
        $totalRoles = Role::count();
        $newUsersToday = User::whereDate('created_at', $today)->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => $totalUsers,
                'active_users' => $activeUsers,
                'total_roles' => $totalRoles,
                'new_users_today' => $newUsersToday,
            ],
        ]);
    }

    /**
     * Get recent activity
     */
    public function activity()
    {
        $recentUsers = User::orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'avatar' => $user->avatar,
                    'roles' => $user->role_names,
                    'created_at' => $user->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $recentUsers,
        ]);
    }
}
