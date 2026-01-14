<?php
namespace Database\Factories\Keanggotaan;

use App\Models\Keanggotaan\Anggota;
use Illuminate\Database\Eloquent\Factories\Factory;

class AnggotaFactory extends Factory
{
    protected $model = Anggota::class;

    public function definition(): array
    {
        return [
             'company_code' => 'BSKM', // ← tambahkan baris ini
            'nama' => $this->faker->name(),
            'jenis_kelamin' => $this->faker->randomElement(['L','P']),
            'no_hp' => $this->faker->unique()->numerify('08##########'),
            'no_kk' => null,
            'no_ktp' => null,
            'email' => $this->faker->unique()->safeEmail(),
            'status' => 'aktif',
            'is_dummy' => false,
        ];
    }
}