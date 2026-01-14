<?php

namespace Database\Factories\Master;

use App\Models\Master\RefIuran;
use Illuminate\Database\Eloquent\Factories\Factory;

class RefIuranFactory extends Factory
{
    protected $model = RefIuran::class;

    public function definition()
    {
        return [
              'company_code' => 'BSKM', // ← tambahkan baris ini
            'nama_iuran' => $this->faker->words(2, true),
            'deskripsi' => $this->faker->sentence(),
            'jumlah' => $this->faker->randomFloat(2, 10000, 100000),
            'periode' => $this->faker->randomElement(['bulanan', 'tahunan', 'sekali']),
        ];
    }
}
