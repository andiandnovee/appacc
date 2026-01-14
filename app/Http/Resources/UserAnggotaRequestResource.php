<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserAnggotaRequestResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,

            'user' => [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
                'email' => $this->user?->email,
            ],

            'anggota' => [
                'id' => $this->anggota?->id,
                'nama' => $this->anggota?->nama,
            ],

            'no_hp' => $this->no_hp,
            'perum' => $this->perum?->nama,
            'no_rumah' => $this->no_rumah,
            'alamat_lainnya' => $this->alamat_lainnya,
            'village' => $this->village?->name,

            'status' => $this->status,
            'created_at' => $this->created_at,
        ];
    }
}