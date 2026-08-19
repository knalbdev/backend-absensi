# Source of Truth (SOT) — Sistem Absensi Sekolah

> **Dokumen ini adalah acuan utama tim Frontend (FE) dan Backend (BE).**
> Jika kode dan dokumen ini berbeda, **dokumen ini yang menjadi rujukan** sampai perubahannya disepakati bersama.
> Setiap perubahan struktur data atau endpoint **wajib diubah di file ini dulu**, baru di kode.

| Item | Keterangan |
|---|---|
| Versi | v1.0 |
| Tanggal | 19 Agustus 2026 |
| Status | Aktif |
| Format data | JSON (`application/json`) |
| Ditujukan kepada | Tim Frontend & Tim Backend |

---

## Daftar Isi

- [1. Struktur Database](#1-struktur-database)
  - [1.1 Ringkasan Tabel](#11-ringkasan-tabel)
  - [1.2 Peta Relasi](#12-peta-relasi)
  - [1.3 Detail Kolom](#13-detail-kolom)
- [2. API Contract](#2-api-contract)
  - [2.1 Daftar Endpoint](#21-daftar-endpoint)
  - [2.2 Pola Respons GET](#22-pola-respons-get)
  - [2.3 POST /api/absen](#23-post-apiabsen)
- [3. Konvensi Penamaan](#3-konvensi-penamaan)
- [4. Aturan Kerja Tim](#4-aturan-kerja-tim)
- [5. Riwayat Revisi](#5-riwayat-revisi)

---

## 1. Struktur Database

Sistem menggunakan **8 tabel utama** yang saling berelasi.

### 1.1 Ringkasan Tabel

| No | Tabel | Fungsi | Relasi Utama |
|---|---|---|---|
| 1 | `users` | Kredensial login + hak akses (`admin`, `guru`, `ortu`) | — (tabel induk) |
| 2 | `guru` | Profil guru | → `users(id)` |
| 3 | `orang_tua` | Profil orang tua/wali | → `users(id)` |
| 4 | `kelas` | Master data daftar kelas | — (master data) |
| 5 | `siswa` | Data induk siswa | → `kelas(id)`, `orang_tua(id)` |
| 6 | `jadwal_mengajar` | Jadwal guru per kelas | → `guru(id)`, `kelas(id)` |
| 7 | `absensi_siswa` | Transaksi kehadiran siswa harian | → `siswa(id)` |
| 8 | `absensi_guru` | Transaksi kehadiran guru per jadwal | → `guru(id)`, `jadwal_mengajar(id)` |

### 1.2 Peta Relasi

```
users (id)
  ├── guru (user_id)
  │     ├── jadwal_mengajar (guru_id)
  │     └── absensi_guru (guru_id)
  └── orang_tua (user_id)
        └── siswa (orang_tua_id)
              └── absensi_siswa (siswa_id)

kelas (id)
  ├── siswa (kelas_id)
  └── jadwal_mengajar (kelas_id)

jadwal_mengajar (id)
  └── absensi_guru (jadwal_id)
```

> **Catatan untuk FE:** satu `user` hanya punya **satu** profil — sebagai `guru` **atau** `orang_tua`, sesuai kolom `role`. Untuk role `admin` tidak dibuat tabel profil tambahan.

### 1.3 Detail Kolom

#### `users`

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT | Identitas unik pengguna |
| `username` | VARCHAR(50) | UNIQUE, NOT NULL | Dipakai untuk login |
| `password` | VARCHAR(255) | NOT NULL | Disimpan sebagai hash — **tidak pernah dikirim ke FE** |
| `role` | ENUM/VARCHAR | NOT NULL | Hanya: `admin`, `guru`, `ortu` |
| `created_at` | DATETIME | DEFAULT NOW() | Waktu pembuatan data |

#### `guru`

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT | Identitas unik guru |
| `user_id` | INT | FK → `users(id)` | Penghubung ke akun login |
| `nip` | VARCHAR(30) | UNIQUE | Nomor induk pegawai |
| `nama` | VARCHAR(100) | NOT NULL | Nama lengkap guru |
| `no_hp` | VARCHAR(20) | NULL | Nomor telepon aktif |
| `mapel` | VARCHAR(100) | NULL | Mata pelajaran yang diampu |

#### `orang_tua`

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT | Identitas unik orang tua/wali |
| `user_id` | INT | FK → `users(id)` | Penghubung ke akun login |
| `nama` | VARCHAR(100) | NOT NULL | Nama lengkap orang tua/wali |
| `no_hp` | VARCHAR(20) | NULL | Untuk notifikasi kehadiran |
| `alamat` | TEXT | NULL | Alamat domisili |

#### `kelas`

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT | Identitas unik kelas |
| `nama_kelas` | VARCHAR(50) | NOT NULL | Contoh: `XI RPL 1` |
| `tingkat` | VARCHAR(10) | NULL | Contoh: `X`, `XI`, `XII` |
| `wali_kelas_id` | INT | FK → `guru(id)` | Guru wali kelas |

#### `siswa`

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT | Identitas unik siswa |
| `nis` | VARCHAR(30) | UNIQUE | Nomor induk siswa |
| `nama` | VARCHAR(100) | NOT NULL | Nama lengkap siswa |
| `kelas_id` | INT | FK → `kelas(id)` | Kelas siswa terdaftar |
| `orang_tua_id` | INT | FK → `orang_tua(id)` | Orang tua/wali penanggung jawab |
| `jenis_kelamin` | CHAR(1) | NULL | `L` atau `P` |
| `id_kartu` | VARCHAR(50) | UNIQUE | Nomor kartu yang dibaca saat tap |

#### `jadwal_mengajar`

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT | Identitas unik jadwal |
| `guru_id` | INT | FK → `guru(id)` | Guru yang mengajar |
| `kelas_id` | INT | FK → `kelas(id)` | Kelas yang diajar |
| `hari` | VARCHAR(10) | NOT NULL | Contoh: `Senin` |
| `jam_mulai` | TIME | NOT NULL | Format 24 jam, contoh `07:00:00` |
| `jam_selesai` | TIME | NOT NULL | Format 24 jam, contoh `08:30:00` |

#### `absensi_siswa`

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT | Identitas unik transaksi |
| `siswa_id` | INT | FK → `siswa(id)` | Siswa yang tap kartu |
| `tanggal` | DATE | NOT NULL | Format `YYYY-MM-DD` |
| `jam_datang` | TIME | NULL | Terisi saat `tipe_absen = "datang"` |
| `jam_pulang` | TIME | NULL | Terisi saat `tipe_absen = "pulang"` |
| `status` | VARCHAR(20) | NULL | `hadir`, `terlambat`, `izin`, `sakit`, `alfa` |

> **Perlu dipastikan tim BE:** tabel ini dirancang **satu baris per siswa per hari** — `jam_datang` dan `jam_pulang` berada di baris yang sama. Ini berpengaruh langsung pada logika `POST /api/absen` saat `tipe_absen = "pulang"`.

#### `absensi_guru`

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT | Identitas unik transaksi |
| `guru_id` | INT | FK → `guru(id)` | Guru yang absen |
| `jadwal_id` | INT | FK → `jadwal_mengajar(id)` | Jadwal dasar absensi |
| `tanggal` | DATE | NOT NULL | Tanggal pelaksanaan mengajar |
| `jam_datang` | TIME | NULL | Waktu guru mulai mengajar |
| `jam_pulang` | TIME | NULL | Waktu guru selesai mengajar |
| `status` | VARCHAR(20) | NULL | `hadir`, `terlambat`, `tidak hadir` |

---

## 2. API Contract

Seluruh endpoint merespons dengan format **JSON**.
Base URL menyesuaikan lingkungan pengembangan, contoh: `http://localhost:3000`

### 2.1 Daftar Endpoint

| Method | Endpoint | Fungsi | Keterangan untuk FE |
|---|---|---|---|
| `GET` | `/` | Cek status server | Mengembalikan teks sapaan |
| `GET` | `/api/users` | Ambil data users | Array of objects |
| `GET` | `/api/guru` | Ambil data guru | Array of objects |
| `GET` | `/api/orang_tua` | Ambil data orang tua | Array of objects |
| `GET` | `/api/kelas` | Ambil data kelas | Array of objects |
| `GET` | `/api/siswa` | Ambil data siswa | Array of objects |
| `GET` | `/api/jadwal_mengajar` | Ambil jadwal | Array of objects |
| `GET` | `/api/absensi_siswa` | Riwayat absen siswa | Array of objects |
| `GET` | `/api/absensi_guru` | Riwayat absen guru | Array of objects |
| `POST` | `/api/absen` | Catat tap kartu | Wajib kirim body JSON — [lihat 2.3](#23-post-apiabsen) |

> Nama endpoint **mengikuti persis nama tabel**, sehingga FE bisa langsung memetakan endpoint ke struktur data pada Bagian 1.

### 2.2 Pola Respons GET

Semua endpoint `GET` pada tabel mengembalikan **array of objects**.
Jika data kosong, server mengembalikan **array kosong `[]`**, bukan `null`.

Contoh respons `GET /api/siswa`:

```json
[
  {
    "id": 1,
    "nis": "2024001",
    "nama": "Aisyah Nur Fadhilah",
    "kelas_id": 3,
    "orang_tua_id": 5,
    "jenis_kelamin": "P",
    "id_kartu": "KRT-000123"
  }
]
```

### 2.3 POST /api/absen

Dipanggil setiap kali kartu siswa ditempelkan pada alat pembaca.

| Item | Ketentuan |
|---|---|
| Method | `POST` |
| Endpoint | `/api/absen` |
| Content-Type | `application/json` |
| `siswa_id` | Integer — merujuk `siswa(id)` |
| `tipe_absen` | String — **hanya** `"datang"` atau `"pulang"` |

**Request body — absen datang:**

```json
{
  "siswa_id": 1,
  "tipe_absen": "datang"
}
```

**Request body — absen pulang:**

```json
{
  "siswa_id": 1,
  "tipe_absen": "pulang"
}
```

**Perilaku yang disepakati:**

- `tipe_absen = "datang"` → server mengisi kolom `jam_datang` pada `absensi_siswa`.
- `tipe_absen = "pulang"` → server mengisi kolom `jam_pulang` pada baris absensi **hari yang sama**.
- Nilai `tanggal` dan jam **ditentukan server**, bukan dikirim FE, agar waktu konsisten untuk semua perangkat.
- Nilai `tipe_absen` selain `"datang"` dan `"pulang"` **ditolak** server.

---

## 3. Konvensi Penamaan

| Aspek | Aturan |
|---|---|
| Nama tabel | huruf kecil semua, `snake_case` — contoh: `jadwal_mengajar` |
| Nama kolom | huruf kecil semua, `snake_case` — contoh: `jam_datang` |
| Primary key | selalu bernama `id` |
| Foreign key | nama tabel tujuan (tunggal) + `_id` — contoh: `siswa_id`, `kelas_id` |
| Nama endpoint | mengikuti nama tabel, diawali `/api/` |
| Format tanggal | `YYYY-MM-DD` — contoh `2026-08-19` |
| Format jam | `HH:MM:SS`, 24 jam — contoh `07:15:00` |
| Format response | JSON, `application/json` |

---

## 4. Aturan Kerja Tim

- [ ] File ini adalah **acuan tunggal**. Kalau kode dan file ini berbeda, file ini yang dirujuk sampai perubahan disepakati.
- [ ] Setiap perubahan nama tabel/kolom/endpoint **wajib diubah di file ini dulu**, lalu diinformasikan ke kedua tim, lalu dicatat di [Riwayat Revisi](#5-riwayat-revisi).
- [ ] Tim FE **tidak boleh mengarang nama field sendiri** — gunakan nama pada Bagian 1.
- [ ] Tim BE menjaga nama field pada respons JSON **sama persis** dengan nama kolom database.
- [ ] Kolom `password` **tidak pernah** dikirim pada respons endpoint mana pun.
- [ ] Perubahan file ini di-*commit* **bersamaan** dengan perubahan kodenya, dalam satu commit yang sama.

---

## 5. Riwayat Revisi

| Versi | Tanggal | Penyusun | Ringkasan Perubahan |
|---|---|---|---|
| v1.0 | 19 Agu 2026 | Tim Pengembang | Dokumen SOT pertama: 8 tabel utama dan 10 endpoint |
|  |  |  |  |