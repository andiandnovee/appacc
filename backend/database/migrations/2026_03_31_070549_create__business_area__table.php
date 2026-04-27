<?php

// database/migrations/xxxx_xx_xx_create_business_areas_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('business_areas', function (Blueprint $table) {
            $table->id();
            $table->integer('sap_id')->unique()->nullable()->comment('BA_Kode dari SAP');
            $table->foreignId('company_id')->nullable()->constrained()->onDelete('set null');
            $table->string('name', 100)->nullable();
            $table->string('name_long', 255)->nullable();
            $table->integer('sap_customer_code')->nullable()->comment('BA_CUST');
            $table->integer('sap_vendor_code')->nullable()->comment('BA_VEND');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('business_areas');
    }
};
