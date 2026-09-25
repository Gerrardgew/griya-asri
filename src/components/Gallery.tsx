'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

type Foto = { url: string; alt: string }

// Galeri + lightbox manual (tanpa auto-play) — keyboard: panah & Escape.
export default function Gallery({ fotos }: { fotos: Foto[] }) {
  const [utama, setUtama] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const total = fotos.length

  const prev = useCallback(() => setUtama((i) => (i - 1 + total) % total), [total])
  const next = useCallback(() => setUtama((i) => (i + 1) % total), [total])

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false)
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, prev, next])

  if (total === 0) {
    return (
      <div className="grid aspect-[16/9] w-full place-items-center rounded-xl bg-parchment text-ink2">
        Belum ada foto untuk proyek ini.
      </div>
    )
  }

  const foto = fotos[utama]

  return (
    <section aria-label="Galeri foto proyek">
      <div className="relative overflow-hidden rounded-xl bg-parchment">
        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="block w-full"
          aria-label={`Perbesar foto: ${foto.alt}`}
        >
          <Image
            src={foto.url}
            alt={foto.alt}
            width={1200}
            height={675}
            sizes="(min-width: 1024px) 1200px, 100vw"
            className="aspect-video w-full object-cover"
            priority
          />
        </button>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Foto sebelumnya"
              className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-surface/90 text-xl shadow-lift hover:bg-surface"
            >
              <span aria-hidden>‹</span>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Foto berikutnya"
              className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-surface/90 text-xl shadow-lift hover:bg-surface"
            >
              <span aria-hidden>›</span>
            </button>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Pilih foto">
          {fotos.map((f, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === utama}
              aria-label={`Foto ${i + 1}: ${f.alt}`}
              onClick={() => setUtama(i)}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 ${
                i === utama ? 'border-clay' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <Image src={f.url} alt="" width={192} height={128} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Foto diperbesar: ${foto.alt}`}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-ink/95 p-4"
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            autoFocus
            aria-label="Tutup tampilan foto"
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-surface text-xl font-bold"
          >
            <span aria-hidden>✕</span>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={foto.url} alt={foto.alt} className="max-h-[75vh] max-w-full rounded-lg object-contain" />
          <div className="mt-4 flex items-center gap-4 text-white">
            <button type="button" onClick={prev} aria-label="Foto sebelumnya" className="grid h-11 w-11 place-items-center rounded-full bg-surface/20 text-2xl">
              <span aria-hidden>‹</span>
            </button>
            <p className="max-w-md text-center text-sm">
              {foto.alt} ({utama + 1}/{total})
            </p>
            <button type="button" onClick={next} aria-label="Foto berikutnya" className="grid h-11 w-11 place-items-center rounded-full bg-surface/20 text-2xl">
              <span aria-hidden>›</span>
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
