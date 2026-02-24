<?php

namespace App\Http\Controllers;

use App\Http\Requests\SettingRequest;
use App\Models\Setting;

class SettingController extends Controller
{
    /**
     * Get all settings
     */
    public function index()
    {
        $settings = Setting::all();

        $data = [];
        foreach ($settings as $setting) {
            $data[$setting->key] = $setting->value;
        }

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    /**
     * Update settings
     */
    public function update(SettingRequest $request)
    {
        $data = $request->validated();

        foreach ($data as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Settings updated successfully',
            'data' => $data,
        ]);
    }
}
