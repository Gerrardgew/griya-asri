// Validasi & sanitasi input (audit #10). Server-side — dipakai di server actions.

/** Ambil string dari form, buang spasi tepi, dan batasi panjang. */
export function teks(v: FormDataEntryValue | null, max: number): string {
  return String(v ?? '').trim().slice(0, max)
}

/** Email boleh kosong (opsional), tapi jika diisi harus berformat wajar. */
export function emailValid(v: string): boolean {
  return v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

/** Hanya terima URL http(s) — tolak skema lain (audit #14). */
export function urlHttp(v: string): string | null {
  return /^https?:\/\/\S+$/i.test(v) ? v : null
}
