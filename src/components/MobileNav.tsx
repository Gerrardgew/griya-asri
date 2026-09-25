'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function MobileNav({ items }: { items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="menu-mobile"
        aria-label={open ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
        onClick={() => setOpen((v) => !v)}
        className="grid h-11 w-11 place-items-center rounded-lg border border-line bg-surface"
      >
        <span aria-hidden className="text-xl leading-none">{open ? '✕' : '☰'}</span>
      </button>

      {open && (
        <nav id="menu-mobile" aria-label="Navigasi utama (mobile)" className="absolute inset-x-0 top-full border-b border-line bg-surface shadow-overlay">
          <ul className="mx-auto max-w-6xl px-4 py-2">
            {items.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-lg font-medium hover:bg-parchment"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}
