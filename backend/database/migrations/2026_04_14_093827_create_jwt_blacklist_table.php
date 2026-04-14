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
      // database/migrations/...._create_jwt_blacklist_table.php

Schema::create('jwt_blacklist', function (Blueprint $table) {
    $table->id();
    $table->string('key')->unique()->index(); // Untuk menyimpan JTI token
    $table->longText('value'); // Untuk menyimpan data token yang di-serialize
    $table->timestamp('expires_at')->nullable(); // Untuk pembersihan data otomatis
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jwt_blacklist');
    }
};
