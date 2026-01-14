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
        if (Schema::hasTable('collector_receipts')) {
            Schema::table('collector_receipts', function (Blueprint $table) {
                if (! Schema::hasColumn('collector_receipts', 'iuran_id')) {
                    $table->unsignedBigInteger('iuran_id')
                        ->nullable()
                        ->after('ref_iuran_id');
                    $table->index('iuran_id');
                }

                if (! Schema::hasColumn('collector_receipts', 'journal_entry_id')) {
                    $table->unsignedBigInteger('journal_entry_id')
                        ->nullable()
                        ->after('iuran_id');
                    $table->index('journal_entry_id');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('collector_receipts')) {
            Schema::table('collector_receipts', function (Blueprint $table) {
                if (Schema::hasColumn('collector_receipts', 'iuran_id')) {
                    $table->dropColumn('iuran_id');
                }

                if (Schema::hasColumn('collector_receipts', 'journal_entry_id')) {
                    $table->dropColumn('journal_entry_id');
                }
            });
        }
    }
};

