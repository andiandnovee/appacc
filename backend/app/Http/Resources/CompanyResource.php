<?php
// app/Http/Resources/CompanyResource.php
namespace App\Http\Resources;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'sap_id'     => $this->sap_id,
            'name'       => $this->name,
            'npwp'       => $this->npwp,
            'address'    => $this->address,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
