<?php
namespace App\Http\Resources;
use Illuminate\Http\Resources\Json\JsonResource;

class SapPoImportResource extends JsonResource
{
    public function toArray($request): array {
        return [
            'id' => $this->id,
            'po_number' => $this->po_number,
            'item_line' => $this->item_line,
            'business_area_code' => $this->business_area_code,
            'sap_vendor_id' => $this->sap_vendor_id,
            'vendor_name' => $this->vendor_name,
            'gr_number' => $this->gr_number,
            'purchasing_group' => $this->purchasing_group,
            'pr_number' => $this->pr_number,
            'amount' => $this->amount,
            'import_date' => $this->import_date?->format('Y-m-d'),
            'import_batch' => $this->import_batch,
            'deleted_at' => $this->deleted_at,
            'created_at' => $this->created_at,
            'vendor' => $this->whenLoaded('vendor'),
        ];
    }
}