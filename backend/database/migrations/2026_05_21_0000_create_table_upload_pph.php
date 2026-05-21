<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('importpphs', function (Blueprint $table) {
            $table->id();

            $table->date('posting_date');

            $table->string('document_number', 30);

            $table->string('reference', 50)
                ->nullable();

            $table->string('business_area', 10);

            $table->decimal('amount_in_local_currency', 18, 2);

            $table->text('text')
                ->nullable();

            $table->string('vendor_code', 30)
                ->nullable();
            $table->string('gl_account_code', 30)
                ->nullable();

            $table->timestamps();

            // composite unique key
            $table->unique(
                ['document_number', 'business_area','posting_date'],
                'doc_business_unique'
            );

            // index tambahan
            $table->index('vendor_code');
            $table->index('reference');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('importpphs');
    }
};