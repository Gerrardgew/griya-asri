import type { Metadata } from 'next'
import Breadcrumb from '@/components/Breadcrumb'
import { getSiteConfig } from '@/lib/data'
import { waLink } from '@/lib/kpr'
import { kirimLead } from './actions'

export const metadata: Metadata = {
  title: 'Kontak',
  description:
    'Hubungi Griya Asri Realty: WhatsApp, email, alamat kantor, dan jam operasional. Formulir kontak juga tersedia.',
  alternates: { canonical: '/kontak' },
}

export default async function KontakPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; err?: string }>
}) {
  const sp = await searchParams
  const config = await getSiteConfig()
  const wa = config?.whatsappNumber ?? '6281234567890'
  const email = config?.email ?? 'halo@griyaasri.id'

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <Breadcrumb items={[{ href: '/', label: 'Beranda' }, { label: 'Kontak' }]} />
      <h1 className="mt-4 font-serif text-3xl font-bold md:text-4xl">Hubungi Kami</h1>
      <p className="mt-2 text-ink2">Pilih cara yang paling nyaman untuk Anda. Kami balas di jam kerja.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <a
          href={waLink(wa, 'Halo, saya ingin bertanya tentang rumah di Griya Asri Realty.')}
          className="rounded-xl border-2 border-wa bg-surface p-5 shadow-card hover:bg-wa/5"
        >
          <p className="font-bold text-wa">WhatsApp</p>
          <p className="mt-1 break-all text-ink2">+{wa}</p>
          <p className="mt-2 text-sm text-ink2">Cara tercepat — klik untuk membuka chat.</p>
        </a>
        <a href={`mailto:${email}`} className="rounded-xl border border-line bg-surface p-5 shadow-card hover:border-clay">
          <p className="font-bold text-clay">Email</p>
          <p className="mt-1 break-all text-ink2">{email}</p>
          <p className="mt-2 text-sm text-ink2">Untuk pertanyaan detail dan dokumen.</p>
        </a>
        <div className="rounded-xl border border-line bg-surface p-5 shadow-card">
          <p className="font-bold">Alamat Kantor</p>
          <p className="mt-1 text-ink2">{config?.alamat ?? 'Jl. Raya Pajajaran No. 12, Bogor'}</p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-5 shadow-card">
          <p className="font-bold">Jam Operasional</p>
          <p className="mt-1 text-ink2">{config?.jamOperasional ?? 'Senin–Sabtu, 08.00–17.00 WIB'}</p>
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <section aria-labelledby="form-kontak">
          <h2 id="form-kontak" className="font-serif text-2xl font-bold">
            atau Isi Formulir Ini
          </h2>
          <p className="mt-2 text-ink2">Isi data Anda, tim kami yang akan menghubungi Anda.</p>

          {sp.ok === '1' && (
            <p role="status" className="mt-4 rounded-lg border border-moss/40 bg-moss/10 px-4 py-3 font-medium text-moss">
              Terima kasih! Pesan Anda sudah kami terima. Tim kami akan menghubungi Anda di jam kerja.
            </p>
          )}
          {sp.err && (
            <p role="alert" className="mt-4 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 font-medium text-danger">
              {sp.err === 'nama-telepon'
                ? 'Nama dan nomor telepon wajib diisi. Silakan periksa kembali.'
                : sp.err === 'email'
                  ? 'Format email tidak valid. Silakan periksa kembali atau kosongkan kolom email.'
                  : sp.err === 'rate'
                    ? 'Terlalu banyak pesan terkirim dalam waktu singkat. Coba lagi dalam satu jam, atau hubungi kami langsung via WhatsApp.'
                    : 'Maaf, pesan gagal terkirim. Silakan coba lagi atau hubungi kami via WhatsApp.'}
            </p>
          )}

          <form action={kirimLead} className="mt-5 space-y-5 rounded-xl border border-line bg-surface p-6 shadow-card">
            <div>
              <label htmlFor="k-nama" className="field-label">
                Nama lengkap <span aria-hidden className="text-danger">*</span>
              </label>
              <input id="k-nama" name="nama" type="text" required autoComplete="name" className="field-input" />
            </div>
            <div>
              <label htmlFor="k-telepon" className="field-label">
                Nomor telepon / WhatsApp <span aria-hidden className="text-danger">*</span>
              </label>
              <input id="k-telepon" name="telepon" type="tel" required autoComplete="tel" placeholder="08…" className="field-input" />
            </div>
            <div>
              <label htmlFor="k-email" className="field-label">
                Email <span className="font-normal text-ink2">(opsional)</span>
              </label>
              <input id="k-email" name="email" type="email" autoComplete="email" className="field-input" />
            </div>
            <div>
              <label htmlFor="k-pesan" className="field-label">
                Pesan Anda
              </label>
              <textarea id="k-pesan" name="pesan" rows={4} placeholder="Contoh: saya tertarik rumah di Bogor, budget Rp 600 juta." className="field-input" />
            </div>
            <button type="submit" className="w-full rounded-lg bg-clay px-4 py-3 font-semibold text-white hover:bg-clay/90">
              Kirim Pesan
            </button>
          </form>
        </section>

        <section aria-labelledby="bantuan-lain" className="rounded-xl border border-line bg-parchment p-6">
          <h2 id="bantuan-lain" className="font-serif text-2xl font-bold">
            Belum Yakin Mulai dari Mana?
          </h2>
          <ul className="mt-4 space-y-3 leading-relaxed text-ink2">
            <li>
              · Lihat dulu{' '}
              <a href="/proyek" className="font-semibold text-clay underline">
                semua proyek kami
              </a>{' '}
              — ada filter per kota dan harga.
            </li>
            <li>
              · Coba{' '}
              <a href="/kalkulator" className="font-semibold text-clay underline">
                Kalkulator KPR
              </a>{' '}
              untuk tahu perkiraan cicilan bulanan Anda.
            </li>
            <li>
              · Baca{' '}
              <a href="/panduan" className="font-semibold text-clay underline">
                Panduan Membeli
              </a>{' '}
              jika istilah DP/KPR masih asing.
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
