<?php

// database/migrations/xxxx_xx_xx_create_stages_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stages', function (Blueprint $table) {
            $table->id();
            $table->integer('sap_id')->unique()->nullable()->comment('Tahap_Kode dari SAP');
            $table->string('name', 50)->nullable();
            $table->date('start_date')->nullable();
            $table->integer('year')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stages');
    }
};
