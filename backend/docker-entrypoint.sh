#!/bin/bash
set -e

# Berikan info ke console
echo "Memulai docker-entrypoint.sh..."

# Jalankan cache config dan route untuk production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Jalankan migrasi database (memaksa force karena mode production)
echo "Menjalankan migrasi database..."
php artisan migrate --force

# Menghidupkan Apache di background
echo "Menghidupkan Apache..."
apache2-foreground
