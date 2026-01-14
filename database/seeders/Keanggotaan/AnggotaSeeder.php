<?php
namespace Database\Seeders\Keanggotaan;

use Illuminate\Database\Seeder;
use App\Models\Keanggotaan\Anggota;
use App\Models\Core\User;

class AnggotaSeeder extends Seeder
{
    public function run(): void
    {
        // create 10 anggota with linked user (dummy password: 'password')
        Anggota::factory()->count(10)->create()->each(function($anggota) {
            User::factory()->create([
                'anggota_id' => $anggota->id,
                'password' => bcrypt('password'),
            ]);
        });
    }
}
