import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-24 text-center md:py-32">
      <p className="font-serif text-6xl font-bold text-clay">404</p>
      <h1 className="mt-4 font-serif text-3xl font-bold">Halaman ini tidak ditemukan</h1>
      <p className="mt-3 leading-relaxed text-ink2">
        Mungkin halamannya sudah dipindahkan atau alamatnya salah. Tidak perlu khawatir — Anda bisa kembali ke beranda
        atau langsung melihat proyek kami.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/" className="rounded-lg bg-clay px-6 py-3 font-semibold text-white hover:bg-clay/90">
          Ke Beranda
        </Link>
        <Link href="/proyek" className="rounded-lg border-2 border-ink px-6 py-3 font-semibold hover:border-clay hover:text-clay">
          Lihat Proyek
        </Link>
      </div>
    </main>
  )
}
