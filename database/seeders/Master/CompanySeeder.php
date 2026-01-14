<?php

namespace Database\Seeders\Master;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        $companies = [
            [
                'company_code' => 'BSKM',
                'nama' => 'Badan Sosial Kematian RT 007',
                'alamat' => 'Jl Kubang Raya KM 05, Tarai Bangun',
                'email' => 'admin@bskm.local',
                'telepon' => '081234567890',
                'penanggung_jawab' => 'Ketua Umum BSKM',
                'status' => 'aktif',
            ],
            [
                'company_code' => 'BAITULAMAL',
                'nama' => 'Musholla Baitul Amal',
                'alamat' => 'Jl Kubang Raya KM 05, Tarai Bangun',
                'email' => 'info@baitulamal.local',
                'telepon' => '081298765432',
                'penanggung_jawab' => 'Bendahara Musholla',
                'status' => 'aktif',
            ],
            [
                'company_code' => 'ERTE007',
                'nama' => 'Rukun Tetangga 007',
                 'alamat' => 'Jl Kubang Raya KM 05, Tarai Bangun',
                'email' => 'sekretaris@erte007.local',
                'telepon' => '081377788899',
                'penanggung_jawab' => 'Ketua RT 007',
                'status' => 'aktif',
            ],
        ];

        foreach ($companies as $company) {
            DB::table('companies')->updateOrInsert(
                ['company_code' => $company['company_code']],
                array_merge($company, [
                    'updated_at' => now(),
                    'created_at' => now(),
                ])
            );
        }
    }
}