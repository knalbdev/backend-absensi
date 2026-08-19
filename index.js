require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// ==========================================
// MIDDLEWARE WAJIB UNTUK FRONTEND
// ==========================================
// 1. Mengizinkan FE dari domain manapun untuk mengakses API ini (Cegah error CORS)
app.use(cors()); 
// 2. Mengizinkan backend membaca data format JSON yang dikirim FE
app.use(express.json()); 
// 3. Mengizinkan backend membaca data dari form-urlencoded
app.use(express.urlencoded({ extended: true }));

// ==========================================
// KONEKSI DATABASE RAILWAY
// ==========================================
const db = mysql.createConnection(process.env.DB_URL);

db.connect((err) => {
    if (err) {
        console.error('Gagal koneksi ke database:', err);
    } else {
        console.log('Berhasil terhubung ke database MySQL Railway!');
    }
});

// ==========================================
// ROUTES / ENDPOINTS API
// ==========================================

// 1. Endpoint Root (Cek Status Server)
app.get('/', (req, res) => {
    res.json({ message: "Halo! Server Backend Absensi Siap Digunakan!" });
});

// 2. Endpoint Get Data Kelas
app.get('/api/kelas', (req, res) => {
    const query = 'SELECT * FROM kelas'; // Sesuaikan nama tabel jika berbeda
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ pesan: "Gagal mengambil data kelas", error: err.message });
        }
        res.json({
            pesan: "Berhasil mengambil data kelas",
            data: results
        });
    });
});

// 3. Endpoint Get Data Guru
app.get('/api/guru', (req, res) => {
    const query = 'SELECT * FROM absensi_guru'; // Sesuaikan nama tabel jika berbeda
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ pesan: "Gagal mengambil data guru", error: err.message });
        }
        res.json({
            pesan: "Berhasil mengambil data guru",
            data: results
        });
    });
});

// 4. Endpoint Post Data Absensi (Contoh untuk menerima data dari FE)
app.post('/api/absensi', (req, res) => {
    // Menangkap data yang dikirim oleh FE
    const { id_guru, id_kelas, status, tanggal } = req.body;

    // Validasi sederhana
    if (!id_guru || !id_kelas || !status) {
        return res.status(400).json({ pesan: "Data absensi tidak lengkap!" });
    }

    // Contoh query insert (Pastikan kamu sudah membuat tabel 'absensi' di database)
    const query = 'INSERT INTO absensi (id_guru, id_kelas, status, tanggal) VALUES (?, ?, ?, ?)';
    db.query(query, [id_guru, id_kelas, status, tanggal], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ pesan: "Gagal menyimpan absensi", error: err.message });
        }
        res.status(201).json({
            pesan: "Absensi berhasil disimpan!",
            data: { id_insert: results.insertId, id_guru, id_kelas, status }
        });
    });
});

// ==========================================
// JALANKAN SERVER
// ==========================================
app.listen(port, () => {
    console.log(`Server menyala dan berjalan di port ${port}`);
});