// J9 — CRUD tipe unit & FAQ: tambah → tampil publik + jadi jawaban bot → hapus.
import { test, expect } from './fixtures'

const UNIT = '[E2E] Tipe 99'
const TANYA = '[E2E] Berapa warna langit?'
const JAWAB = 'Biru dong.'

async function bukaEditorSentosa(adminPage: import('@playwright/test').Page) {
  await adminPage.goto('/admin/proyek')
  await adminPage.getByRole('link', { name: 'Griya Asri Sentosa' }).click()
  await expect(adminPage).toHaveURL(/\/admin\/proyek\/\d+/)
  return adminPage.url()
}

test.describe.configure({ mode: 'serial' })

test('tambah tipe unit muncul di editor dan halaman publik', async ({ adminPage }) => {
  const editorUrl = await bukaEditorSentosa(adminPage)

  await adminPage.locator('#un-nama').fill(UNIT)
  await adminPage.locator('#un-harga').fill('1234500000')
  await adminPage.locator('#un-stok').fill('3')
  await adminPage.getByRole('button', { name: 'Tambah Tipe' }).click()

  await expect(adminPage).toHaveURL(/ok=unit/)
  await expect(adminPage.locator('form', { hasText: UNIT })).toBeVisible()

  await adminPage.goto('/proyek/griya-asri-sentosa')
  await expect(adminPage.getByText(UNIT).first()).toBeVisible()

  // Hapus unit — cleanup sekaligus uji delete.
  // Tombol hapus ada di form sibling setelah form simpan (pola formAction dipecah).
  await adminPage.goto(editorUrl)
  await adminPage
    .locator('form', { hasText: UNIT })
    .locator('xpath=following-sibling::form[1]')
    .getByRole('button', { name: 'Hapus Tipe Ini' })
    .click()
  await expect(adminPage).toHaveURL(/ok=hapus-unit/)
  await expect(adminPage.locator('form', { hasText: UNIT })).toBeHidden()
})

test('tambah FAQ muncul di halaman publik dan dipakai bot', async ({ adminPage, page }) => {
  await adminPage.goto('/admin/faq')
  await adminPage.locator('#fn-t').fill(TANYA)
  await adminPage.locator('#fn-j').fill(JAWAB)
  await adminPage.getByRole('button', { name: 'Tambah FAQ' }).click()
  await expect(adminPage.locator('form', { hasText: TANYA })).toBeVisible()

  // Halaman FAQ publik: accordion terbuka menampilkan jawaban.
  await page.goto('/faq')
  await page.getByRole('button', { name: TANYA }).click()
  await expect(page.getByText(JAWAB)).toBeVisible()

  // Bot memakai FAQ yang sama.
  await page.goto('/')
  await page.getByRole('button', { name: /Buka asisten chat/ }).click()
  await page.locator('#bot-input').fill('warna langit')
  await page.getByRole('button', { name: 'Kirim' }).click()
  await expect(page.getByTestId('bot-messages')).toContainText(JAWAB, { timeout: 10_000 })

  // Cleanup — tombol hapus di form sibling.
  await adminPage.goto('/admin/faq')
  await adminPage
    .locator('form', { hasText: TANYA })
    .locator('xpath=following-sibling::form[1]')
    .getByRole('button', { name: 'Hapus FAQ Ini' })
    .click()
  await expect(adminPage.locator('form', { hasText: TANYA })).toBeHidden()
})
