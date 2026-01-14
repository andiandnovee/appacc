<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('journal_entries', function (Blueprint $table) {
            // Add status field (parked, posted)
            if (! Schema::hasColumn('journal_entries', 'status')) {
                $table->enum('status', ['parked', 'posted'])->default('parked')->after('description');
            }
        });
    }

    public function down(): void
    {
        Schema::table('journal_entries', function (Blueprint $table) {
            if (Schema::hasColumn('journal_entries', 'status')) {
                $table->dropColumn('status');
            }
        });
    }
};
