-- 1. Buat Tabel Users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'guru', 'ortu') NOT NULL
);

-- 2. Buat Tabel Orang Tua
CREATE TABLE orang_tua (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    nama_ortu VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Buat Tabel Guru
CREATE TABLE guru (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    nip VARCHAR(20) NOT NULL,
    nama_guru VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Buat Tabel Kelas
CREATE TABLE kelas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_kelas VARCHAR(50) NOT NULL
);

-- 5. Buat Tabel Siswa
CREATE TABLE siswa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nis VARCHAR(20) NOT NULL,
    nama_siswa VARCHAR(100) NOT NULL,
    kelas_id INT,
    orang_tua_id INT,
    FOREIGN KEY (kelas_id) REFERENCES kelas(id) ON DELETE SET NULL,
    FOREIGN KEY (orang_tua_id) REFERENCES orang_tua(id) ON DELETE SET NULL
);

-- 6. Buat Tabel Jadwal Mengajar
CREATE TABLE jadwal_mengajar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    guru_id INT,
    kelas_id INT,
    hari VARCHAR(10) NOT NULL,
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    FOREIGN KEY (guru_id) REFERENCES guru(id) ON DELETE CASCADE,
    FOREIGN KEY (kelas_id) REFERENCES kelas(id) ON DELETE CASCADE
);

-- 7. Buat Tabel Absensi Siswa
CREATE TABLE absensi_siswa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    siswa_id INT,
    tanggal DATE NOT NULL,
    jam_datang TIME,
    jam_pulang TIME,
    status ENUM('hadir', 'izin', 'sakit', 'alpa') DEFAULT 'hadir',
    is_email_datang_sent TINYINT(1) DEFAULT 0,
    is_email_pulang_sent TINYINT(1) DEFAULT 0,
    FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE
);

-- 8. Buat Tabel Absensi Guru
CREATE TABLE absensi_guru (
    id INT AUTO_INCREMENT PRIMARY KEY,
    jadwal_id INT,
    tanggal DATE NOT NULL,
    jam_masuk TIME NOT NULL,
    FOREIGN KEY (jadwal_id) REFERENCES jadwal_mengajar(id) ON DELETE CASCADE
);