# 🔄 Alur Aplikasi & Hak Akses Pengguna (Role Flow)

Aplikasi ini memiliki 3 Role pengguna yang bisa melakukan Login, serta 1 aktor pasif (Siswa) yang berinteraksi melalui mesin pemindai.

## 1. 👑 Admin Sekolah (Administrator)
Pemegang kendali penuh atas pendataan di sistem absensi.
*   **Autentikasi:** Wajib Login (contoh username: `admin_sekolah`).
*   **Hak Akses & Kebisaan (Fitur):**
    *   **Dashboard Utama:** Melihat rekapitulasi data sekolah.
    *   **Kelola Data Akun:** Membuat *username* dan *password* baru untuk Guru dan Wali (Ortu) melalui endpoint `POST /api/users`.
    *   **Kelola Data Siswa:** Menambahkan data siswa baru lengkap dengan NIS dan relasi kelas/orang tua melalui endpoint `POST /api/siswa`.
    *   **Lihat Master Data (Read-Only):** Melihat daftar lengkap Guru, Wali/Ortu, Siswa, Kelas, dan Jadwal Mengajar.
    *   **Laporan:** Memantau rekap absensi harian seluruh siswa dan guru.

## 2. 👨‍🏫 Guru
Berfokus pada kegiatan belajar mengajar dan mengelola kehadiran di kelasnya.
*   **Autentikasi:** Wajib Login (contoh username: `tia_guru`).
*   **Hak Akses & Kebisaan (Fitur):**
    *   **Dashboard Utama:** Melihat profil diri (NIP & Nama) dan jadwal mengajar pribadinya.
    *   **Rekap Absensi:** Melihat daftar siswa di kelasnya dan laporan kehadiran/absensi mereka.
    *   **Input Manual Kehadiran:** Mengubah/menginput status siswa yang tidak hadir (sakit, izin, alpa) langsung dari *dashboard* Frontend. Fitur ini menembak endpoint `POST /api/absen` dengan menyertakan parameter `status_kehadiran`.

## 3. 👨‍👩‍👦 Wali (Orang Tua)
Pemantau pasif untuk memastikan kedisiplinan dan keamanan anak.
*   **Autentikasi:** Wajib Login (contoh username: `ortu_budi`).
*   **Hak Akses & Kebisaan (Fitur):**
    *   **Dashboard Utama:** Melihat profil data diri dan data anaknya (NIS, Nama Siswa, Kelas).
    *   **Rekap Absensi Anak:** Memantau riwayat dan jam tepatnya anak absen (datang & pulang) setiap hari.

## 4. 🪪 Siswa (Aktor Non-Login / Pemindai QR)
Siswa tidak membuka aplikasi web/mobile dan **tidak memiliki akun login**.
*   **Alur Interaksi:**
    1.  Siswa menempelkan Kartu Pelajar ber-QR Code di depan kamera (aplikasi Frontend / mesin scanner).
    2.  Kamera membaca teks QR yang berisi **NIS** siswa (contoh: `2026001`).
    3.  Aplikasi secara otomatis mengirim data NIS tersebut ke API `POST /api/absen` dengan status `datang` atau `pulang`.
    4.  Backend mencatat waktu secara *real-time* ke database.