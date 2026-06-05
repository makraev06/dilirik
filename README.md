<div align="center">
  <div style="background-color: #5B5BD6; width: 80px; height: 80px; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9.9 2.5 1.5 2.9a2 2 0 0 0 1.2 1.l3 .5a2 2 0 0 1 1.1 3.4l-2.1 2a2 2 0 0 0-.6 1.8l.5 3a2 2 0 0 1-2.9 2.1l-2.7-1.4a2 2 0 0 0-1.9 0l-2.7 1.4a2 2 0 0 1-2.9-2.1l.5-3a2 2 0 0 0-.6-1.8l-2.1-2a2 2 0 0 1 1.1-3.4l3-.5a2 2 0 0 0 1.2-1.1l1.5-2.9a2 2 0 0 1 3.7 0Z"/></svg>
  </div>
  
  # Dilirik 

  **Bikin CV kamu pasti *dilirik* HRD.** <br>
  Platform analisis CV otomatis berbasis AI untuk menguji skor ATS (Applicant Tracking System), menemukan kekurangan, dan memberikan rekomendasi perbaikan instan sesuai dengan posisi pekerjaan impianmu.

  <br>

  [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io/)
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
  [![Gemini AI](https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white)](https://deepmind.google/technologies/gemini/)

</div>

---

## ✨ Fitur Utama

- 🚀 **Analisis Super Cepat**: Ekstraksi dan analisis CV dalam format `.pdf` dan `.docx` hanya dalam hitungan detik.
- 🎯 **Skoring ATS Akurat**: Menggunakan AI untuk mengevaluasi lebih dari 15 metrik (Format, Kata Kunci, Pengalaman, dll).
- 💼 **Penyesuaian Posisi**: AI memberikan kritik dan saran spesifik berdasarkan peran/posisi pekerjaan yang sedang kamu lamar.
- 📊 **Riwayat & Metrik**: Semua hasil analisis disimpan di *dashboard* pribadi sehingga kamu bisa memantau perkembangan skormu.
- 🔒 **Aman & Privat**: Proses penguraian *resume* berjalan di server privat tanpa membagikan/menjual data ke pihak ketiga.
- 💎 **Modern SaaS UI**: Dibangun dengan antarmuka pengguna bergaya Neo-Editorial & Soft SaaS yang cantik dan responsif.

## 🛠️ Tech Stack

**Front-End:**
- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/) (Icons)
- [React Dropzone](https://react-dropzone.js.org/)

**Back-End & AI:**
- [Google Generative AI (Gemini)](https://ai.google.dev/)
- [Unpdf](https://github.com/unjs/unpdf) & [Mammoth](https://github.com/mwilliamson/mammoth.js) (Document Parsing)
- [Prisma ORM](https://www.prisma.io/)
- [Supabase](https://supabase.com/) (PostgreSQL Database)

---

## 🚀 Cara Instalasi (Local Development)

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek Dilirik di komputer lokalmu.

### 1. Prasyarat
Pastikan kamu sudah menginstal:
- [Node.js](https://nodejs.org/) (versi 18.x atau terbaru)
- Git
- Akun [Supabase](https://supabase.com/) (untuk Database)
- Akun [Google AI Studio](https://aistudio.google.com/) (untuk mendapatkan API Key Gemini)

### 2. Clone Repository
```bash
git clone https://github.com/USERNAME_KAMU/dilirik.git
cd dilirik
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Konfigurasi Environment Variables
Buat file bernama `.env` di direktori utama (root) proyek, dan isi dengan kredensial berikut:

```env
# Hubungkan ke Supabase (Dapatkan dari Supabase Project Settings -> Database)
DATABASE_URL="postgresql://postgres.[PROYEK_ID]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.[PROYEK_ID]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# Kunci API Google Gemini (Dapatkan dari Google AI Studio)
GEMINI_API_KEY="AIzaSy_GkGk_YOUR_API_KEY_HERE"
```
*(Catatan: Jangan pernah commit file `.env` kamu. File ini sudah otomatis ditambahkan ke `.gitignore`).*

### 5. Sinkronisasi Database (Prisma)
Jalankan perintah ini untuk membangun tabel database di Supabase sesuai dengan skema yang ada:
```bash
npx prisma generate
npx prisma db push
```

### 6. Jalankan Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browsermu untuk melihat hasilnya.

---

## 📂 Struktur Direktori Utama
```text
dilirik/
├── prisma/                 # Skema Database & konfigurasi Prisma ORM
│   └── schema.prisma       # Definisi tabel 'Resume'
├── src/
│   ├── app/                # Next.js 14 App Router (Pages, API Routes)
│   │   ├── api/analyze/    # Endpoint backend untuk ekstraksi file & pemanggilan Gemini AI
│   │   ├── api/history/    # Endpoint backend untuk mengambil riwayat CV dari DB
│   │   └── ...
│   └── components/         # Komponen React (UI)
│       ├── LandingPage.tsx # Halaman muka / Hero section
│       └── AppView.tsx     # Dashboard aplikasi & Modal hasil
├── public/                 # Aset statis
└── ...
```

## 📸 Tampilan (Screenshots)
*(Tambahkan URL gambar screenshot kamu ke sini setelah diunggah ke Github).*

* **Landing Page:**  
  `![Landing Page Screenshot](./path-to-your-image.png)`
* **Upload Dashboard:**  
  `![Dashboard Screenshot](./path-to-your-image.png)`
* **Analisis & Laporan:**  
  `![Result Screenshot](./path-to-your-image.png)`

## 🤝 Berkontribusi
Jika kamu menemukan *bug* atau memiliki ide penambahan fitur:
1. *Fork* repository ini
2. Buat *branch* fitur baru (`git checkout -b feature/FiturKeren`)
3. *Commit* perubahanmu (`git commit -m 'Menambahkan Fitur Keren'`)
4. *Push* ke *branch* (`git push origin feature/FiturKeren`)
5. Buka **Pull Request**

## 👨‍💻 Pembuat (Author)
Dibuat dengan ❤️ oleh **M. Soni Juliansyah**.  
*Feel free to reach out* jika ada pertanyaan seputar proyek ini!

## 📄 Lisensi
Proyek ini dilisensikan di bawah lisensi MIT - lihat file [LICENSE](LICENSE) untuk detail selengkapnya.
