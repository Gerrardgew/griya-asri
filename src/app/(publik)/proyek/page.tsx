import type { Metadata } from 'next'
import ProjectCard from '@/components/ProjectCard'
import Pagination from '@/components/Pagination'
import Breadcrumb from '@/components/Breadcrumb'
import { getPublishedProjects, hargaMulaiDari } from '@/lib/data'
import { rp } from '@/lib/kpr'

export const metadata: Metadata = {
  title: 'Semua Proyek',
  description:
    'Jelajahi semua proyek perumahan Griya Asri Realty di Bogor, Depok, Bekasi, dan Tangerang Selatan. Filter per kota, harga, dan jumlah kamar.',
}

const PER_HALAMAN = 9
const HARGA_MAX_OPTS = [
  { v: '', label: 'Semua harga' },
  { v: '500000000', label: `Sampai ${rp(500000000)}` },
  { v: '750000000', label: `Sampai ${rp(750000000)}` },
  { v: '1000000000', label: `Sampai ${rp(1000000000)}` },
  { v: '2000000000', label: `Sampai ${rp(2000000000)}` },
]

type Cari = {
  q?: string
  kota?: string
  harga_max?: string
  kamar?: string
  status?: string
  sort?: string
  hal?: string
}

export default async function ProyekIndex({ searchParams }: { searchParams: Promise<Cari> }) {
  const sp = await searchParams
  const semua = await getPublishedProjects()

  const q = (sp.q ?? '').trim().toLowerCase()
  const kota = sp.kota ?? ''
  const hargaMax = Number(sp.harga_max ?? '') || 0
  const kamar = Number(sp.kamar ?? '') || 0
  const status = sp.status ?? ''
  const sort = sp.sort ?? 'terbaru'
  const hal = Math.max(1, Number(sp.hal ?? '1') || 1)

  let hasil = semua.filter((p) => {
    if (q && !`${p.nama} ${p.kota} ${p.alamat}`.toLowerCase().includes(q)) return false
    if (kota && p.kota !== kota) return false
    if (status && p.status !== status) return false
    if (kamar) {
      const maxKt = Math.max(0, ...p.unitTypes.map((u) => u.kamarTidur))
      if (maxKt < kamar) return false
    }
    if (hargaMax) {
      const harga = hargaMulaiDari(p)
      if (harga === null || harga > hargaMax) return false
    }
    return true
  })

  hasil = [...hasil].sort((a, b) => {
    if (sort === 'murah') {
      const ha = hargaMulaiDari(a) ?? Infinity
      const hb = hargaMulaiDari(b) ?? Infinity
      return ha - hb
    }
    if (sort === 'mahal') {
      const ha = hargaMulaiDari(a) ?? 0
      const hb = hargaMulaiDari(b) ?? 0
      return hb - ha
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const totalHalaman = Math.max(1, Math.ceil(hasil.length / PER_HALAMAN))
  const halamanAman = Math.min(hal, totalHalaman)
  const tampil = hasil.slice((halamanAman - 1) * PER_HALAMAN, halamanAman * PER_HALAMAN)
  const kotaUnik = Array.from(new Set(semua.map((p) => p.kota))).sort()

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <Breadcrumb items={[{ href: '/', label: 'Beranda' }, { label: 'Proyek' }]} />
      <h1 className="mt-4 font-serif text-3xl font-bold md:text-4xl">Semua Proyek</h1>
      <p className="mt-2 text-ink2">Cari rumah sesuai kota, budget, dan kebutuhan keluarga Anda.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[16rem_1fr]">
        {/* FILTER — form GET murni: jalan tanpa JS, state via URL */}
        <aside>
          <form action="/proyek" method="get" className="space-y-5 rounded-xl border border-line bg-surface p-5 shadow-card" aria-label="Filter proyek">
            <div>
              <label htmlFor="f-q" className="field-label">
                Kata kunci
              </label>
              <input id="f-q" name="q" type="search" defaultValue={sp.q ?? ''} placeholder="Nama / kota / alamat" className="field-input" />
            </div>
            <div>
              <label htmlFor="f-kota" className="field-label">
                Kota
              </label>
              <select id="f-kota" name="kota" defaultValue={kota} className="field-input">
                <option value="">Semua kota</option>
                {kotaUnik.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="f-harga" className="field-label">
                Harga maksimum
              </label>
              <select id="f-harga" name="harga_max" defaultValue={sp.harga_max ?? ''} className="field-input">
                {HARGA_MAX_OPTS.map((o) => (
                  <option key={o.v} value={o.v}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="f-kamar" className="field-label">
                Kamar tidur (minimal)
              </label>
              <select id="f-kamar" name="kamar" defaultValue={sp.kamar ?? ''} className="field-input">
                <option value="">Berapa saja</option>
                {[2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n}+ kamar
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="f-status" className="field-label">
                Status
              </label>
              <select id="f-status" name="status" defaultValue={status} className="field-input">
                <option value="">Semua status</option>
                <option value="prapenjualan">Prapenjualan</option>
                <option value="siap_huni">Siap Huni</option>
                <option value="sold_out">Sold Out</option>
              </select>
            </div>
            <div>
              <label htmlFor="f-sort" className="field-label">
                Urutkan
              </label>
              <select id="f-sort" name="sort" defaultValue={sort} className="field-input">
                <option value="terbaru">Terbaru</option>
                <option value="murah">Harga terendah</option>
                <option value="mahal">Harga tertinggi</option>
              </select>
            </div>
            <button type="submit" className="w-full rounded-lg bg-clay px-4 py-3 font-semibold text-white hover:bg-clay/90">
              Terapkan filter
            </button>
            <a href="/proyek" className="block text-center font-semibold text-clay underline">
              Reset filter
            </a>
          </form>
        </aside>

        <section aria-label="Hasil pencarian proyek">
          <p aria-live="polite" data-testid="hasil-count" className="mb-6 font-medium">
            {hasil.length === 0
              ? 'Tidak ada proyek yang cocok.'
              : `Menampilkan ${tampil.length} dari ${hasil.length} proyek.`}
          </p>

          {tampil.length === 0 ? (
            <div className="rounded-xl border border-line bg-surface p-10 text-center">
              <p className="text-lg font-semibold">Tidak ada proyek yang cocok dengan filter Anda</p>
              <p className="mt-2 text-ink2">Coba longgarkan filter, atau lihat semua proyek kami.</p>
              <a href="/proyek" className="mt-6 inline-block rounded-lg bg-clay px-5 py-3 font-semibold text-white hover:bg-clay/90">
                Reset filter
              </a>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {tampil.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
              <Pagination
                halaman={halamanAman}
                totalHalaman={totalHalaman}
                baseQuery={{ q: sp.q, kota, harga_max: sp.harga_max, kamar: sp.kamar, status, sort }}
              />
            </>
          )}
        </section>
      </div>
    </div>
  )
}
