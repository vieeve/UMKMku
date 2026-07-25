# UMKMku - Product Requirements Document (PRD) Backend MVP

## 1. Pendahuluan

Dokumen ini merupakan turunan dari **PRD UMKMku (MVP)** yang berfokus khusus pada implementasi **Backend**. Dokumen ini menjadi acuan bagi Backend Engineer dalam membangun REST API, database, business logic, dan autentikasi yang mendukung seluruh modul frontend UMKMku.

Dokumen ini mencakup:

- Arsitektur & Teknologi Backend
- Struktur Project (Modular)
- Desain Database (ERD & Skema Tabel)
- Spesifikasi REST API per Modul
- Business Logic & Validasi
- Format Response Standar
- Autentikasi & Otorisasi
- Non-Functional Requirements
- Kebutuhan Pengujian (Testing)

---

## 2. Arsitektur & Teknologi Backend

### 2.1 Arsitektur

Backend menggunakan pola **Layered Architecture** berbasis Laravel:

```
Request → Route → Middleware → Controller → Form Request (Validation)
        → Service (Business Logic) → Repository/Eloquent Model → Database
        → Resource (Response Formatter) → Response
```

### 2.2 Teknologi

| Komponen        | Teknologi                               |
| --------------- | --------------------------------------- |
| Framework       | Laravel 12                              |
| API             | REST API (JSON)                         |
| Autentikasi     | Laravel Sanctum (Token Based)           |
| ORM             | Eloquent ORM                            |
| Database        | MySQL                                   |
| Validasi        | Form Request Validation                 |
| Testing         | PHPUnit / Pest                          |
| Dokumentasi API | Postman Collection / OpenAPI (opsional) |

### 2.3 Ketentuan Umum

- Seluruh endpoint mengikuti standar REST (resource-based URL, HTTP method sesuai aksi).
- Seluruh response menggunakan format JSON konsisten (lihat Bagian 7).
- Backend bersifat **single tenant, single user** (sesuai batasan MVP — tanpa multi user/multi cabang).
- Struktur project modular per domain (Auth, Product, Sales, Report, Setting).
- Backend harus mudah dikembangkan ke tahap production (scalable, testable).

---

## 3. Struktur Project (Modular)

```
app/
 ├── Http/
 │   ├── Controllers/
 │   │   ├── Auth/AuthController.php
 │   │   ├── DashboardController.php
 │   │   ├── ProductController.php
 │   │   ├── CategoryController.php
 │   │   ├── StockMutationController.php
 │   │   ├── SaleController.php
 │   │   ├── ReportController.php
 │   │   └── SettingController.php
 │   ├── Requests/
 │   │   ├── Product/StoreProductRequest.php
 │   │   ├── Product/UpdateProductRequest.php
 │   │   ├── Sale/StoreSaleRequest.php
 │   │   └── Setting/UpdateSettingRequest.php
 │   ├── Resources/
 │   │   ├── ProductResource.php
 │   │   ├── SaleResource.php
 │   │   ├── StockMutationResource.php
 │   │   └── DashboardResource.php
 │   └── Middleware/
 │       └── EnsureTokenIsValid.php (bawaan Sanctum)
 ├── Models/
 │   ├── User.php
 │   ├── Product.php
 │   ├── Category.php
 │   ├── Sale.php
 │   ├── SaleDetail.php
 │   ├── StockMutation.php
 │   └── Setting.php
 ├── Services/
 │   ├── ProductService.php
 │   ├── SaleService.php
 │   ├── StockService.php
 │   ├── ReportService.php
 │   └── DashboardService.php
 └── Exceptions/
     └── Handler.php (custom error format)

database/
 ├── migrations/
 └── seeders/
```

**Prinsip modular:**

- Controller hanya menangani request/response, tidak berisi business logic.
- Business logic (perhitungan stok, laba, laporan) diletakkan di Service.
- Validasi input menggunakan Form Request terpisah per aksi.
- Format response menggunakan API Resource agar konsisten.

---

## 4. Desain Database

### 4.1 Entity Relationship Diagram (Deskriptif)

```
Users (1) ────────< tidak relevan untuk MVP (single user, tanpa foreign key relasi transaksi)

Categories (1) ───< Products (N)
Products   (1) ───< SaleDetails (N)
Products   (1) ───< StockMutations (N)
Sales      (1) ───< SaleDetails (N)
Settings   (1)  (data tunggal, 1 row)
```

### 4.2 Skema Tabel

#### Tabel `users`

