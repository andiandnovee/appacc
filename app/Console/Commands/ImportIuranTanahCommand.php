<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\Imports\ImportIuranTanahService;

class ImportIuranTanahCommand extends Command
{
    /**
     * Nama command yang bisa dipanggil di terminal.
     */
    protected $signature = 'import:iuran-tanah {file : Path file Excel yang akan diimport}';

    /**
     * Deskripsi yang muncul di daftar artisan.
     */
    protected $description = 'Import data iuran tanah (Iuran Tanah Tahap I) dari file Excel ke database.';

    /**
     * Jalankan perintah.
     */
    public function handle(ImportIuranTanahService $importService)
    {
        $filePath = $this->argument('file');

        if (!file_exists($filePath)) {
            $this->error("❌ File tidak ditemukan di path: $filePath");
            return Command::FAILURE;
        }

        $this->info("🚀 Memulai import iuran tanah dari file: $filePath");

        try {
            $importService->import($filePath);
            $this->info("✅ Import selesai dengan sukses!");
        } catch (\Throwable $e) {
            $this->error("⚠️ Terjadi kesalahan saat import:");
            $this->error($e->getMessage());
            return Command::FAILURE;
        }

        return Command::SUCCESS;
    }
}
