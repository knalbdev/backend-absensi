# 📡 API Documentation

**Base URL (Live):** `https://backend-absensi-production-1702.up.railway.app`
**Content-Type:** `application/json`

---

## 1. Authentication

### A. Login User
*   **Method:** `POST`
*   **Endpoint:** `/api/login`
*   **Request Body:**
    ```json
    {
      "username": "tia_guru",
      "password": "tia123"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "pesan": "Login berhasil!",
      "data": {
        "user_id": 2,
        "username": "tia_guru",
        "role": "guru"
      }
    }
    ```
*   **Error Response (401 Unauthorized):**
    ```json
    { "error": "Username atau password salah!" }
    ```

---

## 2. Master Data

### A. Get Semua Master Data
Mengambil daftar data dari masing-masing tabel. Format balasan semuanya seragam.
*   **Method:** `GET`
*   **Endpoints:** 
    *   `/api/guru`
    *   `/api/orang_tua`
    *   `/api/kelas`
    *   `/api/siswa`
    *   `/api/jadwal_mengajar`
*   **Success Response (200 OK) - Contoh `/api/kelas`:**
    ```json
    {
      "pesan": "Berhasil mengambil data kelas",
      "data": [
        { "id": 1, "nama_kelas": "10 RPL 1" },
        { "id": 2, "nama_kelas": "10 RPL 2" }
      ]
    }
    ```

---

## 3. Transaksi Absensi

### A. Tap Mesin Absensi (Siswa)
*   **Method:** `POST`
*   **Endpoint:** `/api/absen`
*   **Deskripsi:** Digunakan oleh alat tap kartu (IoT) atau form manual Frontend untuk mencatat waktu datang dan pulang.
*   **Request Body (Datang):**
    ```json
    {
      "siswa_id": 1,
      "tipe_absen": "datang"
    }
    ```
*   **Success Response Datang (200 OK):**
    ```json
    {
      "pesan": "Berhasil mencatat jam datang siswa!",
      "siswa_id": 1,
      "waktu_datang": "07:15:00"
    }
    ```
*   **Request Body (Pulang):**
    ```json
    {
      "siswa_id": 1,
      "tipe_absen": "pulang"
    }
    ```
*   **Error Response (404 Not Found - Jika tap pulang tapi belum tap datang):**
    ```json
    { "error": "Gagal absen pulang. Siswa belum absen datang hari ini." }
    ```

### B. Get Riwayat Absensi
*   **Method:** `GET`
*   **Endpoints:** 
    *   `/api/absensi_siswa`
    *   `/api/absensi_guru`
*   **Success Response (200 OK):** Mengembalikan array objek berisi rekapan jam datang dan jam pulang.