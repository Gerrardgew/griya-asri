import Link from 'next/link'

export default function Breadcrumb({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden className="text-ink2">/</span>}
            {it.href ? (
              <Link href={it.href} className="text-ink2 hover:text-clay">
                {it.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium">
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