| Kolom                  | Tipe                 | Keterangan   |
| ---------------------- | -------------------- | ------------ |
| id                     | bigint, PK           |              |
| name                   | varchar(100)         | Nama pemilik |
| email                  | varchar(100), unique |              |
| password               | varchar              | hashed       |
| created_at, updated_at | timestamp            |              |

#### Tabel `categories`

| Kolom                  | Tipe                 | Keterangan |
| ---------------------- | -------------------- | ---------- |
| id                     | bigint, PK           |            |
| name                   | varchar(100), unique |            |
| created_at, updated_at | timestamp            |            |

#### Tabel `products`

| Kolom                  | Tipe                                    | Keterangan                                                           |
| ---------------------- | --------------------------------------- | -------------------------------------------------------------------- |
| id                     | bigint, PK                              |                                                                      |
| category_id            | bigint, FK → categories.id, nullable    |                                                                      |
| name                   | varchar(150)                            |                                                                      |
| sku                    | varchar(50), unique                     |                                                                      |
| cost_price             | decimal(15,2)                           | Harga Modal                                                          |
| selling_price          | decimal(15,2)                           | Harga Jual                                                           |
| current_stock          | integer, default 0                      | Stok saat ini                                                        |
| min_stock              | integer, default 0                      | Minimum Stok                                                         |
| status                 | enum('tersedia','stok_menipis','habis') | dihitung otomatis (kolom tambahan di luar ERD dasar — lihat catatan) |
| deleted_at             | timestamp, nullable                     | Laravel SoftDeletes (kolom tambahan di luar ERD dasar)               |
| created_at, updated_at | timestamp                               |                                                                      |

> **Catatan penyelarasan dengan ERD:** kolom `status` dan `deleted_at` tidak tergambar eksplisit di ERD dasar, namun tetap direkomendasikan karena dibutuhkan langsung oleh Business Rules (penandaan "Stok Menipis" & larangan hapus permanen produk yang punya riwayat transaksi). Kolom `is_deleted` boolean pada draf sebelumnya dihapus, cukup pakai `deleted_at` (standar Laravel SoftDeletes) agar tidak ada dua mekanisme redundan.

#### Tabel `sales`

| Kolom                  | Tipe                | Keterangan                      |
| ---------------------- | ------------------- | ------------------------------- |
| id                     | bigint, PK          |                                 |
| invoice_number         | varchar(30), unique | Nomor transaksi (auto-generate) |
| total_amount           | decimal(15,2)       | Total penjualan                 |
| total_cost             | decimal(15,2)       | Total modal (untuk hitung laba) |
| profit                 | decimal(15,2)       | total_amount - total_cost       |
| status                 | enum('selesai')     | default 'selesai' untuk MVP     |
| created_at, updated_at | timestamp           | dipakai sebagai waktu transaksi |

#### Tabel `sale_details`

| Kolom                  | Tipe                     | Keterangan                            |
| ---------------------- | ------------------------ | ------------------------------------- |
| id                     | bigint, PK               |                                       |
| sale_id                | bigint, FK → sales.id    |                                       |
| product_id             | bigint, FK → products.id |                                       |
| product_name           | varchar(150)             | snapshot nama produk saat transaksi   |
| quantity               | integer                  |                                       |
| selling_price          | decimal(15,2)            | harga jual saat transaksi (snapshot)  |
| cost_price             | decimal(15,2)            | harga modal saat transaksi (snapshot) |
| subtotal               | decimal(15,2)            | quantity \* selling_price             |
| created_at, updated_at | timestamp                |                                       |

#### Tabel `stock_mutations`

| Kolom                  | Tipe                                 | Keterangan                                                |
| ---------------------- | ------------------------------------ | --------------------------------------------------------- |
| id                     | bigint, PK                           |                                                           |
| product_id             | bigint, FK → products.id             |                                                           |
| type                   | enum('masuk','keluar','penyesuaian') | Jenis mutasi                                              |
| quantity               | integer                              | jumlah perubahan                                          |
| note                   | varchar(255), nullable               | Catatan (mis. "Penjualan #INV-001", "Tambah stok manual") |
| created_at, updated_at | timestamp                            | Waktu mutasi                                              |

> **Catatan enum `type`:** disepakati tetap 3 nilai dalam Bahasa Indonesia — `masuk`, `keluar`, `penyesuaian` — bukan `in`/`out` seperti di ERD awal, karena aplikasi butuh membedakan penyesuaian stok manual (mis. barang rusak, koreksi stok fisik) dari stok masuk/keluar normal.

#### Tabel `settings`

