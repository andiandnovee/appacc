<?php
namespace Database\Factories\Keuangan;

use App\Models\Keuangan\Sumbangan;
use Illuminate\Database\Eloquent\Factories\Factory;

class SumbanganFactory extends Factory
{
    protected $model = Sumbangan::class;

    public function definition(): array
    {
        return [
              'company_code' => 'BSKM', // ← tambahkan baris ini
            'tanggal' => $this->faker->date(),
            'nama_penyumbang' => $this->faker->name(),
            'jumlah' => $this->faker->numberBetween(10000, 1000000),
            'keterangan' => $this->faker->sentence(),
            'is_dummy' => false,
        ];
    }
}
