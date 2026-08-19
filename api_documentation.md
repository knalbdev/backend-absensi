# 📡 API Documentation

**Base URL:** `https://backend-absensi-production-1702.up.railway.app`
**Content-Type:** `application/json`

---

## 1. Authentication & Master Data

### A. POST `/api/login` (Login User)
*   **Request:** `{"username": "tia_guru", "password": "tia123"}`
*   **Response (200 OK):**
    ```json
    {
      "pesan": "Login berhasil!",
      "data": { "user_id": 2, "username": "tia_guru", "role": "guru" }
    }
    ```

### B. POST `/api/users` (Tambah Akun - By Admin)
*   **Request:** `{"username": "ortu_siti", "password": "ortu123", "role": "ortu"}`
*   **Response (201 Created):** Mengembalikan data id, username, dan role yang berhasil dibuat.

### C. POST `/api/siswa` (Tambah Siswa - By Admin)
*   **Request:** `{"nis": "2026002", "nama_siswa": "Siti Aminah", "kelas_id": 1, "orang_tua_id": 1}`
*   **Response (201 Created):** Mengembalikan data lengkap siswa beserta insertId.

### D. GET `/api/...` (Ambil Master Data)
*   **Endpoint Tersedia:** `/api/users`, `/api/guru`, `/api/orang_tua`, `/api/kelas`, `/api/siswa`, `/api/jadwal_mengajar`, `/api/absensi_siswa`, `/api/absensi_guru`
*   **Response (200 OK):** Mengembalikan array `data` yang berisi list dari tabel terkait.

---

## 2. Transaksi Absensi (`POST /api/absen`)

### A. Scan Mesin QR (Datang)
*   **Request:** `{"nis": "2026001", "tipe_absen": "datang"}`
*   **Response (200 OK):** `{"pesan": "Berhasil mencatat absen datang (hadir)!", "nis": "2026001", "waktu_datang": "07:15:00"}`

### B. Input Manual oleh Guru (Izin/Sakit)
*   **Request:** `{"nis": "2026001", "tipe_absen": "datang", "status_kehadiran": "sakit"}`
*   **Response (200 OK):** `{"pesan": "Berhasil mencatat absen datang (sakit)!", "nis": "2026001", "waktu_datang": "07:20:00"}`

### C. Scan Mesin QR (Pulang)
*   **Request:** `{"nis": "2026001", "tipe_absen": "pulang"}`
*   **Response (200 OK):** `{"pesan": "Berhasil mencatat jam pulang!", "nis": "2026001", "waktu_pulang": "15:00:00"}`