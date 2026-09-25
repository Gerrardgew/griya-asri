import { execSync } from 'node:child_process'

export default function globalSetup() {
  // Idempoten: push + seed ulang tiap run — sekaligus cleanup antar-run.
  // (Kill port 3222 dilakukan di e2e/build.mjs — webServer Playwright sudah
  // menyala SEBELUM globalSetup, jadi kill di sini justru mematikannya.)
  execSync('node e2e/db-setup.mjs', { stdio: 'inherit' })
}
