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
        if (Schema::hasTable('iurans')) {
            Schema::table('iurans', function (Blueprint $table) {
                if (! Schema::hasColumn('iurans', 'is_canceled')) {
                    $table->boolean('is_canceled')->default(false)->after('is_dummy');
                }
            });
        }

        if (Schema::hasTable('journal_entries')) {
            Schema::table('journal_entries', function (Blueprint $table) {
                if (! Schema::hasColumn('journal_entries', 'is_canceled')) {
                    $table->boolean('is_canceled')->default(false)->after('source_module');
                }
            });
        }

        if (Schema::hasTable('collector_receipts')) {
            Schema::table('collector_receipts', function (Blueprint $table) {
                if (! Schema::hasColumn('collector_receipts', 'is_canceled')) {
                    $table->boolean('is_canceled')->default(false)->after('tgl_setor');
                }
                if (! Schema::hasColumn('collector_receipts', 'canceled_at')) {
                    $table->timestamp('canceled_at')->nullable()->after('is_canceled');
                }
                if (! Schema::hasColumn('collector_receipts', 'canceled_by')) {
                    $table->unsignedBigInteger('canceled_by')->nullable()->after('canceled_at');
                    $table->index('canceled_by');
                }
                if (! Schema::hasColumn('collector_receipts', 'cancel_reason')) {
                    $table->text('cancel_reason')->nullable()->after('canceled_by');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('iurans')) {
            Schema::table('iurans', function (Blueprint $table) {
                if (Schema::hasColumn('iurans', 'is_canceled')) {
                    $table->dropColumn('is_canceled');
                }
            });
        }

        if (Schema::hasTable('journal_entries')) {
            Schema::table('journal_entries', function (Blueprint $table) {
                if (Schema::hasColumn('journal_entries', 'is_canceled')) {
                    $table->dropColumn('is_canceled');
                }
            });
        }

        if (Schema::hasTable('collector_receipts')) {
            Schema::table('collector_receipts', function (Blueprint $table) {
                if (Schema::hasColumn('collector_receipts', 'cancel_reason')) {
                    $table->dropColumn('cancel_reason');
                }
                if (Schema::hasColumn('collector_receipts', 'canceled_by')) {
                    $table->dropColumn('canceled_by');
                }
                if (Schema::hasColumn('collector_receipts', 'canceled_at')) {
                    $table->dropColumn('canceled_at');
                }
                if (Schema::hasColumn('collector_receipts', 'is_canceled')) {
                    $table->dropColumn('is_canceled');
                }
            });
        }
    }
};

