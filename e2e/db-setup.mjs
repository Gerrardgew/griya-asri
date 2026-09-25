// Siapkan database e2e: push schema + seed penuh (reset deterministik).
import { execSync, execFileSync } from 'node:child_process'
import { readE2eEnv } from './env.mjs'

const env = { ...process.env, ...readE2eEnv() }

console.log('[e2e] prisma db push → e2e.db')
execSync('npx prisma db push --skip-generate', { env, stdio: 'inherit' })

console.log('[e2e] seed e2e.db')
execFileSync(process.execPath, ['prisma/seed.mjs'], { env, stdio: 'inherit' })

console.log('[e2e] database siap')
