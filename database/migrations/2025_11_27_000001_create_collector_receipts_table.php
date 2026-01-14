<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('collector_receipts')) {
            Schema::create('collector_receipts', function (Blueprint $table) {
                $table->id();

                // Foreign keys
                $table->unsignedBigInteger('kolektor_user_id')->comment('User ID of the collector');
                $table->unsignedBigInteger('anggota_id')->comment('Member ID (anggota)');
                $table->unsignedBigInteger('ref_iuran_id')->comment('Reference Iuran (master iuran)');
                $table->unsignedBigInteger('iuran_id')->nullable()->comment('Iuran record created for this receipt');
                $table->unsignedBigInteger('journal_entry_id')->nullable()->comment('Journal entry created for this receipt');

                // Amount
                $table->decimal('jumlah', 15, 2)->comment('Amount received');

                // Dates
                $table->dateTime('tanggal_bayar')->comment('Payment date recorded by collector');
                $table->dateTime('tgl_setor')->nullable()->comment('Deposit date to treasury');

                // Notes
                $table->text('catatan')->nullable()->comment('Collector notes');

                // Cancellation
                $table->boolean('is_canceled')->default(false)->comment('Whether this receipt is canceled');
                $table->dateTime('canceled_at')->nullable()->comment('Cancellation timestamp');
                $table->unsignedBigInteger('canceled_by')->nullable()->comment('User ID who canceled');
                $table->text('cancel_reason')->nullable()->comment('Reason for cancellation');

                $table->timestamps();

                // Indexes and foreign keys
                $table->foreign('kolektor_user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('anggota_id')->references('id')->on('anggotas')->onDelete('cascade');
                $table->foreign('ref_iuran_id')->references('id')->on('ref_iurans')->onDelete('cascade');
                $table->foreign('iuran_id')->references('id')->on('iurans')->onDelete('set null');
                $table->foreign('journal_entry_id')->references('id')->on('journal_entries')->onDelete('set null');

                $table->index('kolektor_user_id');
                $table->index('anggota_id');
                $table->index('ref_iuran_id');
                $table->index('tanggal_bayar');
                $table->index(['kolektor_user_id', 'tanggal_bayar']);
                $table->index('is_canceled');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('collector_receipts');
    }
};
