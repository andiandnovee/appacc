<?php
namespace Database\Seeders\Master;

use Illuminate\Database\Seeder;
use App\Models\Master\RefIuran;
use App\Models\Master\Company;

class RefIuranSeeder extends Seeder
{
    public function run(): void
    {
        $company = 'BSKM';
        if (!$company) {
            $this->command->warn("⚠️ Company BSKM not found, skipping seeding RefIuran.");
            return;
        }

        $data = [
            ['nama_iuran' => 'Iuran Rutin Bulanan 2025', 'periode' => 'bulanan', 'jumlah' => 50000],
            ['nama_iuran' => 'Iuran Tanah Makam Thp I', 'periode' => 'tahunan', 'jumlah' => 200000],
            ['nama_iuran' => 'Iuran Masuk', 'periode' => 'sekali', 'jumlah' => 0],
        ];

        foreach ($data as $row) {
            RefIuran::firstOrCreate(
                [
                    'company_code' => 'BSKM',
                    'nama_iuran' => $row['nama_iuran'],
                ],
                [
                    'periode' => $row['periode'],
                    'jumlah' => $row['jumlah'],
                ]
            );
        }
    }
}
