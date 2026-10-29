<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserDevice;
use Illuminate\Http\Request;

class UserDeviceController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'device_token' => ['required', 'string', 'max:4096'],
            'platform' => ['required', 'in:android,ios,web'],
            'device_name' => ['nullable', 'string', 'max:100'],
        ]);

        $tokenHash = hash('sha256', $validated['device_token']);
        $device = UserDevice::updateOrCreate(
            ['token_hash' => $tokenHash],
            [
                'user_id' => $request->user()->id,
                'device_token' => $validated['device_token'],
                'platform' => $validated['platform'],
                'device_name' => $validated['device_name'] ?? null,
                'is_active' => true,
                'last_used_at' => now(),
            ]
        );

        return response()->json([
            'data' => [
                'id' => $device->id,
                'platform' => $device->platform,
                'device_name' => $device->device_name,
                'is_active' => $device->is_active,
            ],
        ]);
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'device_token' => ['required', 'string', 'max:4096'],
        ]);

        UserDevice::query()
            ->where('user_id', $request->user()->id)
            ->where('token_hash', hash('sha256', $validated['device_token']))
            ->update(['is_active' => false]);

        return response()->json(['message' => 'Device token dinonaktifkan.']);
    }
}
