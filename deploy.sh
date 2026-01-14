#!/bin/bash

# BSKM Auto Deploy Script
# Simpan di: /home/wargacom/deploy-bskm.sh
# Jalankan: bash /home/wargacom/deploy-bskm.sh

PROJECT_PATH="/home/wargacom/bskm.warga007.com"
BRANCH="refactor/api-v1"

echo "🚀 Starting BSKM Deploy..."
echo "📁 Project: $PROJECT_PATH"
echo "🔀 Branch: $BRANCH"
echo ""

cd $PROJECT_PATH || exit 1

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin $BRANCH

# Install composer
echo "📦 Installing composer dependencies..."
composer install --no-dev --optimize-autoloader

# Install npm
echo "📦 Installing npm dependencies..."
npm ci

# Build Vue SPA
echo "🔨 Building Vue SPA..."
npm run build

# Clear Laravel cache
echo "🧹 Clearing cache..."
php artisan cache:clear
php artisan config:clear
php artisan view:clear

# Set permissions
echo "🔐 Setting permissions..."
chmod -R 755 storage bootstrap/cache

# Fix OAuth key permissions (must be 600 or 660)
echo "🔑 Fixing OAuth key permissions..."
if [ -f storage/oauth-private.key ]; then
    chmod 600 storage/oauth-private.key
fi
if [ -f storage/oauth-public.key ]; then
    chmod 600 storage/oauth-public.key
fi

# Set ownership
chown -R www-data:www-data storage bootstrap/cache

echo ""
echo "✅ Deploy Complete!"
echo "🌐 Visit: https://bskm.warga007.com"
