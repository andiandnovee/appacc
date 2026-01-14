<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AnggotaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray($request)
    {
        return [
            'id'            => $this->id,
            'kode'          => $this->kode,
            'company_code'  => $this->company_code,
            
            'nama'          => $this->nama,
            'jenis_kelamin' => $this->jenis_kelamin,
            'status'        => $this->status,

            'email'         => $this->email,
            'no_hp'         => $this->no_hp,
            'no_kk'         => $this->no_kk,
            'no_ktp'        => $this->no_ktp,

            // alamat ringkas untuk keperluan kartu
            'alamat' => $this->whenLoaded('alamats', function () {
                $primary = $this->alamats->first();

                if (!$primary) {
                    return null;
                }

                return [
                    'id'    => $primary->id,
                    'no_rumah' => $primary->no_rumah,
                    'alamat_lainnya' => $primary->alamat_lainnya,
                    'perum' => $primary->perum?->nama,
                    'village' => $primary->village?->name,
                ];
            }),

            'created_at'    => $this->created_at?->toDateTimeString(),
            'updated_at'    => $this->updated_at?->toDateTimeString(),
        ];
    }
}