| Kolom                  | Tipe                   | Keterangan     |
| ---------------------- | ---------------------- | -------------- |
| id                     | bigint, PK             | (hanya 1 row)  |
| store_name             | varchar(150)           | Nama Usaha     |
| owner_name             | varchar(150)           | Nama Pemilik   |
| phone_number           | varchar(20)            | Nomor Telepon  |
| address                | text                   | Alamat         |
| logo_path              | varchar(255), nullable | path file logo |
| created_at, updated_at | timestamp              |                |

---

## 5. Autentikasi & Otorisasi

Menggunakan **Laravel Sanctum** dengan token based authentication (Personal Access Token).

| Endpoint      | Method | Deskripsi                          |
| ------------- | ------ | ---------------------------------- |
| `/api/login`  | POST   | Login, mengembalikan token         |
| `/api/logout` | POST   | Menghapus token aktif (butuh auth) |
| `/api/me`     | GET    | Mengambil data profil user login   |

**Aturan:**

- Seluruh endpoint (kecuali `/api/login`) wajib menyertakan header `Authorization: Bearer {token}`.
- Middleware `auth:sanctum` diterapkan pada seluruh route group selain login.
- Jika token tidak valid/kadaluarsa → response `401 Unauthorized`.

---

## 6. Spesifikasi REST API per Modul

Base URL: `/api/v1`

### 6.1 Auth

| Method | Endpoint  | Deskripsi                     |
| ------ | --------- | ----------------------------- |
| POST   | `/login`  | Login dengan email & password |
| POST   | `/logout` | Logout (revoke token)         |
| GET    | `/me`     | Data user yang sedang login   |

### 6.2 Dashboard

| Method | Endpoint                                              | Deskripsi                                                                                                       |
| ------ | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| GET    | `/dashboard/summary`                                  | Total penjualan hari ini, laba hari ini, jumlah produk, produk hampir habis (+ perbandingan periode sebelumnya) |
| GET    | `/dashboard/chart?filter=hari_ini\|7_hari\|bulan_ini` | Data grafik pendapatan vs pengeluaran                                                                           |
| GET    | `/dashboard/recent-transactions`                      | Daftar transaksi terbaru (jam, no. transaksi, total, status)                                                    |
| GET    | `/dashboard/low-stock`                                | Daftar produk dengan stok di bawah minimum                                                                      |

### 6.3 Kategori

| Method | Endpoint           | Deskripsi       |
| ------ | ------------------ | --------------- |
| GET    | `/categories`      | Daftar kategori |
| POST   | `/categories`      | Tambah kategori |
| PUT    | `/categories/{id}` | Ubah kategori   |
| DELETE | `/categories/{id}` | Hapus kategori  |

### 6.4 Produk & Stok

| Method | Endpoint                                                     | Deskripsi                                                                                         |
| ------ | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| GET    | `/products?search=&category=&status=&view=table\|card&page=` | Daftar produk (search, filter kategori, filter status, pagination)                                |
| GET    | `/products/{id}`                                             | Detail produk                                                                                     |
| POST   | `/products`                                                  | Tambah produk baru (termasuk stok awal → otomatis membuat 1 record stock_mutations tipe "masuk")  |
| PUT    | `/products/{id}`                                             | Edit produk (termasuk penambahan/penyesuaian stok → otomatis membuat record stock_mutations)      |
| DELETE | `/products/{id}`                                             | Hapus produk (soft delete; ditolak jika produk memiliki riwayat transaksi — lihat Business Rules) |
| GET    | `/stock-mutations?product_id=&type=&date_from=&date_to=`     | Riwayat mutasi stok                                                                               |

### 6.5 Penjualan

| Method | Endpoint                                    | Deskripsi                                                                     |
| ------ | ------------------------------------------- | ----------------------------------------------------------------------------- |
| GET    | `/sales/available-products?search=&filter=` | Daftar produk yang dapat dijual (stok > 0) untuk kolom kiri halaman Penjualan |
| POST   | `/sales`                                    | Membuat transaksi penjualan baru (lihat detail proses di 7.2)                 |
| GET    | `/sales`                                    | Daftar riwayat transaksi penjualan                                            |
| GET    | `/sales/{id}`                               | Detail transaksi (termasuk detail item)                                       |

### 6.6 Laporan

| Method | Endpoint                                   | Deskripsi                                                            |
| ------ | ------------------------------------------ | -------------------------------------------------------------------- |
| GET    | `/reports/sales?date_from=&date_to=`       | Total penjualan, jumlah transaksi, tren penjualan, riwayat transaksi |
| GET    | `/reports/profit-loss?date_from=&date_to=` | Pendapatan, modal, laba bersih, grafik pendapatan vs pengeluaran     |
| GET    | `/reports/sales/export`                    | Export laporan penjualan ke PDF                                      |
| GET    | `/reports/profit-loss/export`              | Export laporan laba rugi ke PDF                                      |

