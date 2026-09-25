// Pilih provider Prisma otomatis dari DATABASE_URL (Vercel + lokal).
// postgresql://… → generate varian postgres (schema.postgres.prisma),
// selain itu (sqlite) → generate schema utama. Dipanggil oleh `npm run build`
// sehingga deploy Vercel butuh nol konfigurasi build command manual.
import { execSync } from 'node:child_process'
import fs from 'node:fs'

let url = process.env.DATABASE_URL ?? ''
if (!url) {
  // Lokal: baca .env bila ada (Vercel sudah menyuntik env ke proses).
  try {
    for (const line of fs.readFileSync(new URL('../.env', import.meta.url), 'utf8').split('\n')) {
      const m = line.match(/^\s*DATABASE_URL\s*=\s*"?([^"\n]*)"?\s*$/)
      if (m) {
        url = m[1]
        break
      }
    }
  } catch {
    // .env tidak ada — biarkan kosong, jatuh ke sqlite.
  }
}

if (url.startsWith('postgresql://') || url.startsWith('postgres://')) {
  console.log('[prisma] DATABASE_URL postgres → generate client postgresql')
  execSync('node prisma/make-postgres-schema.mjs', { stdio: 'inherit' })
  execSync('npx prisma generate --schema prisma/schema.postgres.prisma', { stdio: 'inherit' })
} else {
  console.log('[prisma] DATABASE_URL sqlite/absen → generate client sqlite')
  execSync('npx prisma generate', { stdio: 'inherit' })
}
