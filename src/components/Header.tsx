import Link from 'next/link'
import MobileNav from './MobileNav'
import { waLink } from '@/lib/kpr'

export default function Header({ waNumber }: { waNumber: string }) {
  const nav = [
    { href: '/proyek', label: 'Proyek' },
    { href: '/kalkulator', label: 'Kalkulator KPR' },
    { href: '/panduan', label: 'Panduan' },
    { href: '/faq', label: 'FAQ' },
    { href: '/kontak', label: 'Kontak' },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-parchment/95 shadow-card backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 md:h-20 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-serif text-lg font-bold md:text-xl" aria-label="Griya Asri Realty — ke beranda">
          <span aria-hidden className="grid h-9 w-9 place-items-center rounded-lg bg-clay font-sans text-base font-bold text-white">
            GA
          </span>
          <span>Griya Asri</span>
        </Link>

        <nav aria-label="Navigasi utama" className="ml-auto hidden items-center gap-6 lg:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="rounded px-1 py-2 font-medium hover:text-clay">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-4">
          <a
            href={waLink(waNumber, 'Halo, saya ingin bertanya tentang rumah di Griya Asri Realty.')}
            className="hidden rounded-lg bg-wa px-4 py-2.5 font-semibold text-white shadow-card hover:bg-wa/90 md:inline-block"
          >
            Hubungi via WhatsApp
          </a>
          <MobileNav items={nav} />
        </div>
      </div>
    </header>
  )
}
