// JSON-LD aman untuk dangerouslySetInnerHTML (audit #9):
// JSON.stringify tidak meng-escape "</script>", yang bisa menutup tag lebih
// awal dan menyuntik HTML arbitral. Escape "<" agar tidak bisa breakout.
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
