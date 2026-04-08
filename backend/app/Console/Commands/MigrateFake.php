<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class MigrateFake extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrate:fake
                            {--path= : Lokasi folder migrasi (relatif dari database/migrations)}
                            {--step : Gunakan batch baru untuk setiap eksekusi (hanya mode ran)}
                            {--only=* : Hanya proses migrasi dengan nama file ini (bisa multiple)}
                            {--except=* : Kecualikan migrasi dengan nama file ini}
                            {--pending : Ubah mode menjadi pending (hapus catatan migrasi)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Menandai migrasi sebagai ran atau pending tanpa eksekusi SQL';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        // 1. Tentukan folder migrasi
        $path = $this->option('path')
            ? database_path('migrations/' . $this->option('path'))
            : database_path('migrations');

        if (!File::isDirectory($path)) {
            $this->error("Folder migrasi tidak ditemukan: {$path}");
            return 1;
        }

        // 2. Ambil semua file migrasi yang valid
        $allMigrationFiles = collect(File::glob($path . '/*.php'))
            ->map(fn($file) => basename($file, '.php'))
            ->filter(fn($name) => preg_match('/^\d{4}_\d{2}_\d{2}_\d{6}_/', $name))
            ->values();

        if ($allMigrationFiles->isEmpty()) {
            $this->info('Tidak ada file migrasi yang ditemukan.');
            return 0;
        }

        // 3. Ambil data migrasi yang sudah tercatat
        $recordedMigrations = DB::table('migrations')->pluck('migration')->toArray();

        // 4. Tentukan mode
        $isPendingMode = $this->option('pending');

        // 5. Filter berdasarkan opsi --only dan --except
        $only = $this->option('only');
        $except = $this->option('except');

        $selectedFiles = $allMigrationFiles;

        if (!empty($only)) {
            $selectedFiles = $selectedFiles->filter(fn($m) => in_array($m, $only));
        }

        if (!empty($except)) {
            $selectedFiles = $selectedFiles->reject(fn($m) => in_array($m, $except));
        }

        if ($selectedFiles->isEmpty()) {
            $this->warn('Tidak ada migrasi yang sesuai dengan filter yang diberikan.');
            return 0;
        }

        // 6. Proses berdasarkan mode
        if ($isPendingMode) {
            // Mode pending: hanya proses migrasi yang sudah tercatat
            $processable = $selectedFiles->filter(fn($m) => in_array($m, $recordedMigrations));
            $skipped = $selectedFiles->diff($processable);

            if ($processable->isEmpty()) {
                $this->info('Tidak ada migrasi tercatat yang sesuai untuk dipending.');
                return 0;
            }

            // Hapus dari tabel migrations
            DB::table('migrations')->whereIn('migration', $processable->toArray())->delete();

            $this->info('✅ ' . $processable->count() . ' migrasi berhasil ditandai sebagai pending (dihapus dari catatan):');
            $this->newLine();
            foreach ($processable as $migration) {
                $this->line("   <fg=yellow>↩</> {$migration}");
            }

            if ($skipped->isNotEmpty()) {
                $this->newLine();
                $this->warn('⚠️ ' . $skipped->count() . ' migrasi tidak tercatat sehingga diabaikan:');
                foreach ($skipped as $migration) {
                    $this->line("   <fg=gray>○</> {$migration}");
                }
            }

        } else {
            // Mode ran (default): hanya proses migrasi yang BELUM tercatat
            $processable = $selectedFiles->reject(fn($m) => in_array($m, $recordedMigrations));
            $skipped = $selectedFiles->diff($processable);

            if ($processable->isEmpty()) {
                $this->info('Semua migrasi terpilih sudah tercatat sebagai ran.');
                return 0;
            }

            // Tentukan batch
            $step = $this->option('step');
            $batch = $step
                ? (DB::table('migrations')->max('batch') ?? 0) + 1
                : (DB::table('migrations')->max('batch') ?: 1);

            $now = now();
            $inserts = $processable->map(fn($m) => [
                'migration' => $m,
                'batch'     => $batch,
                'created_at'=> $now,
            ])->toArray();

            DB::table('migrations')->insert($inserts);

            $this->info('✅ ' . $processable->count() . ' migrasi berhasil ditandai sebagai ran:');
            $this->newLine();
            foreach ($processable as $migration) {
                $this->line("   <fg=green>✔</> {$migration}");
            }
            $this->newLine();
            $this->line("Batch: {$batch}");

            if ($skipped->isNotEmpty()) {
                $this->newLine();
                $this->warn('ℹ️ ' . $skipped->count() . ' migrasi sudah tercatat sebelumnya, dilewati.');
            }
        }

        return 0;
    }
}


// Menandai migrasi spesifik sebagai ran

// # Hanya dua migrasi ini yang ditandai
// php artisan migrate:fake --only=2024_01_01_000000_create_users_table --only=2024_01_02_000000_create_posts_table
// 2. Menandai semua kecuali beberapa migrasi

// php artisan migrate:fake --except=2024_01_01_000000_create_users_table
// 3. Mode pending — Menghapus catatan migrasi tertentu

// # Hapus catatan migrasi users dan posts (status jadi pending)
// php artisan migrate:fake --pending --only=2024_01_01_000000_create_users_table --only=2024_01_02_000000_create_posts_table
// 4. Kombinasi dengan --path dan --step

// # Hanya migrasi di subfolder 'local', batch baru, kecuali file tertentu
// php artisan migrate:fake --path=local --step --except=2024_01_01_000000_create_users_table

