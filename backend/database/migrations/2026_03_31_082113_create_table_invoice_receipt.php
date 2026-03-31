<?php

// database/migrations/xxxx_xx_xx_create_invoice_receipts_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoice_receipts', function (Blueprint $table) {
            $table->id();
            $table->integer('sap_id')->unique()->nullable()->comment('Penerimaan_Kode dari SAP');
            $table->date('receipt_date')->nullable();
            $table->integer('payment_location')->nullable()->comment('Penerimaan_Tempat_Bayar');
            $table->foreignId('vendor_id')->nullable()->constrained()->onDelete('set null');
            $table->string('po_number', 50)->nullable();
            $table->double('amount')->nullable();
            $table->foreignId('company_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('stage_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->integer('sap_user_id')->nullable()->comment('Pengguna_kode lama dari SAP');
            $table->smallInteger('category')->nullable()->comment('icat');
            $table->string('business_area_code', 6)->nullable();
            $table->string('invoice_number', 225)->nullable();
            $table->string('attachment1', 255)->nullable();
            $table->string('attachment2', 255)->nullable();
            $table->string('attachment3', 255)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('business_area_code');
            $table->index('receipt_date');
            $table->index('category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoice_receipts');
    }
};
