import { defineConfig, devices } from '@playwright/test'
const baseURL = process.env.FOLKKIT_CONVERTER_TEST_URL || 'http://127.0.0.1:5184'
const browserName = process.env.FOLKKIT_CONVERTER_TEST_BROWSER || 'chromium'
export default defineConfig({
  testDir: '.', testMatch: 'file-converter*.spec.js', workers: 1,
  outputDir: `../../.superpowers/sdd/2026-09-05-folkkit-studio/converter-${browserName}-results`,
  use: { baseURL, ...devices[browserName === 'webkit' ? 'Desktop Safari' : 'Desktop Chrome'], browserName, trace: 'retain-on-failure' },
  webServer: process.env.FOLKKIT_CONVERTER_TEST_URL ? undefined : {
    command: `"${process.execPath}" ./node_modules/vite/bin/vite.js preview --outDir .superpowers/sdd/2026-09-05-folkkit-studio/converter-dist --host 127.0.0.1 --port 5184 --strictPort`,
    cwd: '../..', url: baseURL, reuseExistingServer: false,
  },
})
