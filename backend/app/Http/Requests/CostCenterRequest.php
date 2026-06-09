<?php 
// ════════════════════════════════════════════════════════════
// app/Http/Requests/CostCenterRequest.php
// ════════════════════════════════════════════════════════════
 
namespace App\Http\Requests;
 
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
 
class CostCenterRequest extends FormRequest
{
    public function authorize(): bool { return true; }
 
    public function rules(): array
    {
        $id = $this->route('cost_center')?->id;
 
        return [
            'sap_id'      => ['required', 'string', 'max:10', Rule::unique('cost_centers', 'sap_id')->ignore($id)->whereNull('deleted_at')],
            'description' => ['nullable', 'string', 'max:200'],
            'short_name'  => ['nullable', 'string', 'max:50'],
        ];
    }
 
    public function messages(): array
    {
        return [
            'sap_id.required' => 'SAP ID wajib diisi.',
            'sap_id.unique'   => 'SAP ID sudah digunakan.',
        ];
    }
}