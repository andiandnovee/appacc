<?php

namespace App\Http\Controllers\Api\v1;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Models\Core\UserDevice;
use Illuminate\Http\Request;

class UserDeviceController extends Controller
{
    /**
     * Simpan atau perbarui device token FCM untuk user yang sedang login.
     *
     * POST /api/v1/user/devices
     */
    public function store(Request $request)
    {
        $request->validate([
            'device_token' => 'required|string|max:255',
            'platform' => 'nullable|string|max:50',
            'device_name' => 'nullable|string|max:100',
        ]);

        $user = $request->user();

        $device = UserDevice::updateOrCreate(
            [
                'user_id' => $user->id,
                'device_token' => $request->input('device_token'),
            ],
            [
                'platform' => $request->input('platform'),
                'device_name' => $request->input('device_name'),
                'is_active' => true,
                'last_used_at' => now(),
            ]
        );

        return ResponseFormatter::success($device, 'Device token berhasil disimpan');
    }
}

