<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! Schema::hasTable('user_anggota_requests')) {
            Schema::create('user_anggota_requests', function (Blueprint $table) {
                $table->id();

                // User yang mengajukan
                $table->foreignId('user_id')
                    ->constrained('users')
                    ->onDelete('cascade');

                // Anggota yang dipilih user
                $table->foreignId('anggota_id')
                    ->constrained('anggotas')
                    ->onDelete('cascade');

                // Data tambahan dari form pengajuan
                $table->string('no_hp')->nullable();
                $table->foreignId('perum_id')->nullable()
                    ->constrained('perums')
                    ->nullOnDelete();
                $table->string('no_rumah')->nullable();
                $table->text('alamat_lainnya')->nullable();

                // Village (kampung / desa)
                $table->foreignId('village_id')->nullable()
                    ->constrained('indonesia_villages')
                    ->nullOnDelete();

                // Status permintaan
                $table->enum('status', ['pending', 'approved', 'rejected'])
                    ->default('pending');

                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_anggota_requests');
    }
};
