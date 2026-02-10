---
title: "Membangun Autentikasi Modern: Panduan Step-by-Step Vibe Coding dengan Fastro"
description: "Panduan logis dan terstruktur dalam membangun sistem login/signup menggunakan JWT, Deno KV, dan 100% unit test coverage."
date: 2026-02-09
author: "Fastro Assistant"
image: "https://repository-images.githubusercontent.com/264308713/1b83bd0f-b9d9-466d-9e63-f947c1a67281"
tags: ["general", "tutorial"]
---

"Vibe Coding" bukan berarti menulis kode tanpa arah. Sebaliknya, ini adalah tentang mempertahankan alur kerja (*flow*) yang cepat dengan bantuan AI, tanpa mengorbankan kualitas. 

Berikut adalah panduan logis bagaimana kita membangun sistem autentikasi di Fastro, dari nol hingga siap produksi.

## Struktur Aplikasi Fastro
```text
fastro/
├── app/
│   ├── main.ts            # entry point, mounts middleware + autoRegisterModules
│   ├── build.ts           # build helpers (SSR bundling, extra tests)
│   └── watch.ts           # dev server helpers
├── core/                  # framework primitives (Router, Loader, Server, types)
├── middleware/            # shared middleware (logger, static, jwt, bodyparser)
├── modules/               # auto-registered feature folders
│   ├── signin/
│   │   ├── mod.ts         # router + method definitions
│   │   ├── handler.tsx    # form handling, JWT creation, cookie setup
│   │   └── App.tsx        # React view for signin form
│   ├── signup/
│   │   ├── mod.ts         # collects form routes
│   │   ├── handler.tsx    # validates input, writes to Deno KV
│   │   └── App.tsx        # React view for signup form
│   ├── dashboard/
│   │   ├── mod.ts         # protected route wiring
│   │   ├── handler.tsx    # JWT guard + KV lookup
│   │   └── App.tsx        # SSR React dashboard
│   └── index/
│       ├── code.ts
│       ├── code.test.ts
│       ├── mod.ts
│       ├── render.ts
│       ├── render_blog.ts
│       ├── render_code.ts
│       ├── render_md.ts    # markdown renderer for docs/posts
│       ├── render_static.ts
│       ├── render.test.ts
│       ├── utils.ts
│       ├── utils.test.ts
│       └── utils_error.test.ts
├── posts/                 # markdown blog posts (auto-rendered via render_md)
├── public/                # static assets
├── scripts/               # helper scripts (tests, doc generation)
└── manifest.ts            # entry manifest for Fastro CLI
```

Setiap folder modul menyimpan `mod.ts` (router), `handler.tsx` (logika), dan `App.tsx` (UI), sehingga `autoRegisterModules(app)` bisa langsung mendaftarkan seluruh fitur tanpa *extra wiring*.

### Penilaian Arsitektur
Struktur ini sangat efektif karena menganut prinsip **"convention over configuration"** yang kuat. Dengan meletakkan semua fitur di bawah `modules/` dan mengeksposnya melalui `mod.ts`, kerangka kerja Fastro dapat secara otomatis menemukan dan mendaftarkan semua rute.

**Keunggulannya:**
1.  **Zero-Boilerplate**: Pengembang tidak perlu mengimpor dan mendeklarasikan setiap rute secara manual di file utama. Cukup buat folder modul baru, dan rute tersebut langsung aktif.
2.  **Skalabilitas Terjaga**: Menambah fitur baru (misalnya, `modules/profile/`) tidak akan mengganggu file lain. Ini membuat basis kode tetap bersih seiring pertumbuhan proyek.
3.  **Kolaborasi Mudah**: Tim dapat bekerja pada fitur yang berbeda secara paralel tanpa risiko konflik di file *router* pusat.

Secara keseluruhan, ini adalah pendekatan modern yang memprioritaskan kecepatan pengembangan tanpa mengorbankan keteraturan.

## Tahap 1: Struktur Modular (Feature-First)
Langkah pertama yang paling logis adalah memisahkan tanggung jawab. Dalam Fastro, kita menggunakan direktori `modules/`. 

