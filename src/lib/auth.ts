// Session berbasis cookie HMAC — tanpa dependensi tambahan.
// Untuk skala besar, pertimbangkan library session teruji (iron-session/next-auth).
import crypto from 'node:crypto'
import { cookies } from 'next/headers'
import { db } from './db'

// Fail-fast: tanpa secret yang layak, sesi bisa dipalsukan siapa pun yang
// membaca source code (audit #2).
const SECRET_ENV = process.env.SESSION_SECRET
if (!SECRET_ENV || SECRET_ENV.length < 32) {
  throw new Error('SESSION_SECRET wajib diset di .env (minimal 32 karakter acak).')
}
const SECRET: string = SECRET_ENV

const COOKIE = 'gas_session'
const MAX_AGE = 24 * 3600 // 24 jam — semula 7 hari (audit #5)

type Payload = { email: string; exp: number }

function sign(body: string): string {
  return crypto.createHmac('sha256', SECRET).update(body).digest('base64url')
}

function verifyToken(token?: string): Payload | null {
  if (!token) return null
  const [body, sig] = token.split('.')
  if (!body || !sig) return null
  const expected = sign(body)
  if (expected.length !== sig.length) return null
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return null
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as Payload
    if (!payload.exp || payload.exp < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

export async function createSession(email: string) {
  const body = Buffer.from(JSON.stringify({ email, exp: Date.now() + MAX_AGE * 1000 })).toString('base64url')
  const cookieStore = await cookies()
  cookieStore.set(COOKIE, `${body}.${sign(body)}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production', // audit #5
    path: '/',
    maxAge: MAX_AGE,
  })
}

// Verifikasi ulang ke DB (audit #6): admin yang dihapus/dinonaktifkan langsung
// kehilangan akses. Fail-closed saat DB bermasalah.
export async function getSession(): Promise<Payload | null> {
  const cookieStore = await cookies()
  const payload = verifyToken(cookieStore.get(COOKIE)?.value)
  if (!payload) return null
  try {
    const admin = await db.adminUser.findUnique({
      where: { email: payload.email },
      select: { aktif: true },
    })
    return admin?.aktif ? payload : null
  } catch {
    return null
  }
}

export async function destroySession() {
  ;(await cookies()).delete(COOKIE)
}
