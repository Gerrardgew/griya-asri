import type { Config } from 'tailwindcss'

// Design tokens dari DESIGN.md §3 — jangan pakai warna lain di luar palet ini.
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        parchment: '#FAF7F2',
        surface: '#FFFFFF',
        ink: '#26221E',
        ink2: '#6B6359',
        clay: '#9A3B1E',
        amber: '#8A5A00',
        moss: '#3E6B3E',
        slate: '#5F5A52',
        wa: '#0E6A5C',
        danger: '#B3261E',
        line: '#C9C1B6',
      },
      fontFamily: {
        sans: ['var(--font-public)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-lora)', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(38,34,30,0.08)',
        lift: '0 2px 8px rgba(38,34,30,0.10)',
        overlay: '0 12px 32px rgba(38,34,30,0.14)',
      },
    },
  },
  plugins: [],
}

export default config
