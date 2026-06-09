<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vehicle_cost_details', function (Blueprint $table) {
            // Tandai baris yang disalin dari periode sebelumnya
            $table->boolean('is_carryover')->default(false)->after('customer_code');

            // Referensi ke baris sumber (nullable — hanya terisi kalau is_carryover = true)
            $table->unsignedBigInteger('source_detail_id')->nullable()->after('is_carryover');

            // Hasil kalkulasi biaya per baris (nullable sampai recalculate dijalankan)
            $table->bigInteger('cost_amount')->nullable()->after('source_detail_id');

            // Soft delete
            $table->softDeletes()->after('cost_amount');

            $table->foreign('source_detail_id')
                  ->references('id')
                  ->on('vehicle_cost_details')
                  ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('vehicle_cost_details', function (Blueprint $table) {
            $table->dropForeign(['source_detail_id']);
            $table->dropColumn([
                'is_carryover',
                'source_detail_id',
                'cost_amount',
                'deleted_at',
            ]);
        });
    }
};
