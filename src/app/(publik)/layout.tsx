// Layout chrome publik: header, footer, sticky WA, bot FAQ.
// Area admin punya layout sendiri (tanpa chrome publik).
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BotWidget from '@/components/BotWidget'
import WaFloat from '@/components/WaFloat'
import { getFaqs, getSiteConfig } from '@/lib/data'

export default async function PublikLayout({ children }: { children: React.ReactNode }) {
  const [config, faqs] = await Promise.all([getSiteConfig(), getFaqs()])
  const wa = config?.whatsappNumber ?? '6281234567890'

  return (
    <>
      <a href="#konten" className="skip-link">
        Lewati ke konten utama
      </a>
      <Header waNumber={wa} />
      <main id="konten" className="min-h-[60vh]">
        {children}
      </main>
      <Footer config={config} waNumber={wa} />
      <WaFloat waNumber={wa} />
      <BotWidget
        waNumber={wa}
        email={config?.email ?? 'halo@griyaasri.id'}
        faqs={faqs.map((f) => ({ pertanyaan: f.pertanyaan, jawaban: f.jawaban, kategori: f.kategori }))}
      />
    </>
  )
}
