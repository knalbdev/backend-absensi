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