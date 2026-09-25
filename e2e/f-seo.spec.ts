// J6 — Artefak SEO: sitemap, robots, JSON-LD.
import { test, expect } from '@playwright/test'

test('sitemap memuat slug proyek terbit', async ({ request }) => {
  const res = await request.get('/sitemap.xml')
  expect(res.ok()).toBeTruthy()
  const xml = await res.text()
  expect(xml).toContain('/proyek/griya-asri-parkview')
  expect(xml).toContain('/kalkulator')
})

test('robots melarang indeks area admin & login', async ({ request }) => {
  const res = await request.get('/robots.txt')
  expect(res.ok()).toBeTruthy()
  const txt = await res.text()
  expect(txt).toContain('Disallow: /admin')
  expect(txt).toContain('Sitemap:')
})

test('halaman FAQ memuat JSON-LD FAQPage', async ({ request }) => {
  const res = await request.get('/faq')
  const html = await res.text()
  expect(html).toContain('FAQPage')
})

test('halaman 404 untuk slug tak dikenal', async ({ request }) => {
  const res = await request.get('/proyek/tidak-ada-slug-ini')
  expect(res.status()).toBe(404)
  expect(await res.text()).toContain('404')
})
