<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\Imports\ImportIuranTanah2025Service;

class ImportIuranTanah2025 extends Command
{
    /**
     * Nama perintah Artisan.
     */
    protected $signature = 'import:iuran2025 
        {file : Path ke file Excel} 
        {--dry : Jalankan dalam mode dry-run (tanpa insert)}';

    /**
     * Deskripsi perintah.
     */
    protected $description = 'Import data iuran tanah bulanan tahun 2025 dari file Excel (sheet ke-2).';

    protected ImportIuranTanah2025Service $service;

    /**
     * Inject service via constructor.
     */
    public function __construct(ImportIuranTanah2025Service $service)
    {
        parent::__construct();
        $this->service = $service;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $filePath = $this->argument('file');
        $isDryRun = $this->option('dry');

        $this->info("=== Import Iuran Tanah 2025 ===");
        $this->info("File: {$filePath}");
        $this->info("Mode: " . ($isDryRun ? 'DRY RUN (tidak ada perubahan DB)' : 'IMPORT REAL'));
        $this->info("-------------------------------------");

        if (! file_exists($filePath)) {
            $this->error("File tidak ditemukan: {$filePath}");
            return Command::FAILURE;
        }

        try {
            $summary = $this->service->import($filePath, $isDryRun);
        } catch (\Throwable $e) {
            $this->error("GAGAL: " . $e->getMessage());
            return Command::FAILURE;
        }

        // Tampilkan hasil
        $this->info("\n=== HASIL IMPORT ===");
        $this->table(
            ['Item', 'Jumlah'],
            [
                ['Total Baris Dibaca', $summary['rows_total']],
                ['Anggota Ditemukan', $summary['found_anggotas']],
                ['Anggota Baru Dibuat', $summary['created_anggotas']],
                ['Iuran Dibuat', $summary['created_iurans']],
                ['Journal Dibuat', $summary['created_journals']],
                ['Baris Dilewati', $summary['skipped_rows']],
            ]
        );

        if (! empty($summary['errors'])) {
            $this->warn("\n=== ERROR TERDETEKSI ===");
            foreach ($summary['errors'] as $err) {
                $this->warn("- " . $err);
            }
        }

        $this->info("\nSelesai.");

        return Command::SUCCESS;
    }
}
