<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RefIuranRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // 'company_code' => 'required|string|max:50',
            'nama_iuran' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'jumlah' => 'required|numeric|min:0',
            'account_id' => 'required|exists:accounts,id',
            'entry_type' => 'required|in:pendapatan,liabilitas',
            'periode' => 'required|in:bulanan,tahunan,sekali',
            'tgl_awal_periode' => 'nullable|date',
            'tgl_akhir_periode' => 'nullable|date|after_or_equal:tgl_awal_periode',

        ];
    }
}