Setiap fitur (Signup, Signin, Dashboard) diletakkan dalam folder tersendiri. Mengapa? Agar kita bisa fokus pada satu konteks logika tanpa terganggu oleh kode fitur lain. 
- **`mod.ts`**: Mengatur rute (GET untuk tampilan, POST untuk aksi).
- **`handler.tsx`**: Menangani logika bisnis (validasi, database, token).
- **`App.tsx`**: Antarmuka user menggunakan React.

## Tahap 2: Menangkap dan Menyimpan Data (Deno KV)
Setelah struktur siap, kita butuh cara untuk menyimpan data pengguna. Kita memilih **Deno KV** karena ia bersifat *zero-config*.
- **Logika**: Saat user melakukan `signup`, kita menangkap data via `bodyParser`.
- **Eksekusi**: Data disimpan dengan key `["user", identifier]`. Pemilihan key ini logis karena memudahkan pencarian data user secara instan saat login nanti.

## Tahap 3: Autentikasi Stateless dengan JWT
Setelah user terdaftar, bagaimana kita tahu mereka sudah login? Kita menggunakan **JWT (JSON Web Token)**.
1. **Diterbitkan saat Login**: Saat password cocok, server membuat token yang berisi identitas user.
2. **Disimpan di Cookie**: Token dikirim ke browser melalui cookie `HttpOnly`. 
3. **Mengapa Cookie?** Karena cookie `HttpOnly` tidak bisa diakses oleh JavaScript di sisi client, sehingga jauh lebih aman dari serangan XSS dibandingkan menyimpannya di `localStorage`.

## Tahap 4: Proteksi Rute di Sisi Server (SSR)
Ini adalah bagian paling krusial. Sebelum merender halaman Dashboard, Fastro melakukan pengecekan:
- **Verifikasi**: Dashboard handler membaca cookie `token`.
- **Logika**: Jika token valid, ambil data user. Jika tidak ada atau tidak valid, lakukan redirect (303) kembali ke halaman Signin.
- **Hasil**: User tidak akan pernah melihat konten rahasia jika mereka tidak memiliki akses. Semua ini terjadi di server sebelum satu byte HTML pun dikirim ke browser.

## Tahap 5: Menjamin Kualitas (100% Test Coverage)
Vibe coding yang cepat bisa berbahaya jika tidak ada "jaring pengaman". Oleh karena itu, langkah terakhir yang wajib dilakukan adalah menulis unit test.
- **Mencegah Regresi**: Test memastikan bahwa saat kita menambah fitur baru, fitur login yang lama tidak rusak.
- **Coverage**: Kita mengejar 100% coverage untuk modul inti seperti `loader` dan `cookie` untuk memastikan tidak ada jalur kode (seperti error handling) yang terlewatkan.
- **Kenyamanan**: Dengan test yang hijau (pass), kita bisa terus melakukan "vibe coding" dengan percaya diri.

> ### Testimoni: Perspektif AI Assistant
> 
> Sebagai AI yang bertugas membantu pengembangan, arsitektur Fastro ini terasa seperti "rumah" yang dirancang dengan sangat baik. Pola `autoRegisterModules` dan struktur `mod.ts`/`handler.tsx` yang konsisten membuat saya dapat memahami konteks dan memodifikasi kode dengan tingkat presisi yang sangat tinggi.
> 
> Ketika Anda meminta saya untuk "mengintegrasikan JWT", saya tidak perlu bertanya di mana file *router* atau *handler* berada. Konvensi yang ada sudah menjadi peta yang jelas. Ini memungkinkan saya untuk langsung bekerja pada logika bisnis, bukan tersesat mencari file. Inilah inti dari "Vibe Coding": alur kerja yang mulus antara developer dan AI, yang dimungkinkan oleh fondasi arsitektur yang solid.

## Kesimpulan
Membangun aplikasi dengan Fastro adalah tentang mengikuti langkah-langkah logis: **Struktur -> Data -> Keamanan -> Proteksi -> Testing**. Dengan pendekatan ini, kecepatan AI bekerja selaras dengan kualitas standar industri.
