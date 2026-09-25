import { Fragment } from 'react'
import type { Faq } from '@prisma/client'
import { db } from '@/lib/db'
import { safeQuery } from '@/lib/data'
import { saveFaq, deleteFaq } from '../actions'

const KATEGORI = [
  { v: 'harga', label: 'Harga & Cicilan' },
  { v: 'lokasi', label: 'Lokasi' },
  { v: 'cara_beli', label: 'Cara Beli' },
  { v: 'kontak', label: 'Kontak Sales' },
  { v: 'umum', label: 'Lainnya' },
]

export default async function AdminFaq({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  const sp = await searchParams
  const faqs = await safeQuery(
    () => db.faq.findMany({ orderBy: [{ urutan: 'asc' }, { id: 'asc' }] }),
    [] as Faq[]
  )

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold">FAQ</h1>
      <p className="mt-1 text-ink2">
        Pertanyaan yang terbit dipakai di halaman FAQ publik dan jawaban bot chat.
      </p>

      {sp.ok && (
        <p role="status" className="mt-4 rounded-lg border border-moss/40 bg-moss/10 px-4 py-3 font-medium text-moss">
          Perubahan FAQ tersimpan.
        </p>
      )}
      {sp.err && (
        <p role="alert" className="mt-4 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 font-medium text-danger">
          Pertanyaan dan jawaban wajib diisi.
        </p>
      )}

      <div className="mt-6 space-y-4">
        {faqs.map((f) => (
          <Fragment key={f.id}>
          <form action={saveFaq.bind(null, f.id)} className="space-y-4 rounded-xl border border-line bg-surface p-5 shadow-card">
            <p className="text-sm font-bold text-ink2" data-testid={`faq-q-${f.id}`}>
              {f.pertanyaan}
            </p>
            <div>
              <label htmlFor={`f-t-${f.id}`} className="field-label">Pertanyaan</label>
              <input id={`f-t-${f.id}`} name="pertanyaan" defaultValue={f.pertanyaan} className="field-input" />
            </div>
            <div>
              <label htmlFor={`f-j-${f.id}`} className="field-label">Jawaban</label>
              <textarea id={`f-j-${f.id}`} name="jawaban" rows={3} defaultValue={f.jawaban} className="field-input" />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor={`f-k-${f.id}`} className="field-label">Kategori</label>
                <select id={`f-k-${f.id}`} name="kategori" defaultValue={f.kategori} className="field-input">
                  {KATEGORI.map((k) => (
                    <option key={k.v} value={k.v}>{k.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={`f-u-${f.id}`} className="field-label">Urutan</label>
                <input id={`f-u-${f.id}`} name="urutan" type="number" defaultValue={f.urutan} className="field-input" />
              </div>
              <label className="flex items-end gap-2 pb-2 font-medium">
                <input type="checkbox" name="publish" defaultChecked={f.publish} className="h-5 w-5 accent-clay" />
                Terbitkan
              </label>
            </div>
            <div className="flex gap-3 border-t border-line pt-4">
              <button type="submit" className="rounded-lg bg-ink px-5 py-2.5 font-semibold text-white hover:bg-ink/90">
                Simpan
              </button>
            </div>
          </form>

          {/* Hapus: form terpisah — pola formAction merusak hidrasi halaman (temuan E2E) */}
          <form action={deleteFaq.bind(null, f.id)} className="-mt-3 mb-4 text-right">
            <button type="submit" className="rounded-lg border border-danger/50 px-4 py-2 text-sm font-semibold text-danger hover:bg-danger/10">
            Hapus FAQ Ini
          </button>
        </form>
        </Fragment>
      ))}

        {/* Tambah FAQ */}
        <form action={saveFaq.bind(null, 0)} className="space-y-4 rounded-xl border-2 border-dashed border-line bg-parchment p-5">
          <p className="font-bold">+ Tambah FAQ</p>
          <div>
            <label htmlFor="fn-t" className="field-label">Pertanyaan</label>
            <input id="fn-t" name="pertanyaan" required className="field-input" />
          </div>
          <div>
            <label htmlFor="fn-j" className="field-label">Jawaban</label>
            <textarea id="fn-j" name="jawaban" rows={3} required className="field-input" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="fn-k" className="field-label">Kategori</label>
              <select id="fn-k" name="kategori" className="field-input">
                {KATEGORI.map((k) => (
                  <option key={k.v} value={k.v}>{k.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="fn-u" className="field-label">Urutan</label>
              <input id="fn-u" name="urutan" type="number" defaultValue={faqs.length + 1} className="field-input" />
            </div>
            <label className="flex items-end gap-2 pb-2 font-medium">
              <input type="checkbox" name="publish" defaultChecked className="h-5 w-5 accent-clay" />
              Terbitkan
            </label>
          </div>
          <button type="submit" className="rounded-lg bg-clay px-5 py-2.5 font-semibold text-white hover:bg-clay/90">
            Tambah FAQ
          </button>
        </form>
      </div>
    </div>
  )
}
