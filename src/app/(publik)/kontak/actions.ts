'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { rateLimit, clientIp } from '@/lib/ratelimit'
import { teks, emailValid } from '@/lib/validate'

// Form kontak (FR-06) — simpan sebagai Lead, sumber "form".
export async function kirimLead(formData: FormData) {
  // Audit #4: batasi 5 pesan / jam per IP.
  const ip = clientIp(await headers())
  if (!rateLimit(`lead:${ip}`, 5, 60 * 60_000)) {
    redirect('/kontak?err=rate')
  }

  // Audit #10: semua input dibatasi panjangnya.
  const nama = teks(formData.get('nama'), 100)
  const telepon = teks(formData.get('telepon'), 30)
  const email = teks(formData.get('email'), 200)
  const pesan = teks(formData.get('pesan'), 2000)

  if (!nama || !telepon) {
    redirect('/kontak?err=nama-telepon')
  }
  if (!emailValid(email)) {
    redirect('/kontak?err=email')
  }

  try {
    await db.lead.create({
      data: {
        nama,
        telepon,
        email: email || null,
        pesan,
        sumber: 'form',
      },
    })
  } catch {
    redirect('/kontak?err=gagal')
  }

  redirect('/kontak?ok=1')
}
