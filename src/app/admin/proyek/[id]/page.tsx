import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { saveProject, deleteProject } from '../../actions'
import UnitSection from './UnitSection'

const PESAN_ERR: Record<string, string> = {
  nama: 'Nama proyek wajib diisi.',
  foto: 'Minimal 1 foto (thumbnail atau galeri) sebelum publish.',
  unit: 'Nama tipe dan harga (lebih dari 0) wajib diisi.',
}

type Params = { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string; err?: string }> }

export default async function EditorProyek({ params, searchParams }: Params) {
  const { id: idParam } = await params
  const sp = await searchParams
  const baru = idParam === 'baru'
  const id = baru ? 0 : Number(idParam)
  // Audit #13: guard NaN — kondisi lama (`&&`) membiarkan id sampak lolos ke query.
  if (!baru && (!Number.isInteger(id) || id <= 0)) notFound()

  const p = baru
    ? null
    : await db.project.findUnique({
        where: { id },
        include: { unitTypes: { orderBy: [{ urutan: 'asc' }, { id: 'asc' }] }, galeri: { orderBy: { urutan: 'asc' } } },
      })
  if (!baru && !p) notFound()

  const galeriTeks = (p?.galeri ?? []).map((g) => `${g.url} | ${g.alt}`).join('\n')

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold">{baru ? 'Tambah Proyek' : `Edit: ${p!.nama}`}</h1>
          <p className="mt-1 text-ink2">
            {baru ? 'Isi detail proyek baru. Bisa disimpan sebagai draft dulu.' : `Slug: /proyek/${p!.slug}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/proyek" className="rounded-lg border border-line px-4 py-2.5 font-semibold hover:border-clay hover:text-clay">
            ← Daftar Proyek
          </Link>
          {p && (
            <a href={`/proyek/${p.slug}`} className="rounded-lg border border-line px-4 py-2.5 font-semibold hover:border-clay hover:text-clay">
              {p.publish ? 'Lihat Halaman' : 'Preview Draft'}
            </a>
          )}
        </div>
      </div>

      {sp.ok && (
        <p role="status" className="mt-4 rounded-lg border border-moss/40 bg-moss/10 px-4 py-3 font-medium text-moss">
          Perubahan tersimpan. {p && !p.publish && 'Proyek masih draft — klik Publish di daftar proyek untuk menayangkan.'}
        </p>
      )}
      {sp.err && PESAN_ERR[sp.err] && (
        <p role="alert" className="mt-4 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 font-medium text-danger">
          {PESAN_ERR[sp.err]}
        </p>
      )}

      {/* ===== FORM PROYEK ===== */}
      <form action={saveProject} className="mt-6 space-y-6 rounded-xl border border-line bg-surface p-6 shadow-card">
        {p && <input type="hidden" name="id" value={p.id} />}

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="p-nama" className="field-label">
              Nama proyek <span aria-hidden className="text-danger">*</span>
            </label>
            <input id="p-nama" name="nama" required defaultValue={p?.nama ?? ''} className="field-input" />
          </div>
          <div>
            <label htmlFor="p-slug" className="field-label">
              Slug URL <span className="font-normal text-ink2">(kosongkan = otomatis dari nama)</span>
            </label>
            <input id="p-slug" name="slug" defaultValue={p?.slug ?? ''} placeholder="griya-asri-contoh" className="field-input" />
          </div>
          <div>
            <label htmlFor="p-kota" className="field-label">
              Kota <span aria-hidden className="text-danger">*</span>
            </label>
            <input id="p-kota" name="kota" required defaultValue={p?.kota ?? ''} className="field-input" />
          </div>
          <div>
            <label htmlFor="p-alamat" className="field-label">
              Alamat lengkap
            </label>
            <input id="p-alamat" name="alamat" defaultValue={p?.alamat ?? ''} className="field-input" />
          </div>
          <div>
            <label htmlFor="p-lat" className="field-label">
              Koordinat lintang (lat)
            </label>
            <input id="p-lat" name="koordinatLat" type="number" step="any" defaultValue={p?.koordinatLat ?? ''} placeholder="-6.5953" className="field-input" />
          </div>
          <div>
            <label htmlFor="p-lng" className="field-label">
              Koordinat bujur (lng)
            </label>
            <input id="p-lng" name="koordinatLng" type="number" step="any" defaultValue={p?.koordinatLng ?? ''} placeholder="106.8166" className="field-input" />
          </div>
          <div>
            <label htmlFor="p-status" className="field-label">
              Status
            </label>
            <select id="p-status" name="status" defaultValue={p?.status ?? 'prapenjualan'} className="field-input">
              <option value="prapenjualan">Prapenjualan</option>
              <option value="siap_huni">Siap Huni</option>
              <option value="sold_out">Sold Out</option>
            </select>
          </div>
          <div>
            <label htmlFor="p-thumb" className="field-label">
              URL foto thumbnail
            </label>
            <input id="p-thumb" name="thumbnailUrl" type="url" defaultValue={p?.thumbnailUrl ?? ''} placeholder="https://…" className="field-input" />
          </div>
        </div>

        <div>
          <label htmlFor="p-deskripsi" className="field-label">
            Deskripsi
          </label>
          <textarea id="p-deskripsi" name="deskripsi" rows={4} defaultValue={p?.deskripsi ?? ''} className="field-input" />
        </div>

        <div>
          <label htmlFor="p-fasilitas" className="field-label">
            Fasilitas <span className="font-normal text-ink2">(satu per baris)</span>
          </label>
          <textarea id="p-fasilitas" name="fasilitas" rows={4} defaultValue={p?.fasilitas ?? ''} className="field-input" />
        </div>

        <div>
          <label htmlFor="p-galeri" className="field-label">
            Galeri <span className="font-normal text-ink2">(satu foto per baris, format: URL | teks alt)</span>
          </label>
          <textarea id="p-galeri" name="galeri" rows={4} defaultValue={galeriTeks} placeholder="https://…/foto1.jpg | Tampak depan rumah" className="field-input" />
        </div>

        <fieldset className="grid gap-5 md:grid-cols-2">
          <legend className="sr-only">Pengaturan publikasi</legend>
          <div>
            <label htmlFor="p-seo-title" className="field-label">
              Judul SEO <span className="font-normal text-ink2">(opsional)</span>
            </label>
            <input id="p-seo-title" name="seoTitle" defaultValue={p?.seoTitle ?? ''} className="field-input" />
          </div>
          <div>
            <label htmlFor="p-seo-desc" className="field-label">
              Deskripsi SEO <span className="font-normal text-ink2">(opsional)</span>
            </label>
            <input id="p-seo-desc" name="seoDescription" defaultValue={p?.seoDescription ?? ''} className="field-input" />
          </div>
        </fieldset>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 font-medium">
            <input type="checkbox" name="featured" defaultChecked={p?.featured ?? false} className="h-5 w-5 accent-clay" />
            Tampilkan sebagai unggulan (maks 3)
          </label>
          <label className="flex items-center gap-2 font-medium">
            <input type="checkbox" name="publish" defaultChecked={p?.publish ?? false} className="h-5 w-5 accent-clay" />
            Publish (butuh minimal 1 foto)
          </label>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-line pt-5">
          <button type="submit" className="rounded-lg bg-clay px-6 py-3 font-semibold text-white hover:bg-clay/90">
            Simpan
          </button>
        </div>
      </form>

      {p && (
        <>
          <UnitSection projectId={p.id} unitTypes={p.unitTypes} />

          {/* ===== ZONA BAHAYA ===== */}
          <section aria-labelledby="hapus-judul" className="mt-12 rounded-xl border border-danger/30 bg-surface p-6">
            <h2 id="hapus-judul" className="font-bold text-danger">
              Hapus Proyek
            </h2>
            <p className="mt-1 text-sm text-ink2">Menghapus proyek beserta semua tipe unit dan galerinya. Tidak bisa dibatalkan.</p>
            <form action={deleteProject.bind(null, p.id)} className="mt-4">
              <button type="submit" className="rounded-lg bg-danger px-5 py-2.5 font-semibold text-white hover:bg-danger/90">
                Hapus Proyek Ini
              </button>
            </form>
          </section>
        </>
      )}
    </div>
  )
}
