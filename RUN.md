# Panduan Menjalankan Aplikasi UMKMku

Aplikasi **UMKMku** terdiri dari dua bagian utama: 
1. **Backend** (Laravel - API & Database)
2. **Frontend** (Next.js - Antarmuka Pengguna)

Berikut adalah langkah-langkah untuk menjalankan aplikasi ini di komputer/server lokal Anda.

---

## 🛠️ Persiapan Awal (Prasyarat)
Pastikan komputer Anda sudah terinstal:
- **Laragon / XAMPP** (Untuk menjalankan database MySQL dan PHP)
- **Node.js & npm** (Untuk menjalankan Frontend Next.js)
- **Composer** (Package manager untuk PHP/Laravel)

---

## ⚙️ 1. Menjalankan Backend (Database & API)

Buka terminal (sangat disarankan menggunakan **Terminal bawaan Laragon**) dan ikuti langkah berikut:

1. **Masuk ke folder backend:**
   ```bash
   cd backend
   ```
2. **Install dependensi PHP (jika belum):**
   ```bash
   composer install
   ```
3. **Nyalakan Database:**
   Pastikan Anda sudah menekan tombol **Start All** (atau start MySQL) di aplikasi Laragon Anda.
4. **Persiapkan Database (Migrasi):**
   Jika ini pertama kalinya dijalankan atau jika ada pembaruan database, jalankan:
   ```bash
   php artisan migrate:fresh
   ```
5. **Jalankan Server Backend:**
   ```bash
   php artisan serve
   ```
   *Biarkan terminal ini tetap terbuka.* Server API backend kini berjalan di `http://localhost:8000`.

---

## 🎨 2. Menjalankan Frontend (Antarmuka Pengguna)

Buka **tab terminal baru** (bisa menggunakan terminal VS Code atau CMD biasa), dan ikuti langkah berikut:

1. **Masuk ke folder frontend:**
   ```bash
   cd frontend
   ```
2. **Install dependensi Node (jika belum):**
   ```bash
   npm install
   ```
3. **Jalankan Server Frontend:**
   ```bash
   npm run dev
   ```
   *Biarkan terminal ini tetap terbuka selama Anda menggunakan aplikasi.*

---

## 🚀 3. Akses Aplikasi

Setelah kedua server di atas berjalan (Backend & Frontend), buka *browser* kesayangan Anda (Chrome, Edge, dll) dan ketikkan alamat berikut:

👉 **http://localhost:3000**

- Anda akan langsung disambut oleh halaman Login/Daftar. 
- Silakan daftarkan akun baru Anda dan mulai kelola usaha dengan UMKMku!

> **Catatan:** Jangan menutup kedua terminal (backend & frontend) selama Anda masih ingin menggunakan aplikasi. Jika terminal ditutup, aplikasi akan mati.
