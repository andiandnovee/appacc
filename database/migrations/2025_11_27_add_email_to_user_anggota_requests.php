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
        if (Schema::hasTable('user_anggota_requests')) {
            Schema::table('user_anggota_requests', function (Blueprint $table) {
                // Tambah kolom email setelah no_hp
                if (! Schema::hasColumn('user_anggota_requests', 'email')) {
                    $table->string('email')->nullable()->after('no_hp');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('user_anggota_requests') && Schema::hasColumn('user_anggota_requests', 'email')) {
            Schema::table('user_anggota_requests', function (Blueprint $table) {
                $table->dropColumn('email');
            });
        }
    }
};
