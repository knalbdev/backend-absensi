## 👥 Alur Pengguna (User Flow) & Hak Akses

Sistem ini dirancang untuk melayani 4 entitas utama dengan hak akses yang berbeda-beda.

### 1. 👑 Admin Sekolah (Administrator)
Pemegang kendali penuh atas sistem absensi.
* **Autentikasi:** Login menggunakan kredensial dari tabel `users` (contoh: `admin_sekolah`)[cite: 1, 2].
* **Hak Akses & Tugas:**
  * Membaca dan mengelola seluruh master data (Guru, Orang Tua, Siswa, Kelas, dan Jadwal).
  * Memantau rekapitulasi absen harian seluruh siswa dan guru[cite: 1, 3].

### 2. 👨‍🏫 Guru
Berfokus pada pemantauan jadwal dan kehadiran siswa di kelas yang diajarnya.
* **Autentikasi:** Login menggunakan kredensial dari tabel `users` (contoh: `tia_guru`)[cite: 1, 2].
* **Hak Akses & Tugas:**
  * Melihat profil data diri (NIP dan Nama) berdasarkan `user_id`[cite: 1, 3].
  * Memeriksa jadwal mengajar pribadi (hari dan jam)[cite: 1, 3].
  * Melihat daftar siswa di kelas yang diajarnya[cite: 1, 3].
  * Melihat laporan absensi siswa dan riwayat absensi pribadi[cite: 1, 3].

### 3. 👨‍👩‍👦 Orang Tua
Pemantau pasif untuk memastikan kedisiplinan dan keamanan anak.
* **Autentikasi:** Login menggunakan kredensial dari tabel `users` (contoh: `ortu_budi`)[cite: 1, 2].
* **Hak Akses & Tugas:**
  * Melihat profil data anak (NIS, Nama, Kelas)[cite: 1, 3].
  * Memantau jam datang dan jam pulang anak secara *real-time*[cite: 1, 3].

### 4. 🪪 Siswa (Via Mesin Tap Kartu)
Siswa **tidak memiliki fitur login**. Interaksi mereka 100% dilakukan melalui perangkat keras (IoT).
* **Alur:** 
  * Menempelkan ID Card ke mesin scanner saat datang ke sekolah.
  * Mesin menembak endpoint `POST /api/absen` dengan status `datang`[cite: 3].
  * Mengulang proses yang sama saat pulang sekolah dengan status `pulang`[cite: 3].