// J1 — Jelajahi proyek: homepage → kartu unggulan → detail proyek.
import { test, expect } from '@playwright/test'

test('homepage menampilkan hero dan proyek unggulan', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: 'Rumah Nyaman untuk Semua Generasi' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Proyek Unggulan' })).toBeVisible()
  await expect(page.getByTestId('project-card')).toHaveCount(3)
})

test('dari homepage ke detail proyek lengkap', async ({ page }) => {
  await page.goto('/')
  // Urutan kartu mengikuti createdAt — pilih by nama, bukan first().
  await page.getByTestId('project-card').filter({ hasText: 'Griya Asri Parkview' }).click()
  await expect(page).toHaveURL(/\/proyek\/griya-asri-parkview$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Griya Asri Parkview' })).toBeVisible()
  await expect(page.getByText('Mulai dari Rp')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Tipe Unit' })).toBeVisible()
  await expect(page.getByText('Tipe 30/60').first()).toBeVisible()
})

test('sticky bar mobile muncul di halaman detail', async ({ page }) => {
  await page.goto('/proyek/griya-asri-parkview')
  await page.setViewportSize({ width: 375, height: 750 })
  const bar = page.getByTestId('sticky-bar')
  await expect(bar).toBeVisible()
  await expect(bar.getByText('WhatsApp')).toBeVisible()
  await expect(bar.getByText('Simulasi KPR')).toBeVisible()
})
