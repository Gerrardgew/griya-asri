import type { Metadata } from 'next'
import { Lora, Public_Sans } from 'next/font/google'
import './globals.css'

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
})

const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-public',
  display: 'swap',
})

// `||` (bukan ??) dengan sengaja: string kosong dari env var Vercel yang
// belum diisi harus jatuh ke fallback — ?? tidak menolak ''.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Griya Asri Realty — Rumah Nyaman untuk Semua Generasi',
    template: '%s · Griya Asri Realty',
  },
  description:
    'Website properti Griya Asri Realty: lihat proyek perumahan di Bogor, Depok, Bekasi, dan Tangerang Selatan. Harga jelas, kalkulator KPR, hubungi sales via WhatsApp.',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'Griya Asri Realty',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${lora.variable} ${publicSans.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
