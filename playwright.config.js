import { defineConfig, devices } from '@playwright/test'

const port = Number.parseInt(process.env.FOLKKIT_E2E_PORT || '4175', 10)
const baseURL = `http://127.0.0.1:${port}/`
const hostingHeaders = process.env.FOLKKIT_E2E_HOSTING_HEADERS === '1'
const runtimeExecutable = `"${process.execPath}"`

export default defineConfig({
  testDir: './tests/e2e',
  testIgnore: hostingHeaders ? [] : ['hosting-csp.spec.js'],
  workers: 1,
  projects: hostingHeaders ? [
    { name: 'chromium-hosting', use: { ...devices['Desktop Chrome'] } },
  ] : [
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox-desktop', grep: /@matrix/, use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit-desktop', grep: /@matrix/, use: { ...devices['Desktop Safari'] } },
    {
      name: 'chromium-mobile-390x844',
      grep: /@matrix/,
      use: { ...devices['Pixel 5'], viewport: { width: 390, height: 844 } },
    },
  ],
  use: {
    baseURL,
    launchOptions: {
      timeout: 30_000,
    },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: hostingHeaders
      ? `${runtimeExecutable} ./scripts/serve-hosting-preview.mjs --port ${port}`
      : `${runtimeExecutable} ./node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port ${port} --strictPort`,
    env: { ...process.env, FOLKKIT_E2E_OLD_SW: '1' },
    url: baseURL,
    reuseExistingServer: false,
  },
})
