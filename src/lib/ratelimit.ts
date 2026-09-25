// Rate limiter in-memory fixed-window (audit #4).
// Catatan jujur: state hilang saat restart dan tidak dibagi antar instance
// serverless. Untuk produksi multi-instance, ganti dengan Upstash Redis —
// antarmuka fungsi ini sengaja dibuat supaya swap-nya mudah.
const buckets = new Map<string, { count: number; resetAt: number }>()

/** true = boleh lanjut; false = melebihi kuota. */
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const b = buckets.get(key)
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    if (buckets.size > 10_000) {
      // Cegah memory bloat dari IP palsu: buang entri kedaluwarsa.
      buckets.forEach((v, k) => {
        if (v.resetAt <= now) buckets.delete(k)
      })
    }
    return true
  }
  b.count += 1
  return b.count <= max
}

/** IP klien dari proxy/CDN; fallback 'lokal' untuk akses langsung. */
export function clientIp(h: Headers): string {
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || 'lokal'
}
