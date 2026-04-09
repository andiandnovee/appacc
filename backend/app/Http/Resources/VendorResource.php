<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VendorResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'sap_id'       => $this->sap_id,
            'name'         => $this->name,
            'npwp'         => $this->npwp,
            'address'      => $this->address,
            'service_type' => $this->service_type,
            'pph_type'     => $this->pph_type,
            'pph_rate'     => (float) $this->pph_rate,
            'is_deleted'   => $this->deleted_at !== null,
            'deleted_at'   => $this->deleted_at?->format('Y-m-d H:i:s'),
            'created_at'   => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at'   => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}