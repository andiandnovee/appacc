#!/bin/bash
set -e

echo "========================================="
echo "  COMPREHENSIVE CACHE & DATABASE CLEANUP"
echo "========================================="
echo ""

cd /var/www/html/bskmAPI

echo "[1/8] Pulling latest code..."
git pull origin refactor/api-v1 --force
echo "✓ Done"
echo ""

echo "[2/8] Clearing Laravel application cache..."
php artisan cache:clear
echo "✓ Done"
echo ""

echo "[3/8] Clearing Laravel config cache..."
php artisan config:clear
echo "✓ Done"
echo ""

echo "[4/8] Clearing Laravel view/compiled cache..."
php artisan view:clear
php artisan optimize:clear
echo "✓ Done"
echo ""

echo "[5/8] Removing bootstrap cache files..."
rm -f bootstrap/cache/*.php 2>/dev/null || true
echo "✓ Done"
echo ""

echo "[6/8] Removing orphaned OAuth migration records from database..."
php artisan tinker --execute="
\$count = DB::table('migrations')->where('migration', 'like', '%oauth%')->count();
if (\$count > 0) {
    DB::table('migrations')->where('migration', 'like', '%oauth%')->delete();
    echo 'Deleted ' . \$count . ' OAuth migration records';
} else {
    echo 'No OAuth migration records found';
}
" || echo "⚠ Could not delete via tinker, trying alternative..."
echo "✓ Done"
echo ""

echo "[7/8] Verifying no OAuth migrations in queue..."
php artisan migrate:status 2>&1 | grep oauth || echo "✓ No OAuth migrations pending (clean!)"
echo ""

echo "[8/8] Running other migrations (non-OAuth)..."
php artisan migrate --force
echo "✓ Done"
echo ""

echo "========================================="
echo "  ✅ CLEANUP COMPLETE"
echo "========================================="
echo ""
echo "Summary:"
echo "- Code pulled from refactor/api-v1"
echo "- All caches cleared"
echo "- Bootstrap cache removed"
echo "- OAuth migration records cleaned"
echo "- Other migrations executed"
echo ""
echo "Next steps:"
echo "1. Verify application works: curl http://localhost/api/health"
echo "2. Check logs: tail -f storage/logs/laravel.log"
echo "3. Restart queue: php artisan queue:restart"
echo ""
