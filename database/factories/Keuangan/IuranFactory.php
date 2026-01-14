<?php
namespace Database\Factories\Keuangan;

use App\Models\Keuangan\Iuran;
use App\Models\Keanggotaan\Anggota;
use App\Models\Master\RefIuran;
use Illuminate\Database\Eloquent\Factories\Factory;

class IuranFactory extends Factory
{
    protected $model = Iuran::class;

    public function definition(): array
    {
        return [
              'company_code' => 'BSKM', // ← tambahkan baris ini
            'anggota_id' => Anggota::factory(),
            'ref_iuran_id' => RefIuran::factory(),
            'jumlah' => $this->faker->randomElement([50000, 100000, 200000]),
            'tanggal_bayar' => $this->faker->date(),
            'periode_bulan' => $this->faker->monthName(),
        ];
    }
}
