// J4 — Kontak/lead: validasi kosong (HTML5), sukses tersimpan.
import { test, expect } from '@playwright/test'

test('form kosong diblokir validasi browser, tidak ada submit', async ({ page }) => {
  await page.goto('/kontak')
  await page.getByRole('button', { name: 'Kirim Pesan' }).click()

  // Tidak ada navigasi/param sukses — native required menahan submit.
  await expect(page).toHaveURL(/\/kontak$/)
  const invalid = await page.locator('#k-nama').evaluate((el) => (el as HTMLInputElement).validity.valid)
  expect(invalid).toBe(false)
})

test('form valid tersubmit dan konfirmasi tampil', async ({ page }) => {
  await page.goto('/kontak')
  await page.locator('#k-nama').fill('[E2E] Tester Kontak')
  await page.locator('#k-telepon').fill('081234567890')
  await page.locator('#k-pesan').fill('Percobaan otomatis dari test E2E.')
  await page.getByRole('button', { name: 'Kirim Pesan' }).click()

  await expect(page.getByRole('status')).toContainText('Pesan Anda sudah kami terima')
  await expect(page).toHaveURL(/ok=1/)
})
