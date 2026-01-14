<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            // \Database\Seeders\Core\RolePermissionSeeder::class,
            Master\CompanySeeder::class,
            \Database\Seeders\Master\PerumSeeder::class,
            \Database\Seeders\Master\RefIuranSeeder::class,
            \Database\Seeders\Master\AccountSeeder::class,
            // \Database\Seeders\Keanggotaan\AnggotaSeeder::class,
            // \Database\Seeders\Keuangan\SeederTransaksiDummy::class,
            \Database\Seeders\Core\RoleSeeder::class,
            \Database\Seeders\Core\RolePermissionSeeder::class,

        ]);
    }
}
