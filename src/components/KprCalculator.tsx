'use client'

import { useMemo, useState } from 'react'
import { hitungKpr, rp, waLink } from '@/lib/kpr'

const DP_PRESET = [10, 20, 30]
const TENOR = [5, 10, 15, 20, 25, 30]

// Kalkulator KPR (FR-04) — murni client, tetap jalan offline.
export default function KprCalculator({
  hargaAwal,
  waNumber,
  konteks,
}: {
  hargaAwal?: number
  waNumber: string
  konteks?: string
}) {
  const [harga, setHarga] = useState<number | ''>(hargaAwal ?? 500000000)
  const [dpPersen, setDpPersen] = useState(20)
  const [tenor, setTenor] = useState(15)
  const [bunga, setBunga] = useState(8)

  const valid =
    typeof harga === 'number' && harga > 0 && dpPersen >= 0 && dpPersen <= 100 && bunga >= 0 && TENOR.includes(tenor)

  const hasil = useMemo(() => {
    if (!valid) return null
    return hitungKpr(harga as number, dpPersen, tenor, bunga)
  }, [valid, harga, dpPersen, tenor, bunga])

  const waPesan = hasil
    ? `Halo, saya mau tanya${konteks ? ` soal ${konteks}` : ''}. Estimasi cicilan saya: ${rp(hasil.angsuran)}/bln (harga ${rp(
        harga as number
      )}, DP ${dpPersen}%, tenor ${tenor} thn, bunga ${bunga}%). Apakah bisa dibantu?`
    : 'Halo, saya mau bertanya soal simulasi KPR.'

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="kpr-harga" className="field-label">
            Harga rumah (Rp)
          </label>
          <input
            id="kpr-harga"
            type="number"
            inputMode="numeric"
            min={1}
            step={5000000}
            value={harga}
            onChange={(e) => setHarga(e.target.value === '' ? '' : Number(e.target.value))}
            className="field-input"
            aria-describedby="kpr-harga-help"
          />
          <p id="kpr-harga-help" className="mt-1 text-sm text-ink2">
            Harga sudah terisi otomatis dari tipe unit — boleh Anda ubah.
          </p>
          {!valid && typeof harga !== 'number' && (
            <p role="alert" className="mt-1 text-sm font-medium text-danger">
              Harga harus berupa angka lebih dari 0.
            </p>
          )}
        </div>

        <div>
          <span className="field-label" id="kpr-dp-label">
            Uang muka (DP)
          </span>
          <div role="radiogroup" aria-labelledby="kpr-dp-label" className="mb-2 flex flex-wrap gap-2">
            {DP_PRESET.map((p) => (
              <button
                key={p}
                type="button"
                role="radio"
                aria-checked={dpPersen === p}
                onClick={() => setDpPersen(p)}
                className={`rounded-full border px-4 py-2 font-semibold ${
                  dpPersen === p ? 'border-clay bg-clay text-white' : 'border-line bg-surface hover:border-clay/50'
                }`}
              >
                {p}%
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <input
              id="kpr-dp"
              type="range"
              min={0}
              max={100}
              step={5}
              value={dpPersen}
              onChange={(e) => setDpPersen(Number(e.target.value))}
              aria-label="Persentase uang muka kustom"
              className="w-full accent-clay"
            />
            <output htmlFor="kpr-dp" className="w-16 shrink-0 text-right font-semibold">
              {dpPersen}%
            </output>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="kpr-tenor" className="field-label">
              Tenor (tahun)
            </label>
            <select id="kpr-tenor" value={tenor} onChange={(e) => setTenor(Number(e.target.value))} className="field-input">
              {TENOR.map((t) => (
                <option key={t} value={t}>
                  {t} tahun
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="kpr-bunga" className="field-label">
              Suku bunga / tahun
            </label>
            <input
              id="kpr-bunga"
              type="number"
              min={0}
              max={30}
              step={0.25}
              value={bunga}
              onChange={(e) => setBunga(Number(e.target.value))}
              className="field-input"
            />
          </div>
        </div>
      </form>

      <div className="rounded-xl border border-line bg-surface p-6 shadow-card">
        <h3 className="font-serif text-xl font-bold">Perkiraan Anda</h3>
        <dl className="mt-4 space-y-3">
          <div className="flex justify-between gap-4 border-b border-line pb-3">
            <dt className="text-ink2">Uang muka ({dpPersen}%)</dt>
            <dd className="font-semibold">{hasil ? rp(hasil.dp) : '—'}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-line pb-3">
            <dt className="text-ink2">Pokok pinjaman</dt>
            <dd className="font-semibold">{hasil ? rp(hasil.pokok) : '—'}</dd>
          </div>
          <div>
            <dt className="text-ink2">Angsuran per bulan</dt>
            <dd data-testid="kpr-angsuran" className="mt-1 font-serif text-3xl font-bold text-clay">{hasil ? rp(hasil.angsuran) : '—'}</dd>
          </div>
        </dl>

        <a
          href={waLink(waNumber, waPesan)}
          data-testid="kpr-wa"
          className="mt-6 block rounded-lg bg-wa px-4 py-3 text-center font-semibold text-white hover:bg-wa/90"
          aria-disabled={!valid}
        >
          Tanya via WhatsApp dengan hasil ini
        </a>
        <p className="mt-3 text-sm text-ink2">
          Angka di atas estimasi ilustratif (bukan penawaran resmi). Suku bunga final mengikuti kebijakan bank.
        </p>
      </div>
    </div>
  )
}
