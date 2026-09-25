// Generate schema.postgres.prisma dari schema.prisma (single source of truth):
// ganti provider sqlite -> postgresql. Dipakai build Vercel + setup DB produksi.
import fs from 'node:fs'

const SRC = new URL('./schema.prisma', import.meta.url)
const OUT = new URL('./schema.postgres.prisma', import.meta.url)

const src = fs.readFileSync(SRC, 'utf8')
if (!/provider\s*=\s*"sqlite"/.test(src)) {
  console.error('schema.prisma tidak memakai provider sqlite — tidak ada yang diubah.')
  process.exit(1)
}
const out = src
  .replace(/provider\s*=\s*"sqlite"/, 'provider = "postgresql"')
  .replace(
    /\/\/ Lokal & E2E memakai SQLite[\s\S]*?datasource db/,
    '// GENERATED oleh prisma/make-postgres-schema.mjs — JANGAN edit langsung.\ndatasource db'
  )
fs.writeFileSync(OUT, out)
console.log('[schema] schema.postgres.prisma digenerate.')
