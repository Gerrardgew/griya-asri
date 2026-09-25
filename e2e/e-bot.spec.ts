// J5 — Bot FAQ: quick-reply, kata kunci, fallback (tidak pernah menggantung).
import { test, expect } from '@playwright/test'

async function bukaBot(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: /Buka asisten chat/ }).click()
  await expect(page.getByTestId('bot-panel')).toBeVisible()
}

test('quick reply menjawab FAQ kategori harga', async ({ page }) => {
  await page.goto('/')
  await bukaBot(page)
  await page.getByRole('button', { name: 'Harga & Cicilan' }).click()
  await expect(page.getByTestId('bot-messages')).toContainText('bervariasi', { timeout: 10_000 })
})

test('pertanyaan bebas cocok via kata kunci', async ({ page }) => {
  await page.goto('/')
  await bukaBot(page)
  await page.locator('#bot-input').fill('berapa uang muka yang harus disiapkan')
  await page.getByRole('button', { name: 'Kirim' }).click()
  await expect(page.getByTestId('bot-messages')).toContainText('DP', { timeout: 10_000 })
})

test('pertanyaan tak dikenal jatuh ke fallback', async ({ page }) => {
  await page.goto('/')
  await bukaBot(page)
  await page.locator('#bot-input').fill('zzzqqq xxxwww')
  await page.getByRole('button', { name: 'Kirim' }).click()
  await expect(page.getByTestId('bot-messages')).toContainText('belum punya jawaban', { timeout: 10_000 })
})
