<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('accounts') && Schema::hasColumn('accounts', 'company_code')) {
            Schema::table('accounts', function (Blueprint $table) {
                $table->string('company_code', 50)->nullable()->change();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('accounts') && Schema::hasColumn('accounts', 'company_code')) {
            Schema::table('accounts', function (Blueprint $table) {
                $table->string('company_code', 50)->nullable(false)->change();
            });
        }
    }
};
