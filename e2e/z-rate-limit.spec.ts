// Rate limit login (audit #4) — file "z-" sengaja paling akhir (serial, workers=1):
// bucket in-memory 'login:lokal' sudah terpakai beberapa kali oleh g-admin-login;
// test ini menghabiskan sisa kuota lalu memastikan pesan pembatasan muncul.
// SETELAH file ini, bucket login terkunci ±15 menit — jangan menaruh test login
// lain setelah sini. Itulah sebabnya file ini terakhir dan hanya sekali.
import { test, expect, E2E_ADMIN_EMAIL } from './fixtures'

test('brute force login dihentikan setelah kuota habis', async ({ page }) => {
  let terblokir = false

  for (let i = 0; i < 8; i++) {
    await page.goto('/masuk')
    await page.locator('#m-email').fill(E2E_ADMIN_EMAIL)
    await page.locator('#m-sandi').fill(`salah-${i}`)
    await page.getByRole('button', { name: 'Masuk', exact: true }).click()
    await page.waitForURL(/\/masuk\?err=/)

    const alert = page.locator('p[role="alert"]') // hindari route announcer Next
    if ((await alert.textContent())?.includes('Terlalu banyak percobaan login')) {
      terblokir = true
      break
    }
  }

  expect(terblokir).toBe(true)
  await expect(page.locator('p[role="alert"]')).toContainText('Terlalu banyak percobaan login')
})
