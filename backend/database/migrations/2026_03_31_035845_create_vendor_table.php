<?php

// database/migrations/xxxx_xx_xx_create_vendors_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vendors', function (Blueprint $table) {
            $table->id();
            $table->integer('sap_id')->unique()->nullable()->comment('Vendor_Kode dari SAP');
            $table->string('name', 100);
            $table->string('npwp', 50)->nullable();
            $table->string('address', 300)->nullable();
            $table->string('service_type', 50)->nullable()->comment('Vendor_Jasa');
            $table->string('pph_type', 50)->nullable()->comment('jenis PPh misal PPh23');
            $table->decimal('pph_rate', 5, 2)->nullable()->comment('tarif PPh dalam persen');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vendors');
    }
};
