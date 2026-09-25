import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { loginAction } from './actions'

export const metadata: Metadata = {
  title: 'Masuk Admin',
  robots: { index: false },
}

export default async function MasukPage({ searchParams }: { searchParams: Promise<{ err?: string }> }) {
  const sp = await searchParams
  const session = await getSession()
  if (session) redirect('/admin')

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 md:py-24">
      <h1 className="font-serif text-3xl font-bold">Masuk ke Dashboard Admin</h1>
      <p className="mt-2 text-ink2">Area khusus pengelola situs Griya Asri Realty.</p>

      {sp.err && (
        <p role="alert" className="mt-6 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 font-medium text-danger">
          {sp.err === 'db'
            ? 'Sistem sedang bermasalah. Coba beberapa saat lagi.'
            : sp.err === 'rate'
              ? 'Terlalu banyak percobaan login. Tunggu sekitar 15 menit, lalu coba lagi.'
              : 'Email atau kata sandi salah. Silakan coba lagi.'}
        </p>
      )}

      <form action={loginAction} className="mt-8 space-y-5 rounded-xl border border-line bg-surface p-6 shadow-card">
        <div>
          <label htmlFor="m-email" className="field-label">
            Email
          </label>
          <input id="m-email" name="email" type="email" required autoComplete="email" className="field-input" />
        </div>
        <div>
          <label htmlFor="m-sandi" className="field-label">
            Kata sandi
          </label>
          <input id="m-sandi" name="password" type="password" required autoComplete="current-password" className="field-input" />
        </div>
        <button type="submit" className="w-full rounded-lg bg-clay px-4 py-3 font-semibold text-white hover:bg-clay/90">
          Masuk
        </button>
      </form>
    </div>
  )
}
