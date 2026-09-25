'use client'

import { useState } from 'react'

type Item = { id: string | number; tanya: string; jawab: string }

// Accordion satu-terbuka — keyboard: Enter/Spasi (tombol native), sesuai APG.
export default function Accordion({ items, label }: { items: Item[]; label: string }) {
  const [openId, setOpenId] = useState<string | number | null>(items[0]?.id ?? null)

  return (
    <div className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
      {items.map((it) => {
        const open = openId === it.id
        return (
          <div key={it.id}>
            <h3>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`acc-panel-${it.id}`}
                id={`acc-btn-${it.id}`}
                onClick={() => setOpenId(open ? null : it.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold hover:bg-parchment"
              >
                <span>{it.tanya}</span>
                <span aria-hidden className={`shrink-0 text-clay transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
              </button>
            </h3>
            <div
              id={`acc-panel-${it.id}`}
              role="region"
              aria-labelledby={`acc-btn-${it.id}`}
              hidden={!open}
              className="px-5 pb-5 pt-0 leading-relaxed text-ink2"
            >
              {it.jawab}
            </div>
          </div>
        )
      })}
      <span className="sr-only">{label}</span>
    </div>
  )
}
