// Rumus anuitas + format Rupiah — dipakai server & client (murni, tanpa dep).

export function hitungKpr(harga: number, dpPersen: number, tenorTahun: number, bungaPersen: number) {
  const dp = harga * (dpPersen / 100)
  const pokok = harga - dp
  const r = bungaPersen / 100 / 12
  const n = tenorTahun * 12
  let angsuran: number
  if (n <= 0) angsuran = 0
  else if (r === 0) angsuran = pokok / n
  else {
    const pow = Math.pow(1 + r, n)
    angsuran = (pokok * r * pow) / (pow - 1)
  }
  return { dp, pokok, angsuran }
}

export function rp(value: number): string {
  if (!isFinite(value)) return '—'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Math.round(value))
}

export function waLink(number: string, message: string): string {
  const clean = number.replace(/[^0-9]/g, '')
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`
}
