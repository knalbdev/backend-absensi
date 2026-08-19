# 🏛️ Source of Truth (SOT) - Sistem Absensi

Dokumen ini berisi kontrak kerja tim Frontend dan Backend, mencakup rancangan database dan daftar endpoint.

## A. Struktur Database & Relasi (8 Tabel Utama)
1. **`users`**: Sentral autentikasi. Kolom penting: `username`, `password`, `role` (admin, guru, ortu).
2. **`guru`**: Data profil. Relasi -> `user_id`.
3. **`orang_tua`**: Data profil. Relasi -> `user_id`.
4. **`kelas`**: Master data kelas (contoh: 10 RPL 1).
5. **`siswa`**: Data siswa (termasuk `nis`). Relasi -> `kelas_id` & `orang_tua_id`. **(Siswa tidak ada di tabel users)**.
6. **`jadwal_mengajar`**: Jadwal pelajaran. Relasi -> `guru_id` & `kelas_id`.
7. **`absensi_siswa`**: Transaksi kehadiran. Kolom penting: `siswa_id`, `tanggal`, `jam_datang`, `jam_pulang`, `status`.
8. **`absensi_guru`**: Transaksi kehadiran guru.

## B. API Contract (Daftar Endpoint)
Seluruh respons dan request menggunakan format JSON.

| Method | Endpoint | Fungsi | Payload yang dikirim FE (Body) |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Cek Server | (Tidak ada) |
| **POST**| `/api/login` | Autentikasi | `username`, `password` |
| **POST**| `/api/users` | Buat Akun (Admin) | `username`, `password`, `role` |
| **POST**| `/api/siswa` | Tambah Siswa (Admin)| `nis`, `nama_siswa`, `kelas_id`, `orang_tua_id` |
| **POST**| `/api/absen` | Record Absensi | `nis`, `tipe_absen` ('datang'/'pulang'), `status_kehadiran` (opsional, u/ Guru) |
| **GET** | `/api/users` | List Akun | (Tidak ada) |
| **GET** | `/api/guru` | List Guru | (Tidak ada) |
| **GET** | `/api/orang_tua` | List Wali | (Tidak ada) |
| **GET** | `/api/kelas` | List Kelas | (Tidak ada) |
| **GET** | `/api/siswa` | List Siswa | (Tidak ada) |
| **GET** | `/api/jadwal_mengajar`| List Jadwal | (Tidak ada) |
| **GET** | `/api/absensi_siswa` | Riwayat Absen Siswa| (Tidak ada) |
| **GET** | `/api/absensi_guru` | Riwayat Absen Guru | (Tidak ada) |