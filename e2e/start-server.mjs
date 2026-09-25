// Jalankan server produksi di port 3222 dengan env e2e (dipakai webServer Playwright).
import { spawn } from 'node:child_process'
import { readE2eEnv } from './env.mjs'

const env = { ...process.env, ...readE2eEnv() }
const child = spawn('npx', ['next', 'start', '-p', '3222'], { env, stdio: 'inherit', shell: true })

// Teruskan sinyal agar Playwright bisa memberhentikan server dengan bersih.
for (const sig of ['SIGTERM', 'SIGINT']) {
  process.on(sig, () => {
    child.kill(sig)
    process.exit(0)
  })
}
child.on('exit', (code) => process.exit(code ?? 0))
