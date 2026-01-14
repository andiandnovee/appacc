<?php
namespace Database\Factories\Master;

use App\Models\Master\Perum;
use Illuminate\Database\Eloquent\Factories\Factory;

class PerumFactory extends Factory
{
    protected $model = Perum::class;

    public function definition(): array
    {
        return [
            'nama' => $this->faker->company(),
            'is_dummy' => false,
        ];
    }
}
