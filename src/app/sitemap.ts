import type { MetadataRoute } from 'next'
import { db } from '@/lib/db'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const statis: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/proyek`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/kalkulator`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/panduan`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/faq`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/kontak`, changeFrequency: 'yearly', priority: 0.6 },
  ]

  try {
    const proyek = await db.project.findMany({
      where: { publish: true },
      select: { slug: true, updatedAt: true },
    })
    return [
      ...statis,
      ...proyek.map((p) => ({
        url: `${BASE}/proyek/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      })),
    ]
  } catch {
    return statis
  }
}
