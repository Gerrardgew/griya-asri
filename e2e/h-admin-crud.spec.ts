// J8 — CRUD proyek (paling kritis): draft → validasi foto → publish → tampil publik → hapus.
import { test, expect } from './fixtures'

const NAMA = '[E2E] Proyek Uji'
const SLUG = 'e2e-proyek-uji'
const FOTO = 'https://picsum.photos/seed/e2e-uji/1200/800'

test.describe.configure({ mode: 'serial' })

test('membuat proyek draft tanpa foto berhasil', async ({ adminPage }) => {
  // Idempoten: bersihkan sisa run yang gagal agar retry tidak membuat duplikat.
  await adminPage.goto('/admin/proyek')
  for (let i = 0; i < 5; i++) {
    const sisa = adminPage.locator('li', { hasText: NAMA })
    if ((await sisa.count()) === 0) break
    await sisa.first().getByRole('button', { name: 'Hapus' }).click()
    await expect(adminPage).toHaveURL(/ok=hapus/)
  }

  await adminPage.goto('/admin/proyek/baru')
  await adminPage.locator('#p-nama').fill(NAMA)
  await adminPage.locator('#p-kota').fill('Bandung')
  await adminPage.getByRole('button', { name: 'Simpan', exact: true }).click()

  await expect(adminPage).toHaveURL(/\/admin\/proyek\/\d+\?ok=1/)
  await expect(adminPage.getByRole('status')).toContainText('Perubahan tersimpan')
})

test('proyek draft tampil di daftar dengan badge Draft', async ({ adminPage }) => {
  await adminPage.goto('/admin/proyek')
  const row = adminPage.locator('li', { hasText: NAMA })
  await expect(row).toBeVisible()
  await expect(row.getByText('Draft')).toBeVisible()
})

test('draft tidak terlihat publik (anonim 404, admin bisa preview)', async ({ adminPage, request }) => {
  const res = await request.get(`/proyek/${SLUG}`)
  expect(res.status()).toBe(404)

  await adminPage.goto(`/proyek/${SLUG}`)
  await expect(adminPage.getByText('Mode preview')).toBeVisible()
  await expect(adminPage.getByRole('heading', { level: 1, name: NAMA })).toBeVisible()
})

test('publish tanpa foto diblokir validasi', async ({ adminPage }) => {
  await adminPage.goto('/admin/proyek')
  await adminPage.locator('li', { hasText: NAMA }).getByRole('button', { name: 'Publish' }).click()

  await expect(adminPage).toHaveURL(/err=foto/)
  await expect(adminPage.locator('p[role="alert"]')).toContainText('Minimal 1 foto')
})

test('tambah foto lalu publish sukses dan tampil publik', async ({ adminPage }) => {
  // Halaman baru per test — buka editor lewat daftar.
  await adminPage.goto('/admin/proyek')
  await adminPage.locator('li', { hasText: NAMA }).getByRole('link', { name: 'Edit' }).click()
  await expect(adminPage).toHaveURL(/\/admin\/proyek\/\d+/)

  await adminPage.locator('#p-thumb').fill(FOTO)
  await adminPage.getByRole('button', { name: 'Simpan', exact: true }).click()
  await expect(adminPage).toHaveURL(/ok=1/)

  await adminPage.goto('/admin/proyek')
  const row = adminPage.locator('li', { hasText: NAMA })
  await row.getByRole('button', { name: 'Publish' }).click()

  await expect(adminPage).toHaveURL(/\/admin\/proyek\?ok=status/)
  // exact: teks tombol toggle "Jadikan Draft" memuat kata Draft juga.
  await expect(adminPage.locator('li', { hasText: NAMA }).getByText('Draft', { exact: true })).toBeHidden()

  // Publik: muncul di daftar dan bisa dibuka.
  await adminPage.goto('/proyek')
  await expect(adminPage.getByTestId('project-card').filter({ hasText: NAMA })).toBeVisible()
  await adminPage.goto(`/proyek/${SLUG}`)
  await expect(adminPage.getByRole('heading', { level: 1, name: NAMA })).toBeVisible()
})

test('cleanup: hapus proyek E2E', async ({ adminPage }) => {
  await adminPage.goto('/admin/proyek')
  await adminPage.locator('li', { hasText: NAMA }).getByRole('button', { name: 'Hapus' }).click()

  await expect(adminPage).toHaveURL(/ok=hapus/)
  await expect(adminPage.locator('li', { hasText: NAMA })).toBeHidden()

  await adminPage.goto('/proyek')
  await expect(adminPage.getByTestId('hasil-count')).toContainText('6 dari 6')
})