### 6.7 Pengaturan

| Method | Endpoint    | Deskripsi                                     |
| ------ | ----------- | --------------------------------------------- |
| GET    | `/settings` | Mengambil data usaha                          |
| PUT    | `/settings` | Memperbarui data usaha (termasuk upload logo) |

---

## 7. Business Logic (Detail Implementasi)

### 7.1 Manajemen Produk & Stok

- Saat produk dibuat dengan `stock_awal > 0`, sistem otomatis membuat 1 entri `stock_mutations` dengan `type = 'masuk'` dan `note = 'Stok awal produk'`.
- Saat produk diedit dan terjadi penambahan/pengurangan stok manual, sistem mencatat mutasi dengan `type = 'masuk'` atau `'penyesuaian'` sesuai konteks.
- Field `status` produk dihitung otomatis setiap kali stok berubah:
  - `current_stock = 0` → `habis`
  - `0 < current_stock <= min_stock` → `stok_menipis`
  - `current_stock > min_stock` → `tersedia`
- Validasi: `selling_price >= cost_price` (Harga jual tidak boleh lebih kecil dari harga modal).
- Validasi: `sku` harus unik di seluruh produk aktif.
- Penghapusan produk:
  - Jika produk **tidak memiliki riwayat transaksi** (`sale_details`) → hapus permanen (hard delete) diperbolehkan, atau soft delete sesuai kebijakan implementasi.
  - Jika produk **memiliki riwayat transaksi** → tolak hard delete, gunakan soft delete (`deleted_at` diisi, produk disembunyikan dari katalog aktif namun data historis tetap utuh untuk laporan).

### 7.2 Proses Transaksi Penjualan (`POST /sales`)

Dijalankan dalam **satu database transaction** agar konsisten:

1. Validasi: setiap item harus punya `product_id` dan `quantity > 0`.
2. Validasi: transaksi minimal memiliki 1 produk.
3. Untuk setiap item, cek stok produk:
   - Jika `current_stock = 0` atau `quantity > current_stock` → tolak transaksi dengan error, kembalikan pesan produk mana yang stoknya tidak cukup.
4. Hitung `subtotal`, `total_amount`, `total_cost`, dan `profit`.
5. Generate `invoice_number` unik (format contoh: `INV-YYYYMMDD-XXXX`).
6. Simpan record `sales` dan `sale_details` (dengan snapshot nama produk, harga jual, dan harga modal saat transaksi — agar histori tidak berubah jika harga produk diubah di kemudian hari).
7. Kurangi `current_stock` pada masing-masing produk sejumlah `quantity`.
8. Buat record `stock_mutations` dengan `type = 'keluar'` dan `note = 'Penjualan #{invoice_number}'` untuk setiap produk yang terjual.
9. Update ulang field `status` produk berdasarkan stok terbaru.
10. Commit transaction; jika ada kegagalan di salah satu langkah, rollback seluruh proses.

### 7.3 Dashboard

- **Total Penjualan Hari Ini**: SUM(`sales.total_amount`) WHERE `created_at` = hari ini.
- **Laba Hari Ini**: SUM(`sales.profit`) WHERE `created_at` = hari ini.
- **Jumlah Produk**: COUNT(`products`) aktif (belum dihapus).
- **Produk Hampir Habis**: COUNT(`products`) WHERE `status IN ('stok_menipis','habis')`.
- Setiap kartu ringkasan juga menghitung perbandingan (%) terhadap periode sebelumnya (misal: hari ini vs kemarin).
- Grafik "Pendapatan vs Pengeluaran" mengagregasi `sales.total_amount` (pendapatan) dan `sales.total_cost` (pengeluaran/modal) berdasarkan filter periode (`hari_ini`, `7_hari_terakhir`, `bulan_ini`).

### 7.4 Laporan

- **Laporan Penjualan**: agregasi `sales` pada rentang tanggal yang dipilih — total penjualan, jumlah transaksi, tren harian, serta daftar transaksi.
- **Laporan Laba Rugi**:
  - Pendapatan = SUM(`sales.total_amount`)
  - Modal = SUM(`sales.total_cost`)
  - Laba Bersih = Pendapatan - Modal
- Export PDF menghasilkan file PDF dari data laporan yang sedang ditampilkan (sesuai filter tanggal aktif).

### 7.5 Pengaturan

