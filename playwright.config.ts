import { defineConfig, devices } from '@playwright/test'

// Serial (workers 1, fullyParallel false): rate limiter & e2e.db in-memory/di-disk
// dibagi seluruh test — urutan file dijaga lewat nama (a-, b-, …, z-rate terakhir).
export default defineConfig({
  testDir: './e2e',
  testMatch: '*.spec.ts',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  reporter: [['html', { open: 'never' }], ['list']],
  timeout: 30_000,
  expect: { timeout: 5_000 },

  use: {
    baseURL: 'http://localhost:3222',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  globalSetup: './e2e/global-setup.ts',

  webServer: {
    command: 'node e2e/start-server.mjs',
    url: 'http://localhost:3222',
    // Selalu server segar: limiter in-memory & build ikut baru tiap run.
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
