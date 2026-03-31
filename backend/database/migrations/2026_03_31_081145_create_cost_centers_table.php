<?php

// database/migrations/xxxx_xx_xx_create_cost_centers_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cost_centers', function (Blueprint $table) {
            $table->id();
            $table->string('sap_id', 10)->unique()->nullable()->comment('CostCenter dari SAP');
            $table->string('description', 200)->nullable();
            $table->string('short_name', 50)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cost_centers');
    }
};
