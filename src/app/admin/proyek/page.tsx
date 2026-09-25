import Link from 'next/link'
import Badge from '@/components/Badge'
import { db } from '@/lib/db'
import { safeQuery } from '@/lib/data'
import { togglePublish, deleteProject } from '../actions'
import { rp } from '@/lib/kpr'

const PESAN: Record<string, string> = {
  status: 'Status publikasi proyek berhasil diubah.',
  hapus: 'Proyek berhasil dihapus.',
}

export default async function AdminProyekList({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const sp = await searchParams
  const proyek = await safeQuery(
    () =>
      db.project.findMany({
        orderBy: { updatedAt: 'desc' },
        include: { unitTypes: { select: { harga: true } } },
      }),
    []
  )

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold">Proyek</h1>
          <p className="mt-1 text-ink2">{proyek.length} proyek tersimpan (termasuk draft).</p>
        </div>
        <Link href="/admin/proyek/baru" className="rounded-lg bg-clay px-5 py-3 font-semibold text-white hover:bg-clay/90">
          + Tambah Proyek
        </Link>
      </div>

      {sp.ok && PESAN[sp.ok] && (
        <p role="status" className="mt-4 rounded-lg border border-moss/40 bg-moss/10 px-4 py-3 font-medium text-moss">
          {PESAN[sp.ok]}
        </p>
      )}

      {proyek.length === 0 ? (
        <div className="mt-6 rounded-xl border border-line bg-surface p-10 text-center">
          <p className="font-semibold">Belum ada proyek</p>
          <p className="mt-1 text-ink2">Mulai dengan menambahkan proyek pertama Anda.</p>
          <Link href="/admin/proyek/baru" className="mt-5 inline-block rounded-lg bg-clay px-5 py-3 font-semibold text-white hover:bg-clay/90">
            + Tambah Proyek
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {proyek.map((p) => {
            const hargaMin = p.unitTypes.length > 0 ? Math.min(...p.unitTypes.map((u) => u.harga)) : null
            return (
              <li key={p.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-line bg-surface p-4 shadow-card">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <Link href={`/admin/proyek/${p.id}`} className="font-serif text-lg font-bold hover:text-clay">
                      {p.nama}
                    </Link>
                    <Badge status={p.status} />
                    {!p.publish && (
                      <span className="rounded-full border border-line bg-parchment px-3 py-0.5 text-sm font-semibold text-ink2">
                        Draft
                      </span>
                    )}
                    {p.featured && (
                      <span className="rounded-full border border-clay/40 bg-clay/10 px-3 py-0.5 text-sm font-semibold text-clay">
                        Unggulan
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-ink2">
                    {p.kota} · /proyek/{p.slug} · {hargaMin ? `Mulai ${rp(hargaMin)}` : 'belum ada tipe unit'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`/proyek/${p.slug}`}
                    className="rounded-lg border border-line px-3 py-2 text-sm font-semibold hover:border-clay hover:text-clay"
                  >
                    {p.publish ? 'Lihat' : 'Preview'}
                  </a>
                  <form action={togglePublish.bind(null, p.id)}>
                    <input type="hidden" name="target" value={p.publish ? '0' : '1'} />
                    <button
                      type="submit"
                      className={`rounded-lg px-3 py-2 text-sm font-semibold text-white ${
                        p.publish ? 'bg-slate hover:bg-slate/90' : 'bg-moss hover:bg-moss/90'
                      }`}
                    >
                      {p.publish ? 'Jadikan Draft' : 'Publish'}
                    </button>
                  </form>
                  <Link href={`/admin/proyek/${p.id}`} className="rounded-lg bg-ink px-3 py-2 text-sm font-semibold text-white hover:bg-ink/90">
                    Edit
                  </Link>
                  <form action={deleteProject.bind(null, p.id)}>
                    <button type="submit" className="rounded-lg border border-danger/50 px-3 py-2 text-sm font-semibold text-danger hover:bg-danger/10">
                      Hapus
                    </button>
                  </form>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
