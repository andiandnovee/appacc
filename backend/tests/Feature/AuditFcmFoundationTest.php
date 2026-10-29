<?php

namespace Tests\Feature;

use App\Services\AuditNotificationDispatcher;
use App\Services\AuditService;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class AuditFcmFoundationTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config([
            'cache.default' => 'array',
            'database.default' => 'audit_test',
            'database.connections.audit_test' => [
                'driver' => 'sqlite',
                'database' => ':memory:',
                'prefix' => '',
                'foreign_key_constraints' => true,
            ],
        ]);
        Cache::setDefaultDriver('array');
        DB::purge('audit_test');
        DB::setDefaultConnection('audit_test');
    }

    public function test_audit_rules_are_seeded_disabled_without_recipients(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
        });

        $migration = require database_path('migrations/2026_10_28_000001_create_audit_and_notification_tables.php');
        $migration->up();

        $rule = DB::table('audit_notification_rules')->where('event_code', 'auth.login.success')->first();

        $this->assertNotNull($rule);
        $this->assertFalse((bool) $rule->is_active);
        $this->assertFalse((bool) $rule->notify_push);
        $this->assertFalse((bool) $rule->notify_in_app);
        $this->assertSame([], json_decode($rule->recipient_targets, true));
    }

    public function test_normalization_merges_role_and_permission_pivots(): void
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('guard_name');
            $table->timestamps();
        });
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('guard_name');
            $table->timestamps();
        });
        Schema::create('model_has_roles', function (Blueprint $table) {
            $table->unsignedBigInteger('role_id');
            $table->string('model_type');
            $table->unsignedBigInteger('model_id');
            $table->primary(['role_id', 'model_id', 'model_type']);
        });
        Schema::create('model_has_permissions', function (Blueprint $table) {
            $table->unsignedBigInteger('permission_id');
            $table->string('model_type');
            $table->unsignedBigInteger('model_id');
            $table->primary(['permission_id', 'model_id', 'model_type']);
        });
        Schema::create('role_has_permissions', function (Blueprint $table) {
            $table->unsignedBigInteger('permission_id');
            $table->unsignedBigInteger('role_id');
            $table->primary(['permission_id', 'role_id']);
        });

        $timestamp = now();
        DB::table('roles')->insert([
            ['id' => 1, 'name' => 'Accounting', 'guard_name' => 'api', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['id' => 2, 'name' => 'accounting', 'guard_name' => 'api', 'created_at' => $timestamp, 'updated_at' => $timestamp],
        ]);
        DB::table('permissions')->insert([
            ['id' => 1, 'name' => 'View Reports', 'guard_name' => 'api', 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ['id' => 2, 'name' => 'view reports', 'guard_name' => 'api', 'created_at' => $timestamp, 'updated_at' => $timestamp],
        ]);
        DB::table('model_has_roles')->insert([
            'role_id' => 2,
            'model_type' => 'App\\Models\\User',
            'model_id' => 10,
        ]);
        DB::table('model_has_permissions')->insert([
            'permission_id' => 2,
            'model_type' => 'App\\Models\\User',
            'model_id' => 10,
        ]);
        DB::table('role_has_permissions')->insert([
            'permission_id' => 2,
            'role_id' => 2,
        ]);

        $migration = require database_path('migrations/2026_10_28_000002_normalize_role_and_permission_names.php');
        $migration->up();

        $this->assertSame('accounting', DB::table('roles')->where('id', 1)->value('name'));
        $this->assertDatabaseMissing('roles', ['id' => 2], 'audit_test');
        $this->assertDatabaseHas('model_has_roles', ['role_id' => 1, 'model_id' => 10], 'audit_test');
        $this->assertSame('view reports', DB::table('permissions')->where('id', 1)->value('name'));
        $this->assertDatabaseMissing('permissions', ['id' => 2], 'audit_test');
        $this->assertDatabaseHas('model_has_permissions', ['permission_id' => 1, 'model_id' => 10], 'audit_test');
        $this->assertDatabaseHas('role_has_permissions', ['permission_id' => 1, 'role_id' => 1], 'audit_test');
    }

    public function test_audit_metadata_redacts_credentials_recursively(): void
    {
        $service = new AuditService(\Mockery::mock(AuditNotificationDispatcher::class));

        $sanitized = $service->sanitize([
            'device_token' => 'device-secret',
            'email' => 'person@example.test',
            'nested' => ['refresh_token' => 'refresh-secret'],
            'event_code' => 'receipt.created',
        ]);

        $this->assertSame('[REDACTED]', $sanitized['device_token']);
        $this->assertSame('[REDACTED]', $sanitized['email']);
        $this->assertSame('[REDACTED]', $sanitized['nested']['refresh_token']);
        $this->assertSame('receipt.created', $sanitized['event_code']);
    }
}
