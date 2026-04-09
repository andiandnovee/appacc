<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVendorRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Authorization logic dipindah ke Controller via Policy
    }

    public function rules()
    {
        return [
            'sap_id'       => 'required|integer|unique:vendors,sap_id',
            'name'         => 'required|string|max:255',
            'npwp'         => 'required|string|max:20|unique:vendors,npwp',
            'address'      => 'nullable|string|max:500',
            'service_type' => 'required|in:HF9,HT4,OTHER', // Sesuaikan dengan enum yang ada
            'pph_type'     => 'required|in:21,23,26', // PPh jenis (21=salary, 23=service, 26=div)
            'pph_rate'     => 'required|numeric|min:0|max:100',
        ];
    }

    public function messages()
    {
        return [
            'sap_id.unique'       => 'SAP ID sudah terdaftar.',
            'name.required'       => 'Nama vendor wajib diisi.',
            'npwp.unique'         => 'NPWP sudah terdaftar.',
            'npwp.required'       => 'NPWP wajib diisi.',
            'service_type.in'     => 'Tipe layanan harus salah satu: HF9, HT4, atau OTHER.',
            'pph_type.in'         => 'Tipe PPh tidak valid.',
            'pph_rate.required'   => 'Tarif PPh wajib diisi.',
            'pph_rate.numeric'    => 'Tarif PPh harus berupa angka.',
            'pph_rate.max'        => 'Tarif PPh tidak boleh lebih dari 100%.',
        ];
    }
}