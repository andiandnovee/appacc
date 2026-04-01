<?php

// app/Http/Requests/ReceiptStatusRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReceiptStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status_date'   => ['required', 'date'],
            'status_value'  => ['required', 'integer'],
            'status_reason' => ['required', 'string', 'max:255'],
            'status_action' => ['nullable', 'string', 'max:255'],
        ];
    }
}
