<?php

namespace App\Http\Controllers;

use App\Http\Requests\SettingRequest;
use App\Models\Setting;
use App\Services\AuditService;

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
    public function update(SettingRequest $request, AuditService $auditService)
    {
        $data = $request->validated();

        foreach ($data as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }
        $auditService->record('admin.settings.updated', [
            'business_domain' => 'admin',
            'action' => 'update',
            'description' => 'Pengaturan aplikasi diperbarui.',
            'metadata' => ['setting_keys' => array_keys($data)],
        ], $request);

        return response()->json([
            'success' => true,
            'message' => 'Settings updated successfully',
            'data' => $data,
        ]);
    }
}
