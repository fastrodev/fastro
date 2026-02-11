---
title: "Membangun Blog Performa Tinggi dengan Fastro dan Deno Deploy"
description: "Bagaimana kami membangun blog Fastro hanya menggunakan Deno, Fastro, dan Markdown—dihosting secara gratis di Deno Deploy tanpa database."
date: 2026-02-11
author: "Fastro Team"
tags: ["blog", "markdown"]
image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=60"
---

![blog](https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=60)

Saat kami memutuskan untuk membangun blog Fastro, kami memiliki batasan yang jelas: harus cepat, mudah dirawat, dan hemat biaya. Kami memutuskan untuk menggunakan produk kami sendiri, yaitu **Fastro** di **Deno Deploy**.

Hasilnya? Sebuah blog berkinerja tinggi yang berjalan sepenuhnya secara **GRATIS**, tanpa database, dan ditenagai oleh file Markdown biasa.

## Stack Teknologi

Stack kami sengaja dibuat minimalis:
- **Framework**: [Fastro](https://fastro.dev) (tentu saja!)
- **Runtime**: [Deno](https://deno.com)
- **Deployment**: [Deno Deploy](https://deno.com/deploy) (Integrasi GitHub klasik)
- **Konten**: File Markdown (.md) lokal
- **Penyimpanan**: Tanpa database. Kami menggunakan sistem file.

## Mengapa Tanpa Database?

Untuk sebuah blog, database seringkali berlebihan. Intinya, blog adalah kumpulan dokumen. Dengan menggunakan file Markdown:
1.  **Kontrol Versi**: Konten kami ada di Git. Setiap perubahan terlacak.
2.  **Zero Latency**: Membaca file dari memori atau disk lokal (cache) jauh lebih cepat daripada koneksi ke database.
3.  **Portability**: Kami bisa memindahkan konten ke mana saja. Hanya berupa teks biasa.

## Cara Kerjanya

### 1. Routing Sederhana
Menggunakan router Fastro, kami mendefinisikan dua endpoint utama:
- `/blog`: Menampilkan daftar semua postingan dengan membaca direktori `posts/`.
- `/blog/:post`: Membaca file `.md` spesifik dan merendernya.

### 2. Pemrosesan Markdown & Frontmatter
Kami menggunakan fungsi bawaan `Deno.readTextFile` untuk memuat konten. Untuk mengekstrak metadata seperti judul, tanggal, gambar, dan tag, kami menggunakan **Frontmatter** yang diproses menggunakan regex sederhana. Teknik ini memungkinkan kami memisahkan metadata dari konten utama Markdown tanpa memerlukan library eksternal yang berat.

### 3. Sistem Tag & Pencarian
Meskipun tanpa database, blog ini mendukung fitur pencarian dan kategori tag:
- **Tag**: Diekstrak langsung dari frontmatter setiap file. Kami mengumpulkan semua tag unik untuk ditampilkan sebagai filter di halaman utama blog.
- **Pencarian**: Dilakukan secara *on-the-fly*. Saat pengguna memasukkan kata kunci, sistem akan melakukan filter pada daftar postingan berdasarkan judul, konten, dan tag yang sudah dimuat ke dalam memori. Ini sangat cepat karena jumlah dokumen yang masih terkelola dengan baik.

### 4. Deployment di Deno Deploy
Integrasi GitHub di Deno Deploy membuat proses CI/CD menjadi otomatis. Setiap kali kami melakukan push file `.md` baru ke folder `posts/`, blog akan langsung terupdate. Performa jaringan edge global Deno memastikan pengguna mendapatkan konten dengan latensi minimal.

## Biaya: $0.00

Karena jejak (footprint) Fastro dan Deno yang sangat kecil, kami tetap berada dalam batas paket gratis Deno Deploy yang sangat murah hati. Tanpa biaya hosting, tanpa biaya database, tanpa biaya pemeliharaan.

## Kesimpulan

Membangun blog modern tidak memerlukan CMS yang kompleks atau database berbayar. Dengan **Fastro** dan **Deno**, Anda dapat membangun blog yang tangguh, dapat dicari, dan sangat cepat hanya dengan menggunakan alat yang biasa Anda gunakan saat coding.

Pantau terus update selanjutnya saat kami terus mengeksplorasi batas kemungkinan dengan Fastro!
