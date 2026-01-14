<?php

namespace Database\Seeders\Core;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        Permission::truncate();
        Role::truncate();
        DB::table('role_has_permissions')->truncate();
        DB::table('model_has_roles')->truncate();
        DB::table('model_has_permissions')->truncate();

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        // Reset cache
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        /*
        |--------------------------------------------------------------------------
        | 1. Definisi Permission (ringkas dengan pola Resource.Action)
        |--------------------------------------------------------------------------
        */
        $permissions = [

            // ===== Anggota =====
            'Anggota.View',     // show + search
            'Anggota.Manage',   // add + edit
            'Anggota.Delete',
            'Guser.View',


            // Detail Anggota

            // khusus akses diri sendiri
            'AnggotaSelf.View',
            'AnggotaSelf.Manage',

            // Detail Anggota Keluarga
            'Keluarga.View',
            'Keluarga.Manage',
            'Keluarga.Delete',

            'KeluargaSelf.View',
            'KeluargaSelf.Manage',
            'KeluargaSelf.Delete',

            // ===== Iuran =====
            'Iuran.View',
            'Iuran.Manage',
            'Iuran.Delete',

            'IuranSelf.View',

            // ===== Akun =====

            'Account.View',
            'Account.Manage',
            'Account.Delete',

            // Ref Iuran
            'RefIuran.View',
            'RefIuran.Manage',
            'RefIuran.Delete',

            // ===== Pengeluaran =====
            'Kas.View',
            'Kas.Manage',
            'Kas.Delete',

            // ===== Fungsi Khusus =====

            'AssignRole.View',
            'AssignRole.Manage',
            'AssignRole.Delete',

            'IuranSetor.View',
            'IuranSetor.Manage',
            'IuranSetor.Delete',

            // Permission khusus (bukan resource-based)

        ];

        foreach ($permissions as $name) {
            Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
        }

        /*
        |--------------------------------------------------------------------------
        | 2. Role Definition
        |--------------------------------------------------------------------------
        */

        // Anggota
        $anggota = Role::firstOrCreate(['name' => 'anggota', 'guard_name' => 'web']);
        $anggota->syncPermissions([
            'AnggotaSelf.View',
            'AnggotaSelf.Manage',
            'KeluargaSelf.View',
            'KeluargaSelf.Manage',
            'KeluargaSelf.Delete',
            'IuranSelf.View',
            'Kas.View',
        ]);

        // Pengurus
        $pengurus = Role::firstOrCreate(['name' => 'pengurus', 'guard_name' => 'web']);
        $pengurus->syncPermissions([
            'Anggota.View',
            'Keluarga.View',
            'Iuran.View',

        ]);

        // Sekretaris
        $sekretaris = Role::firstOrCreate(['name' => 'sekretaris', 'guard_name' => 'web']);
        $sekretaris->syncPermissions(array_merge($pengurus->permissions->pluck('name')->toArray(), [
            'Anggota.Manage',
            'Anggota.Delete',
            'Keluarga.Manage',
            'Keluarga.Delete',

        ]));

        // Bendahara
        $bendahara = Role::firstOrCreate(['name' => 'bendahara', 'guard_name' => 'web']);
        $bendahara->syncPermissions(array_merge($pengurus->permissions->pluck('name')->toArray(), [
            'Kas.View',
            'Kas.Manage',
            'Kas.Delete',

            'RefIuran.View',
            'RefIuran.Manage',
            'RefIuran.Delete',

            'IuranSetor.View',
            'IuranSetor.Manage',
            'IuranSetor.Delete',

            'Account.View',
            'Account.Manage',
            'Account.Delete',



        ]));

        // Ketua
        $ketua = Role::firstOrCreate(['name' => 'ketua', 'guard_name' => 'web']);
        $ketua->syncPermissions(array_merge($pengurus->permissions->pluck('name')->toArray(), [
            'AssignRole.View',
            'AssignRole.Manage',
            'AssignRole.Delete',

            'Kas.View',
            'Kas.Manage',

        ]));

        // Kolektor
        $kolektor = Role::firstOrCreate(['name' => 'kolektor', 'guard_name' => 'web']);
        $kolektor->syncPermissions(array_merge($pengurus->permissions->pluck('name')->toArray(), [
            'Iuran.Manage',
            'Iuran.Delete',
            'Iuran.View',
            'IuranSetor.View',
            'IuranSetor.Manage',
        ]));

        $gUser = Role::firstOrCreate(['name' => 'guser', 'guard_name' => 'web']);
        $gUser->syncPermissions([

            'Guser.View',

        ]);

        // Superadmin = semua
        $superadmin = Role::firstOrCreate(['name' => 'superadmin', 'guard_name' => 'web']);
        $superadmin->syncPermissions(Permission::all());
    }
}

// cleanup sebelum seeding ulang
// DB::statement('SET FOREIGN_KEY_CHECKS=0;');

// Spatie\Permission\Models\Permission::truncate();
// Spatie\Permission\Models\Role::truncate();
// DB::table('role_has_permissions')->truncate();
// DB::table('model_has_roles')->truncate();
// DB::table('model_has_permissions')->truncate();

// DB::statement('SET FOREIGN_KEY_CHECKS=1;');
// exit
