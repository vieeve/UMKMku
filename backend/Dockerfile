FROM php:8.4-apache

# Menginstal dependensi sistem yang dibutuhkan oleh PHP extensions
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    mariadb-client

# Membersihkan cache apt
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Menginstal ekstensi PHP
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Mengaktifkan Apache mod_rewrite (dibutuhkan oleh Laravel)
RUN a2enmod rewrite

# Mengubah konfigurasi DocumentRoot Apache agar mengarah ke folder public Laravel
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Menginstal Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Menetapkan working directory
WORKDIR /var/www/html

# Menyalin seluruh kode backend (termasuk .env dan ca.pem) ke dalam container
COPY . .

# Menginstal dependensi PHP menggunakan composer
RUN composer install --no-dev --optimize-autoloader

# Menetapkan hak akses yang benar untuk folder penyimpanan Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Menyalin script entrypoint dan menjadikannya executable
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Menjalankan entrypoint (akan menjalankan migrate lalu menghidupkan Apache)
ENTRYPOINT ["docker-entrypoint.sh"]
