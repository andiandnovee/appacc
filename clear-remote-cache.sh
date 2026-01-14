#!/bin/bash
echo "Clearing all caches..."
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan route:clear
php artisan event:clear
php artisan optimize:clear
echo "Caches cleared!"
