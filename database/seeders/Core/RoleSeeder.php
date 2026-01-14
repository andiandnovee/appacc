<?php

namespace Database\Seeders\Core; // ✅ tambahkan baris ini!

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        Role::firstOrCreate(['name' => 'anggota']);
        Role::firstOrCreate(['name' => 'pengurus']);
        Role::firstOrCreate(['name' => 'superadmin']);
    }
}