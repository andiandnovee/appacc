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
           

            // Tambah batch_id setelah gl_account_code
            $table->string('po_number', 20)
                ->nullable()
                ->after('vendor_code')
                ->comment('jika ada po number ');

            $table->index('po_number');
        });
    }

    public function down(): void
    {
        Schema::table('importpphs', function (Blueprint $table) {
            $table->dropIndex(['po_number']);
            $table->dropColumn('po_number');
       
        });
    }
};