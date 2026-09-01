import { defineConfig } from '@playwright/test'

const port = Number.parseInt(process.env.FOLKKIT_E2E_PORT || '4175', 10)
const baseURL = `http://127.0.0.1:${port}/`
const hostingHeaders = process.env.FOLKKIT_E2E_HOSTING_HEADERS === '1'

export default defineConfig({
  testDir: './tests/e2e',
  testIgnore: hostingHeaders ? [] : ['hosting-csp.spec.js'],
  workers: 1,
  use: {
    baseURL,
    launchOptions: {
      timeout: 30_000,
    },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: hostingHeaders
      ? `${process.execPath} ./scripts/serve-hosting-preview.mjs --port ${port}`
      : `${process.execPath} ./node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port ${port} --strictPort`,
    env: { ...process.env, FOLKKIT_E2E_OLD_SW: '1' },
    url: baseURL,
    reuseExistingServer: false,
  },
})
