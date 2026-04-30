<?php
// app/Http/Requests/StageRequest.php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // otorisasi didelegasikan ke StagePolicy via controller
    }

    public function rules(): array
    {
        $stageId = $this->route('stage')?->id;

        return [
            'name'       => [
                'required',
                'string',
                'max:50',
                Rule::unique('stages', 'name')->ignore($stageId)->whereNull('deleted_at'),
            ],
            'start_date' => ['required', 'date'],
            'year'       => ['required', 'integer', 'digits:4', 'min:2000', 'max:2099'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'       => 'Nama stage wajib diisi.',
            'name.max'            => 'Nama stage maksimal 50 karakter.',
            'name.unique'         => 'Nama stage sudah digunakan.',
            'start_date.required' => 'Tanggal mulai wajib diisi.',
            'start_date.date'     => 'Format tanggal tidak valid.',
            'year.required'       => 'Tahun wajib diisi.',
            'year.integer'        => 'Tahun harus berupa angka.',
            'year.digits'         => 'Tahun harus 4 digit.',
            'year.min'            => 'Tahun minimal 2000.',
            'year.max'            => 'Tahun maksimal 2099.',
        ];
    }
}