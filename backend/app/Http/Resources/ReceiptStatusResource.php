<?php

// app/Http/Resources/ReceiptStatusResource.php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReceiptStatusResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'status_date'   => $this->status_date?->format('Y-m-d'),
            'status_value'  => $this->status_value,
            'status_reason' => $this->status_reason,
            'status_action' => $this->status_action,
            'created_at'    => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
