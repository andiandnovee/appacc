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
        if (! Schema::hasTable('notification_logs')) {
            Schema::create('notification_logs', function (Blueprint $table) {
                $table->id();

                // Target utama notifikasi
                $table->foreignId('user_id')
                    ->nullable()
                    ->constrained('users')
                    ->nullOnDelete();

                $table->foreignId('anggota_id')
                    ->nullable()
                    ->constrained('anggotas')
                    ->nullOnDelete();

                // Informasi teknis FCM
                $table->string('device_token', 255)->nullable();
                $table->string('channel', 50)->default('fcm'); // fcm, email, dll (future-proof)
                $table->string('type', 100)->nullable(); // jenis notifikasi, misal: tagihan_iuran, pengumuman, dll

                // Konten notifikasi
                $table->string('title')->nullable();
                $table->text('body')->nullable();
                $table->json('data_payload')->nullable(); // payload data tambahan yang dikirim ke FCM

                // Status pengiriman
                $table->enum('status', ['pending', 'sent', 'failed'])
                    ->default('pending');
                $table->timestamp('sent_at')->nullable();

                // Response dari FCM / error
                $table->text('fcm_response')->nullable();
                $table->text('error_message')->nullable();

                $table->timestamps();

                $table->index('status');
                $table->index('channel');
                $table->index('sent_at');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notification_logs');
    }
};
