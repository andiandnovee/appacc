<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVendorRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Authorization logic dipindah ke Controller via Policy
    }

    public function rules()
    {
        $vendor = $this->route('vendor');

        return [
            'sap_id'       => [
                'required',
                'integer',
                Rule::unique('vendors', 'sap_id')->ignore($vendor->id),
            ],
            'name'         => 'required|string|max:255',
            'npwp'         => [
                'nullable',
                'string',
                'max:20',
                Rule::unique('vendors', 'npwp')->ignore($vendor->id),
            ],
            'address'      => 'nullable|string|max:500',
            'service_type' => 'nullable',
            'pph_type'     => 'nullable|in:21,23,26',
            'pph_rate'     => 'nullable|numeric|min:0|max:100',
        ];
    }

    public function messages()
    {
        return [
            'sap_id.unique'       => 'SAP ID sudah terdaftar untuk vendor lain.',
            'name.required'       => 'Nama vendor wajib diisi.',
            'npwp.unique'         => 'NPWP sudah terdaftar untuk vendor lain.',
            'npwp.required'       => 'NPWP wajib diisi.',
            'service_type.in'     => 'Tipe layanan harus salah satu: HF9, HT4, atau OTHER.',
            'pph_type.in'         => 'Tipe PPh tidak valid.',
            'pph_rate.required'   => 'Tarif PPh wajib diisi.',
            'pph_rate.numeric'    => 'Tarif PPh harus berupa angka.',
            'pph_rate.max'        => 'Tarif PPh tidak boleh lebih dari 100%.',
        ];
    }
}