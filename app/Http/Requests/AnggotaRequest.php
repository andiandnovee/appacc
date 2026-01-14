<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AnggotaRequest extends FormRequest
{
    /**
     * Properti untuk menyimpan ID anggota saat update
     */
    protected $anggotaId = null;

    /**
     * Setter untuk mengisi anggotaId dari controller
     */
    public function setAnggotaId($id)
    {
        $this->anggotaId = $id;
    }

    /**
     * Authorization (bolehkan semua request dulu)
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Rules validasi
     */
    public function rules()
    {
        $anggotaId = optional($this->user()->anggota)->id;



        // dd('AnggotaId: '.$anggotaId); // sementara buat debug

        return [
            'nama' => 'required|string',
            'jenis_kelamin' => 'required|in:L,P',
            'no_hp' => [
                'required',
                'regex:/^[0-9]+$/',
                'min:10',
                'max:15',
                Rule::unique('anggotas', 'no_hp')->ignore($anggotaId),
            ],
            'no_kk' => [
                'nullable',
                'regex:/^[0-9]+$/',
                Rule::unique('anggotas', 'no_kk')->ignore($anggotaId),
            ],
            'no_ktp' => [
                'nullable',
                'digits:16',
                'regex:/^[0-9]+$/',
                Rule::unique('anggotas', 'no_ktp')->ignore($anggotaId),
            ],
            'email' => [
                'nullable',
                'email',
                Rule::unique('anggotas', 'email')->ignore($anggotaId),
            ],
        ];
    }
}
