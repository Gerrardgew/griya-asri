# Griya Asri Realty — Website Property Accessible (Portfolio Demo)

Website property/real-estate frontend yang accessible untuk semua umur, dibangun sesuai `PRD.md` dan `DESIGN.md` di workspace ini.

**Status: situs demo.** Semua proyek, harga, dan kontak adalah data contoh.

## Tech Stack

- **Next.js 16 (App Router) + React 19 + TypeScript** — SSG/ISR untuk SEO terbaik
- **Tailwind CSS** — design tokens dari DESIGN.md
- **Prisma + SQLite** — database ringan untuk demo (skema siap migrasi ke PostgreSQL)
- **next/font** — Lora (display) + Public Sans (body)
- Tanpa CMS eksternal — admin dashboard custom dengan server actions

## Menjalankan Lokal

```bash
npm install
npx prisma db push      # buat database SQLite dari schema
npm run db:seed         # isi data dummy (6 proyek, FAQ, admin, konfigurasi)
npm run dev             # buka http://localhost:3000
```

**Login admin:** http://localhost:3000/masuk — kredensial diatur lewat `ADMIN_EMAIL` / `ADMIN_PASSWORD` di `.env` (dipakai `npm run db:seed`; min. 8 karakter). Lihat `.env.example`.

## Fitur MVP (sesuai PRD)

| Fitur | Status |
|---|---|
| Homepage showcase + hero editable | ✅ |
| Daftar proyek + search/filter via URL (jalan tanpa JS) | ✅ |
| Detail proyek: galeri lightbox, tipe unit, peta, sticky CTA | ✅ |
| Kalkulator KPR (anuitas, hasil terkirim ke WA) | ✅ |
| Bot chat FAQ statis (quick-reply + keyword, fallback WA) | ✅ |
| Kontak WA/email + form → Lead | ✅ |
| Panduan & glosarium (KPR, DP, SHM, PBG) | ✅ |
| Admin: CRUD proyek/unit/FAQ/pengaturan, draft/preview/publish | ✅ |
| Aksesibilitas: toggle A−/A/A+, skip link, keyboard nav, ARIA | ✅ |
| SEO: metadata, sitemap.xml, robots.txt, JSON-LD | ✅ |

## Struktur Penting

```
prisma/schema.prisma      # data model (Project, UnitType, Faq, Lead, AdminUser, SiteConfig)
prisma/seed.mjs           # data dummy
src/lib/                  # db, auth (session HMAC), kpr (anuitas), data helpers
src/app/(publik)/         # halaman publik + chrome (header/footer/bot)
src/app/admin/            # dashboard admin (terproteksi session)
src/components/           # komponen reusable sesuai DESIGN.md §7
```

## Testing E2E (Playwright)

Suite E2E menguji 33 skenario di 10 critical user journey (jelajah proyek, filter, kalkulator KPR, kontak, bot FAQ, SEO artefak, login/guard, CRUD proyek, tipe unit & FAQ, pengaturan, rate limit).

```bash
npm run test:e2e      # build + seed DB test + jalankan semua (headless)
npm run test:e2e:ui   # mode UI interaktif (pilih test, lihat trace)
npm run test:e2e:ci   # sama dengan test:e2e, untuk CI (tanpa reuse server)
npx playwright show-report   # buka laporan HTML setelah run
```

Yang perlu diketahui:

- **Isolasi penuh**: suite memakai database terpisah (`e2e.db`) dan port khusus (3222), di-push + seed ulang setiap run. Database dev Anda (`dev.db` di port 3111) tidak tersentuh.
- **Kredensial test**: `ADMIN_EMAIL`/`ADMIN_PASSWORD` di `.env.e2e` (bukan kredensial dev). Fixture `adminPage` menandatangani cookie sesi langsung dari `SESSION_SECRET` test — test admin tidak mengulang login.
- **Urutan penting**: test berjalan serial (workers=1); rate-limit test (`z-*.spec.ts`) sengaja paling akhir karena mengunci bucket login ±15 menit.
- **CI**: `.github/workflows/e2e.yml` menjalankan suite di setiap PR/push main; report + trace di-upload sebagai artifact saat gagal.

## Keamanan (hasil audit pre-launch)

- **Secret:** `SESSION_SECRET` wajib ada di env (aplikasi gagal start tanpanya); `.env` tidak di-commit (lihat `.gitignore`).
- **Sesi:** cookie `httpOnly` + `SameSite=Lax` + `Secure` di produksi, usia 24 jam, dan divalidasi ulang ke database (admin nonaktif langsung kehilangan akses).
- **Rate limit:** login maks 5 percobaan/15 menit/IP, form kontak maks 5/jam/IP (in-memory — untuk multi-instance ganti Upstash di `src/lib/ratelimit.ts`).
- **Input:** semua field dibatasi panjang di server; URL foto hanya http(s); koordinat divalidasi range.
- **Headers:** `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS (produksi), CSP Report-Only (lihat `next.config.mjs`).
- **Dependency:** `npm audit` bersih (0 vulnerabilities) sejak migrasi Next 16.3.6 + React 19 — menutup CVE critical/high era Next 14 (termasuk GHSA-p293-qw3h-jr36 RCE Windows & postcss).
- **JSON-LD:** di-escape lewat `safeJsonLd()` agar `</script>` tidak bisa breakout.
- Kredensial admin tidak pernah di-hardcode maupun di-log.

## Catatan Produksi

- Ganti `SESSION_SECRET` di `.env` dengan string acak ≥32 karakter sebelum deploy.
- `NEXT_PUBLIC_SITE_URL` dipakai untuk canonical/sitemap — sesuaikan dengan domain.
- SQLite cocok untuk demo; untuk deploy multi-instance (mis. Vercel), migrasi ke PostgreSQL cukup ganti `provider` di `schema.prisma`.
- Foto dummy memakai picsum.photos (sudah di-allowlist `next.config.mjs`).
