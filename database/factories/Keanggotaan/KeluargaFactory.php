<?php
namespace Database\Factories\Keanggotaan;

use App\Models\Keanggotaan\Keluarga;
use App\Models\Keanggotaan\Anggota;
use Illuminate\Database\Eloquent\Factories\Factory;

class KeluargaFactory extends Factory
{
    protected $model = Keluarga::class;

    public function definition(): array
    {
        return [
            'anggota_id' => Anggota::factory(),
            'nama' => $this->faker->name(),
            'hubungan' => 'anak',
            'tanggal_lahir' => $this->faker->date(),
            'jenis_kelamin' => $this->faker->randomElement(['L','P']),
            'is_dummy' => false,
        ];
    }
}
