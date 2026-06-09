<?php 
 
// ════════════════════════════════════════════════════════════
// app/Http/Resources/CostCenterResource.php
// ════════════════════════════════════════════════════════════
 
namespace App\Http\Resources;
 
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
 
class CostCenterResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'sap_id'      => $this->sap_id,
            'description' => $this->description,
            'short_name'  => $this->short_name,
            'created_at'  => $this->created_at?->toDateTimeString(),
            'updated_at'  => $this->updated_at?->toDateTimeString(),
        ];
    }
}
 