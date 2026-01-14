#!/bin/bash

echo "========================================="
echo "  OAUTH MIGRATION DIAGNOSTIC REPORT"
echo "========================================="
echo ""

cd /var/www/html/bskmAPI || exit 1

echo "[1] OAuth migration files in codebase:"
echo "---"
find database/migrations -name "*oauth*" -type f 2>/dev/null | wc -l
echo "Files found (should be 0)"
find database/migrations -name "*oauth*" -type f 2>/dev/null
echo ""

echo "[2] OAuth migration records in database:"
echo "---"
php artisan tinker --execute="
\$records = DB::table('migrations')->where('migration', 'like', '%oauth%')->get();
echo 'Total records: ' . \$records->count() . \"\n\";
foreach (\$records as \$r) {
    echo '  - ' . \$r->migration . \" (batch: \" . \$r->batch . \", migrated: \" . \$r->batch_date . \")\n\";
}
" 2>/dev/null || echo "Could not query database"
echo ""

echo "[3] OAuth tables that exist in database:"
echo "---"
php artisan tinker --execute="
\$tables = ['oauth_auth_codes', 'oauth_access_tokens', 'oauth_refresh_tokens', 'oauth_clients', 'oauth_device_codes'];
foreach (\$tables as \$table) {
    if (Schema::hasTable(\$table)) {
        echo '✓ ' . \$table . \" exists\n\";
    } else {
        echo '✗ ' . \$table . \" MISSING\n\";
    }
}
" 2>/dev/null || echo "Could not check tables"
echo ""

echo "[4] Migration status (showing oauth rows):"
echo "---"
php artisan migrate:status | grep -i oauth || echo "No oauth migrations in status (good!)"
echo ""

echo "========================================="
echo "✅ Diagnostic complete"
echo "========================================="
echo ""
echo "If you see:"
echo "  - 0 files in [1]  → Code is clean ✓"
echo "  - 0 records in [2] → Database is clean ✓"  
echo "  - All ✓ in [3]    → Tables exist ✓"
echo "  - Empty in [4]    → No pending migrations ✓"
echo ""
echo "Then OAuth setup is OK. You can proceed with:"
echo "  bash full-cleanup.sh"
echo ""
