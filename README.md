# Griya Asri Realty

Website properti yang accessible untuk semua umur — dibangun sebagai portfolio engineering dengan data demo.

> **Demo:** _belum di-deploy — tambahkan URL demo di sini setelah live_
> **Status:** situs demo. Semua proyek, harga, dan kontak bersifat contoh.

© 2026 Gerrardgew. All Rights Reserved — lihat [LICENSE](./LICENSE).

---

## Tentang Proyek

Website showcase properti dengan prioritas ganda: **dapat dipakai mandiri oleh pengguna lansia dan non-tech-savvy** (font besar, bahasa sederhana, satu tombol kontak yang selalu terlihat), sekaligus **menunjukkan kualitas engineering** — SEO teknis penuh, aksesibilitas WCAG AA, security audit tertutup, dan test E2E otomatis.

Perencanaannya terdokumentasi di dua dokumen produk: `PRD.md` (scope, user stories, requirement) dan `DESIGN.md` (design principles, design tokens, component spec).

## Fitur

**Situs publik**
- **Katalog proyek** dengan search & filter (kota, harga, kamar, status) via URL query — hasil tetap dirender server-side, berfungsi tanpa JavaScript
- **Detail proyek**: galeri lightbox (keyboard-navigable), tipe unit, fasilitas, peta lokasi embed, sticky CTA WhatsApp di mobile
- **Kalkulator KPR** dengan rumus anuitas — harga ter-prefill dari tipe unit, hasil bisa dikirim ke sales via WhatsApp (pesan ter-prefill)
- **Bot FAQ** — quick-reply per topik + pencocokan kata kunci, fallback ke kontak manusia, tidak pernah menggantung
- **Panduan & glosarium** — istilah properti (KPR, DP, SHM, PBG) dijelaskan dengan bahasa awam
- **SEO**: metadata per halaman, `sitemap.xml` dinamis, `robots.txt`, JSON-LD (Organization, Product, BreadcrumbList, FAQPage), semua konten server-rendered

**Dashboard admin** (login terproteksi)
- CRUD proyek, tipe unit, FAQ, dan pengaturan situs (nomor WA, hero, jam operasional) — tanpa menyentuh kode
- Alur draft → preview → publish, dengan validasi minimal-1-foto sebelum publish
- Dashboard ringkasan + daftar lead dari form kontak

**Aksesibilitas & keandalan**
- Kontras WCAG AA di seluruh token warna, fokus visible, navigasi keyboard penuh, skip link, `prefers-reduced-motion` dihormati
- Rate limiting (login & form kontak), validasi server-side di semua input, security headers, sesi hardening
- 33 test E2E Playwright di 10 critical user journey

## Arsitektur

```
┌─ src/app/
│  ├─ (publik)/          Halaman publik + chrome (header/footer/bot) — route group
│  │  ├─ proyek/         Index (filter via searchParams) & detail [slug]
│  │  ├─ kalkulator/     Kalkulator KPR (client component, prefill via query)
│  │  └─ kontak|faq|panduan|masuk
│  └─ admin/             Dashboard terproteksi (guard sesi di layout.tsx)
│     └─ actions.ts      9 server actions (CRUD, publish, settings)
├─ src/components/       14 komponen reusable (Server + Client Components)
├─ src/lib/              Domain logic murni:
│  ├─ auth.ts            Sesi cookie HMAC + verifikasi admin ke DB (fail-closed)
│  ├─ kpr.ts             Rumus anuitas + format Rupiah + waLink
│  ├─ data.ts            Query helpers dengan fallback aman (DB gagal ≠ halaman crash)
│  ├─ ratelimit.ts       Fixed-window in-memory (siap ditukar Upstash)
│  └─ validate|slug|jsonld
└─ prisma/               Schema (6 model) + seed dummy env-based
```

**Keputusan arsitektur utama:**

- **Next.js 16 App Router, SSG/ISR-first** — semua konten publik ter-prerender (SEO + LCP), halaman admin dinamis. Data diambil langsung dari Prisma; tidak ada layer API eksternal.
- **Server Actions, bukan REST** — semua mutasi via action + form; origin-check bawaan Next menghilangkan kebutuhan CSRF handler manual.
- **SQLite + Prisma** untuk demo self-contained; skema normal dan siap migrasi PostgreSQL.
- **Async API Next 16** (`cookies()`/`headers()`/`params` sebagai Promise) — migrasi penuh, `npm audit` bersih (0 vulnerabilities).

## Menjalankan Lokal

```bash
npm install
cp .env.example .env    # isi SESSION_SECRET (min 32 char) + kredensial admin
npx prisma db push
npm run db:seed         # 6 proyek dummy + 8 FAQ + akun admin
npm run dev             # http://localhost:3000
```

Dashboard admin: `/masuk` (kredensial sesuai `ADMIN_EMAIL`/`ADMIN_PASSWORD` di `.env`).

## Deploy ke Vercel

SQLite tidak bisa persisten di serverless, jadi produksi memakai **PostgreSQL (Neon)** — schema postgres di-generate otomatis dari schema utama saat build (`npm run build:vercel`), tanpa duplikasi model.

1. **Buat database Neon**: vercel.com → tab **Storage** → **Create Database** → pilih *Neon (Postgres)*. Salin `DATABASE_URL` yang diberikan (format `postgresql://…`), atau buat akun di [neon.tech](https://neon.tech) dan ambil connection string-nya.
2. **Import repo di Vercel**: Add New → Project → pilih `griya-asri` dari GitHub.
3. **Build Command**: ubah menjadi `npm run build:vercel` (di Settings → Build & Output Settings).
4. **Environment Variables** (Settings → Environment Variables), semuanya untuk Production + Preview:
   | Kunci | Nilai |
   |---|---|
   | `DATABASE_URL` | URL Neon dari langkah 1 |
   | `SESSION_SECRET` | string acak ≥32 karakter |
   | `NEXT_PUBLIC_SITE_URL` | URL produksi, mis. `https://griya-asri.vercel.app` (isi setelah tahu URL-nya, lalu redeploy) |
   | `ADMIN_EMAIL` | email admin Anda |
   | `ADMIN_PASSWORD` | password admin Anda (min 8 karakter) |
5. **Deploy**. Build pertama akan men-generate schema postgres + klien Prisma otomatis.
6. **Isi database produksi** dari mesin lokal — buat file `.env.production` (tergitignore) berisi `DATABASE_URL` Neon + `ADMIN_EMAIL`/`ADMIN_PASSWORD` produksi, lalu:
   ```bash
   npm run db:push:pg     # buat tabel di Neon
   npm run db:seed:pg     # isi data dummy + akun admin produksi
   npm run build          # pulihkan Prisma client lokal (sqlite)
   ```

## Testing

```bash
npm run test:e2e        # build + seed DB test + 33 skenario Playwright
npm run test:e2e:ui     # mode interaktif
npx playwright show-report
```

Suite berjalan terisolasi di `e2e.db` + port 3222 (tidak menyentuh data dev), seed ulang tiap run, dan dijalankan otomatis per PR oleh `.github/workflows/e2e.yml`.

## Keamanan

Ringkasan hasil audit pre-launch (14 temuan, semua tertangani): secret wajib via env (fail-fast), cookie `httpOnly`+`Secure`+24 jam dengan revokasi via DB, rate limiting, input capping + URL allowlist http(s), security headers, JSON-LD escape, kredensial tidak pernah di-hardcode/log. Detail di bagian "Keamanan" README versi lengkap — lihat riwayat sesi audit.

## Lisensi

Semua hak dilindungi. Lihat [LICENSE](./LICENSE).
