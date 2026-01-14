<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ClearDummyData extends Command
{
    protected $signature = 'dummy:clear';
    protected $description = 'Menghapus semua data is_dummy = true dari tabel BSKM';

    public function handle(): void
    {
        $this->info('Menghapus data dummy...');

        DB::table('iurans')->where('is_dummy', true)->delete();
        DB::table('pengeluarans')->where('is_dummy', true)->delete();
        DB::table('sumbangans')->where('is_dummy', true)->delete();
        DB::table('alamat')->where('is_dummy', true)->delete();
        DB::table('keluarga')->where('is_dummy', true)->delete();
        DB::table('anggotas')->where('is_dummy', true)->delete();
        DB::table('perum')->where('is_dummy', true)->delete();

        $this->info('Semua data dummy berhasil dihapus!');
    }
}