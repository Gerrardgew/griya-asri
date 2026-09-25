import { waLink } from '@/lib/kpr'

// Sticky WhatsApp — selalu terlihat (FR-06), ditumpuk di atas tombol bot.
export default function WaFloat({ waNumber }: { waNumber: string }) {
  return (
    <a
      href={waLink(waNumber, 'Halo, saya ingin bertanya tentang rumah di Griya Asri Realty.')}
      className="fixed bottom-24 right-4 z-40 flex h-12 items-center gap-2 rounded-full bg-wa px-4 font-semibold text-white shadow-lift hover:bg-wa/90"
      aria-label="Hubungi via WhatsApp (buka aplikasi WhatsApp)"
    >
      <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M17.5 14.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2-1.42.25-.7.25-1.29.18-1.42-.07-.12-.27-.2-.57-.35zM12.05 2C6.5 2 2 6.5 2 12.05c0 1.77.46 3.5 1.34 5.02L2 22l5.05-1.32a10 10 0 0 0 4.99 1.33h.01c5.54 0 10.05-4.5 10.05-10.05C22.1 6.5 17.6 2 12.05 2zm0 18.15h-.01a8.3 8.3 0 0 1-4.24-1.16l-.3-.18-3.15.82.84-3.07-.2-.32a8.28 8.28 0 0 1-1.27-4.42c0-4.6 3.74-8.34 8.34-8.34 2.23 0 4.32.87 5.9 2.45a8.28 8.28 0 0 1 2.44 5.9c0 4.6-3.74 8.32-8.35 8.32z" />
      </svg>
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  )
}
