<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $customerId = $this->route('customer')?->id;

        return [
            'sap_id' => [
                'required',
                'string',
                'max:10',
                Rule::unique('customers', 'sap_id')
                    ->ignore($customerId)
                    ->whereNull('deleted_at'),
            ],
            'name' => ['required', 'string', 'max:200'],
            'short_name' => ['nullable', 'string', 'max:50'],
        ];
    }

    public function messages(): array
    {
        return [
            'sap_id.required' => 'SAP ID wajib diisi.',
            'sap_id.unique' => 'SAP ID sudah digunakan.',
            'name.required' => 'Nama customer wajib diisi.',
        ];
    }
}
