# UMKMku

UMKMku adalah aplikasi kasir (Point of Sales) dan pencatatan stok sederhana yang dibuat khusus untuk pemilik usaha kecil atau warung. Aplikasi ini dirancang agar gampang digunakan oleh satu orang yang merangkap sebagai kasir sekaligus pengelola stok, tanpa perlu pengaturan rumit seperti di aplikasi skala besar.

## Fitur Utama

- **Kasir Penjualan:** Sistem keranjang belanja yang cepat untuk melayani pembeli.
- **Katalog & Stok Barang:** Catat barang dagangan, harga modal, harga jual, dan pantau ketersediaan stok.
- **Peringatan Otomatis:** Sistem akan memberitahu kamu jika ada barang yang stoknya mulai menipis atau sudah habis.
- **Laporan Transaksi:** Pantau riwayat penjualan beserta nomor nota berurutan (misal: TRX-00001).
- **Dashboard Harian:** Ringkasan pendapatan kotor dan keuntungan bersih harian dalam satu layar.

## Teknologi yang Dipakai

Aplikasi ini dibangun menggunakan arsitektur modern yang memisahkan bagian depan dan belakang, tapi tetap disimpan dalam satu folder (Monorepo) supaya lebih rapi.

- **Frontend:** Next.js (React), TypeScript, dan Tailwind CSS.
- **Backend:** Laravel 11 dan MySQL (Database).

## Cara Menjalankan di Komputer Lokal

Pastikan komputer kamu sudah ter-install Node.js, PHP, Composer, dan aplikasi database seperti XAMPP atau Laragon.

### 1. Setup Backend
1. Masuk ke folder `backend` lewat terminal.
2. Gandakan file `.env.example` dan ubah namanya menjadi `.env`.
3. Buka file `.env` dan atur bagian database (DB_DATABASE, DB_USERNAME, DB_PASSWORD) sesuai dengan database lokal kamu.
4. Jalankan perintah ini berurutan:
   - `composer install`
   - `php artisan key:generate`
   - `php artisan migrate`
   - `php artisan serve` (atau jalankan langsung lewat Laragon/XAMPP).

### 2. Setup Frontend
1. Buka terminal baru dan masuk ke folder `frontend`.
2. Jalankan `npm install` untuk mengunduh semua dependency.
3. Jalankan `npm run dev` untuk menyalakan server lokal frontend.

Aplikasi kasir siap diakses melalui browser di alamat `http://localhost:3000`.
