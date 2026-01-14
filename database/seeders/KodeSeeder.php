<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Helpers\KodeGenerator;

class KodeSeeder extends Seeder
{
    public function run(): void
    {
        $targets = [
            'anggotas' => 'A',
            'keluargas' => 'KEL',
            'iurans' => 'IUR',
            'setoran_kolektors' => 'SET',
            'accounts' => 'ACC',
            'journal_entries' => 'JOU',
        ];

        foreach ($targets as $table => $prefix) {
            $rows = DB::table($table)->whereNull('kode')->get();

            foreach ($rows as $row) {
                $kode = KodeGenerator::generate($table, $prefix);
                DB::table($table)->where('id', $row->id)->update(['kode' => $kode]);
            }
        }
    }
}
