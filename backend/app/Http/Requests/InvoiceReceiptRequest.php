<?php

// app/Http/Requests/InvoiceReceiptRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InvoiceReceiptRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

   public function rules(): array
{
    $isUpdate = $this->isMethod('PUT') || $this->isMethod('PATCH');

    return [
        'receipt_date'       => [$isUpdate ? 'sometimes' : 'required', 'date'],
        'vendor_id'          => [$isUpdate ? 'sometimes' : 'required', 'exists:vendors,id'],
        'po_number'          => ['nullable', 'string', 'max:50'],
        'amount'             => [$isUpdate ? 'sometimes' : 'required', 'numeric', 'min:0'],
        'company_id'         => [$isUpdate ? 'sometimes' : 'required', 'exists:companies,id'],
        'stage_id'           => [$isUpdate ? 'sometimes' : 'required', 'exists:stages,id'],
        'pgr_id'             => ['nullable', 'string', 'max:10'],  // ← ganti
        'business_area_code' => ['nullable', 'string', 'max:6'],
        'invoice_number'     => ['nullable', 'string', 'max:225'],
        'attachment1'        => ['nullable', 'string', 'max:255'],
        'attachment2'        => ['nullable', 'string', 'max:255'],
        'attachment3'        => ['nullable', 'string', 'max:255'],
        // payment_location → hapus
    ];
}
}
