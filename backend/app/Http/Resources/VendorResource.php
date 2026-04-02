<?php
// app/Http/Resources/VendorResource.php
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
            'pph_rate'     => $this->pph_rate,
            'created_at'   => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
