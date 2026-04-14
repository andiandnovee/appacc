<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;

class SapPoImportRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array {
        return [
            'po_number' => 'required|string|max:50',
            'item_line' => 'required|string|max:10',
            'business_area_code' => 'nullable|string|max:20',
            'sap_vendor_id' => 'nullable|string|max:50',
            'vendor_name' => 'nullable|string|max:255',
            'gr_number' => 'nullable|string|max:50',
            'purchasing_group' => 'nullable|string|max:20',
            'pr_number' => 'nullable|string|max:50',
            'amount' => 'required|numeric|min:0',
            'import_date' => 'required|date',
            'import_batch' => 'nullable|string|max:50',
        ];
    }
}