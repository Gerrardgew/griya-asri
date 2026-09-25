// Build produksi dengan env e2e (hasil prerender memakai e2e.db).
import { execSync, spawnSync } from 'node:child_process'
import { readE2eEnv } from './env.mjs'

const env = { ...process.env, ...readE2eEnv() }

// Bunuh sisa server di port 3222 (run sebelumnya / server manual) SEBELUM
// Playwright menyentuh port — webServer dinyalakan setelah script ini.
if (process.platform === 'win32') {
  try {
    execSync(
      `for /f "tokens=5" %a in ('netstat -ano ^| findstr ":3222" ^| findstr "LISTENING"') do taskkill /F /PID %a`,
      { stdio: 'pipe' }
    )
  } catch {
    // tidak ada yang listen — abaikan
  }
}

execSync('node e2e/db-setup.mjs', { stdio: 'inherit' })

console.log('[e2e] next build (env e2e)')
const r = spawnSync('npx', ['next', 'build'], { env, stdio: 'inherit', shell: true })
process.exit(r.status ?? 1)
