// Query helpers dengan fallback aman: jika DB belum siap/bangkrut, halaman
// publik tetap render (empty state) — tidak crash.
import { db } from './db'
import type { Project, UnitType, GaleriItem, Faq, SiteConfig } from '@prisma/client'

export type ProjectWithUnits = Project & { unitTypes: UnitType[]; galeri: GaleriItem[] }

export async function getSiteConfig(): Promise<SiteConfig | null> {
  try {
    return await db.siteConfig.findUnique({ where: { id: 1 } })
  } catch {
    return null
  }
}

export async function getPublishedProjects(): Promise<ProjectWithUnits[]> {
  try {
    return await db.project.findMany({
      where: { publish: true },
      include: { unitTypes: true, galeri: { orderBy: { urutan: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectWithUnits | null> {
  try {
    return await db.project.findUnique({
      where: { slug },
      include: { unitTypes: { orderBy: { urutan: 'asc' } }, galeri: { orderBy: { urutan: 'asc' } } },
    })
  } catch {
    return null
  }
}

export async function getFaqs(): Promise<Faq[]> {
  try {
    return await db.faq.findMany({ where: { publish: true }, orderBy: { urutan: 'asc' } })
  } catch {
    return []
  }
}

export function hargaMulaiDari(p: ProjectWithUnits): number | null {
  const aktif = p.unitTypes.filter((u) => u.harga > 0 && p.status !== 'sold_out')
  if (aktif.length === 0) return null
  return Math.min(...aktif.map((u) => u.harga))
}

/** Jalankan query DB dengan fallback aman — halaman tetap render saat DB bermasalah. */
export async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch {
    return fallback
  }
}
