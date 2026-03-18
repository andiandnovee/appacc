<?php

namespace App\Http\Requests\Vendor;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVendorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $vendorId = $this->route('vendor');

        return [
            'vendor_code'          => ['sometimes', 'string', 'max:20', Rule::unique('vendors', 'vendor_code')->ignore($vendorId)],
            'name'                 => ['sometimes', 'string', 'max:150'],
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
            'vendor_code.unique' => 'Kode vendor sudah digunakan vendor lain.',
            'ref_pph_id.exists'  => 'Jenis PPh tidak ditemukan.',
        ];
    }
}
