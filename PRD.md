# UMKMku - Product Requirements Document (PRD) MVP

# Peran

Bertindaklah sebagai **Product Manager**, **System Analyst**, **UI/UX Designer**, **Frontend Engineer**, dan **Backend Engineer**.

Bangun aplikasi web **UMKMku**, sebuah sistem yang membantu pelaku UMKM mengelola operasional usaha sehari-hari mulai dari mengelola produk, memantau stok barang, mencatat transaksi penjualan, hingga melihat laporan usaha secara sederhana.

Dokumen ini menjadi acuan utama dalam pengembangan sistem, baik pada sisi frontend, backend, database, REST API, maupun dokumentasi SDLC.

Gunakan bahasa Indonesia pada seluruh antarmuka dan dokumentasi.

Gunakan dashboard referensi yang saya lampirkan sebagai inspirasi visual tanpa menyalin desain secara langsung.

---

# Tujuan Pengembangan MVP

Dokumen ini digunakan sebagai acuan pengembangan aplikasi UMKMku versi **Minimum Viable Product (MVP)**.

PRD ini menjadi dasar untuk:

- Pengembangan Frontend
- Pengembangan Backend
- Perancangan Database
- Perancangan REST API
- Penyusunan Dokumentasi SDLC
- Pengujian Sistem

---

# Arsitektur Sistem

Aplikasi menggunakan arsitektur **Client–Server**.

Frontend bertugas menampilkan antarmuka pengguna dan berkomunikasi dengan backend melalui REST API. Pada environment production, Frontend di-deploy menggunakan **Vercel**.

Backend bertugas menangani business logic, validasi data, autentikasi, serta komunikasi dengan database. Pada environment production, Backend di-deploy menggunakan **Render** (via Docker).

Database digunakan sebagai penyimpanan utama seluruh data aplikasi. Pada environment production, Database di-hosting menggunakan layanan **Aiven** (MySQL dengan SSL).

---

# Teknologi

## Frontend

- Next.js (App Router)
- React
- Tailwind CSS
- shadcn/ui
- Lucide React
- Recharts
- Framer Motion
- Axios (HTTP Client)

## Backend

- Laravel 12
- REST API
- Laravel Sanctum
- Eloquent ORM

## Database

- MySQL dengan Laragon (Untuk Local Development)
- Aiven MySQL dengan SSL (Untuk Production)

## Deployment (Production)

- **Frontend:** Vercel
- **Backend:** Render (Dockerized Laravel)
- **Database:** Aiven (MySQL)

Ketentuan:

- Gunakan reusable component.
- Struktur project harus modular.
- Backend menggunakan REST API.
- Mudah dikembangkan menjadi aplikasi production.

---

# Konsep Desain

Gunakan gaya desain:

- Modern Dashboard
- Clean
- Minimalis
- Banyak White Space
- Soft Shadow
- Rounded Corner 16px
- Responsive (Desktop First)
- Font Inter

## Design System

Primary

#4F46E5

Success

#22C55E

Warning

#F59E0B

Danger

#EF4444

Background

#F8FAFC

Card

White

---

# Target Pengguna

Aplikasi ditujukan untuk:

- Pemilik Warung
- Pemilik Toko Kelontong
- Pemilik Toko Sembako
- Pemilik Usaha Kuliner Rumahan
- Pedagang Pasar

Karakteristik pengguna:

- Tidak terbiasa menggunakan software bisnis.
- Membutuhkan proses pencatatan yang sederhana.
- Menginginkan informasi usaha secara cepat.
- Mengutamakan kemudahan dibanding banyak fitur.

---

# Tujuan Sistem

UMKMku membantu pengguna untuk:

- Mengelola data produk.
- Mengelola stok barang.
- Mencatat transaksi penjualan.
- Melihat laporan penjualan.
- Melihat laporan laba-rugi.
- Mengetahui produk yang stoknya mulai menipis.

---

# Ruang Lingkup MVP

Versi MVP mencakup modul berikut:

- Dashboard
- Produk & Stok
- Penjualan
- Laporan
- Pengaturan
- Login

Seluruh modul diimplementasikan menggunakan frontend, backend, database, dan REST API.

---

# Batasan MVP

Versi MVP **tidak mencakup**:

- Multi User
- Multi Cabang
- Supplier
- Pembelian Barang
- Manajemen Pelanggan
- Hutang Piutang
- Diskon
- Pajak
- Retur
- Barcode Scanner
- QRIS
- Payment Gateway
- Integrasi Marketplace
- Integrasi Printer
- Sinkronisasi Cloud
- Import / Export Excel

Fitur-fitur tersebut menjadi ruang lingkup pengembangan setelah MVP.

---

# Struktur Menu

Sidebar terdiri dari:

## Menu Utama

🏠 Dashboard

📦 Produk & Stok

💰 Penjualan

📈 Laporan

## Sistem

⚙ Pengaturan

🚪 Keluar

Sidebar dapat di-collapse.

---

# Layout

Layout terdiri dari:

- Sidebar
- Top Navigation
- Content Area

Top Navigation menampilkan:

- Profil Usaha
- Nama Pemilik

Informasi stok ditampilkan melalui panel **Perhatian Stok** pada Dashboard.

---

# Dashboard

Dashboard merupakan halaman utama yang menampilkan ringkasan kondisi usaha.

## Ringkasan

