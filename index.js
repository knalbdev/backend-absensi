const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// KONEKSI KE DATABASE XAMPP
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Yah, Gagal nyambung ke database:', err);
    return;
  }
  console.log('Mantap! Berhasil terhubung ke database XAMPP.');
});

// ==========================================
// ENDPOINT / ROUTING KITA TARUH DI SINI
// ==========================================

// 1. Endpoint Test Server
app.get('/', (req, res) => {
  res.json({ message: "Halo! Server Backend Absensi Siap Digunakan!" });
});

// 2. Endpoint Test Ambil Data Kelas dari Database
app.get('/api/kelas', (req, res) => {
  const query = "SELECT * FROM kelas";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Gagal ngambil data" });
    }
    res.json({
      pesan: "Berhasil mengambil data kelas",
      data: results
    });
  });
});

// ==========================================

app.listen(port, () => {
  console.log(`Server nyala! Coba buka http://localhost:${port}`);
});

// ==========================================
// ENDPOINT ABSENSI SISWA
// ==========================================
app.post('/api/absen', (req, res) => {
  // Mengambil data yang dikirim oleh aplikasi frontend/mesin tap kartu
  const { siswa_id, tipe_absen } = req.body; 
  
  // Memastikan data yang dikirim tidak kosong
  if (!siswa_id || !tipe_absen) {
    return res.status(400).json({ error: "Data siswa_id atau tipe_absen tidak boleh kosong" });
  }

  // Mendapatkan waktu saat ini
  const sekarang = new Date();
  const tanggal = sekarang.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  
  // Format jam ke HH:MM:SS sesuai zona waktu server
  const jam = sekarang.toTimeString().split(' ')[0]; 

  if (tipe_absen === 'datang') {
    // Logika jika siswa baru datang
    const query = `INSERT INTO absensi_siswa (siswa_id, tanggal, jam_datang, status) VALUES (?, ?, ?, 'hadir')`;
    
    db.query(query, [siswa_id, tanggal, jam], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Gagal mencatat jam datang ke database" });
      }
      
      // Catatan: Nanti kita panggil fungsi kirim Email di sini
      res.json({ 
        pesan: "Berhasil mencatat jam datang siswa!", 
        siswa_id: siswa_id,
        waktu_datang: jam 
      });
    });

  } else if (tipe_absen === 'pulang') {
    // Logika jika siswa pulang (mengupdate baris yang sudah ada hari ini)
    const query = `UPDATE absensi_siswa SET jam_pulang = ? WHERE siswa_id = ? AND tanggal = ?`;
    
    db.query(query, [jam, siswa_id, tanggal], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Gagal mencatat jam pulang ke database" });
      }
      
      if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Gagal absen pulang. Siswa belum absen datang hari ini."});
      }

      // Catatan: Nanti kita panggil fungsi kirim Email di sini
      res.json({ 
        pesan: "Berhasil mencatat jam pulang siswa!", 
        siswa_id: siswa_id,
        waktu_pulang: jam 
      });
    });

  } else {
    // Jika tipe absen salah ketik
    res.status(400).json({ error: "tipe_absen tidak valid. Harus 'datang' atau 'pulang'" });
  }
});
