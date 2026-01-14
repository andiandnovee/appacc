<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('ref_iurans')) {
            Schema::table('ref_iurans', function (Blueprint $table) {
                // tambahkan dua kolom tanggal setelah kolom 'periode'
                if (! Schema::hasColumn('ref_iurans', 'tgl_awal_periode')) {
                    $table->date('tgl_awal_periode')->nullable()->after('periode');
                }
                if (! Schema::hasColumn('ref_iurans', 'tgl_akhir_periode')) {
                    $table->date('tgl_akhir_periode')->nullable()->after('tgl_awal_periode');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('ref_iurans')) {
            Schema::table('ref_iurans', function (Blueprint $table) {
                $cols = [];
                if (Schema::hasColumn('ref_iurans', 'tgl_awal_periode')) {
                    $cols[] = 'tgl_awal_periode';
                }
                if (Schema::hasColumn('ref_iurans', 'tgl_akhir_periode')) {
                    $cols[] = 'tgl_akhir_periode';
                }
                if (! empty($cols)) {
                    $table->dropColumn($cols);
                }
            });
        }
    }
};
