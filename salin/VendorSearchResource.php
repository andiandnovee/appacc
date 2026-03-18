<?php

namespace App\Http\Resources\Vendor;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Lightweight resource untuk dropdown / lookup di form penerimaan.
 * Hanya mengembalikan field yang dibutuhkan frontend.
 */
class VendorSearchResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'vendor_code'  => $this->vendor_code,
            'name'         => $this->name,
            'display_name' => $this->display_name,
            'npwp'         => $this->npwp,
        ];
    }
}
