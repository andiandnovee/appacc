<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;

class BusinessAreaRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array {
        return [
           'sap_id' => 'nullable|string|max:20',
            'company_id' => 'required|exists:companies,id',
            'name' => 'required|string|max:255',
            'name_long' => 'nullable|string|max:255',
            'sap_customer_code' => 'nullable|string|max:50',
            'sap_vendor_code' => 'nullable|string|max:50',
        ];
    }
}