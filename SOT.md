# 🏛️ Source of Truth (SOT) - Sistem Absensi

Dokumen ini berisi kontrak kerja antara tim Frontend dan Backend, mencakup rancangan database dan daftar endpoint (API Contract) yang disepakati.

## A. Struktur Database & Relasi (Master Data)
Sistem ini menggunakan 8 tabel utama[cite: 1]:

1. **`users`**: Tabel sentral untuk autentikasi login. Hanya berisi role `admin`, `guru`, dan `ortu`[cite: 1].
2. **`guru`**: Data profil guru. Berelasi ke tabel `users` melalui `user_id`[cite: 1].
3. **`orang_tua`**: Data profil orang tua. Berelasi ke tabel `users` melalui `user_id`[cite: 1].
4. **`kelas`**: Master data daftar kelas (contoh: 10 RPL 1)[cite: 1].
5. **`siswa`**: Data profil siswa. Berelasi ke tabel `kelas` (`kelas_id`) dan `orang_tua` (`orang_tua_id`)[cite: 1]. **Siswa tidak memiliki akun di tabel users.**
6. **`jadwal_mengajar`**: Jadwal pelajaran. Berelasi ke tabel `guru` (`guru_id`) dan `kelas` (`kelas_id`)[cite: 1].
7. **`absensi_siswa`**: Tabel transaksi pencatatan jam datang dan pulang siswa[cite: 1].
8. **`absensi_guru`**: Tabel transaksi kehadiran guru sesuai dengan jadwal mengajar mereka[cite: 1].

## B. API Contract (Daftar Endpoint)
Semua komunikasi menggunakan format JSON.

| Method | Endpoint | Fungsi / Tugas | Keterangan untuk FE |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Pengecekan server | Mengembalikan pesan status server. |
| **POST**| `/api/login` | Autentikasi User | Mengirim `username` dan `password`. Mengembalikan data profil dan `role`. |
| **GET** | `/api/users` | Ambil data akun | Mengembalikan array list akun terdaftar. |
| **GET** | `/api/guru` | Ambil data guru | Mengembalikan array list profil guru. |
| **GET** | `/api/orang_tua` | Ambil data ortu | Mengembalikan array list profil orang tua. |
| **GET** | `/api/kelas` | Ambil data kelas | Mengembalikan array list kelas. |
| **GET** | `/api/siswa` | Ambil data siswa | Mengembalikan array list siswa. |
| **GET** | `/api/jadwal_mengajar`| Ambil jadwal | Mengembalikan array list jadwal pelajaran. |
| **GET** | `/api/absensi_siswa` | Riwayat absen siswa | Mengembalikan array data kehadiran siswa harian. |
| **GET** | `/api/absensi_guru` | Riwayat absen guru | Mengembalikan array data kehadiran guru harian. |
| **POST**| `/api/absen` | Catat Tap Kartu | Wajib mengirim `siswa_id` dan `tipe_absen` ('datang' atau 'pulang'). |