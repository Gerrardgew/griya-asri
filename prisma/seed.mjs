// Seed data dummy — Griya Asri Realty (portfolio demo).
// Jalankan: npm run db:seed
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

const img = (seed) => `https://picsum.photos/seed/${seed}/1200/800`

const projects = [
  {
    slug: 'griya-asri-parkview',
    nama: 'Griya Asri Parkview',
    alamat: 'Jl. Raya Pajajaran No. 12, Bogor Tengah',
    kota: 'Bogor',
    koordinatLat: -6.5953,
    koordinatLng: 106.8166,
    status: 'prapenjualan',
    featured: true,
    publish: true,
    thumbnailUrl: img('ga-park-0'),
    deskripsi:
      'PerumahanCluster 120 unit di jantung Bogor, 10 menit dari Stasiun Bogor dan dekat RSUD Kota Bogor. Cocok untuk keluarga muda dan pensiunan yang ingin udara sejuk dengan akses lengkap.',
    fasilitas: 'One gate system\nTaman bermain anak\nMasjid\nCCTV 24 jam\nJalan paving lebar 6 meter',
    seoTitle: 'Griya Asri Parkview Bogor — Rumah Nyaman Dekat Stasiun',
    seoDescription: 'Cluster 120 unit di Bogor Tengah, 10 menit dari Stasiun Bogor. Prapenjualan mulai Rp 480 juta.',
    galeri: [
      { url: img('ga-park-0'), alt: 'Tampak depan rumah Griya Asri Parkview' },
      { url: img('ga-park-1'), alt: 'Taman cluster Parkview' },
      { url: img('ga-park-2'), alt: 'Jalan utama cluster' },
      { url: img('ga-park-3'), alt: 'Masjid cluster' },
    ],
    unitTypes: [
      { namaTipe: 'Tipe 30/60', harga: 480000000, luasTanah: 60, luasBangunan: 30, kamarTidur: 2, kamarMandi: 1, lantai: 1, stok: 12, urutan: 1, spesifikasi: 'Carport 1 mobil\nDapur bersih\nKanopi' },
      { namaTipe: 'Tipe 36/72', harga: 575000000, luasTanah: 72, luasBangunan: 36, kamarTidur: 2, kamarMandi: 1, lantai: 1, stok: 8, urutan: 2, spesifikasi: 'Carport 1 mobil\nDapur bersih\nTaman belakang' },
      { namaTipe: 'Tipe 45/84', harga: 725000000, luasTanah: 84, luasBangunan: 45, kamarTidur: 3, kamarMandi: 2, lantai: 1, stok: 5, urutan: 3, spesifikasi: 'Carport 2 mobil\nDapur bersih\nRuang keluarga luas' },
    ],
  },
  {
    slug: 'griya-asri-green-valley',
    nama: 'Griya Asri Green Valley',
    alamat: 'Jl. Nusantara Raya No. 8, Sukmajaya',
    kota: 'Depok',
    koordinatLat: -6.4605,
    koordinatLng: 106.8275,
    status: 'siap_huni',
    featured: true,
    publish: true,
    thumbnailUrl: img('ga-valley-0'),
    deskripsi:
      'Rumah siap huni di Depok dengan 40% ruang terbuka hijau. Dekat Stasiun Sukmajaya, sekolah negeri, dan pasar. Bisa dijangkau dari Tol Jagorawi dalam 15 menit.',
    fasilitas: 'Ruang terbuka hijau 40%\nJogging track\nSecurity 24 jam\nPos jaga dua lapis\nKids playground',
    seoTitle: 'Griya Asri Green Valley Depok — Rumah Siap Huni',
    seoDescription: 'Rumah siap huni di Depok, 40% ruang hijau, 15 menit dari Tol Jagorawi. Mulai Rp 520 juta.',
    galeri: [
      { url: img('ga-valley-0'), alt: 'Rumah contoh Green Valley' },
      { url: img('ga-valley-1'), alt: 'Jogging track cluster' },
      { url: img('ga-valley-2'), alt: 'Area hijau cluster' },
    ],
    unitTypes: [
      { namaTipe: 'Tipe 36/70', harga: 520000000, luasTanah: 70, luasBangunan: 36, kamarTidur: 2, kamarMandi: 1, lantai: 1, stok: 4, urutan: 1, spesifikasi: 'Carport 1 mobil\nFully furnished opsional' },
      { namaTipe: 'Tipe 50/90', harga: 780000000, luasTanah: 90, luasBangunan: 50, kamarTidur: 3, kamarMandi: 2, lantai: 1, stok: 2, urutan: 2, spesifikasi: 'Carport 2 mobil\nTaman depan\nDapur kering & basah' },
    ],
  },
  {
    slug: 'griya-asri-sentosa',
    nama: 'Griya Asri Sentosa',
    alamat: 'Jl. Ahmad Yani No. 45, Bekasi Selatan',
    kota: 'Bekasi',
    koordinatLat: -6.2383,
    koordinatLng: 107.0003,
    status: 'prapenjualan',
    featured: true,
    publish: true,
    thumbnailUrl: img('ga-sentosa-0'),
    deskripsi:
      'Kawasan seluas 12 hektar di Bekasi Selatan, 5 menit dari RS Mitra Keluarga dan Mall Grand Metropolitan. Pilihan tepat untuk keluarga yang butuh akses kota lengkap.',
    fasilitas: 'Kolam renang\nClub house\nTaman tematik\nMasjid\nSmart gate system',
    seoTitle: 'Griya Asri Sentosa Bekasi — Perumahan Strategis Kota',
    seoDescription: 'Perumahan 12 hektar di Bekasi Selatan, 5 menit dari RS Mitra Keluarga. Prapenjualan mulai Rp 425 juta.',
    galeri: [
      { url: img('ga-sentosa-0'), alt: 'Gerbang utama Griya Asri Sentosa' },
      { url: img('ga-sentosa-1'), alt: 'Club house Sentosa' },
      { url: img('ga-sentosa-2'), alt: 'Kolam renang cluster' },
      { url: img('ga-sentosa-3'), alt: 'Rumah contoh tipe 45' },
    ],
    unitTypes: [
      { namaTipe: 'Tipe 28/54', harga: 425000000, luasTanah: 54, luasBangunan: 28, kamarTidur: 2, kamarMandi: 1, lantai: 1, stok: 15, urutan: 1, spesifikasi: 'Carport 1 mobil' },
      { namaTipe: 'Tipe 36/72', harga: 540000000, luasTanah: 72, luasBangunan: 36, kamarTidur: 2, kamarMandi: 1, lantai: 1, stok: 10, urutan: 2, spesifikasi: 'Carport 1 mobil\nKanopi depan' },
      { namaTipe: 'Tipe 54/90', harga: 850000000, luasTanah: 90, luasBangunan: 54, kamarTidur: 3, kamarMandi: 2, lantai: 2, stok: 3, urutan: 3, spesifikasi: 'Carport 2 mobil\n2 lantai\nRuang serbaguna' },
    ],
  },
  {
    slug: 'griya-asri-riverside',
    nama: 'Griya Asri Riverside',
    alamat: 'Jl. Pahlawan Seribu No. 21, BSD City',
    kota: 'Tangerang Selatan',
    koordinatLat: -6.3011,
    koordinatLng: 106.6547,
    status: 'siap_huni',
    featured: false,
    publish: true,
    thumbnailUrl: img('ga-river-0'),
    deskripsi:
      'Cluster premium tepi sungai di BSD City. Unit terbatas, 24 unit saja, dengan pedestrian riverside dan akses langsung ke ICE BSD.',
    fasilitas: 'Pedestrian riverside\nSmart home ready\nSecurity 24 jam\nGym cluster',
    seoTitle: 'Griya Asri Riverside BSD — Cluster Premium Tepi Sungai',
    seoDescription: 'Cluster premium 24 unit di BSD City, smart home ready, dekat ICE. Mulai Rp 980 juta.',
    galeri: [
      { url: img('ga-river-0'), alt: 'Tampak rumah Riverside' },
      { url: img('ga-river-1'), alt: 'Pedestrian tepi sungai' },
    ],
    unitTypes: [
      { namaTipe: 'Tipe 60/100', harga: 980000000, luasTanah: 100, luasBangunan: 60, kamarTidur: 3, kamarMandi: 2, lantai: 1, stok: 2, urutan: 1, spesifikasi: 'Carport 2 mobil\nSmart home ready' },
      { namaTipe: 'Tipe 90/140', harga: 1450000000, luasTanah: 140, luasBangunan: 90, kamarTidur: 4, kamarMandi: 3, lantai: 2, stok: 1, urutan: 2, spesifikasi: 'Carport 2 mobil\n2 lantai\nSmart home included' },
    ],
  },
  {
    slug: 'griya-asri-bukit-cimanggu',
    nama: 'Griya Asri Bukit Cimanggu',
    alamat: 'Jl. Raya Cimanggu No. 3, Bogor Barat',
    kota: 'Bogor',
    koordinatLat: -6.5722,
    koordinatLng: 106.7756,
    status: 'prapenjualan',
    featured: false,
    publish: true,
    thumbnailUrl: img('ga-cimanggu-0'),
    deskripsi:
      'Perumahan bernuansa resort di Bogor Barat, berdekatan dengan Cimanggu Asri dan IPB Darmaga. Udara sejuk, cocok untuk rumah masa pensiun.',
    fasilitas: 'Taman resort\nKolam ikan\nGazebo bersama\nCCTV 24 jam',
    seoTitle: 'Griya Asri Bukit Cimanggu — Rumah Resort di Bogor',
    seoDescription: 'Perumahan bernuansa resort di Bogor Barat, dekat IPB Darmaga. Mulai Rp 510 juta.',
    galeri: [
      { url: img('ga-cimanggu-0'), alt: 'Rumah nuansa resort Bukit Cimanggu' },
      { url: img('ga-cimanggu-1'), alt: 'Taman resort cluster' },
      { url: img('ga-cimanggu-2'), alt: 'Gazebo area bersama' },
    ],
    unitTypes: [
      { namaTipe: 'Tipe 36/80', harga: 510000000, luasTanah: 80, luasBangunan: 36, kamarTidur: 2, kamarMandi: 1, lantai: 1, stok: 9, urutan: 1, spesifikasi: 'Carport 1 mobil\nTaman depan' },
      { namaTipe: 'Tipe 45/90', harga: 660000000, luasTanah: 90, luasBangunan: 45, kamarTidur: 3, kamarMandi: 2, lantai: 1, stok: 6, urutan: 2, spesifikasi: 'Carport 1 mobil\nTaman depan & belakang' },
    ],
  },
  {
    slug: 'griya-asri-kota-baru',
    nama: 'Griya Asri Kota Baru',
    alamat: 'Jl. Ir. H. Juanda No. 88, Bekasi Timur',
    kota: 'Bekasi',
    koordinatLat: -6.2246,
    koordinatLng: 107.0137,
    status: 'sold_out',
    featured: false,
    publish: true,
    thumbnailUrl: img('ga-kotabaru-0'),
    deskripsi:
      'Perumahan 200 unit yang telah habis terjual. Terima kasih atas kepercayaan Anda — kunjungi proyek kami yang lain, atau hubungi sales untuk informasi unit resale.',
    fasilitas: 'One gate system\nTaman cluster\nMasjid',
    seoTitle: 'Griya Asri Kota Baru Bekasi — Habis Terjual',
    seoDescription: 'Perumahan 200 unit di Bekasi Timur yang telah habis terjual. Hubungi kami untuk info proyek lain.',
    galeri: [{ url: img('ga-kotabaru-0'), alt: 'Gerbang Griya Asri Kota Baru' }],
    unitTypes: [
      { namaTipe: 'Tipe 36/72', harga: 495000000, luasTanah: 72, luasBangunan: 36, kamarTidur: 2, kamarMandi: 1, lantai: 1, stok: 0, urutan: 1, spesifikasi: 'Habis terjual' },
    ],
  },
]

