import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'

export const metadata: Metadata = {
  title: 'Panduan Membeli & Glosarium',
  description:
    'Panduan membeli rumah untuk pemula: langkah-langkah membeli, dan penjelasan istilah KPR, DP, tenor, sertifikat SHM, dan PBG dalam bahasa sederhana.',
  alternates: { canonical: '/panduan' },
}

const LANGKAH = [
  {
    judul: 'Tentukan budget Anda',
    teks: 'Lihat kisaran harga rumah di halaman Proyek, lalu hitung perkiraan cicilan dengan Kalkulator KPR. Aturan umum: cicilan sebaiknya tidak lebih dari sepertiga penghasilan bulanan.',
  },
  {
    judul: 'Pilih lokasi yang pas',
    teks: 'Perhatikan jarak ke tempat kerja, rumah sakit, sekolah, dan pasar. Semua halaman proyek kami menyertakan peta lokasi.',
  },
  {
    judul: 'Survei lokasi',
    teks: 'Hubungi sales via WhatsApp dan jadwalkan kunjungan. Lihat langsung rumah contoh dan lingkungan sekitarnya — tidak ada biaya, tidak ada kewajiban membeli.',
  },
  {
    judul: 'Booking dan uang muka (DP)',
    teks: 'Jika sudah yakin, Anda melakukan booking unit lalu membayar DP sesuai kesepakatan. Simpan selalu bukti pembayaran Anda.',
  },
  {
    judul: 'Proses KPR',
    teks: 'Tim kami membantu mengurus pengajuan kredit ke bank: mengisi formulir, melengkapi dokumen, dan menunggu persetujuan.',
  },
  {
    judul: 'Akad kredit & serah terima kunci',
    teks: 'Setelah akad kredit di notaris/bank, kunci rumah resmi menjadi milik Anda. Selamat menempati rumah baru!',
  },
]

const GLOSARIUM = [
  { istilah: 'KPR (Kredit Pemilikan Rumah)', arti: 'Pinjaman dari bank untuk membeli rumah. Anda mencicil setiap bulan sampai lunas.' },
  { istilah: 'DP (Down Payment / uang muka)', arti: 'Bagian harga rumah yang dibayar di awal, sebelum KPR dimulai. Umumnya 10%–30% dari harga.' },
  { istilah: 'Tenor', arti: 'Lama waktu mencicil. Contoh: 15 tahun berarti 180 kali pembayaran bulanan.' },
  { istilah: 'Suku bunga', arti: 'Biaya pinjaman per tahun yang ditetapkan bank. Angka ini memengaruhi besar cicilan Anda.' },
  { istilah: 'Anuitas', arti: 'Cara menghitung cicilan di mana Anda membayar jumlah yang sama setiap bulan (pokok + bunga).' },
  { istilah: 'Sertifikat SHM', arti: 'Surat Hak Milik — dokumen bukti kepemilikan penuh atas tanah dan rumah, diterbitkan BPN.' },
  { istilah: 'PBG (dahulu IMB)', arti: 'Persetujuan Bangunan Gedung — izin resmi bahwa bangunan sesuai peraturan daerah.' },
  { istilah: 'Akad kredit', arti: 'Pertemuan resmi di notaris tempat Anda menandatangani perjanjian KPR dengan bank.' },
]

export default function PanduanPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
      <Breadcrumb items={[{ href: '/', label: 'Beranda' }, { label: 'Panduan' }]} />
      <h1 className="mt-4 font-serif text-3xl font-bold md:text-4xl">Panduan Membeli Rumah</h1>
      <p className="mt-2 text-ink2">
        Belum pernah beli rumah? Tidak masalah. Halaman ini menjelaskan semuanya dengan bahasa sederhana.
      </p>

      <section aria-labelledby="langkah" className="mt-10">
        <h2 id="langkah" className="font-serif text-2xl font-bold">
          Enam Langkah Menuju Rumah Anda
        </h2>
        <ol className="mt-6 space-y-0">
          {LANGKAH.map((l, i) => (
            <li key={l.judul} className="relative flex gap-5 pb-8 last:pb-0">
              {i < LANGKAH.length - 1 && <span aria-hidden className="absolute left-[1.375rem] top-11 h-full w-0.5 bg-line" />}
              <span
                aria-hidden
                className="z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-clay font-serif text-lg font-bold text-white"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg font-bold">{l.judul}</h3>
                <p className="mt-1 leading-relaxed text-ink2">{l.teks}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="glosarium" className="mt-14">
        <h2 id="glosarium" className="font-serif text-2xl font-bold">
          Kamus Istilah Rumah
        </h2>
        <p className="mt-2 text-ink2">Istilah yang sering muncul saat membeli rumah, dijelaskan singkat dan jelas.</p>
        <dl className="mt-6 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
          {GLOSARIUM.map((g) => (
            <div key={g.istilah} className="p-5">
              <dt className="font-bold">{g.istilah}</dt>
              <dd className="mt-1 leading-relaxed text-ink2">{g.arti}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-12 rounded-xl border-2 border-clay bg-surface p-6 text-center shadow-card">
        <p className="font-serif text-xl font-bold">Sudah siap melihat-lihat?</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link href="/proyek" className="rounded-lg bg-clay px-6 py-3 font-semibold text-white hover:bg-clay/90">
            Lihat Proyek
          </Link>
          <Link href="/kalkulator" className="rounded-lg border-2 border-ink px-6 py-3 font-semibold hover:border-clay hover:text-clay">
            Hitung Cicilan
          </Link>
        </div>
      </div>
    </div>
  )
}
