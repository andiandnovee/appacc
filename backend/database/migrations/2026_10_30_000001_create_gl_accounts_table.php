<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gl_accounts', function (Blueprint $table) {
            $table->increments('id');
            $table->string('gl_acc', 8)->nullable();
            $table->string('gl_text', 255)->nullable();
            $table->string('gl_group', 255)->nullable();
            $table->enum('group_src', ['sheet', 'inferred'])->default('sheet');
            $table->text('desc')->nullable();
            $table->text('other_desc')->nullable();
            $table->index('gl_acc', 'idx_gl_acc');
            $table->index('gl_group', 'idx_gl_group');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gl_accounts');
    }
};
