import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import AdminNav from '@/components/AdminNav'
import { getSession } from '@/lib/auth'
import { logoutAction } from './actions'

export const metadata: Metadata = {
  title: { default: 'Dashboard Admin', template: '%s · Admin Griya Asri' },
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/masuk')

  return (
    <div className="min-h-screen bg-parchment">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3 md:px-6">
          <a href="/" className="flex items-center gap-2 font-serif text-lg font-bold" aria-label="Griya Asri Realty — buka situs publik">
            <span aria-hidden className="grid h-8 w-8 place-items-center rounded-lg bg-clay font-sans text-sm font-bold text-white">
              GA
            </span>
            Admin Griya Asri
          </a>
          <span className="ml-auto hidden text-sm text-ink2 md:inline">{session.email}</span>
          <a href="/" className="rounded-lg border border-line px-3 py-2 text-sm font-semibold hover:border-clay hover:text-clay">
            Lihat Situs
          </a>
          <form action={logoutAction}>
            <button type="submit" className="rounded-lg bg-ink px-3 py-2 text-sm font-semibold text-white hover:bg-ink/90">
              Keluar
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:px-6 lg:grid-cols-[14rem_1fr]">
        <aside>
          <AdminNav />
        </aside>
        <div>{children}</div>
      </div>
    </div>
  )
}
