import Link from 'next/link'

// Pagination bernomor (SEO-friendly, predictable) — query string dipertahankan.
export default function Pagination({
  halaman,
  totalHalaman,
  baseQuery,
}: {
  halaman: number
  totalHalaman: number
  baseQuery: Record<string, string | undefined>
}) {
  if (totalHalaman <= 1) return null

  function href(h: number) {
    const q = new URLSearchParams()
    for (const [k, v] of Object.entries(baseQuery)) if (v) q.set(k, v)
    q.set('hal', String(h))
    return `/proyek?${q.toString()}`
  }

  return (
    <nav aria-label="Navigasi halaman hasil" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      {halaman > 1 && (
        <Link href={href(halaman - 1)} rel="prev" className="rounded-lg border border-line bg-surface px-4 py-2 font-medium hover:border-clay">
          ‹ Sebelumnya
        </Link>
      )}
      {Array.from({ length: totalHalaman }, (_, i) => i + 1).map((h) => (
        <Link
          key={h}
          href={href(h)}
          aria-current={h === halaman ? 'page' : undefined}
          className={`grid h-11 w-11 place-items-center rounded-lg border font-semibold ${
            h === halaman ? 'border-clay bg-clay text-white' : 'border-line bg-surface hover:border-clay'
          }`}
        >
          {h}
        </Link>
      ))}
      {halaman < totalHalaman && (
        <Link href={href(halaman + 1)} rel="next" className="rounded-lg border border-line bg-surface px-4 py-2 font-medium hover:border-clay">
          Berikutnya ›
        </Link>
      )}
    </nav>
  )
}
