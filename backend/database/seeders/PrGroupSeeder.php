<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PrGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
{
    $lines = file(database_path('seeders/PGr.txt'), FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    $batchInsert = collect($lines)->map(function ($line) {
    $line = trim($line);

    $parts = preg_split('/\s+/', $line, 2);

    if (count($parts) < 2) {
        return null; // skip data aneh
    }

    [$pgr, $desc] = $parts;

    return [
        'PGr' => trim($pgr),
        'Description' => trim($desc),
        'created_at' => now(),
        'updated_at' => now(),
    ];
})->filter()->toArray();

    DB::table('pr_group_tabel')->insert($batchInsert);
}
}
