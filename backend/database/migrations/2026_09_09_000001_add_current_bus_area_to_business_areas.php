<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('business_areas', function (Blueprint $table) {
            $table->boolean('current_bus_area')
                  ->default(false)
                  ->after('sap_vendor_code')
                  ->comment('Flag BusArea pembayar/penerima jurnal RO per company. Hanya satu true per company_id.');
        });
    }

    public function down(): void
    {
        Schema::table('business_areas', function (Blueprint $table) {
            $table->dropColumn('current_bus_area');
        });
    }
};
