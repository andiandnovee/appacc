<?php

namespace App\Console\Commands;
use Illuminate\Support\Facades\DB;
use Illuminate\Console\Command;

class WipeDummyDataBSKM extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:wipe-dummy-data-b-s-k-m';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        DB::table('iurans')->where('is_dummy', true)->delete();
        DB::table('pengeluarans')->where('is_dummy', true)->delete();
        DB::table('sumbangans')->where('is_dummy', true)->delete();
        DB::table('alamat')->where('is_dummy', true)->delete();
        DB::table('keluarga')->where('is_dummy', true)->delete();
        DB::table('anggotas')->where('is_dummy', true)->delete();
        DB::table('perum')->where('is_dummy', true)->delete();

        $this->info('Semua data dummy berhasil dihapus.');
    }

}