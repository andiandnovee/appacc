#!/bin/bash
#
# Clear all Laravel caches
# Usage: ./clear-cache.sh
#

cd "$(dirname "$0")"

echo "🧹 Clearing all Laravel caches..."

php artisan config:clear
php artisan route:clear
php artisan cache:clear
php artisan view:clear
php artisan event:clear
php artisan optimize:clear

echo ""
echo "✅ All caches cleared!"
echo ""
echo "📝 Note: If you updated Vue/JS files, run: npm run build"
