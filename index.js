const express = require('express');
const mysql = require('mysql2'); // Kembali menggunakan mysql2 sesuai aslinya
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// MIDDLEWARE WAJIB FRONTEND
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// KONEKSI KE DATABASE RAILWAY
const db = mysql.createConnection(process.env.DB_URL);

db.connect((err) => {
  if (err) {
    console.error('Yah, Gagal nyambung ke database:', err);
    return;
  }
  console.log('Mantap! Berhasil terhubung ke database Railway.');
});

// ==========================================
// ENDPOINT / ROUTING
// ==========================================

// 1. Endpoint Test Server
app.get('/', (req, res) => {
  res.json({ message: "Halo! Server Backend Absensi Siap Digunakan!" });
});

// 2. Endpoint Get Data Kelas
app.get('/api/kelas', (req, res) => {
  const query = "SELECT * FROM kelas";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Gagal ngambil data kelas" });
    }
    res.json({
      pesan: "Berhasil mengambil data kelas",
      data: results
    });
  });
});

// 3. Endpoint Get Data Guru
app.get('/api/guru', (req, res) => {
  const query = "SELECT * FROM guru";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Gagal ngambil data guru" });
    }
    res.json({
      pesan: "Berhasil mengambil data guru",
      data: results
    });
  });
});

// 4. Endpoint Absensi Mesin Tap Kartu
app.post('/api/absen', (req, res) => {
  const { siswa_id, tipe_absen } = req.body; 
  
  if (!siswa_id || !tipe_absen) {
    return res.status(400).json({ error: "Data siswa_id atau tipe_absen tidak boleh kosong" });
  }

  const sekarang = new Date();
  const tanggal = sekarang.toISOString().split('T')[0];
  const jam = sekarang.toTimeString().split(' ')[0]; 

  if (tipe_absen === 'datang') {
    const query = `INSERT INTO absensi_siswa (siswa_id, tanggal, jam_datang, status) VALUES (?, ?, ?, 'hadir')`;
    db.query(query, [siswa_id, tanggal, jam], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Gagal mencatat jam datang ke database" });
      }
      res.json({ pesan: "Berhasil mencatat jam datang siswa!", siswa_id: siswa_id, waktu_datang: jam });
    });

  } else if (tipe_absen === 'pulang') {
    const query = `UPDATE absensi_siswa SET jam_pulang = ? WHERE siswa_id = ? AND tanggal = ?`;
    db.query(query, [jam, siswa_id, tanggal], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Gagal mencatat jam pulang ke database" });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Gagal absen pulang. Siswa belum absen datang hari ini."});
      }
      res.json({ pesan: "Berhasil mencatat jam pulang siswa!", siswa_id: siswa_id, waktu_pulang: jam });
    });

  } else {
    res.status(400).json({ error: "tipe_absen tidak valid. Harus 'datang' atau 'pulang'" });
  }
});

// ==========================================
app.listen(port, () => {
  console.log(`Server nyala! Coba buka http://localhost:${port}`);
});