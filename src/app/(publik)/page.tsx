import Link from 'next/link'
import Image from 'next/image'
import ProjectCard from '@/components/ProjectCard'
import { getPublishedProjects, getSiteConfig } from '@/lib/data'
import { safeJsonLd } from '@/lib/jsonld'

export const revalidate = 60

const LANGKAH = [
  { no: 1, judul: 'Lihat proyek', teks: 'Buka halaman Proyek, filter sesuai kota dan budget Anda.' },
  { no: 2, judul: 'Hitung cicilan', teks: 'Pakai Kalkulator KPR — masukkan harga, DP, dan tenor. Hasilnya langsung terlihat.' },
  { no: 3, judul: 'Hubungi kami', teks: 'Klik tombol WhatsApp. Pesan sudah disiapkan otomatis, tinggal kirim.' },
]

const KEUNGGULAN = [
  { judul: 'Harga jelas sejak awal', teks: 'Setiap tipe unit menampilkan harga dan perkiraan cicilan — tidak ada biaya tersembunyi.' },
  { judul: 'Mudah dibaca semua umur', teks: 'Huruf besar, bahasa sederhana, dan penjelasan istilah seperti DP dan KPR di halaman Panduan.' },
  { judul: 'Lokasi terverifikasi', teks: 'Peta lokasi dan daftar fasilitas terdekat ada di setiap halaman proyek.' },
]

export default async function Homepage() {
  const [config, projects] = await Promise.all([getSiteConfig(), getPublishedProjects()])
  const unggulan =
    projects.filter((p) => p.featured).slice(0, 3).length > 0
      ? projects.filter((p) => p.featured).slice(0, 3)
      : projects.slice(0, 3)

  const hero = projects[0]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Griya Asri Realty',
            url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
            areaServed: ['Bogor', 'Depok', 'Bekasi', 'Tangerang Selatan'],
          }),
        }}
      />

      {/* HERO — foto adalah panggung, teks di panel solid (bukan overlay gradien) */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:px-6 md:py-20">
          <div>
            <h1 className="font-serif text-4xl font-bold leading-tight md:text-5xl">
              {config?.heroTitle ?? 'Rumah Nyaman untuk Semua Generasi'}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-ink2">
              {config?.heroSubtitle ??
                'Pilih rumah dengan tenang. Lihat harganya dengan jelas, hitung cicilannya sendiri, lalu hubungi kami saat Anda siap.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/proyek"
                className="rounded-lg bg-clay px-6 py-3.5 text-lg font-semibold text-white shadow-card hover:bg-clay/90"
              >
                {config?.heroCtaLabel ?? 'Lihat Proyek'}
              </Link>
              <Link
                href="/kontak"
                className="rounded-lg border-2 border-ink px-6 py-3.5 text-lg font-semibold hover:border-clay hover:text-clay"
              >
                Hubungi Kami
              </Link>
            </div>
            <p className="mt-6 text-sm text-ink2">
              Baru mengenal istilah seperti DP dan KPR? Baca{' '}
              <Link href="/panduan" className="font-semibold text-clay underline">
                Panduan Membeli
              </Link>{' '}
              kami — dijelaskan dengan bahasa sederhana.
            </p>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-lift">
            {hero?.thumbnailUrl || hero?.galeri[0] ? (
              <Image
                src={hero.thumbnailUrl ?? hero.galeri[0].url}
                alt={hero.galeri[0]?.alt ?? `Proyek ${hero.nama}`}
                fill
                priority
                sizes="(min-width: 768px) 560px, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center bg-parchment text-ink2">
                Foto proyek unggulan
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CARA MEMBELI — panduan 3 langkah untuk pengguna baru */}
      <section aria-labelledby="cara-beli" className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <h2 id="cara-beli" className="font-serif text-3xl font-bold">
          Memilih rumah di sini mudah — tiga langkah saja
        </h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {LANGKAH.map((l) => (
            <li key={l.no} className="rounded-xl border border-line bg-surface p-6 shadow-card">
              <span
                aria-hidden
                className="grid h-11 w-11 place-items-center rounded-full bg-clay/10 font-serif text-xl font-bold text-clay"
              >
                {l.no}
              </span>
              <h3 className="mt-4 text-lg font-bold">{l.judul}</h3>
              <p className="mt-2 leading-relaxed text-ink2">{l.teks}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* PROYEK UNGGULAN */}
      <section aria-labelledby="proyek-unggulan" className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="proyek-unggulan" className="font-serif text-3xl font-bold">
              Proyek Unggulan
            </h2>
            <Link href="/proyek" className="font-semibold text-clay underline">
              Lihat semua proyek →
            </Link>
          </div>

          {unggulan.length === 0 ? (
            <p className="mt-8 rounded-xl border border-line bg-parchment p-8 text-center text-ink2">
              Belum ada proyek yang dipublikasikan.{' '}
              <Link href="/proyek" className="font-semibold text-clay underline">
                Cek lagi nanti
              </Link>
              .
            </p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {unggulan.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* KENAPA KAMI */}
      <section aria-labelledby="kenapa-kami" className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <h2 id="kenapa-kami" className="font-serif text-3xl font-bold">
          Kenapa Griya Asri Realty
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {KEUNGGULAN.map((k) => (
            <div key={k.judul} className="rounded-xl border border-line bg-surface p-6">
              <h3 className="text-lg font-bold">{k.judul}</h3>
              <p className="mt-2 leading-relaxed text-ink2">{k.teks}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