const faqs = [
  {
    pertanyaan: 'Berapa harga rumah di Griya Asri Realty?',
    jawaban: 'Harga rumah bervariasi per proyek dan tipe, mulai dari sekitar Rp 425 juta hingga Rp 1,45 miliar. Harga terbaru selalu tertera di halaman setiap proyek. Anda juga bisa memakai Kalkulator KPR di situs ini untuk menghitung perkiraan cicilan bulanan.',
    kategori: 'harga',
    urutan: 1,
  },
  {
    pertanyaan: 'Berapa uang muka (DP) yang harus disiapkan?',
    jawaban: 'Umumnya DP mulai dari 10% sampai 30% dari harga rumah, tergantung kebijakan bank dan tipe pembiayaan. Contoh: rumah Rp 500 juta dengan DP 20% berarti Anda menyiapkan Rp 100 juta. Coba masukkan angka Anda di Kalkulator KPR kami untuk simulasi lengkap.',
    kategori: 'harga',
    urutan: 2,
  },
  {
    pertanyaan: 'Bagaimana cara menghitung cicilan KPR?',
    jawaban: 'Cicilan KPR dihitung dengan sistem anuitas: pokok pinjaman ditambah bunga dibagi selama tenor. Gunakan Kalkulator KPR di situs ini — masukkan harga rumah, DP, tenor, dan suku bunga, lalu perkiraan cicilan bulanan muncul otomatis. Hasilnya bisa langsung Anda kirim ke sales kami lewat WhatsApp.',
    kategori: 'harga',
    urutan: 3,
  },
  {
    pertanyaan: 'Di mana lokasi proyek-proyek Griya Asri Realty?',
    jawaban: 'Proyek kami berada di Bogor, Depok, Bekasi, dan Tangerang Selatan. Setiap halaman proyek dilengkapi peta lokasi dan alamat lengkap. Gunakan filter kota di halaman Proyek untuk menemukan lokasi terdekat dengan Anda.',
    kategori: 'lokasi',
    urutan: 4,
  },
  {
    pertanyaan: 'Apakah dekat dengan fasilitas umum seperti rumah sakit dan pasar?',
    jawaban: 'Ya. Semua proyek kami dipilih berdasarkan kedekatan ke fasilitas penting: rumah sakit, sekolah, pasar, dan stasiun/terminal. Detail jarak ke fasilitas tercantum di halaman masing-masing proyek.',
    kategori: 'lokasi',
    urutan: 5,
  },
  {
    pertanyaan: 'Apa saja langkah membeli rumah di Griya Asri Realty?',
    jawaban: 'Langkahnya sederhana: (1) pilih proyek dan tipe rumah di situs ini, (2) simulasi cicilan dengan Kalkulator KPR, (3) hubungi sales kami via WhatsApp untuk survei lokasi, (4) booking unit dan urus DP, (5) proses KPR dibantu tim kami sampai serah terima kunci.',
    kategori: 'cara_beli',
    urutan: 6,
  },
  {
    pertanyaan: 'Apakah bisa survei lokasi dulu sebelum membeli?',
    jawaban: 'Tentu bisa dan sangat kami anjurkan. Hubungi sales kami via WhatsApp di halaman proyek yang Anda minati, lalu jadwalkan waktu survei. Tim kami akan menjemput Anda di titik yang mudah dicari.',
    kategori: 'cara_beli',
    urutan: 7,
  },
  {
    pertanyaan: 'Bagaimana cara menghubungi sales Griya Asri Realty?',
    jawaban: 'Cara tercepat: klik tombol hijau "Hubungi via WhatsApp" yang ada di setiap halaman — chat akan terbuka dengan pesan yang sudah tersiap. Atau kirim email ke alamat di halaman Kontak. Kami balas pada jam operasional Senin–Sabtu 08.00–17.00 WIB.',
    kategori: 'kontak',
    urutan: 8,
  },
]

