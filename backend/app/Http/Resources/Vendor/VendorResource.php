<?php

namespace App\Http\Resources\Vendor;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VendorResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                   => $this->id,
            'vendor_code'          => $this->vendor_code,
            'name'                 => $this->name,
            'display_name'         => $this->display_name,
            'npwp'                 => $this->npwp,
            'address'              => $this->address,
            'service_type'         => $this->service_type,
            'pph'                  => $this->whenLoaded('refPph', fn() => [
                'id'          => $this->refPph->id,
                'code'        => $this->refPph->pph_code,
                'description' => $this->refPph->description,
                'rate'        => $this->refPph->rate,
            ]),
            'bank' => [
                'name'           => $this->bank_name,
                'account_no'     => $this->bank_account_no,
                'account_holder' => $this->bank_account_holder,
            ],
            'is_active'   => $this->is_active,
            'created_at'  => $this->created_at?->toDateTimeString(),
            'updated_at'  => $this->updated_at?->toDateTimeString(),
        ];
    }
}
