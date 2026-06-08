<?php // ════════════════════════════════════════════════════════════
// app/Http/Requests/VehicleRequest.php
// ════════════════════════════════════════════════════════════
 
namespace App\Http\Requests;
 
use Illuminate\Foundation\Http\FormRequest;
 
class VehicleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
 
    public function rules(): array
    {
        return [
            'vehicle_type'       => ['nullable', 'string', 'max:6'],
            'company_code'       => ['required', 'string', 'max:4'],
            'business_area_code' => ['nullable', 'string', 'max:6'],
            'description'        => ['nullable', 'string', 'max:255'],
            'plate_number'       => ['required', 'string', 'max:50'],
            'plate_number_old'   => ['nullable', 'string', 'max:50'],
            'cost_center'        => ['nullable', 'string', 'max:20'],
            'chassis_number'     => ['nullable', 'string', 'max:255'],
            'engine_number'      => ['nullable', 'string', 'max:255'],
            'is_active'          => ['nullable', 'string', 'max:255'],
            'notes'              => ['nullable', 'string', 'max:255'],
            'stnkb_valid_until'  => ['nullable', 'date'],
            'pkb_valid_until'    => ['nullable', 'date'],
            'kier_valid_until'   => ['nullable', 'date'],
        ];
    }
 
    public function messages(): array
    {
        return [
            'company_code.required' => 'Company Code wajib diisi.',
            'plate_number.required' => 'Plat nomor wajib diisi.',
        ];
    }
}
 