- Total Penjualan Hari Ini
- Laba Hari Ini
- Jumlah Produk
- Produk Hampir Habis

Setiap kartu memiliki:

- Icon
- Nilai
- Informasi perubahan dibanding periode sebelumnya

## Grafik

Menampilkan grafik:

Pendapatan vs Pengeluaran

Filter:

- Hari Ini
- 7 Hari Terakhir
- Bulan Ini

## Transaksi Terbaru

Menampilkan:

- Jam
- Nomor Transaksi
- Total
- Status

## Perhatian Stok

Menampilkan daftar produk dengan stok di bawah batas minimum.

---

# Produk & Stok

Halaman terpadu untuk mengelola produk dan stok.

Tab:

1. Katalog Produk
2. Riwayat Mutasi Stok

## Katalog Produk

Toolbar:

- Search
- Filter Kategori
- Tambah Produk

Mode Tampilan:

- Table View
- Card View

Default:

Table View

Data Produk:

- Nama Produk
- SKU
- Kategori
- Harga Modal
- Harga Jual
- Stok Saat Ini
- Minimum Stok
- Status

Status:

- Tersedia
- Stok Menipis
- Habis

Aksi:

- Edit
- Hapus

Penambahan stok dilakukan melalui halaman Edit Produk.

## Riwayat Mutasi Stok

Menampilkan:

- Waktu
- Nama Produk
- Jenis Mutasi
- Jumlah
- Catatan

## Modal Tambah Produk

Field:

- Nama Produk
- SKU
- Kategori
- Harga Modal
- Harga Jual
- Stok Awal
- Minimum Stok

---

# Penjualan

Halaman untuk mencatat transaksi penjualan.

Layout dua kolom.

## Kolom Kiri

Daftar Produk

- Search
- Filter
- Card Produk

Card menampilkan:

- Nama Produk
- Harga
- Sisa Stok

Produk dengan stok habis tidak dapat dipilih.

## Kolom Kanan

Keranjang Penjualan

Berisi:

- Daftar Produk
- Qty
- Harga
- Subtotal
- Total Penjualan

Button:

**Selesaikan Penjualan**

Saat transaksi berhasil:

- Data transaksi disimpan.
- Stok otomatis berkurang.
- Riwayat mutasi stok bertambah.
- Dashboard diperbarui.
- Laporan diperbarui.

---

# Laporan

Memiliki dua tab.

## Penjualan

- Total Penjualan
- Jumlah Transaksi
- Grafik Tren Penjualan
- Riwayat Transaksi

## Laba Rugi

- Pendapatan
- Modal
- Laba Bersih

Grafik:

Pendapatan vs Pengeluaran

Button:

Export PDF

---

# Pengaturan

Data usaha:

- Nama Usaha
- Nama Pemilik
- Nomor Telepon
- Alamat
- Logo

Button:

Simpan Perubahan

---

# Kebutuhan Backend

Backend harus menyediakan layanan:

- Login
- Dashboard
- Produk
- Mutasi Stok
- Penjualan
- Laporan
- Pengaturan

Seluruh layanan diakses melalui REST API.

---

# Kebutuhan Database

Database minimal memiliki entitas:

- Users
- Products
- Categories
- Sales
- Sale Details
- Stock Mutations
- Settings

---

# Business Rules

- SKU harus unik.
- Harga jual tidak boleh lebih kecil dari harga modal.
- Produk dengan stok 0 tidak dapat dijual.
- Setiap transaksi minimal memiliki satu produk.
- Setiap transaksi otomatis mengurangi stok.
- Setiap perubahan stok dicatat sebagai mutasi stok.
- Dashboard mengambil data dari transaksi dan data produk terbaru.
- Laporan dihitung berdasarkan transaksi yang tersimpan.
- Produk dengan stok di bawah minimum ditandai sebagai "Stok Menipis".
- Laba dihitung dari selisih harga jual dan harga modal.
- Produk yang masih memiliki riwayat transaksi tidak dapat dihapus secara permanen.

---

# UX Rules

- Seluruh aksi utama maksimal dua klik.
- Gunakan bahasa Indonesia yang sederhana.
- Hindari istilah teknis.
- Berikan umpan balik yang jelas setelah setiap aksi.

Gunakan:

- Empty State
- Loading Skeleton
- Confirmation Modal
- Success Toast
- Hover Effect

---

# Alur Utama Sistem

1. Pengguna login ke sistem.
2. Pengguna menambahkan produk beserta stok awal.
3. Produk tersimpan pada katalog.
4. Pengguna mencatat transaksi penjualan.
5. Sistem menyimpan transaksi.
6. Sistem mengurangi stok secara otomatis.
7. Sistem mencatat mutasi stok.
8. Dashboard diperbarui.
9. Laporan Penjualan dan Laba-Rugi diperbarui secara otomatis.

---

# Hasil yang Diharapkan

Bangun aplikasi web UMKMku berbasis MVP yang terdiri dari frontend dan backend sesuai ruang lingkup yang telah ditentukan.

Frontend harus mengikuti desain antarmuka yang telah divalidasi.

Backend harus menyediakan business logic, database, autentikasi, dan REST API yang mendukung seluruh fitur MVP.

Dokumen ini menjadi acuan utama dalam penyusunan dokumentasi SDLC, implementasi frontend, implementasi backend, pengujian sistem, dan pengembangan aplikasi pada tahap berikutnya.
