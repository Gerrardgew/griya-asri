import { db } from './db'

// Internal saja — bukan bagian API modul (dipakai uniqueSlug di bawah).
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
}

/** Pastikan slug unik; jika bentrok, tambah suffix -2, -3, ... */
export async function uniqueSlug(base: string, excludeId?: number): Promise<string> {
  let slug = slugify(base) || 'proyek'
  let i = 1
  for (;;) {
    const existing = await db.project.findUnique({ where: { slug }, select: { id: true } })
    if (!existing || existing.id === excludeId) return slug
    i += 1
    slug = `${slugify(base)}-${i}`
  }
}
