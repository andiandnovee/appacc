<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserAnggotaLinkRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // nanti bisa pakai Gate/Permission
    }

    public function rules(): array
    {
        return [
            'anggota_id' => 'required|exists:anggotas,id',
            'no_hp' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'perum_id' => 'nullable|exists:perums,id',
            'no_rumah' => 'nullable|string|max:255',
            'alamat_lainnya' => 'nullable|string',
            'village_id' => 'nullable|exists:indonesia_villages,id',
        ];
    }
}
