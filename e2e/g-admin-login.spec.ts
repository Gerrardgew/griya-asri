// J7 — Login & session guard: redirect, kredensial salah, sukses, logout.
import { test, expect, E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD } from './fixtures'

test('tanpa sesi, /admin redirect ke halaman masuk', async ({ page }) => {
  await page.goto('/admin')
  await expect(page).toHaveURL(/\/masuk$/)
})

test('password salah menampilkan error', async ({ page }) => {
  await page.goto('/masuk')
  await page.locator('#m-email').fill(E2E_ADMIN_EMAIL)
  await page.locator('#m-sandi').fill('password-yang-salah')
  await page.getByRole('button', { name: 'Masuk', exact: true }).click()
  // p[role="alert"] — getByRole('alert') menabrak route announcer bawaan Next.
  await expect(page.locator('p[role="alert"]')).toContainText('Email atau kata sandi salah')
})

test('login benar masuk dashboard, logout mematikan sesi', async ({ page }) => {
  await page.goto('/masuk')
  await page.locator('#m-email').fill(E2E_ADMIN_EMAIL)
  await page.locator('#m-sandi').fill(E2E_ADMIN_PASSWORD)
  await page.getByRole('button', { name: 'Masuk', exact: true }).click()

  await expect(page).toHaveURL(/\/admin$/)
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  await expect(page.getByText(E2E_ADMIN_EMAIL)).toBeVisible()

  await page.getByRole('button', { name: 'Keluar' }).click()
  await expect(page).toHaveURL(/\/masuk$/)

  await page.goto('/admin')
  await expect(page).toHaveURL(/\/masuk$/)
})
