<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccountResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'company_code' => $this->company_code,
            'kode'         => $this->kode,
            'nama'         => $this->nama,
            'parent_id'    => $this->parent_id,

            // Parent account info (optional)
            'parent' => $this->whenLoaded('parent', function () {
                return [
                    'id'   => $this->parent->id,
                    'kode' => $this->parent->kode,
                    'nama' => $this->parent->nama,
                ];
            }),

            // Children accounts (recursive)
            'children' => AccountResource::collection(
                $this->whenLoaded('children')
            ),

            // timestamps
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}