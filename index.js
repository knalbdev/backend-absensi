const express = require('express');
const mysql = require('mysql2'); 
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
// ENDPOINT FITUR LOGIN
// ==========================================
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // 1. Validasi input kosong
  if (!username || !password) {
    return res.status(400).json({ error: "Username dan password tidak boleh kosong!" });
  }

  // 2. Cari user di database
  const query = "SELECT id, username, role FROM users WHERE username = ? AND password = ?";
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Terjadi kesalahan pada server" });
    }

    // 3. Jika user tidak ditemukan atau password salah
    if (results.length === 0) {
      return res.status(401).json({ error: "Username atau password salah!" });
    }

    // 4. Jika berhasil login, kirim data user ke Frontend
    const user = results[0];
    res.json({
      pesan: "Login berhasil!",
      data: {
        user_id: user.id,
        username: user.username,
        role: user.role
      }
    });
  });
});

// ==========================================
// ENDPOINT / ROUTING DATA GET
// ==========================================
app.get('/', (req, res) => {
  res.json({ message: "Halo! Server Backend Absensi Siap Digunakan!" });
});

app.get('/api/users', (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: "Gagal ngambil data users" });
    res.json({ pesan: "Berhasil mengambil data users", data: results });
  });
});

app.get('/api/orang_tua', (req, res) => {
  db.query("SELECT * FROM orang_tua", (err, results) => {
    if (err) return res.status(500).json({ error: "Gagal ngambil data orang tua" });
    res.json({ pesan: "Berhasil mengambil data orang tua", data: results });
  });
});

app.get('/api/guru', (req, res) => {
  db.query("SELECT * FROM guru", (err, results) => {
    if (err) return res.status(500).json({ error: "Gagal ngambil data guru" });
    res.json({ pesan: "Berhasil mengambil data guru", data: results });
  });
});

app.get('/api/kelas', (req, res) => {
  db.query("SELECT * FROM kelas", (err, results) => {
    if (err) return res.status(500).json({ error: "Gagal ngambil data kelas" });
    res.json({ pesan: "Berhasil mengambil data kelas", data: results });
  });
});

app.get('/api/siswa', (req, res) => {
  db.query("SELECT * FROM siswa", (err, results) => {
    if (err) return res.status(500).json({ error: "Gagal ngambil data siswa" });
    res.json({ pesan: "Berhasil mengambil data siswa", data: results });
  });
});

app.get('/api/jadwal_mengajar', (req, res) => {
  db.query("SELECT * FROM jadwal_mengajar", (err, results) => {
    if (err) return res.status(500).json({ error: "Gagal ngambil data jadwal" });
    res.json({ pesan: "Berhasil mengambil jadwal mengajar", data: results });
  });
});

app.get('/api/absensi_siswa', (req, res) => {
  db.query("SELECT * FROM absensi_siswa", (err, results) => {
    if (err) return res.status(500).json({ error: "Gagal ngambil data absensi siswa" });
    res.json({ pesan: "Berhasil mengambil data absensi siswa", data: results });
  });
});

app.get('/api/absensi_guru', (req, res) => {
  db.query("SELECT * FROM absensi_guru", (err, results) => {
    if (err) return res.status(500).json({ error: "Gagal ngambil data absensi guru" });
    res.json({ pesan: "Berhasil mengambil data absensi guru", data: results });
  });
});

// ==========================================
// ENDPOINT ABSENSI MESIN TAP KARTU
// ==========================================
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