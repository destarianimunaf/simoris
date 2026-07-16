# SIMORIS — Sistem Penomoran Surat Otomatis

Aplikasi pengganti pencatatan manual di Google Sheets. SIMORIS menghasilkan
**nomor urut surat paling belakang secara otomatis** setiap kali surat baru
dibuat, sehingga tidak perlu lagi mengetik nomor secara manual dan risiko
nomor bentrok/loncat hilang.

Contoh hasil: `W.9-KP.10.02-001`, `W.9-UM.01.01-013`, dst — nomor urut
(3 digit terakhir) selalu bertambah otomatis dan **tidak bisa diketik ulang**
oleh pengguna, dikunci di sisi server (backend) supaya tetap konsisten
walau dipakai banyak orang sekaligus.

## Fitur

- Penomoran otomatis, aman dari duplikasi (row locking di database)
- Preview nomor surat sebelum disimpan
- Kode klasifikasi surat dapat dikelola sendiri (KP.10.02, UM.01.01, dst)
- Pencarian & filter berdasarkan perihal, tujuan, atau kode klasifikasi
- Tampilan tabel rapi, responsif, dan bisa diakses banyak pengguna sekaligus
- 100% open source, gratis untuk digunakan dan dihosting

## Struktur folder

```
simoris/
├── backend/     -> berkas kustom Laravel (model, controller, migration, route)
├── frontend/    -> aplikasi React (Vite) lengkap siap pakai
├── LICENSE
└── README.md
```

Folder `backend/` **bukan** instalasi Laravel yang utuh (agar repo tetap
ringan dan mudah diunggah ke GitHub) — ini adalah berkas-berkas kustom yang
Anda salin ke atas instalasi Laravel baru. Folder `frontend/` sudah lengkap
dan siap dijalankan dengan `npm install`.

---

## 1. Menyiapkan Backend (Laravel)

Butuh PHP ≥ 8.2, Composer, dan MySQL/PostgreSQL/SQLite.

```bash
# 1. Buat instalasi Laravel baru di luar folder backend/ kustom ini
composer create-project laravel/laravel simoris-backend
cd simoris-backend

# 2. Salin seluruh isi folder backend/ (dari repo ini) ke dalam folder ini,
#    timpa file yang sudah ada (routes/api.php dsb)
#    Contoh (dari root repo simoris/):
cp -r ../simoris/backend/app/Models/* app/Models/
cp -r ../simoris/backend/app/Http/Controllers/Api app/Http/Controllers/
cp -r ../simoris/backend/database/migrations/* database/migrations/
cp -r ../simoris/backend/database/seeders/* database/seeders/
cp ../simoris/backend/routes/api.php routes/api.php
cp ../simoris/backend/config/simoris.php config/simoris.php

# 3. Atur koneksi database di .env, lalu:
php artisan migrate
php artisan db:seed --class=Database\\Seeders\\KodeKlasifikasiSeeder

# 4. (opsional) ganti kode singkat instansi, default "W.9"
echo "INSTANSI_KODE=W.9" >> .env

# 5. Izinkan frontend mengakses API (CORS) — Laravel 11 ke atas sudah
#    otomatis mengizinkan /api/*. Jika masih diblokir browser, buka
#    config/cors.php lalu set 'paths' => ['api/*'] dan
#    'allowed_origins' => ['http://localhost:5173'] (alamat frontend Anda).

# 6. Jalankan server
php artisan serve
# API aktif di http://localhost:8000/api
```

> **Endpoint utama** (semua di bawah `/api`):
> `GET /surats`, `POST /surats`, `PUT /surats/{id}`, `DELETE /surats/{id}`,
> `GET /surats-preview-nomor?kode_klasifikasi_id=1`,
> `GET/POST/PUT/DELETE /kode-klasifikasis`

## 2. Menyiapkan Frontend (React)

Butuh Node.js ≥ 18.

```bash
cd frontend
cp .env.example .env
# sesuaikan VITE_API_URL jika backend tidak di localhost:8000

npm install
npm run dev
# Buka http://localhost:5173
```

---

## 3. Cara Kerja Penomoran Otomatis

1. Pengguna memilih **kode klasifikasi** (mis. `KP.10.02`) dan mengisi
   perihal, tujuan, tanggal surat.
2. Saat tombol **Terbitkan** ditekan, backend mengunci baris penghitung
   global (`counters`) di dalam transaksi database, menaikkan nilainya +1,
   lalu menyusun nomor: `{KODE_INSTANSI}-{KODE_KLASIFIKASI}-{NOMOR_URUT}`.
3. Nomor urut ini **global** (bukan per-kode klasifikasi) — persis seperti
   pola pada rekap Google Sheets sebelumnya, di mana nomor terus berjalan
   maju setiap ada surat baru apa pun jenisnya.
4. Nomor yang sudah terbit tidak bisa diketik ulang/diubah manual — hanya
   field lain (perihal, tujuan, tanggal) yang bisa disunting lewat tombol
   **Ubah**, agar riwayat penomoran tetap terpercaya.

Ingin nomor urut terpisah per kode klasifikasi (misal `KP.10.02-001`,
`UM.01.01-001` mulai dari 1 lagi)? Tinggal ganti kunci pencarian di
`SuratController::store()` dari counter tunggal menjadi counter per
`kode_klasifikasi_id`.

---

## 4. Mengunggah ke GitHub (gratis)

```bash
cd simoris
git init
git add .
git commit -m "Inisialisasi SIMORIS - sistem penomoran surat otomatis"

# Buat repository kosong dulu di github.com (tanpa README), lalu:
git branch -M main
git remote add origin https://github.com/USERNAME/simoris.git
git push -u origin main
```

Setelah itu repo bisa dibagikan/diunduh siapa saja secara gratis lewat
tombol **Code → Download ZIP** atau `git clone`.

## 5. Hosting Gratis (opsional, agar bisa diakses tanpa `npm run dev`)

| Bagian | Opsi gratis | Catatan |
|---|---|---|
| Frontend (React) | Vercel, Netlify, Cloudflare Pages | Hubungkan langsung ke repo GitHub, auto-deploy tiap push |
| Backend (Laravel) | Railway, Render (free tier) | Sediakan juga database MySQL/PostgreSQL gratis di sana |
| Database | Railway/Render MySQL, atau Supabase (PostgreSQL) | Cukup untuk skala instansi kecil-menengah |

Setelah backend online, ubah `VITE_API_URL` di pengaturan environment
variable Vercel/Netlify agar mengarah ke URL backend yang sudah live.

---

## Lisensi

MIT — bebas digunakan, dimodifikasi, dan disebarluaskan.
