#!/bin/bash
echo "=== Fix Orphaned Migration Records ==="
echo ""
echo "Step 1: Clear all caches"
php artisan cache:clear
php artisan config:clear
php artisan optimize:clear

echo ""
echo "Step 2: Delete orphaned migration records from database"
php artisan tinker --execute="DB::table('migrations')->where('migration', 'like', '%2025_12_10_0307%')->delete(); DB::table('migrations')->where('migration', 'like', '%2025_11_07%')->delete(); echo 'Orphaned migrations deleted';"

echo ""
echo "Step 3: Check migration status"
php artisan migrate:status | grep oauth || echo "No oauth migrations in queue (good!)"

echo ""
echo "Step 4: Run migrations"
php artisan migrate --force

echo ""
echo "Step 5: Verify oauth tables exist"
php artisan tinker --execute="Schema::hasTable('oauth_auth_codes') ? print('✓ oauth_auth_codes exists') : print('✗ oauth_auth_codes missing');"

echo ""
echo "=== Done ==="
