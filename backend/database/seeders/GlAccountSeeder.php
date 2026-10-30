<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class GlAccountSeeder extends Seeder
{
    /**
     * Seed the GL account reference data from the checked-in JSON source.
     */
    public function run(): void
    {
        $path = database_path('seeders/data/gl_accounts.json');
        $contents = file_get_contents($path);

        if ($contents === false) {
            throw new RuntimeException("Unable to read GL account seed data at {$path}.");
        }

        $rows = json_decode($contents, true, flags: JSON_THROW_ON_ERROR);

        if (! is_array($rows)) {
            throw new RuntimeException('GL account seed data must be a JSON array.');
        }

        DB::transaction(function () use ($rows): void {
            DB::table('gl_accounts')->delete();

            foreach (array_chunk($rows, 150) as $chunk) {
                DB::table('gl_accounts')->insert(array_map(
                    static fn (array $row): array => [
                        'gl_acc' => $row[0],
                        'gl_text' => $row[1],
                        'gl_group' => $row[2],
                        'group_src' => $row[3],
                        'desc' => $row[4],
                        'other_desc' => $row[5],
                    ],
                    $chunk,
                ));
            }
        });
    }
}
