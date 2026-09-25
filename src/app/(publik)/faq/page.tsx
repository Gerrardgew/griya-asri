import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import Accordion from '@/components/Accordion'
import { getFaqs } from '@/lib/data'
import { safeJsonLd } from '@/lib/jsonld'

export const metadata: Metadata = {
  title: 'Pertanyaan Umum (FAQ)',
  description:
    'Jawaban atas pertanyaan yang sering diajukan tentang harga, DP, cicilan KPR, lokasi proyek, dan cara membeli rumah di Griya Asri Realty.',
  alternates: { canonical: '/faq' },
}

export default async function FaqPage() {
  const faqs = await getFaqs()
  const items = faqs.map((f) => ({ id: f.id, tanya: f.pertanyaan, jawab: f.jawaban }))

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((f) => ({
                '@type': 'Question',
                name: f.pertanyaan,
                acceptedAnswer: { '@type': 'Answer', text: f.jawaban },
              })),
            }),
          }}
        />
      )}

      <Breadcrumb items={[{ href: '/', label: 'Beranda' }, { label: 'FAQ' }]} />
      <h1 className="mt-4 font-serif text-3xl font-bold md:text-4xl">Pertanyaan Umum</h1>
      <p className="mt-2 text-ink2">
        Jawaban di bawah ditulis dengan bahasa sederhana. Klik pertanyaan untuk membuka jawabannya.
      </p>

      {items.length === 0 ? (
        <p className="mt-8 rounded-xl border border-line bg-surface p-8 text-center text-ink2">
          Belum ada pertanyaan yang terbit.{' '}
          <Link href="/kontak" className="font-semibold text-clay underline">
            Tanya langsung ke kami
          </Link>
          .
        </p>
      ) : (
        <div className="mt-8">
          <Accordion items={items} label="Daftar pertanyaan umum" />
        </div>
      )}

      <p className="mt-8 text-ink2">
        Pertanyaan Anda tidak ada di daftar?{' '}
        <Link href="/kontak" className="font-semibold text-clay underline">
          Hubungi kami
        </Link>{' '}
        — atau klik tombol “Tanya Bot” di kanan bawah.
      </p>
    </div>
  )
}
