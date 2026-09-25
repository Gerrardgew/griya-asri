import Link from 'next/link'
import { db } from '@/lib/db'
import { safeQuery } from '@/lib/data'

export default async function AdminDashboard() {
  const [jumlahProyek, jumlahPublish, jumlahFaq, leads] = await Promise.all([
    safeQuery(() => db.project.count(), 0),
    safeQuery(() => db.project.count({ where: { publish: true } }), 0),
    safeQuery(() => db.faq.count(), 0),
    safeQuery(() => db.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }), []),
  ])

  const kartu = [
    { label: 'Total proyek', nilai: jumlahProyek, href: '/admin/proyek' },
    { label: 'Proyek terbit', nilai: jumlahPublish, href: '/admin/proyek' },
    { label: 'FAQ terbit', nilai: jumlahFaq, href: '/admin/faq' },
    { label: 'Lead (form kontak)', nilai: leads.length, href: '#lead' },
  ]

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-ink2">Ringkasan konten situs Griya Asri Realty.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kartu.map((k) => (
          <Link key={k.label} href={k.href} className="rounded-xl border border-line bg-surface p-5 shadow-card hover:border-clay">
            <p className="text-sm text-ink2">{k.label}</p>
            <p className="mt-1 font-serif text-3xl font-bold">{k.nilai}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/proyek/baru" className="rounded-lg bg-clay px-5 py-3 font-semibold text-white hover:bg-clay/90">
          + Tambah Proyek
        </Link>
        <Link href="/admin/faq" className="rounded-lg border-2 border-ink px-5 py-3 font-semibold hover:border-clay hover:text-clay">
          Kelola FAQ
        </Link>
        <Link href="/admin/pengaturan" className="rounded-lg border-2 border-ink px-5 py-3 font-semibold hover:border-clay hover:text-clay">
          Ubah Kontak & Hero
        </Link>
      </div>

      <section id="lead" aria-labelledby="lead-judul" className="mt-12">
        <h2 id="lead-judul" className="font-serif text-xl font-bold">
          Lead Terbaru (Form Kontak)
        </h2>
        {leads.length === 0 ? (
          <p className="mt-3 rounded-xl border border-line bg-surface p-6 text-ink2">
            Belum ada lead masuk. Formulir kontak publik akan mengirim data ke sini.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
            {leads.map((l) => (
              <li key={l.id} className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">
                    {l.nama} · {l.telepon}
                  </p>
                  <p className="text-sm text-ink2">{new Date(l.createdAt).toLocaleString('id-ID')}</p>
                </div>
                {l.pesan && <p className="mt-1 text-ink2">{l.pesan}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
