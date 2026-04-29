<?php

// app/Http/Resources/InvoiceReceiptResource.php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceReceiptResource extends JsonResource
{
    public function toArray(Request $request): array
{
    return [
        'id'                 => $this->id,
        'sap_id'             => $this->sap_id,
        'receipt_date'       => $this->receipt_date?->format('Y-m-d'),
        'vendor_id'          => $this->vendor_id,
        'company_id'         => $this->company_id,
        'stage_id'           => $this->stage_id,
        'po_number'          => $this->po_number,
        'amount'             => $this->amount,
        'pgr_id'             => $this->pgr_id,              // ← ganti
        'business_area_code' => $this->business_area_code,
        'business_area_id'   => $this->business_area_code,
        'invoice_number'     => $this->invoice_number,
        'attachment1'        => $this->attachment1,
        'attachment2'        => $this->attachment2,
        'attachment3'        => $this->attachment3,
        'year'               => $this->stage->year ?? null,
        // payment_location → hapus
        // sap_id, category → hapus

        'vendor'   => $this->whenLoaded('vendor', fn() => [
            'id'           => $this->vendor->id,
            'sap_id'       => $this->vendor->sap_id,
            'name'         => $this->vendor->name,
            'npwp'         => $this->vendor->npwp,
            'service_type' => $this->vendor->service_type,
            'pph_type'     => $this->vendor->pph_type,
            'pph_rate'     => $this->vendor->pph_rate,
        ]),

        'company' => $this->whenLoaded('company', fn() => [
            'id'     => $this->company->id,
            'sap_id' => $this->company->sap_id,
            'name'   => $this->company->name,
            'npwp'   => $this->company->npwp,
        ]),

        'stage' => $this->whenLoaded('stage', fn() => [
            'id'     => $this->stage->id,
            'sap_id' => $this->stage->sap_id,
            'name'   => $this->stage->name,
            'year'   => $this->stage->year,
        ]),

        'latest_status' => $this->whenLoaded('latestStatus', fn() => [
            'id'            => $this->latestStatus?->id,
            'status_date'   => $this->latestStatus?->status_date?->format('Y-m-d'),
            'status_value'  => $this->latestStatus?->status_value,
            'status_reason' => $this->latestStatus?->status_reason,
            'status_action' => $this->latestStatus?->status_action,
        ]),

        'statuses' => ReceiptStatusResource::collection(
            $this->whenLoaded('statuses')
        ),

        'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
        'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
    ];
}
}
