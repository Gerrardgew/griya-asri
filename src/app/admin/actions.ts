'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { getSession, destroySession } from '@/lib/auth'
import { uniqueSlug } from '@/lib/slug'
import { urlHttp } from '@/lib/validate'

async function wajibLogin() {
  const s = await getSession()
  if (!s) redirect('/masuk')
}

// Audit #10: semua input teks dibatasi panjangnya di server.
function str(fd: FormData, k: string, max = 500): string {
  return String(fd.get(k) ?? '').trim().slice(0, max)
}

function num(fd: FormData, k: string): number {
  const n = Number(fd.get(k))
  return Number.isFinite(n) ? n : 0
}

function numAtauNull(fd: FormData, k: string): number | null {
  const raw = String(fd.get(k) ?? '').trim()
  if (!raw) return null
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
}

function segarkan() {
  revalidatePath('/', 'layout')
}

// Galeri disimpan sebagai baris "url | alt" di textarea admin.
function parseGaleri(raw: string): { url: string; alt: string }[] {
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [url, ...rest] = l.split('|').map((s) => s.trim())
      return { url: url ?? '', alt: rest.join(' | ') }
    })
    .filter((g) => /^https?:\/\//i.test(g.url)) // audit #14: hanya http(s)
}

export async function logoutAction() {
  await destroySession()
  redirect('/masuk')
}

export async function saveProject(fd: FormData) {
  await wajibLogin()
  const id = num(fd, 'id')
  const nama = str(fd, 'nama')
  if (!nama) redirect(`/admin/proyek/${id || 'baru'}?err=nama`)

  const publish = fd.get('publish') === 'on'
  const thumbnailUrl = urlHttp(str(fd, 'thumbnailUrl', 500))
  const galeriItems = parseGaleri(str(fd, 'galeri', 20_000))

  // FR-07: wajib minimal 1 foto sebelum publish
  if (publish && !thumbnailUrl && galeriItems.length === 0) {
    redirect(`/admin/proyek/${id || 'baru'}?err=foto`)
  }

  const slug = await uniqueSlug(str(fd, 'slug') || nama, id || undefined)

  // Audit #10: koordinat di luar range wajar dianggap tidak diisi.
  const lat = numAtauNull(fd, 'koordinatLat')
  const lng = numAtauNull(fd, 'koordinatLng')
  const data = {
    nama,
    slug,
    alamat: str(fd, 'alamat', 200),
    kota: str(fd, 'kota', 80) || 'Tanpa kota',
    koordinatLat: lat !== null && lat >= -90 && lat <= 90 ? lat : null,
    koordinatLng: lng !== null && lng >= -180 && lng <= 180 ? lng : null,
    deskripsi: str(fd, 'deskripsi', 5_000),
    status: ['prapenjualan', 'siap_huni', 'sold_out'].includes(str(fd, 'status'))
      ? str(fd, 'status')
      : 'prapenjualan',
    featured: fd.get('featured') === 'on',
    publish,
    fasilitas: str(fd, 'fasilitas', 2_000),
    thumbnailUrl,
    seoTitle: str(fd, 'seoTitle', 200) || null,
    seoDescription: str(fd, 'seoDescription', 300) || null,
  }

  let projectId = id
  if (id) {
    await db.project.update({ where: { id }, data })
    await db.galeriItem.deleteMany({ where: { projectId: id } })
  } else {
    const created = await db.project.create({ data })
    projectId = created.id
  }
  if (galeriItems.length > 0) {
    await db.galeriItem.createMany({
      data: galeriItems.map((g, i) => ({ ...g, projectId: projectId!, urutan: i })),
    })
  }

  segarkan()
  redirect(`/admin/proyek/${projectId}?ok=1`)
}

// Catatan (hasil E2E): action yang sama dipakai banyak <form> di satu halaman
// hanya ter-wire ke form pertama. Karena itu semua action per-baris menerima id
// lewat .bind(null, id) di halaman — tiap form punya referensi fungsi unik.
export async function deleteProject(id: number, _fd: FormData) {
  await wajibLogin()
  if (id) await db.project.delete({ where: { id } })
  segarkan()
  redirect('/admin/proyek?ok=hapus')
}

