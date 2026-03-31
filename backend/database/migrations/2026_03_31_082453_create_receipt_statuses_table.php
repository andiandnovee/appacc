<?php

// database/migrations/xxxx_xx_xx_create_receipt_statuses_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('receipt_statuses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invoice_receipt_id')->constrained()->onDelete('cascade');
            $table->date('status_date');
            $table->integer('status_value');
            $table->string('status_reason', 255);
            $table->string('status_action', 255)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('status_value');
            $table->index('invoice_receipt_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('receipt_statuses');
    }
};
