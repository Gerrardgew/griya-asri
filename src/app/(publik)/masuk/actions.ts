'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { createSession } from '@/lib/auth'
import { rateLimit, clientIp } from '@/lib/ratelimit'

export async function loginAction(formData: FormData) {
  // Audit #4: batasi 5 percobaan / 15 menit per IP, sebelum menyentuh bcrypt/DB.
  const ip = clientIp(await headers())
  if (!rateLimit(`login:${ip}`, 5, 15 * 60_000)) {
    redirect('/masuk?err=rate')
  }

  const email = String(formData.get('email') ?? '').trim().toLowerCase().slice(0, 200)
  const password = String(formData.get('password') ?? '').slice(0, 200)

  let admin = null
  try {
    admin = await db.adminUser.findUnique({ where: { email } })
  } catch {
    redirect('/masuk?err=db')
  }

  if (!admin || !admin.aktif || !bcrypt.compareSync(password, admin.passwordHash)) {
    redirect('/masuk?err=1')
  }

  await createSession(email)
  redirect('/admin')
}
