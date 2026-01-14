<?php

/**
 * Script untuk membersihkan orphaned migration records
 * 
 * Jalankan dengan: php artisan tinker < cleanup-orphaned-migrations.php
 * Atau copy-paste commands di bawah ke dalam `php artisan tinker`
 */

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

echo "=== Cleanup Orphaned Migration Records ===\n\n";

// Get all migration files in database/migrations
$migrationPath = database_path('migrations');
$migrationFiles = File::files($migrationPath);
$fileNames = [];

foreach ($migrationFiles as $file) {
    // Extract migration name without extension
    $name = str_replace('.php', '', $file->getFilename());
    $fileNames[] = $name;
}

echo "Found " . count($fileNames) . " migration files in database/migrations/\n";
echo "Sample files: " . implode(', ', array_slice($fileNames, 0, 3)) . "...\n\n";

// Get all migration records in database
$dbMigrations = DB::table('migrations')->get();
echo "Found " . $dbMigrations->count() . " migration records in database\n\n";

// Find orphaned migrations (in database but not in files)
$orphaned = [];
foreach ($dbMigrations as $migration) {
    if (!in_array($migration->migration, $fileNames)) {
        $orphaned[] = $migration;
    }
}

if (empty($orphaned)) {
    echo "✅ No orphaned migrations found!\n";
} else {
    echo "❌ Found " . count($orphaned) . " orphaned migrations:\n\n";
    foreach ($orphaned as $m) {
        echo "- " . $m->migration . " (batch: " . $m->batch . ")\n";
    }
    
    echo "\n--- DELETING ORPHANED MIGRATIONS ---\n";
    foreach ($orphaned as $m) {
        DB::table('migrations')->where('migration', $m->migration)->delete();
        echo "✓ Deleted: " . $m->migration . "\n";
    }
    echo "\nCleanup complete!\n";
}

// Final verification
echo "\n=== FINAL STATUS ===\n";
$finalDbMigrations = DB::table('migrations')->get();
echo "Migration records in database: " . $finalDbMigrations->count() . "\n";

$stillOrphaned = [];
foreach ($finalDbMigrations as $migration) {
    if (!in_array($migration->migration, $fileNames)) {
        $stillOrphaned[] = $migration->migration;
    }
}

if (empty($stillOrphaned)) {
    echo "✅ All migration records have corresponding files!\n";
} else {
    echo "⚠️ Still found orphaned migrations: " . implode(', ', $stillOrphaned) . "\n";
}
