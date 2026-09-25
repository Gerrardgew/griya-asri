// Parser .env sederhana untuk script e2e (node murni, tanpa dep).
import fs from 'node:fs'

const FILE = new URL('./../.env.e2e', import.meta.url)

export function readE2eEnv() {
  const raw = fs.readFileSync(FILE, 'utf8')
  const env = {}
  for (const line of raw.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/)
    if (m) env[m[1]] = m[2]
  }
  return env
}
