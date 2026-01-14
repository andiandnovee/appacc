<?php
namespace Database\Factories\Keuangan;

use App\Models\Keuangan\Pengeluaran;
use Illuminate\Database\Eloquent\Factories\Factory;

class PengeluaranFactory extends Factory
{
    protected $model = Pengeluaran::class;

    public function definition(): array
    {
        return [
              'company_code' => 'BSKM', // ← tambahkan baris ini
            'tanggal' => $this->faker->date(),
            'jumlah' => $this->faker->numberBetween(10000, 500000),
            'jenis_pengeluaran' => $this->faker->randomElement(['operasional', 'acara', 'donasi']),
            'keterangan' => $this->faker->sentence(),
            'is_dummy' => false,
        ];
    }
}
