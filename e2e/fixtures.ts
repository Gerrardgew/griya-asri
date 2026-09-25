// Fixture admin: injeksi cookie sesi HMAC langsung dari SESSION_SECRET e2e —
// test admin tidak mengulang flow login (J7 mengujinya secara terpisah).
import { test as base, expect } from '@playwright/test'
import type { Page } from '@playwright/test'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

function e2eEnv(): Record<string, string> {
  const raw = fs.readFileSync(path.join(__dirname, '..', '.env.e2e'), 'utf8')
  const env: Record<string, string> = {}
  for (const line of raw.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/)
    if (m) env[m[1]] = m[2]
  }
  return env
}

export const E2E_ADMIN_EMAIL = e2eEnv().ADMIN_EMAIL
export const E2E_ADMIN_PASSWORD = e2eEnv().ADMIN_PASSWORD

function signSession(email: string): string {
  const secret = e2eEnv().SESSION_SECRET
  const body = Buffer.from(JSON.stringify({ email, exp: Date.now() + 3_600_000 })).toString('base64url')
  const sig = crypto.createHmac('sha256', secret).update(body).digest('base64url')
  return `${body}.${sig}`
}

export const test = base.extend<{ adminPage: Page }>({
  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: {
        cookies: [
          {
            name: 'gas_session',
            value: signSession(E2E_ADMIN_EMAIL),
            domain: 'localhost',
            path: '/',
            httpOnly: true,
            sameSite: 'Lax',
          },
        ],
        origins: [],
      },
    })
    const page = await context.newPage()
    await use(page)
    await context.close()
  },
})

export { expect }
