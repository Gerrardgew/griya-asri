import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Gallery from '@/components/Gallery'
import Badge from '@/components/Badge'
import Breadcrumb from '@/components/Breadcrumb'
import KprCalculator from '@/components/KprCalculator'
import { getProjectBySlug, getSiteConfig, hargaMulaiDari } from '@/lib/data'
import { getSession } from '@/lib/auth'
import { safeJsonLd } from '@/lib/jsonld'
import { rp, waLink } from '@/lib/kpr'

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const p = await getProjectBySlug(slug)
  if (!p) return { title: 'Proyek tidak ditemukan' }
  return {
    title: p.seoTitle ?? p.nama,
    description: p.seoDescription ?? `Proyek ${p.nama} di ${p.kota}. ${p.deskripsi}`.slice(0, 160),
    alternates: { canonical: `/proyek/${p.slug}` },
    openGraph: {
      title: p.seoTitle ?? p.nama,
      description: p.seoDescription ?? p.deskripsi.slice(0, 160),
      images: p.thumbnailUrl ? [p.thumbnailUrl] : undefined,
    },
  }
}

export default async function DetailProyek({ params }: Params) {
  const { slug } = await params
  const p = await getProjectBySlug(slug)
  const session = await getSession()

  // Draft hanya terlihat oleh admin yang login (mode preview FR-07)
  if (!p || (!p.publish && !session)) notFound()

  const config = await getSiteConfig()
  const wa = config?.whatsappNumber ?? '6281234567890'
  const harga = hargaMulaiDari(p)
  const fotos =
    p.galeri.length > 0
      ? p.galeri.map((g) => ({ url: g.url, alt: g.alt || `Foto proyek ${p.nama}` }))
      : p.thumbnailUrl
        ? [{ url: p.thumbnailUrl, alt: `Foto proyek ${p.nama}` }]
        : []
  const fasilitas = p.fasilitas.split('\n').map((f) => f.trim()).filter(Boolean)
  const waPesan = `Halo, saya lihat proyek ${p.nama} di website. Boleh minta info lebih lanjut?`

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 pb-28 md:px-6 md:py-12 md:pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd([
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Beranda', item: '/' },
                { '@type': 'ListItem', position: 2, name: 'Proyek', item: '/proyek' },
                { '@type': 'ListItem', position: 3, name: p.nama },
              ],
            },
            {
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: p.nama,
              description: p.seoDescription ?? p.deskripsi.slice(0, 200),
              image: fotos[0]?.url,
              offers: {
                '@type': 'Offer',
                price: harga ?? undefined,
                priceCurrency: 'IDR',
                availability:
                  p.status === 'sold_out'
                    ? 'https://schema.org/SoldOut'
                    : 'https://schema.org/InStock',
              },
            },
          ]),
        }}
      />

      {!p.publish && (
        <p role="status" className="mb-6 rounded-lg border border-amber/40 bg-amber/10 px-4 py-3 font-medium text-amber">
          Mode preview — proyek ini belum dipublikasikan. Perubahan Anda tidak terlihat pengunjung lain.
        </p>
      )}

      <Breadcrumb
        items={[
          { href: '/', label: 'Beranda' },
          { href: '/proyek', label: 'Proyek' },
          { label: p.nama },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_20rem]">
        <div>
          <Gallery fotos={fotos} />

          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge status={p.status} />
              <span className="text-ink2">{p.kota}</span>
            </div>
            <h1 className="mt-3 font-serif text-3xl font-bold md:text-4xl">{p.nama}</h1>
            <p className="mt-2 text-ink2">{p.alamat}</p>
            <p className="mt-4 font-serif text-2xl font-bold text-clay">
              {harga ? `Mulai dari ${rp(harga)}` : 'Hubungi kami untuk harga'}
            </p>
          </div>

          <section aria-labelledby="deskripsi" className="mt-8">
            <h2 id="deskripsi" className="font-serif text-2xl font-bold">
              Tentang Proyek Ini
            </h2>
            <p className="mt-3 leading-relaxed text-ink2">{p.deskripsi}</p>
          </section>

          {fasilitas.length > 0 && (
            <section aria-labelledby="fasilitas" className="mt-8">
              <h2 id="fasilitas" className="font-serif text-2xl font-bold">
                Fasilitas
              </h2>
              <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {fasilitas.map((f) => (
                  <li key={f} className="flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5">
                    <span aria-hidden className="text-moss">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="tipe-unit" className="mt-10">
            <h2 id="tipe-unit" className="font-serif text-2xl font-bold">
              Tipe Unit
            </h2>
            {p.unitTypes.length === 0 ? (
              <p className="mt-3 text-ink2">Informasi tipe unit menyusul — hubungi kami untuk detail.</p>
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {p.unitTypes.map((u) => (
                  <article key={u.id} className="flex flex-col rounded-xl border border-line bg-surface p-5 shadow-card">
                    <h3 className="font-serif text-xl font-bold">{u.namaTipe}</h3>
                    <dl className="mt-3 space-y-1.5 text-ink2">
                      <div className="flex justify-between gap-3">
                        <dt>Harga</dt>
                        <dd className="font-semibold text-ink">{u.harga > 0 ? rp(u.harga) : 'Hubungi kami'}</dd>
                      </div>
                      {u.luasBangunan != null && u.luasTanah != null && (
                        <div className="flex justify-between gap-3">
                          <dt>Luas</dt>
                          <dd>
                            {u.luasBangunan}/{u.luasTanah} m²
                          </dd>
                        </div>
                      )}
                      <div className="flex justify-between gap-3">
                        <dt>Kamar</dt>
                        <dd>
                          {u.kamarTidur} tidur · {u.kamarMandi} mandi
                        </dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt>Stok</dt>
                        <dd>{u.stok > 0 ? `${u.stok} unit` : p.status === 'sold_out' ? 'Habis' : 'Hubungi kami'}</dd>
                      </div>
                    </dl>
                    {u.spesifikasi && (
                      <ul className="mt-3 space-y-1 border-t border-line pt-3 text-sm text-ink2">
                        {u.spesifikasi
                          .split('\n')
                          .map((s) => s.trim())
                          .filter(Boolean)
                          .map((s) => (
                            <li key={s}>· {s}</li>
                          ))}
                      </ul>
                    )}
                    <div className="mt-4 flex flex-col gap-2">
                      <Link
                        href={`/kalkulator?harga=${u.harga}&proyek=${encodeURIComponent(p.nama)}&tipe=${encodeURIComponent(u.namaTipe)}`}
                        className="rounded-lg bg-clay px-4 py-2.5 text-center font-semibold text-white hover:bg-clay/90"
                      >
                        Simulasi KPR
                      </Link>
                      <a
                        href={waLink(wa, `Halo, saya lihat ${p.nama} tipe ${u.namaTipe}. Boleh minta info lebih lanjut?`)}
                        className="rounded-lg border-2 border-wa px-4 py-2.5 text-center font-semibold text-wa hover:bg-wa/10"
                      >
                        Tanya via WhatsApp
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section id="kpr" aria-labelledby="kpr-judul" className="mt-12 scroll-mt-24 rounded-xl border border-line bg-surface p-6 shadow-card md:p-8">
            <h2 id="kpr-judul" className="font-serif text-2xl font-bold">
              Simulasi Cicilan KPR
            </h2>
            <p className="mt-2 text-ink2">
              Ingin tahu berapa cicilan per bulan? Ubah angka di bawah — hasilnya langsung terlihat.
            </p>
            <div className="mt-6">
              <KprCalculator
                hargaAwal={harga ?? undefined}
                waNumber={wa}
                konteks={`${p.nama}${p.unitTypes[0] ? ` tipe ${p.unitTypes[0].namaTipe}` : ''}`}
              />
            </div>
          </section>

          {p.koordinatLat != null && p.koordinatLng != null && (
            <section aria-labelledby="peta" className="mt-10">
              <h2 id="peta" className="font-serif text-2xl font-bold">
                Lokasi
              </h2>
              <div className="mt-4 overflow-hidden rounded-xl border border-line">
                <iframe
                  title={`Peta lokasi ${p.nama}`}
                  src={`https://www.google.com/maps?q=${p.koordinatLat},${p.koordinatLng}&z=15&output=embed`}
                  width="600"
                  height="400"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                />
              </div>
              <p className="mt-3 text-ink2">
                Alamat: {p.alamat}, {p.kota}
              </p>
            </section>
          )}
        </div>

        {/* Sidebar desktop */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-xl border border-line bg-surface p-6 shadow-card">
            <p className="font-semibold">Tertarik dengan proyek ini?</p>
            <p className="mt-1 text-sm text-ink2">Sales kami siap menjawab di jam kerja.</p>
            <a
              href={waLink(wa, waPesan)}
              className="mt-4 block rounded-lg bg-wa px-4 py-3 text-center font-semibold text-white hover:bg-wa/90"
            >
              Hubungi via WhatsApp
            </a>
            <a
              href={`mailto:${config?.email ?? 'halo@griyaasri.id'}?subject=${encodeURIComponent(`Tanya ${p.nama}`)}`}
              className="mt-2 block rounded-lg border-2 border-ink px-4 py-3 text-center font-semibold hover:border-clay hover:text-clay"
            >
              Kirim Email
            </a>
            <Link
              href="/kalkulator"
              className="mt-2 block rounded-lg border-2 border-clay px-4 py-3 text-center font-semibold text-clay hover:bg-clay/10"
            >
              Buka Kalkulator KPR
            </Link>
          </div>
        </aside>
      </div>

      {/* Sticky bottom bar (mobile) — aksi utama selalu terjangkau jempol */}
      <div data-testid="sticky-bar" className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line bg-surface p-3 shadow-lift lg:hidden">
        <a
          href={waLink(wa, waPesan)}
          className="flex-1 rounded-lg bg-wa px-4 py-3 text-center font-semibold text-white"
        >
          WhatsApp
        </a>
        <a href="#kpr" className="flex-1 rounded-lg bg-clay px-4 py-3 text-center font-semibold text-white">
          Simulasi KPR
        </a>
      </div>
    </div>
  )
}
