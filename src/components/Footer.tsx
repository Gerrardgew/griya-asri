import Link from 'next/link'
import { waLink } from '@/lib/kpr'
import type { SiteConfig } from '@prisma/client'

export default function Footer({ config, waNumber }: { config: SiteConfig | null; waNumber: string }) {
  const email = config?.email ?? 'halo@griyaasri.id'

  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <p className="font-serif text-xl font-bold">Griya Asri Realty</p>
          <p className="mt-2 text-ink2">Rumah nyaman untuk semua generasi.</p>
          <p className="mt-4 text-sm text-ink2">
            Situs demo untuk keperluan portfolio. Semua proyek, harga, dan data bersifat contoh.
          </p>
        </div>

        <nav aria-label="Tautan footer">
          <p className="font-semibold">Jelajahi</p>
          <ul className="mt-3 space-y-2">
            <li><Link href="/proyek" className="hover:text-clay">Semua Proyek</Link></li>
            <li><Link href="/kalkulator" className="hover:text-clay">Kalkulator KPR</Link></li>
            <li><Link href="/panduan" className="hover:text-clay">Panduan Membeli</Link></li>
            <li><Link href="/faq" className="hover:text-clay">Pertanyaan Umum</Link></li>
            <li><Link href="/kontak" className="hover:text-clay">Kontak</Link></li>
          </ul>
        </nav>

        <div>
          <p className="font-semibold">Hubungi Kami</p>
          <ul className="mt-3 space-y-2">
            <li>
              WhatsApp:{' '}
              <a href={waLink(waNumber, 'Halo, saya ingin bertanya tentang rumah di Griya Asri Realty.')} className="font-semibold text-wa underline">
                +{waNumber}
              </a>
            </li>
            <li>
              Email:{' '}
              <a href={`mailto:${email}`} className="font-semibold text-clay underline">
                {email}
              </a>
            </li>
            {config?.alamat && <li className="text-ink2">{config.alamat}</li>}
            {config?.jamOperasional && <li className="text-ink2">{config.jamOperasional}</li>}
          </ul>
        </div>
      </div>

      <div className="border-t border-line py-4 text-center text-sm text-ink2">
        © {new Date().getFullYear()} Griya Asri Realty | Made By Gerrardgew
      </div>
    </footer>
  )
}
