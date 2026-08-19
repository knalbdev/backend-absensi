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
// ENDPOINT FITUR LOGIN & TAMBAH AKUN (USERS)
// ==========================================
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: "Username dan password tidak boleh kosong!" });
  }

  const query = "SELECT id, username, role FROM users WHERE username = ? AND password = ?";
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Terjadi kesalahan pada server" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Username atau password salah!" });
    }

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

// Admin Menambah Akun User Baru (Guru/Ortu)
app.post('/api/users', (req, res) => {
  const { username, password, role } = req.body || {};

  if (!username || !password || !role) {
    return res.status(400).json({ error: "Username, password, dan role tidak boleh kosong!" });
  }

  const validRoles = ['admin', 'guru', 'ortu'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: "Role tidak valid! Harus 'admin', 'guru', atau 'ortu'." });
  }

  const query = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`;
  db.query(query, [username, password, role], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Gagal menyimpan user baru ke database." });
    }
    res.status(201).json({
      pesan: "Berhasil menambahkan user baru!",
      data: {
        id: results.insertId,
        username: username,
        role: role
      }
    });
  });
});

// ==========================================
// ENDPOINT MASTER DATA (TAMBAH SISWA)
// ==========================================
// Admin Menambah Siswa Baru
app.post('/api/siswa', (req, res) => {
  const { nis, nama_siswa, kelas_id, orang_tua_id } = req.body || {};

  if (!nis || !nama_siswa || !kelas_id || !orang_tua_id) {
    return res.status(400).json({ error: "Data NIS, Nama, Kelas ID, dan Orang Tua ID tidak boleh kosong!" });
  }

  const query = `INSERT INTO siswa (nis, nama_siswa, kelas_id, orang_tua_id) VALUES (?, ?, ?, ?)`;
  db.query(query, [nis, nama_siswa, kelas_id, orang_tua_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Gagal menyimpan data siswa baru ke database." });
    }
    res.status(201).json({
      pesan: "Berhasil menambahkan siswa baru!",
      data: {
        id: results.insertId,
        nis: nis,
        nama_siswa: nama_siswa,
        kelas_id: kelas_id,
        orang_tua_id: orang_tua_id
      }
    });
  });
});

// ==========================================
// ENDPOINT BACA DATA GET (READ-ONLY)
// ==========================================
app.get('/', (req, res) => res.json({ message: "Halo! Server Backend Absensi Siap Digunakan!" }));

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
// ENDPOINT ABSENSI (MESIN QR & INPUT GURU)
// ==========================================
app.post('/api/absen', (req, res) => {
  const { nis, tipe_absen, status_kehadiran } = req.body || {}; 
  
  if (!nis || !tipe_absen) {
    return res.status(400).json({ error: "Data NIS atau tipe_absen tidak boleh kosong" });
  }

  // Cari ID siswa dari NIS
  db.query("SELECT id FROM siswa WHERE nis = ?", [nis], (err, results) => {
    if (err) return res.status(500).json({ error: "Gagal mencari data siswa" });
    if (results.length === 0) return res.status(404).json({ error: "Siswa dengan NIS tersebut tidak ditemukan!" });

    const siswa_id = results[0].id; 
    const status_final = status_kehadiran || 'hadir'; 
    
    // Konversi zona waktu ke WIB (Waktu Indonesia Barat) untuk format jam
    const waktuSekarang = new Date();
    waktuSekarang.setHours(waktuSekarang.getHours() + 7);
    const tanggal = waktuSekarang.toISOString().split('T')[0];
    const jam = waktuSekarang.toISOString().split('T')[1].split('.')[0]; 

    if (tipe_absen === 'datang') {
      const query = `INSERT INTO absensi_siswa (siswa_id, tanggal, jam_datang, status) VALUES (?, ?, ?, ?)`;
      db.query(query, [siswa_id, tanggal, jam, status_final], (err, insertResult) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Gagal mencatat jam datang ke database" });
        }
        res.json({ pesan: `Berhasil mencatat absen datang (${status_final})!`, nis: nis, waktu_datang: jam });
      });

    } else if (tipe_absen === 'pulang') {
      const query = `UPDATE absensi_siswa SET jam_pulang = ? WHERE siswa_id = ? AND tanggal = ?`;
      db.query(query, [jam, siswa_id, tanggal], (err, updateResult) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Gagal mencatat jam pulang ke database" });
        }
        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ error: "Gagal absen pulang. Siswa belum absen datang hari ini."});
        }
        res.json({ pesan: "Berhasil mencatat jam pulang!", nis: nis, waktu_pulang: jam });
      });
    } else {
      res.status(400).json({ error: "tipe_absen tidak valid. Harus 'datang' atau 'pulang'" });
    }
  });
});

// ==========================================
app.listen(port, () => {
  console.log(`Server nyala! Coba buka http://localhost:${port}`);
});