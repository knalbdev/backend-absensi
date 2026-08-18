-- Mengisi tabel users
INSERT INTO users (username, password, role) VALUES 
('admin_sekolah', 'rahasia123', 'admin'),
('tia_guru', 'tia123', 'guru'),
('wida_guru', 'wida123', 'guru'),
('ortu_budi', 'ortu123', 'ortu');

-- Mengisi tabel kelas
INSERT INTO kelas (nama_kelas) VALUES 
('10 RPL 1'), ('10 RPL 2'), ('11 RPL 1');

-- Mengisi tabel guru (nyambung ke user_id 2 dan 3)
INSERT INTO guru (user_id, nip, nama_guru) VALUES 
(2, '19900101', 'Bu Tia'),
(3, '19920202', 'Bu Wida');

-- Mengisi tabel orang tua (nyambung ke user_id 4)
INSERT INTO orang_tua (user_id, nama_ortu, email) VALUES 
(4, 'Bapaknya Budi', 'bapakbudi@email.com');

-- Mengisi tabel siswa
INSERT INTO siswa (nis, nama_siswa, kelas_id, orang_tua_id) VALUES 
('2026001', 'Budi Santoso', 1, 1);