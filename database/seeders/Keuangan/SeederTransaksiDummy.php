<?php
namespace Database\Seeders\Keuangan;

use Illuminate\Database\Seeder;
use App\Models\Keuangan\Iuran;
use App\Models\Keuangan\Pengeluaran;
use App\Models\Keuangan\Sumbangan;

class SeederTransaksiDummy extends Seeder
{
    public function run(): void
    {
        // create some dummy financial transactions
        Iuran::factory()->count(15)->create();
        Pengeluaran::factory()->count(5)->create();
        Sumbangan::factory()->count(5)->create();
    }
}
