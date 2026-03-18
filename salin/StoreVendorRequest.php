<?php

namespace App\Http\Requests\Vendor;

use Illuminate\Foundation\Http\FormRequest;

class StoreVendorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Ganti dengan gate/permission check jika perlu
    }

    public function rules(): array
    {
        return [
            'vendor_code'          => ['required', 'string', 'max:20', 'unique:vendors,vendor_code'],
            'name'                 => ['required', 'string', 'max:150'],
            'npwp'                 => ['nullable', 'string', 'max:20'],
            'address'              => ['nullable', 'string'],
            'service_type'         => ['nullable', 'string', 'max:100'],
            'ref_pph_id'           => ['nullable', 'integer', 'exists:ref_pph,id'],
            'bank_name'            => ['nullable', 'string', 'max:100'],
            'bank_account_no'      => ['nullable', 'string', 'max:50'],
            'bank_account_holder'  => ['nullable', 'string', 'max:100'],
            'is_active'            => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'vendor_code.unique' => 'Kode vendor sudah terdaftar.',
            'vendor_code.required' => 'Kode vendor wajib diisi.',
            'name.required' => 'Nama vendor wajib diisi.',
            'ref_pph_id.exists' => 'Jenis PPh tidak ditemukan.',
        ];
    }
}
