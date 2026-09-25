import { db } from '@/lib/db'
import { saveSettings } from '../actions'

export default async function AdminPengaturan({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const sp = await searchParams
  const config =
    (await db.siteConfig.findUnique({ where: { id: 1 } }).catch(() => null)) ??
    (await db.siteConfig.create({ data: {} }).catch(() => null))

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-2xl font-bold">Pengaturan Situs</h1>
      <p className="mt-1 text-ink2">Kontak dan teks hero yang dipakai di seluruh halaman publik.</p>

      {sp.ok && (
        <p role="status" className="mt-4 rounded-lg border border-moss/40 bg-moss/10 px-4 py-3 font-medium text-moss">
          Pengaturan tersimpan.
        </p>
      )}

      <form action={saveSettings} className="mt-6 space-y-5 rounded-xl border border-line bg-surface p-6 shadow-card">
        <div>
          <label htmlFor="s-wa" className="field-label">
            Nomor WhatsApp (format internasional tanpa +)
          </label>
          <input id="s-wa" name="whatsappNumber" defaultValue={config?.whatsappNumber ?? ''} placeholder="6281234567890" className="field-input" />
          <p className="mt-1 text-sm text-ink2">Dipakai semua tombol WhatsApp di situs.</p>
        </div>
        <div>
          <label htmlFor="s-email" className="field-label">Email</label>
          <input id="s-email" name="email" type="email" defaultValue={config?.email ?? ''} className="field-input" />
        </div>
        <div>
          <label htmlFor="s-alamat" className="field-label">Alamat kantor</label>
          <input id="s-alamat" name="alamat" defaultValue={config?.alamat ?? ''} className="field-input" />
        </div>
        <div>
          <label htmlFor="s-jam" className="field-label">Jam operasional</label>
          <input id="s-jam" name="jamOperasional" defaultValue={config?.jamOperasional ?? ''} className="field-input" />
        </div>

        <fieldset className="space-y-5 rounded-lg bg-parchment p-5">
          <legend className="px-1 font-bold">Hero Homepage</legend>
          <div>
            <label htmlFor="s-ht" className="field-label">Judul besar</label>
            <input id="s-ht" name="heroTitle" defaultValue={config?.heroTitle ?? ''} className="field-input" />
          </div>
          <div>
            <label htmlFor="s-hs" className="field-label">Subjudul</label>
            <textarea id="s-hs" name="heroSubtitle" rows={2} defaultValue={config?.heroSubtitle ?? ''} className="field-input" />
          </div>
          <div>
            <label htmlFor="s-hc" className="field-label">Label tombol utama</label>
            <input id="s-hc" name="heroCtaLabel" defaultValue={config?.heroCtaLabel ?? ''} className="field-input" />
          </div>
        </fieldset>

        <button type="submit" className="rounded-lg bg-clay px-6 py-3 font-semibold text-white hover:bg-clay/90">
          Simpan Pengaturan
        </button>
      </form>
    </div>
  )
}
