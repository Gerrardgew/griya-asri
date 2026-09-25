// Badge status proyek (DESIGN.md §7) — warna dari token lolos kontras AA.
const MAP: Record<string, { label: string; cls: string }> = {
  prapenjualan: { label: 'Prapenjualan', cls: 'bg-amber/10 text-amber border-amber/40' },
  siap_huni: { label: 'Siap Huni', cls: 'bg-moss/10 text-moss border-moss/40' },
  sold_out: { label: 'Sold Out', cls: 'bg-slate/10 text-slate border-slate/40' },
}

export default function Badge({ status }: { status: string }) {
  const m = MAP[status] ?? { label: status, cls: 'bg-slate/10 text-slate border-slate/40' }
  return (
    <span className={`inline-block rounded-full border px-3 py-0.5 text-sm font-semibold ${m.cls}`}>{m.label}</span>
  )
}
