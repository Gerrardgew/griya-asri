'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const MENU = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/proyek', label: 'Proyek' },
  { href: '/admin/faq', label: 'FAQ' },
  { href: '/admin/pengaturan', label: 'Pengaturan' },
]

export default function AdminNav() {
  const path = usePathname()

  return (
    <nav aria-label="Navigasi admin" className="flex gap-2 overflow-x-auto lg:flex-col">
      {MENU.map((m) => {
        const aktif = m.exact ? path === m.href : path.startsWith(m.href)
        return (
          <Link
            key={m.href}
            href={m.href}
            aria-current={aktif ? 'page' : undefined}
            className={`shrink-0 rounded-lg px-4 py-2.5 font-semibold ${
              aktif ? 'bg-clay text-white' : 'text-ink hover:bg-parchment'
            }`}
          >
            {m.label}
          </Link>
        )
      })}
    </nav>
  )
}