- Data usaha (`settings`) hanya memiliki 1 baris data (single-row table); endpoint `PUT /settings` selalu meng-update baris tersebut (upsert jika belum ada).
- Upload logo divalidasi tipe file gambar (jpg, png) dan ukuran maksimum (misal 2MB), disimpan di storage lokal (`storage/app/public/logo`).

---

## 8. Format Response Standar

### 8.1 Response Sukses

```json
{
  "success": true,
  "message": "Produk berhasil ditambahkan",
  "data": {}
}
```

### 8.2 Response Gagal (Validasi)

```json
{
  "success": false,
  "message": "Data yang dikirim tidak valid",
  "errors": {
    "sku": ["SKU sudah digunakan"],
    "selling_price": ["Harga jual tidak boleh lebih kecil dari harga modal"]
  }
}
```

### 8.3 Response Gagal (Business Rule / Umum)

```json
{
  "success": false,
  "message": "Stok produk 'Kopi Sachet' tidak mencukupi"
}
```

### 8.4 HTTP Status Code

| Kode | Penggunaan                              |
| ---- | --------------------------------------- |
| 200  | Sukses (GET, PUT)                       |
| 201  | Sukses membuat data baru (POST)         |
| 400  | Bad Request / pelanggaran business rule |
| 401  | Tidak terautentikasi                    |
| 403  | Tidak memiliki akses                    |
| 404  | Data tidak ditemukan                    |
| 422  | Validasi input gagal                    |
| 500  | Kesalahan server                        |

---

## 9. Non-Functional Requirements

- **Keamanan**: password di-hash (bcrypt), seluruh input tervalidasi, seluruh endpoint (kecuali login) memerlukan token Sanctum.
- **Konsistensi data**: proses transaksi penjualan & mutasi stok wajib menggunakan DB transaction (atomic).
- **Performa**: endpoint list (produk, transaksi, mutasi stok) menggunakan pagination.
- **Auditability**: seluruh perubahan stok wajib tercatat di `stock_mutations` — tidak ada perubahan stok tanpa jejak.
- **Maintainability**: struktur modular (Controller–Service–Repository) agar mudah dikembangkan ke fitur pasca-MVP (multi user, multi cabang, dsb).
- **Skalabilitas**: desain skema database mempertimbangkan penambahan kolom/tabel di masa depan tanpa breaking changes besar (misal `branch_id` untuk multi cabang nantinya).

---

## 10. Kebutuhan Pengujian (Testing)

Pengujian backend minimal mencakup:

- **Unit Test**: perhitungan status stok, perhitungan laba, perhitungan subtotal transaksi.
- **Feature Test**:
  - Login gagal/berhasil.
  - Tambah produk (SKU duplikat harus gagal, harga jual < harga modal harus gagal).
  - Transaksi penjualan (stok tidak cukup harus gagal, stok berkurang otomatis setelah transaksi berhasil).
  - Mutasi stok tercatat setiap kali stok berubah (tambah produk, edit stok, transaksi penjualan).
  - Penghapusan produk yang memiliki riwayat transaksi harus ditolak (hard delete), namun soft delete tetap berhasil.
  - Dashboard & Laporan mengembalikan data yang konsisten dengan data transaksi yang tersimpan.

---

## 11. Ringkasan Endpoint (Quick Reference)

| Modul       | Endpoint Utama                                                                                                     |
| ----------- | ------------------------------------------------------------------------------------------------------------------ |
| Auth        | `POST /login`, `POST /logout`, `GET /me`                                                                           |
| Dashboard   | `GET /dashboard/summary`, `GET /dashboard/chart`, `GET /dashboard/recent-transactions`, `GET /dashboard/low-stock` |
| Kategori    | `GET/POST /categories`, `PUT/DELETE /categories/{id}`                                                              |
| Produk      | `GET/POST /products`, `GET/PUT/DELETE /products/{id}`                                                              |
| Mutasi Stok | `GET /stock-mutations`                                                                                             |
| Penjualan   | `GET /sales/available-products`, `GET/POST /sales`, `GET /sales/{id}`                                              |
| Laporan     | `GET /reports/sales`, `GET /reports/profit-loss`, `GET /reports/sales/export`, `GET /reports/profit-loss/export`   |
| Pengaturan  | `GET/PUT /settings`                                                                                                |

---

Dokumen ini menjadi acuan utama bagi Backend Engineer dalam implementasi REST API, database, dan business logic UMKMku versi MVP, serta menjadi dasar penyusunan dokumentasi teknis (SDLC) dan pengujian sistem pada tahap berikutnya.
