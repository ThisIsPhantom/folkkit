import { defineConfig } from '@playwright/test'

const port = Number.parseInt(process.env.FOLKKIT_E2E_PORT || '4175', 10)
const baseURL = `http://127.0.0.1:${port}/`

export default defineConfig({
  testDir: './tests/e2e',
  workers: 1,
  use: {
    baseURL,
    launchOptions: {
      timeout: 30_000,
    },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `${process.execPath} ./node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port ${port} --strictPort`,
    url: baseURL,
    reuseExistingServer: false,
  },
})
