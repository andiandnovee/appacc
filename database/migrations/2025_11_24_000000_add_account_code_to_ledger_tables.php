<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1) Tambah ke JOURNAL_LINES
        if (Schema::hasTable('journal_lines')) {
            Schema::table('journal_lines', function (Blueprint $table) {
                if (! Schema::hasColumn('journal_lines', 'account_code')) {
                    $table->string('account_code', 50)
                        ->nullable()
                        ->after('account_id')
                        ->comment('Kode akun seperti 1101 atau 2101');
                }
            });
        }

        // 2) Tambah ke ACCOUNT_BALANCES
        if (Schema::hasTable('account_balances')) {
            Schema::table('account_balances', function (Blueprint $table) {
                if (! Schema::hasColumn('account_balances', 'account_code')) {
                    $table->string('account_code', 50)
                        ->nullable()
                        ->after('account_id')
                        ->comment('Kode akun seperti 1101 atau 2101');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('journal_lines')) {
            Schema::table('journal_lines', function (Blueprint $table) {
                if (Schema::hasColumn('journal_lines', 'account_code')) {
                    $table->dropColumn('account_code');
                }
            });
        }

        if (Schema::hasTable('account_balances')) {
            Schema::table('account_balances', function (Blueprint $table) {
                if (Schema::hasColumn('account_balances', 'account_code')) {
                    $table->dropColumn('account_code');
                }
            });
        }
    }
};
