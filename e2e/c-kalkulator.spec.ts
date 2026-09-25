// J3 — Kalkulator KPR: prefill dari tipe unit, hasil live, input invalid, prefll WA.
import { test, expect } from '@playwright/test'

test('dari kartu tipe unit: harga ter-prefill dan angsuran dihitung', async ({ page }) => {
  await page.goto('/proyek/griya-asri-parkview')
  await page.getByRole('link', { name: 'Simulasi KPR' }).first().click()

  await expect(page).toHaveURL(/\/kalkulator\?harga=480000000/)
  await expect(page.locator('#kpr-harga')).toHaveValue('480000000')
  await expect(page.getByTestId('kpr-angsuran')).toContainText('Rp')
})

test('ubah tenor mengubah angsuran', async ({ page }) => {
  await page.goto('/kalkulator?harga=480000000')
  const awal = await page.getByTestId('kpr-angsuran').textContent()

  await page.getByLabel(/Tenor/).selectOption('20')
  const sesudah = await page.getByTestId('kpr-angsuran').textContent()

  expect(awal).toContain('Rp')
  expect(sesudah).toContain('Rp')
  expect(sesudah).not.toEqual(awal)
})

test('input invalid (harga 0) menampilkan tanpa hasil', async ({ page }) => {
  await page.goto('/kalkulator?harga=480000000')
  await page.locator('#kpr-harga').fill('0')
  await expect(page.getByTestId('kpr-angsuran')).toHaveText('—')
})

test('link WA membawa hasil simulasi', async ({ page }) => {
  await page.goto('/kalkulator?harga=480000000&proyek=Griya%20Asri%20Parkview')
  const href = await page.getByTestId('kpr-wa').getAttribute('href')
  expect(href).toMatch(/^https:\/\/wa\.me\/62/)
  expect(href).toContain('Estimasi')
})
