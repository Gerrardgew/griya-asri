import type { Metadata } from 'next'
import Breadcrumb from '@/components/Breadcrumb'
import KprCalculator from '@/components/KprCalculator'
import { getSiteConfig } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Kalkulator KPR',
  description:
    'Hitung perkiraan cicilan KPR rumah Anda: masukkan harga, uang muka (DP), tenor, dan suku bunga. Hasil bisa langsung dikirim ke sales via WhatsApp.',
  alternates: { canonical: '/kalkulator' },
}

export default async function KalkulatorPage({
  searchParams,
}: {
  searchParams: Promise<{ harga?: string; proyek?: string; tipe?: string }>
}) {
  const sp = await searchParams
  const config = await getSiteConfig()
  const harga = Number(sp.harga ?? '') || undefined
  const konteks = [sp.proyek, sp.tipe].filter(Boolean).join(' ')

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <Breadcrumb items={[{ href: '/', label: 'Beranda' }, { label: 'Kalkulator KPR' }]} />
      <h1 className="mt-4 font-serif text-3xl font-bold md:text-4xl">Kalkulator KPR</h1>
      <p className="mt-2 max-w-2xl text-ink2">
        Berapa kira-kira cicilan bulanan Anda? Isi kolom di bawah — hitungannya muncul langsung, tanpa perlu minta
        bantuan siapa pun.
      </p>

      <div className="mt-8">
        <KprCalculator
          hargaAwal={harga}
          waNumber={config?.whatsappNumber ?? '6281234567890'}
          konteks={konteks || undefined}
        />
      </div>

      <p className="mt-8 max-w-2xl text-ink2">
        Baru dengan istilah seperti <strong>DP</strong> (uang muka) atau <strong>tenor</strong> (lama cicilan)? Baca
        penjelasan sederhananya di halaman Panduan.
      </p>
    </div>
  )
}
