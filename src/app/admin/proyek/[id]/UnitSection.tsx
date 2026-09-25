import { Fragment } from 'react'
import type { UnitType } from '@prisma/client'
import { saveUnit, deleteUnit } from '@/app/admin/actions'

// Bagian "Tipe Unit" di editor proyek — dipisah dari form proyek agar file
// editor tetap terbaca. Server component: seluruh form memakai server action.
export default function UnitSection({ projectId, unitTypes }: { projectId: number; unitTypes: UnitType[] }) {
  return (
    <section aria-labelledby="unit-judul" className="mt-12">
      <h2 id="unit-judul" className="font-serif text-xl font-bold">
        Tipe Unit ({unitTypes.length})
      </h2>

      {unitTypes.map((u) => (
        <Fragment key={u.id}>
          <form action={saveUnit.bind(null, u.id)} className="mt-4 space-y-4 rounded-xl border border-line bg-surface p-6 shadow-card">
            <p className="font-serif font-bold" data-testid={`unit-name-${u.id}`}>
              {u.namaTipe}
            </p>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="md:col-span-1">
                <label htmlFor={`u-nama-${u.id}`} className="field-label">Nama tipe</label>
                <input id={`u-nama-${u.id}`} name="namaTipe" defaultValue={u.namaTipe} className="field-input" />
              </div>
              <div>
                <label htmlFor={`u-harga-${u.id}`} className="field-label">Harga (Rp)</label>
                <input id={`u-harga-${u.id}`} name="harga" type="number" min={1} step="any" defaultValue={u.harga} className="field-input" />
              </div>
              <div>
                <label htmlFor={`u-lt-${u.id}`} className="field-label">Luas tanah (m²)</label>
                <input id={`u-lt-${u.id}`} name="luasTanah" type="number" step="any" defaultValue={u.luasTanah ?? ''} className="field-input" />
              </div>
              <div>
                <label htmlFor={`u-lb-${u.id}`} className="field-label">Luas bangunan (m²)</label>
                <input id={`u-lb-${u.id}`} name="luasBangunan" type="number" step="any" defaultValue={u.luasBangunan ?? ''} className="field-input" />
              </div>
              <div>
                <label htmlFor={`u-kt-${u.id}`} className="field-label">Kamar tidur</label>
                <input id={`u-kt-${u.id}`} name="kamarTidur" type="number" min={0} defaultValue={u.kamarTidur} className="field-input" />
              </div>
              <div>
                <label htmlFor={`u-km-${u.id}`} className="field-label">Kamar mandi</label>
                <input id={`u-km-${u.id}`} name="kamarMandi" type="number" min={0} defaultValue={u.kamarMandi} className="field-input" />
              </div>
              <div>
                <label htmlFor={`u-stok-${u.id}`} className="field-label">Stok unit</label>
                <input id={`u-stok-${u.id}`} name="stok" type="number" min={0} defaultValue={u.stok} className="field-input" />
              </div>
              <div>
                <label htmlFor={`u-urut-${u.id}`} className="field-label">Urutan tampil</label>
                <input id={`u-urut-${u.id}`} name="urutan" type="number" defaultValue={u.urutan} className="field-input" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor={`u-spek-${u.id}`} className="field-label">Spesifikasi (satu per baris)</label>
                <textarea id={`u-spek-${u.id}`} name="spesifikasi" rows={3} defaultValue={u.spesifikasi} className="field-input" />
              </div>
              <div>
                <label htmlFor={`u-foto-${u.id}`} className="field-label">URL foto unit</label>
                <input id={`u-foto-${u.id}`} name="fotoUrl" type="url" defaultValue={u.fotoUrl ?? ''} className="field-input" />
              </div>
            </div>

            <div className="flex gap-3 border-t border-line pt-4">
              <button type="submit" className="rounded-lg bg-ink px-5 py-2.5 font-semibold text-white hover:bg-ink/90">
                Simpan Tipe
              </button>
            </div>
          </form>

          {/* Hapus: form terpisah — pola formAction merusak hidrasi halaman (temuan E2E) */}
          <form action={deleteUnit.bind(null, u.id)} className="-mt-3 mb-4 text-right">
            <button type="submit" className="rounded-lg border border-danger/50 px-4 py-2 text-sm font-semibold text-danger hover:bg-danger/10">
              Hapus Tipe Ini
            </button>
          </form>
        </Fragment>
      ))}

      {/* Tambah tipe unit */}
      <form action={saveUnit.bind(null, 0)} className="mt-6 space-y-4 rounded-xl border-2 border-dashed border-line bg-parchment p-6">
        <input type="hidden" name="projectId" value={projectId} />
        <p className="font-bold">+ Tambah Tipe Unit</p>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-1">
            <label htmlFor="un-nama" className="field-label">Nama tipe</label>
            <input id="un-nama" name="namaTipe" placeholder="Tipe 36/72" required className="field-input" />
          </div>
          <div>
            <label htmlFor="un-harga" className="field-label">Harga (Rp)</label>
            <input id="un-harga" name="harga" type="number" min={1} step="any" required placeholder="500000000" className="field-input" />
          </div>
          <div>
            <label htmlFor="un-lt" className="field-label">Luas tanah (m²)</label>
            <input id="un-lt" name="luasTanah" type="number" step="any" className="field-input" />
          </div>
          <div>
            <label htmlFor="un-lb" className="field-label">Luas bangunan (m²)</label>
            <input id="un-lb" name="luasBangunan" type="number" step="any" className="field-input" />
          </div>
          <div>
            <label htmlFor="un-kt" className="field-label">Kamar tidur</label>
            <input id="un-kt" name="kamarTidur" type="number" min={0} defaultValue={2} className="field-input" />
          </div>
          <div>
            <label htmlFor="un-km" className="field-label">Kamar mandi</label>
            <input id="un-km" name="kamarMandi" type="number" min={0} defaultValue={1} className="field-input" />
          </div>
          <div>
            <label htmlFor="un-stok" className="field-label">Stok unit</label>
            <input id="un-stok" name="stok" type="number" min={0} defaultValue={0} className="field-input" />
          </div>
          <div>
            <label htmlFor="un-urut" className="field-label">Urutan tampil</label>
            <input id="un-urut" name="urutan" type="number" defaultValue={unitTypes.length + 1} className="field-input" />
          </div>
        </div>
        <div>
          <label htmlFor="un-spek" className="field-label">Spesifikasi (satu per baris)</label>
          <textarea id="un-spek" name="spesifikasi" rows={2} className="field-input" />
        </div>
        <button type="submit" className="rounded-lg bg-clay px-5 py-2.5 font-semibold text-white hover:bg-clay/90">
          Tambah Tipe
        </button>
      </form>
    </section>
  )
}
