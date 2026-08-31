import { defineConfig } from '@playwright/test'

const bun = process.execPath
const bunDirectory = bun.slice(0, bun.lastIndexOf('\\'))

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'bun run dev -- --host 127.0.0.1 --port 4173',
    env: { PATH: `${bunDirectory};${process.env.PATH}` },
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
  },
})
