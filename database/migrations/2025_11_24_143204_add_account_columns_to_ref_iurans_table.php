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
                // akun jurnal (pendapatan/liabilitas)
                if (! Schema::hasColumn('ref_iurans', 'account_id')) {
                    $table->unsignedBigInteger('account_id')->nullable()->after('jumlah');

                    // pendapatan / liabilitas
                    $table->enum('entry_type', ['pendapatan', 'liabilitas'])
                        ->default('pendapatan')
                        ->after('account_id');

                    // foreign key ke tabel accounts
                    $table->foreign('account_id')
                        ->references('id')->on('accounts')
                        ->onDelete('set null');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('ref_iurans')) {
            Schema::table('ref_iurans', function (Blueprint $table) {
                if (Schema::hasColumn('ref_iurans', 'account_id')) {
                    $table->dropForeign(['account_id']);
                    $table->dropColumn(['account_id', 'entry_type']);
                }
            });
        }
    }
};
