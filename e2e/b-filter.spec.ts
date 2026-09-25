// J2 — Search & filter: form GET → URL query → hasil terfilter → reset → empty state.
import { test, expect } from '@playwright/test'

test('filter kota memfilter hasil dan tercermin di URL', async ({ page }) => {
  await page.goto('/proyek')
  await expect(page.getByTestId('hasil-count')).toContainText('6 dari 6')

  await page.getByLabel('Kota').selectOption('Bogor')
  await page.getByRole('button', { name: 'Terapkan filter' }).click()

  await expect(page).toHaveURL(/kota=Bogor/)
  await expect(page.getByTestId('hasil-count')).toContainText('2 dari 2')
  await expect(page.getByTestId('project-card')).toHaveCount(2)
})

test('filter tak cocok menampilkan empty state + reset', async ({ page }) => {
  await page.goto('/proyek?kota=Bogor&harga_max=300000000')
  await expect(page.getByText('Tidak ada proyek yang cocok dengan filter Anda')).toBeVisible()

  // Reset di empty state adalah <a> (role link), bukan <button>.
  await page.locator('a', { hasText: 'Reset filter' }).last().click()
  await expect(page).toHaveURL(/\/proyek$/)
  await expect(page.getByTestId('hasil-count')).toContainText('6 dari 6')
})

test('pencarian kata kunci via URL langsung (tanpa JS form)', async ({ request }) => {
  // Verifikasi server-side: hasil filter dirender tanpa perlu interaksi JS.
  const res = await request.get('/proyek?q=riverside')
  expect(res.ok()).toBeTruthy()
  const html = await res.text()
  expect(html).toContain('Griya Asri Riverside')
  expect(html).not.toContain('Griya Asri Parkview')
})
