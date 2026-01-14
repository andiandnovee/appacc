<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Tentukan kolom referensi yang ada untuk posisi tgl_setor
        $afterColumn = null;
        if (Schema::hasColumn('collector_receipts', 'paid_at')) {
            $afterColumn = 'paid_at';
        } elseif (Schema::hasColumn('collector_receipts', 'tanggal_bayar')) {
            $afterColumn = 'tanggal_bayar';
        }

        // Tambah kolom tanggal setor bendahara (idempotent)
        if (! Schema::hasColumn('collector_receipts', 'tgl_setor')) {
            Schema::table('collector_receipts', function (Blueprint $table) use ($afterColumn) {
                $column = $table->timestamp('tgl_setor')->nullable();

                if ($afterColumn) {
                    $column->after($afterColumn);
                }
            });
        }

        // Rename kolom ke Bahasa Indonesia (jika masih memakai nama lama)
        if (Schema::hasColumn('collector_receipts', 'collector_user_id')) {
            Schema::table('collector_receipts', function (Blueprint $table) {
                $table->renameColumn('collector_user_id', 'kolektor_user_id');
                $table->renameColumn('amount', 'jumlah');
                $table->renameColumn('paid_at', 'tanggal_bayar');
                $table->renameColumn('note', 'catatan');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('collector_receipts')) {
            // Kembalikan nama kolom ke Bahasa Inggris (jika perlu)
            if (Schema::hasColumn('collector_receipts', 'kolektor_user_id')) {
                Schema::table('collector_receipts', function (Blueprint $table) {
                    $table->renameColumn('kolektor_user_id', 'collector_user_id');
                    $table->renameColumn('jumlah', 'amount');
                    $table->renameColumn('tanggal_bayar', 'paid_at');
                    $table->renameColumn('catatan', 'note');
                });
            }

            // Hapus kolom tgl_setor jika ada
            if (Schema::hasColumn('collector_receipts', 'tgl_setor')) {
                Schema::table('collector_receipts', function (Blueprint $table) {
                    $table->dropColumn('tgl_setor');
                });
            }
        }
    }
};