async function main() {
  console.log('Seeding database...')

  // Audit #1/#12: kredensial admin dari env — tidak pernah di-hardcode/log.
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 8) {
    console.error('Seed butuh ADMIN_EMAIL dan ADMIN_PASSWORD (min. 8 karakter) di .env — lihat .env.example.')
    process.exit(1)
  }

  // SiteConfig (single record)
  await db.siteConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      whatsappNumber: '6281234567890',
      email: 'halo@griyaasri.id',
      alamat: 'Jl. Raya Pajajaran No. 12, Bogor, Jawa Barat 16128',
      jamOperasional: 'Senin–Sabtu, 08.00–17.00 WIB',
      heroTitle: 'Rumah Nyaman untuk Semua Generasi',
      heroSubtitle: 'Pilih rumah dengan tenang. Lihat harganya dengan jelas, hitung cicilannya sendiri, lalu hubungi kami saat Anda siap.',
      heroCtaLabel: 'Lihat Proyek',
    },
  })

  // Admin (satu akun MVP) — password di-resync dengan env setiap seed
  const passwordHash = bcrypt.hashSync(ADMIN_PASSWORD, 10)
  await db.adminUser.upsert({
    where: { email: ADMIN_EMAIL },
    update: { passwordHash },
    create: { nama: 'Admin Griya Asri', email: ADMIN_EMAIL, passwordHash, role: 'admin' },
  })

  // Hapus data lama lalu insert ulang (seed idempoten)
  await db.unitType.deleteMany({})
  await db.galeriItem.deleteMany({})
  await db.project.deleteMany({})

  for (const p of projects) {
    const { unitTypes, galeri, ...project } = p
    const created = await db.project.create({ data: project })
    await db.galeriItem.createMany({
      data: galeri.map((g, i) => ({ ...g, projectId: created.id, urutan: i })),
    })
    await db.unitType.createMany({
      data: unitTypes.map((u) => ({ ...u, projectId: created.id })),
    })
  }

  await db.faq.deleteMany({})
  await db.faq.createMany({ data: faqs })

  console.log(`Selesai: ${projects.length} proyek, ${faqs.length} FAQ, 1 admin, 1 site config.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
