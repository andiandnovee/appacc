<?php
namespace Database\Seeders\Master;

use Illuminate\Database\Seeder;
use App\Models\Master\Perum;

class PerumSeeder extends Seeder
{
    public function run(): void
    {
        $perums = [
            'Perumahan Villa Erce Mandiri',
            'Perumahan Bunga Raya Indah',
            'Perum Griya Gilang Lestari',
            'Perumahan Ryantama ',
        ];

        foreach ($perums as $p) {
            Perum::firstOrCreate(
                ['nama' => $p],
              //  ['company_code' => 'BSKM001'] // <— tambahkan baris ini
            );
        }
    }
}