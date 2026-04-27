<?php
// app/Http/Resources/BusinessAreaResource.php
namespace App\Http\Resources;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BusinessAreaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                 => $this->id,
            'sap_id'             => $this->sap_id,
            'name'               => $this->name,
            'name_long'          => $this->name_long,
            'sap_customer_code'  => $this->sap_customer_code,
            'sap_vendor_code'    => $this->sap_vendor_code,
            'company'            => $this->whenLoaded('company', fn() => [
                'id'   => $this->company->id,
                'name' => $this->company->name,
            ]),
            'created_at'         => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
