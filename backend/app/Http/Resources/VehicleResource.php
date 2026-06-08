<?php

// ════════════════════════════════════════════════════════════
// app/Http/Resources/VehicleResource.php
// ════════════════════════════════════════════════════════════

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VehicleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'vehicle_type' => $this->vehicle_type,
            'company_code' => $this->company_code,
            'business_area_code' => $this->business_area_code,
            'description' => $this->description,
            'plate_number' => $this->plate_number,
            'plate_number_old' => $this->plate_number_old,
            'cost_center' => $this->cost_center,
            'chassis_number' => $this->chassis_number,
            'engine_number' => $this->engine_number,
            'is_active' => $this->is_active,
            'notes' => $this->notes,
            'stnkb_valid_until' => $this->stnkb_valid_until?->toDateString(),
            'pkb_valid_until' => $this->pkb_valid_until?->toDateString(),
            'kier_valid_until' => $this->kier_valid_until?->toDateString(),
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
        ];
    }
}