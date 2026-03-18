---
title: "Konsep Aplikasi Loyalti Sederhana untuk Pedagang Sembako & Gas"
description: "Desain dan alur kerja sistem loyalti: setiap item (termasuk Gas LPG) punya konfigurasi sendiri untuk hadiah gratis setelah sejumlah pembelian."
date: 2026-02-25
author: "Tim Fastro"
tags: ["concept"]
image: https://storage.googleapis.com/replix-394315-file/uploads/loyalti.jpg
---

![Loyalti](https://storage.googleapis.com/replix-394315-file/uploads/loyalti.jpg)

| Status | Keterangan |
|--------|-----------|
| 🔵 Konsep | Masih dalam tahap perencanaan dan desain. Belum ada implementasi kode. |

# Cara Kerjanya

Konsepnya sederhana: semakin sering pelanggan membeli suatu barang, semakin banyak kesempatan mereka mendapat barang itu gratis. **Kuncinya adalah fleksibilitas**; setiap barang punya aturan main (target) yang berbeda-beda tergantung margin keuntungan barang tersebut.

## Alur Dasar

1.  **Pelanggan Membeli Barang** — Mis. beras, minyak, atau **Gas LPG 3kg** yang masuk dalam program loyalti.
2.  **Toko Mencatat Pembelian** — Sistem (atau kasir) menghitung total akumulasi pembelian pelanggan untuk barang spesifik tersebut.
3.  **Jumlah Pembelian Mencapai Target** — Ketika hitungan mencapai angka yang ditentukan (mis. setiap 12 tabung gas), pelanggan berhak dapat 1 barang gratis.
4.  **Hadiah Diberikan** — Bisa langsung diberikan saat transaksi (sebagai diskon 100% untuk 1 barang) atau berupa kupon klaim.
5.  **Otomatisasi Sisa Poin** — Jika pembelian pelanggan melebihi target, sisa poin tidak hangus, melainkan langsung dihitung sebagai tabungan untuk hadiah berikutnya.

## Konfigurasi Contoh Produk

Sistem memungkinkan admin toko mengatur "Target Gratisan" yang berbeda agar toko tetap untung (terutama untuk barang subsidi dengan margin tipis).

| Nama Produk | Harga Jual (HET) | Aturan Loyalti | Harga Efektif |
| :--- | :--- | :--- | :--- |
| **Minyak Goreng** | Rp18.000 | Beli 9 Gratis ke-10 | Rp16.200 |
| **Gas LPG 3kg** | Rp19.000 | **Beli 12 Gratis ke-13** | **Rp17.538** |

## Contoh Nyata: Skenario Gas LPG

Toko menetapkan aturan: **"Setiap pembelian Gas LPG 3kg yang ke-13 adalah GRATIS"** (Sistem 12+1).

* **Status Awal:** Pak Budi sudah tercatat membeli **11 tabung gas** dalam 3 bulan terakhir.
* **Transaksi Hari Ini:** Pak Budi datang membawa hajatan dan membeli **5 tabung gas** sekaligus.
* **Perhitungan Sistem:**
    * Total Akumulasi: $11 + 5 = 16$ tabung.
    * Ambang Batas Hadiah: 12 tabung.
    * **Hasil:** Pak Budi berhak mendapatkan **1 Tabung Gas Gratis** saat itu juga.
* **Sisa Saldo Poin:** * Sistem menghitung: $16 - 12 = 4$.
    * Jadi, untuk pembelian berikutnya, Pak Budi sudah punya modal **4 poin**. Dia hanya butuh 8 tabung lagi untuk dapat gratisan berikutnya.

> **Catatan Bisnis:** Strategi ini sangat efektif untuk Gas LPG karena harganya dipatok HET (Rp19.000). Dengan skema "Beli 12 Gratis 1", toko tetap mendapatkan keuntungan yang sehat namun pelanggan merasa sangat dihargai dibandingkan membeli di pengecer lain.

---

Simpel, menguntungkan, dan pelanggan senang bolak-balik belanja.