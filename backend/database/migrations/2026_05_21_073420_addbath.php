<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('importpphs', function (Blueprint $table) {
            // Rename business_area → company_code
            $table->renameColumn('business_area', 'company_code');

            // Tambah batch_id setelah gl_account_code
            $table->string('batch_id', 20)
                ->nullable()
                ->after('gl_account_code')
                ->comment('Format: company_code-gl_account_code-YYYY-MM');

            $table->index('batch_id');
        });
    }

    public function down(): void
    {
        Schema::table('importpphs', function (Blueprint $table) {
            $table->dropIndex(['batch_id']);
            $table->dropColumn('batch_id');
            $table->renameColumn('company_code', 'business_area');
        });
    }
};