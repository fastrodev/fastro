---
title: "Membangun CMS Performa Tinggi dengan Fastro, Deno Deploy, dan Deno KV"
description: "Bagaimana kami membangun CMS Fastro hanya menggunakan Deno, Fastro, dan Markdown—dengan manajemen konten modern berbasis Deno KV."
date: 2026-02-15
author: "Fastro Team"
tags: ["cms", "markdown", "deno-kv"]
image: "https://storage.googleapis.com/replix-394315-file/uploads/dashboard.jpg"
---

![blog](https://storage.googleapis.com/replix-394315-file/uploads/dashboard.jpg)

Saat kami membangun CMS Fastro, kami menginginkan sesuatu yang cepat, mudah dirawat, dan hemat biaya. Kami menggunakan produk kami sendiri: **Fastro** di **Deno Deploy**.

Hasilnya? CMS performa tinggi yang berjalan sepenuhnya secara **GRATIS**, tanpa database tradisional, dan ditenagai oleh file Markdown serta manajemen konfigurasi berbasis **Deno KV**.

## Stack Teknologi Modern

Stack kami dirancang seefisien mungkin:
- **Framework**: [Fastro](https://fastro.dev) (Framework Deno untuk Fullstack)
- **Runtime**: [Deno](https://deno.com)
- **Storage**: Gabungan sistem file (Markdown) dan **Deno KV** (Konfigurasi & Meta)
- **Deployment**: [Deno Deploy](https://deno.com/deploy)
- **UI**: React 19 dengan Server Side Rendering (SSR) dan Tailwind CSS.

## Apa yang Baru?

Kami baru saja mengintegrasikan fitur-fitur canggih untuk mempermudah manajemen konten langsung dari dashboard CMS:

### 1. Manajemen Navigasi Dinamis via Deno KV
Dulu, menu navigasi di header bersifat statis. Sekarang, kami menggunakan **Deno KV** untuk menyimpan konfigurasi halaman. Melalui dashboard CMS, kami bisa menentukan hingga 4 halaman utama (dari folder `/pages`) yang berhak tampil di navigasi situs secara *real-time* tanpa perlu deploy ulang.

### 2. Manajemen Konten & Git Terintegrasi
Kami telah menambahkan fitur untuk mengelola postingan dan aset media secara langsung melalui dashboard:
- **Post Management**: Kita bisa membuat dan mengelola postingan Markdown langsung dari browser. Semua perubahan ini dikelola menggunakan perintah Git yang sudah terintegrasi melalui handler di sisi server (Git via API).
- **Media Management**: Upload dan hapus aset gambar CMS langsung dari UI.
- **Git Dashboard**: Pantau file yang baru ditambahkan (*untracked*), dimodifikasi, hingga yang dihapus (*deleted*). Kita bisa melakukan *Add*, *Commit*, dan *Push* langsung dari dashboard tanpa perlu menyentuh terminal.

> **Catatan**: Saat ini, fitur manajemen konten via Git ini hanya tersedia ketika aplikasi dijalankan di `localhost`. Di versi berikutnya, kami berencana mengintegrasikan fitur ini dengan **GitHub API** agar dapat berfungsi penuh di lingkungan **Deno Deploy**.

### 3. Keamanan & Environment Guard
CMS ini dirancang dengan deteksi lingkungan yang cerdas. Fitur-fitur kritikal seperti operasi Git dan manajemen file sensitif secara otomatis diproteksi dengan *guard* saat berjalan di **Deno Deploy**, memastikan integritas sistem tetap terjaga di lingkungan produksi.

## Mengapa Tetap Tanpa Database Tradisional?

Kami tetap setia pada prinsip minimalis:
1.  **Kontrol Versi di Git**: Konten Markdown tetap berada di Git sebagai sumber kebenaran data.
2.  **Deno KV untuk State**: Menggunakan Deno KV untuk konfigurasi aplikasi memberikan latensi yang jauh lebih rendah dibandingkan database SQL/NoSQL konvensional.
3.  **Metrik Real-time**: Dashboard CMS sekarang menampilkan jumlah file `/pages`, `/posts`, dan `/public/img` secara instan, memberikan gambaran kapasitas penyimpanan.

## Biaya: Tetap $0.00

Dengan jejak memori Fastro yang sangat kecil dan efisiensi Deno KV dalam paket *free tier* Deno Deploy, CMS ini tetap berjalan tanpa biaya operasional sepeser pun.

## Kesimpulan

Membangun CMS modern tidak lagi berarti terjebak dalam kompleksitas sistem yang berat. Dengan kombinasi **Markdown** untuk konten dan **Deno KV** untuk manajemen state, Anda mendapatkan CMS yang tangguh, cepat, dan sangat mudah dikelola.

Pantau terus update selanjutnya saat kami terus mengevolusi CMS Fastro!
