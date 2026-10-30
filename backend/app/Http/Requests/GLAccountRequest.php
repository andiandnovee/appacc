<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GLAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'gl_acc' => ['nullable', 'string', 'max:8', 'regex:/^\d{1,8}$/'],
            'gl_text' => ['nullable', 'string', 'max:255'],
            'gl_group' => ['nullable', 'string', 'max:255'],
            'group_src' => ['required', Rule::in(['sheet', 'inferred'])],
            'desc' => ['nullable', 'string'],
            'other_desc' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'gl_acc.regex' => 'GL Account harus berisi maksimal 8 digit angka.',
            'group_src.in' => 'Sumber group harus sheet atau inferred.',
        ];
    }
}
