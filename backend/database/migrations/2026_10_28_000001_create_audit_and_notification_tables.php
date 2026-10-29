<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_events', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignId('actor_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('actor_name')->nullable();
            $table->json('actor_roles')->nullable();
            $table->string('business_domain', 50)->index();
            $table->string('event_code', 100)->index();
            $table->string('action', 30)->index();
            $table->string('severity', 20)->default('info')->index();
            $table->string('outcome', 20)->default('success')->index();
            $table->nullableMorphs('auditable');
            $table->string('subject_label')->nullable();
            $table->text('description');
            $table->json('metadata')->nullable();
            $table->json('changes_before')->nullable();
            $table->json('changes_after')->nullable();
            $table->ulid('request_id')->nullable()->index();
            $table->ulid('batch_id')->nullable()->index();
            $table->string('route_name')->nullable();
            $table->string('http_method', 10)->nullable();
            $table->unsignedSmallInteger('http_status')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 1000)->nullable();
            $table->timestamp('occurred_at')->useCurrent()->index();
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('audit_notification_rules', function (Blueprint $table) {
            $table->id();
            $table->string('event_code', 100)->unique();
            $table->string('business_domain', 50)->index();
            $table->string('label');
            $table->string('mode', 20)->default('log_only');
            $table->boolean('notify_in_app')->default(false);
            $table->boolean('notify_push')->default(false);
            $table->json('recipient_targets')->nullable();
            $table->boolean('is_active')->default(false);
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('audit_notifications', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUlid('audit_event_id')->constrained('audit_events')->cascadeOnDelete();
            $table->string('title');
            $table->text('body');
            $table->string('link')->nullable();
            $table->timestamp('read_at')->nullable()->index();
            $table->timestamps();
            $table->unique(['audit_event_id', 'user_id']);
            $table->index(['user_id', 'created_at']);
        });

        Schema::create('user_devices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->text('device_token');
            $table->char('token_hash', 64)->unique();
            $table->string('platform', 20);
            $table->string('device_name', 100)->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'is_active']);
        });

        Schema::create('notification_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('user_device_id')->nullable()->constrained('user_devices')->nullOnDelete();
            $table->foreignUlid('audit_event_id')->nullable()->constrained('audit_events')->nullOnDelete();
            $table->foreignUlid('audit_notification_id')->nullable()->constrained('audit_notifications')->nullOnDelete();
            $table->string('channel', 20)->default('fcm');
            $table->string('status', 20)->default('pending')->index();
            $table->unsignedSmallInteger('http_status')->nullable();
            $table->text('response_body')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'created_at']);
        });

        $rules = [
            ['auth.login.success', 'auth', 'Login berhasil'],
            ['auth.login.failed', 'auth', 'Login gagal'],
            ['auth.logout', 'auth', 'Logout'],
            ['auth.google.login.success', 'auth', 'Login Google berhasil'],
            ['auth.oauth.login.success', 'auth', 'Login OAuth berhasil'],
            ['receipt.created', 'receipt', 'Receipt dibuat'],
            ['receipt.updated', 'receipt', 'Receipt diperbarui'],
            ['receipt.deleted', 'receipt', 'Receipt dihapus'],
            ['receipt.status.created', 'receipt', 'Status receipt ditambahkan'],
            ['receipt.icat.imported', 'receipt', 'Impor ICAT selesai'],
            ['import.po.failed', 'imports', 'Impor PO gagal'],
            ['import.po.completed', 'imports', 'Impor PO selesai'],
            ['import.f53.completed', 'imports', 'Impor F53 selesai'],
            ['import.f53.failed', 'imports', 'Impor F53 gagal'],
            ['import.f53.deleted', 'imports', 'Data impor F53 dihapus'],
            ['import.pph.completed', 'imports', 'Impor PPh selesai'],
            ['import.pph.failed', 'imports', 'Impor PPh gagal'],
            ['import.pph.deleted', 'imports', 'Data impor PPh dihapus'],
            ['import.pph.vendor_gl.updated', 'imports', 'GL vendor diperbarui'],
            ['import.vehicle_cost.completed', 'imports', 'Impor biaya kendaraan selesai'],
            ['import.vehicle_cost.failed', 'imports', 'Impor biaya kendaraan gagal'],
            ['vehicle.created', 'vehicle', 'Kendaraan dibuat'],
            ['vehicle.updated', 'vehicle', 'Kendaraan diperbarui'],
            ['vehicle.deleted', 'vehicle', 'Kendaraan dihapus'],
            ['vehicle.logbook.created', 'vehicle', 'Baris logbook ditambahkan'],
            ['vehicle.logbook.updated', 'vehicle', 'Baris logbook diperbarui'],
            ['vehicle.logbook.deleted', 'vehicle', 'Baris logbook dihapus'],
            ['vehicle.logbook.carryover', 'vehicle', 'Carry-over logbook selesai'],
            ['admin.user.created', 'admin', 'User dibuat'],
            ['admin.user.updated', 'admin', 'User diperbarui'],
            ['admin.user.deleted', 'admin', 'User dihapus'],
            ['admin.user.roles.changed', 'admin', 'Role user diperbarui'],
            ['admin.role.created', 'admin', 'Role dibuat'],
            ['admin.role.updated', 'admin', 'Role diperbarui'],
            ['admin.role.deleted', 'admin', 'Role dihapus'],
            ['admin.settings.updated', 'admin', 'Pengaturan diperbarui'],
            ['admin.audit_rule.updated', 'admin', 'Aturan notifikasi diperbarui'],
        ];

        $now = now();
        DB::table('audit_notification_rules')->insert(array_map(
            fn (array $rule) => [
                'event_code' => $rule[0],
                'business_domain' => $rule[1],
                'label' => $rule[2],
                'mode' => 'log_only',
                'notify_in_app' => false,
                'notify_push' => false,
                'recipient_targets' => json_encode([]),
                'is_active' => false,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            $rules
        ));
    }

    public function down(): void
    {
        Schema::dropIfExists('notification_logs');
        Schema::dropIfExists('user_devices');
        Schema::dropIfExists('audit_notifications');
        Schema::dropIfExists('audit_notification_rules');
        Schema::dropIfExists('audit_events');
    }
};