export async function togglePublish(id: number, fd: FormData) {
  await wajibLogin()
  const target = fd.get('target') === '1'
  if (id) {
    if (target) {
      const p = await db.project.findUnique({ where: { id }, include: { galeri: true } })
      if (p && !p.thumbnailUrl && p.galeri.length === 0) {
        redirect(`/admin/proyek/${id}?err=foto`)
      }
    }
    await db.project.update({ where: { id }, data: { publish: target } })
  }
  segarkan()
  redirect('/admin/proyek?ok=status')
}

// Bind 1 argumen saja: bind multi-argumen pada server action merusak submit
// (temuan E2E — form dengan 2+ argumen bind tidak pernah memicu POST).
export async function saveUnit(unitId: number, fd: FormData) {
  await wajibLogin()
  let pid = 0
  if (unitId) {
    const existing = await db.unitType.findUnique({ where: { id: unitId }, select: { projectId: true } })
    pid = existing?.projectId ?? 0
  } else {
    pid = num(fd, 'projectId')
  }

  const namaTipe = str(fd, 'namaTipe', 80)
  const harga = num(fd, 'harga')
  if (!namaTipe || harga <= 0 || !pid) {
    redirect(`/admin/proyek/${pid}?err=unit`)
  }

  const data = {
    namaTipe,
    harga,
    luasTanah: numAtauNull(fd, 'luasTanah'),
    luasBangunan: numAtauNull(fd, 'luasBangunan'),
    kamarTidur: num(fd, 'kamarTidur') || 2,
    kamarMandi: num(fd, 'kamarMandi') || 1,
    lantai: num(fd, 'lantai') || 1,
    stok: num(fd, 'stok'),
    spesifikasi: str(fd, 'spesifikasi', 2_000),
    fotoUrl: urlHttp(str(fd, 'fotoUrl', 500)),
    urutan: num(fd, 'urutan'),
  }

  if (unitId) {
    await db.unitType.update({ where: { id: unitId }, data })
  } else {
    await db.unitType.create({ data: { ...data, projectId: pid } })
  }
  segarkan()
  redirect(`/admin/proyek/${pid}?ok=unit`)
}

export async function deleteUnit(unitId: number, _fd: FormData) {
  await wajibLogin()
  let pid = 0
  if (unitId) {
    const u = await db.unitType.findUnique({ where: { id: unitId }, select: { projectId: true } })
    pid = u?.projectId ?? 0
    await db.unitType.delete({ where: { id: unitId } })
  }
  segarkan()
  redirect(`/admin/proyek/${pid}?ok=hapus-unit`)
}

export async function saveFaq(id: number, fd: FormData) {
  await wajibLogin()
  const pertanyaan = str(fd, 'pertanyaan', 300)
  const jawaban = str(fd, 'jawaban', 5_000)
  if (!pertanyaan || !jawaban) redirect('/admin/faq?err=isi')

  const data = {
    pertanyaan,
    jawaban,
    kategori: str(fd, 'kategori', 40) || 'umum',
    urutan: num(fd, 'urutan'),
    publish: fd.get('publish') === 'on',
  }

  if (id) {
    await db.faq.update({ where: { id }, data })
  } else {
    await db.faq.create({ data })
  }
  segarkan()
  redirect('/admin/faq?ok=1')
}

export async function deleteFaq(id: number, _fd: FormData) {
  await wajibLogin()
  if (id) await db.faq.delete({ where: { id } })
  segarkan()
  redirect('/admin/faq?ok=hapus')
}

export async function saveSettings(fd: FormData) {
  await wajibLogin()
  const data = {
    whatsappNumber: str(fd, 'whatsappNumber', 30).replace(/[^0-9]/g, '').slice(0, 20) || '6281234567890',
    email: str(fd, 'email', 200) || 'halo@griyaasri.id',
    alamat: str(fd, 'alamat', 300),
    jamOperasional: str(fd, 'jamOperasional', 120),
    heroTitle: str(fd, 'heroTitle', 120) || 'Rumah Nyaman untuk Semua Generasi',
    heroSubtitle: str(fd, 'heroSubtitle', 300),
    heroCtaLabel: str(fd, 'heroCtaLabel', 60) || 'Lihat Proyek',
  }
  await db.siteConfig.upsert({ where: { id: 1 }, update: data, create: { id: 1, ...data } })
  segarkan()
  redirect('/admin/pengaturan?ok=1')
}
