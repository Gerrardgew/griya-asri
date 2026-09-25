// J10 — Pengaturan situs: ubah nomor WA → tombol WA publik ikut berubah (lalu dipulihkan).
import { test, expect } from './fixtures'

const WA_BARU = '6289990001111'
const WA_AWAL = '6281234567890'

test('ubah nomor WhatsApp terpancar ke situs publik', async ({ adminPage }) => {
  await adminPage.goto('/admin/pengaturan')
  await adminPage.locator('#s-wa').fill(WA_BARU)
  await adminPage.getByRole('button', { name: 'Simpan Pengaturan' }).click()
  await expect(adminPage.getByRole('status')).toContainText('Pengaturan tersimpan')

  await adminPage.goto('/')
  await expect(adminPage.locator(`a[href*="wa.me/${WA_BARU}"]`).first()).toBeVisible()
})

test('cleanup: pulihkan nomor WA awal', async ({ adminPage }) => {
  await adminPage.goto('/admin/pengaturan')
  await adminPage.locator('#s-wa').fill(WA_AWAL)
  await adminPage.getByRole('button', { name: 'Simpan Pengaturan' }).click()
  await expect(adminPage.getByRole('status')).toContainText('Pengaturan tersimpan')

  await adminPage.goto('/')
  await expect(adminPage.locator(`a[href*="wa.me/${WA_AWAL}"]`).first()).toBeVisible()
})
