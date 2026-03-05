---
description: Identifikasi Pola Repositori Fastro
---

# Alur Kerja Identifikasi Pola Repositori Fastro

Gunakan alur kerja ini untuk memahami struktur dan pola desain yang digunakan dalam repositori Fastro ini. Alur ini membantu Antigravity dalam memberikan saran kode yang konsisten dengan arsitektur yang sudah ada.

## Dasar Teknologi
- **Runtime**: Deno
- **Framework**: Fastro
- **Styling**: Tailwind CSS (v4)
- **UI**: React 19 (SSR & Client Hydration)
- **Database**: Deno KV

## Langkah-langkah Identifikasi Pola:

### 1. Eksplorasi Struktur Modul
Lihat direktori `modules/` untuk memahami pemisahan fitur.
- **`mod.ts`**: Entry point modul. Mengekspor fungsi default `register(app: Server)` untuk meregistrasi router dan middleware spesifik modul.
- **`handler.tsx`**: Berisi logika penanganan request. Biasanya menggunakan `ctx.renderToString` untuk SSR.
- **`App.tsx`**: Komponen utama React untuk UI.
- **Pola Impor**: Selalu gunakan `../../deps.ts` untuk library eksternal dan core framework.

### 2. Analisis Registrasi Rute & Autoloading
- Rute utama dikelola di `app.ts`.
- Fungsi `autoRegisterModules(app)` digunakan untuk memuat semua modul di `modules/` secara otomatis.
- Di lingkungan Deno Deploy, `manifest.ts` digunakan sebagai fallback. Jalankan `deno task gen-manifest` setiap ada perubahan modul.

### 3. Pola SSR (Server-Side Rendering)
Identifikasi bagaimana data dilewatkan dari server ke client.
- **Server Side**: `ctx.renderToString(<App ... />, options)` di `handler.tsx`.
- **Options**: Sertakan `title`, `module` (nama direktori modul), dan `initialProps`.
- **Head**: Biasanya menyertakan meta tags dan link ke `/css/app.css`.

### 4. Pola Middleware & Context (`ctx`)
- **Middlewares**: `logger`, `cookieMiddleware`, `bodyParser`, `kvMiddleware`, `tailwind`.
- **Context API**:
    - `ctx.kv`: Akses ke Deno KV.
    - `ctx.cookies`: Akses ke cookies.
    - `ctx.setCookie`: Fungsi untuk mengatur cookie.
    - `ctx.renderToString`: Fungsi untuk rendering React.

### 5. Pola Data & Keamanan
- **Hashing**: Gunakan `utils/password.ts` untuk hashing password.
- **Auth**: Menggunakan JWT yang disimpan di cookie `token`.
- **Validation**: Validasi form biasanya dilakukan langsung di handler menggunakan `ctx.state.formData` atau `req.formData()`.

### 6. Development Workflow
- **`deno task start`**: Menjalankan server dengan watch mode dan build CSS.
- **`deno task cov`**: Menjalankan tes dengan laporan coverage 100%.

## Tips untuk Antigravity:
- **Konsistensi**: Ikuti pola pemberian nama dan struktur yang sudah ada di `modules/signin` atau `modules/user`.
- **Testing**: Pastikan setiap rute baru memiliki tes yang sesuai untuk menjaga coverage 100%.
- **Manifest**: Jangan lupa ingatkan user untuk menjalankan `deno task gen-manifest` jika ada file `mod.ts` baru.
