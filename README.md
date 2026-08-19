# 📚 Backend Sistem Absensi Terintegrasi

API Backend untuk sistem absensi sekolah (Siswa dan Guru), dibangun menggunakan Node.js, Express, dan MySQL. Proyek ini siap dikonsumsi oleh aplikasi Frontend (Web/Mobile) maupun perangkat IoT (Mesin Tap Kartu).

## 🚀 Teknologi yang Digunakan
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MySQL (Cloud by Railway)
* **Library:** `mysql2`, `cors`, `dotenv`

## 🌍 Base URL (Live Production)
Semua request API diarahkan ke URL berikut:
\`https://backend-absensi-production-1702.up.railway.app\`

## 🛠️ Cara Menjalankan di Komputer Lokal (Local Development)

1. **Clone Repository**
   \`\`\`bash
   git clone <url-repo-kamu>
   cd workshop-backend
   \`\`\`
2. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`
3. **Konfigurasi Environment**
   Buat file \`.env\` di root folder dan isi dengan konfigurasi database kamu:
   \`\`\`env
   PORT=3000
   DB_URL=mysql://root:password@host:port/database
   \`\`\`
4. **Jalankan Server**
   \`\`\`bash
   npm run dev
   \`\`\`
   Server akan berjalan di \`http://localhost:3000\`.