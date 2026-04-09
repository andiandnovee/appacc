<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sap_po_imports', function (Blueprint $table) {
            $table->id();
            
            // SAP PO Data - WAJIB ada
            $table->string('po_number', 20); // NOT NULL
            $table->string('item_line', 10); // NOT NULL
            $table->string('business_area_code', 6);
            $table->integer('sap_vendor_id');
            $table->string('vendor_name', 255);
            
            // SAP Transaction References
            $table->string('gr_number', 20)->nullable()->comment('Goods Receipt Number');
            $table->string('purchasing_group', 10)->nullable()->comment('SAP Purchasing Group (e.g., HF9, HT4)');
            $table->string('pr_number', 20)->nullable()->comment('Purchase Requisition Number');
            
            // Financial
            $table->decimal('amount', 15, 2)->default(0);
            
            // Import metadata
            $table->date('import_date')->nullable()->comment('Tanggal data di-import dari SAP');
            $table->string('import_batch', 50)->nullable()->comment('Batch ID untuk tracking import bulanan');
            
            $table->timestamps();
            $table->softDeletes();

            // UNIQUE CONSTRAINT: PO + item line
            // Prevent duplicate upload
            $table->unique(['po_number', 'item_line'], 'unique_po_item');
            
            // Indexes untuk lookup
            $table->index('po_number');
            $table->index('business_area_code');
            $table->index('sap_vendor_id');
            $table->index('import_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sap_po_imports');
    }
};