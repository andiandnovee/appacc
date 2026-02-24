<?php

namespace App\Http\Controllers;

use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    /**
     * Get all permissions (for role form)
     */
    public function index()
    {
        $permissions = Permission::all()->map(function ($permission) {
            return [
                'id' => $permission->id,
                'name' => $permission->name,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $permissions,
        ]);
    }
}
