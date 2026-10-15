#!/bin/sh
set -e

PORT="${PORT:-10000}"
echo "Configuring Nginx to listen on port: $PORT"
sed -i "s/LISTEN_PORT/$PORT/g" /etc/nginx/nginx.conf

# Ensure directories exist
mkdir -p /var/www/database /var/www/storage/framework/cache /var/www/storage/framework/sessions /var/www/storage/framework/views /var/www/storage/app/public/deeds/images /var/www/storage/app/public/deeds/videos /var/www/bootstrap/cache

# Ensure SQLite file exists
if [ ! -f /var/www/database/database.sqlite ]; then
    echo "Creating empty database/database.sqlite..."
    touch /var/www/database/database.sqlite
fi

# Run database migrations
echo "Running migrations..."
php artisan migrate --force

# Seed database if not yet populated
echo "Checking database seed status..."
php artisan tinker --execute="if (\App\Models\User::count() === 0) { \Artisan::call('db:seed', ['--force' => true]); echo 'Database seeded successfully.'; } else { echo 'Database already seeded, skipping.'; }"

# Link storage
echo "Linking storage..."
php artisan storage:link || true

# Cache Laravel configuration and routes for blazing production speed
echo "Caching configuration and routes..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set permissions for www-data
echo "Setting permissions..."
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache /var/www/database
chmod -R 775 /var/www/storage /var/www/bootstrap/cache /var/www/database

echo "Starting services via supervisord..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
