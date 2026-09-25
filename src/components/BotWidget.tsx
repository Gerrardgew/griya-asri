'use client'

import { useState, useRef, useEffect } from 'react'
import { waLink } from '@/lib/kpr'

type FaqLite = { pertanyaan: string; jawaban: string; kategori: string }
type Msg = { from: 'bot' | 'user'; text: string }

const KATEGORI_LABEL: Record<string, string> = {
  harga: 'Harga & Cicilan',
  lokasi: 'Lokasi',
  cara_beli: 'Cara Beli',
  kontak: 'Kontak Sales',
  umum: 'Lainnya',
}

// Bot FAQ statis (FR-05): quick-reply per kategori + pencocokan kata kunci.
// Rule-based client-side; fallback ke WA — bot tidak pernah menggantung.
export default function BotWidget({
  waNumber,
  email,
  faqs,
}: {
  waNumber: string
  email: string
  faqs: FaqLite[]
}) {
  const [open, setOpen] = useState(false)
  const [typing, setTyping] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Msg[]>([
    { from: 'bot', text: 'Halo! Saya asisten otomatis Griya Asri. Pilih topik di bawah, atau tulis pertanyaan Anda.' },
  ])
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages, typing])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function balas(text: string) {
    setTyping(true)
    window.setTimeout(() => {
      setMessages((m) => [...m, { from: 'bot', text }])
      setTyping(false)
    }, 600)
  }

  function pilihKategori(kategori: string) {
    setMessages((m) => [...m, { from: 'user', text: KATEGORI_LABEL[kategori] ?? kategori }])
    const jawaban = faqs.find((f) => f.kategori === kategori)
    balas(
      jawaban
        ? jawaban.jawaban
        : 'Untuk topik ini, silakan hubungi sales kami langsung lewat tombol WhatsApp di bawah.'
    )
  }

  function cariJawaban(query: string) {
    const q = query.toLowerCase()
    const kata = q.split(/\s+/).filter((w) => w.length > 3)
    let terbaik: { f: FaqLite; skor: number } | null = null
    for (const f of faqs) {
      const teks = `${f.pertanyaan} ${f.jawaban}`.toLowerCase()
      const skor = kata.reduce((s, w) => s + (teks.includes(w) ? 1 : 0), 0)
      if (skor > 0 && (!terbaik || skor > terbaik.skor)) terbaik = { f, skor }
    }
    if (terbaik) {
      balas(terbaik.f.jawaban)
    } else {
      balas('Maaf, saya belum punya jawaban untuk pertanyaan itu. Silakan tanya langsung ke sales kami via WhatsApp — dibalas pada jam kerja.')
    }
  }

  const kategoriUnik = Array.from(new Set(faqs.map((f) => f.kategori)))

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="panel-bot"
        aria-label={open ? 'Tutup asisten chat' : 'Buka asisten chat — tanya seputar properti'}
        className="fixed bottom-4 right-4 z-50 flex h-14 items-center gap-2 rounded-full bg-clay px-4 font-semibold text-white shadow-lift hover:bg-clay/90"
      >
        <span aria-hidden className="text-xl">{open ? '✕' : '💬'}</span>
        <span className="hidden sm:inline">Tanya Bot</span>
      </button>

      {open && (
        <div
          id="panel-bot"
          role="dialog"
          aria-label="Asisten chat tanya properti"
          data-testid="bot-panel"
          className="fixed bottom-20 right-4 z-50 flex max-h-[70vh] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-overlay"
        >
          <div className="flex items-center justify-between border-b border-line bg-parchment px-4 py-3">
            <div>
              <p className="font-semibold">Asisten Griya Asri</p>
              <p className="text-xs text-ink2">Bot otomatis — jawaban dari FAQ</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tutup asisten chat"
              className="grid h-9 w-9 place-items-center rounded-lg hover:bg-surface"
            >
              <span aria-hidden>✕</span>
            </button>
          </div>

          <div ref={listRef} aria-live="polite" data-testid="bot-messages" className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                  m.from === 'bot' ? 'bg-parchment text-ink' : 'ml-auto bg-clay text-white'
                }`}
              >
                {m.text}
              </div>
            ))}
            {typing && (
              <div className="w-16 rounded-xl bg-parchment px-3 py-2 text-sm" aria-label="Bot sedang mengetik">
                <span aria-hidden>···</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 border-t border-line px-4 py-2">
            {kategoriUnik.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => pilihKategori(k)}
                className="rounded-full border border-clay/40 bg-surface px-3 py-1.5 text-sm font-medium text-clay hover:bg-clay/10"
              >
                {KATEGORI_LABEL[k] ?? k}
              </button>
            ))}
            <a
              href={waLink(waNumber, 'Halo, saya baru dari situs Griya Asri dan ingin bertanya.')}
              className="rounded-full bg-wa px-3 py-1.5 text-sm font-medium text-white hover:bg-wa/90"
            >
              Tanya Sales (WA)
            </a>
          </div>

          <form
            className="flex gap-2 border-t border-line p-3"
            onSubmit={(e) => {
              e.preventDefault()
              const q = input.trim()
              if (!q) return
              setMessages((m) => [...m, { from: 'user', text: q }])
              setInput('')
              cariJawaban(q)
            }}
          >
            <label htmlFor="bot-input" className="sr-only">
              Tulis pertanyaan Anda
            </label>
            <input
              id="bot-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis pertanyaan… mis. berapa DP?"
              className="field-input"
            />
            <button type="submit" className="rounded-lg bg-clay px-4 font-semibold text-white hover:bg-clay/90">
              Kirim
            </button>
          </form>
        </div>
      )}
    </>
  )
}
