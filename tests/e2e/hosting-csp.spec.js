import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'
import { tinyWavFixture } from '../fixtures/coreFixtures'

const htaccess = await readFile(new URL('../../dist/.htaccess', import.meta.url), 'utf8')
const cspMatch = htaccess.match(/^\s*Header always set Content-Security-Policy "([^"]*)"\s*$/m)
if (!cspMatch) throw new Error('Built .htaccess has no CSP header.')
const expectedCsp = cspMatch[1]

test('real MP3 conversion runs under the exact production CSP without inline styles', async ({ context, page }) => {
  test.setTimeout(120_000)
  const requests = []
  const responses = []
  const consoleViolations = []
  const pageErrors = []
  const origin = new URL(test.info().project.use.baseURL).origin

  await context.addInitScript(() => {
    globalThis.__folkkitCspViolations = []
    document.addEventListener('securitypolicyviolation', event => {
      globalThis.__folkkitCspViolations.push({
        blockedURI: event.blockedURI,
        violatedDirective: event.violatedDirective,
      })
    })
  })
  page.on('request', request => requests.push(request.url()))
  page.on('response', response => responses.push({ url: response.url(), csp: response.headers()['content-security-policy'] }))
  page.on('console', message => {
    if (/content security policy|refused to/i.test(message.text())) consoleViolations.push(message.text())
  })
  page.on('pageerror', error => pageErrors.push(error.message))

  const documentResponse = await page.goto('./workspace?tool=audio-to-mp3', { waitUntil: 'domcontentloaded' })
  expect(documentResponse.headers()['content-security-policy']).toBe(expectedCsp)
  expect(expectedCsp).toContain("form-action 'none'")
  expect(expectedCsp).toContain("script-src 'self' 'wasm-unsafe-eval'")
  expect(expectedCsp).toContain("style-src 'self'")
  expect(expectedCsp).not.toContain("style-src 'self' 'unsafe-inline'")
  expect(expectedCsp).not.toContain('script-src blob:')
  await expect(page.locator('[style]')).toHaveCount(0)

  await page.getByLabel('Datei auswählen').setInputFiles(tinyWavFixture('hosting-csp.wav'))
  const downloadLink = page.getByRole('link', { name: 'Herunterladen' })
  await expect(downloadLink).toBeVisible({ timeout: 110_000 })
  const downloadPromise = page.waitForEvent('download')
  await downloadLink.click()
  const download = await downloadPromise
  const bytes = await readFile(await download.path())

  expect(download.suggestedFilename()).toBe('hosting-csp.mp3')
  expect(bytes.byteLength).toBeGreaterThan(100)
  expect(bytes.subarray(0, 3).toString('ascii') === 'ID3' || (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0)).toBe(true)
  expect(requests.some(url => url.includes('/vendor/ffmpeg/ffmpeg-core.js'))).toBe(true)
  expect(requests.some(url => url.includes('/vendor/ffmpeg/ffmpeg-core.wasm'))).toBe(true)
  for (const runtimePath of ['/vendor/ffmpeg/ffmpeg-core.js', '/vendor/ffmpeg/ffmpeg-core.wasm']) {
    const runtimeResponses = responses.filter(response => new URL(response.url).pathname === runtimePath)
    expect(runtimeResponses.length).toBeGreaterThan(0)
    expect(runtimeResponses.every(response => response.csp === expectedCsp)).toBe(true)
  }
  expect(requests.filter(url => url.startsWith('blob:'))).toEqual([])
  expect(requests.every(url => new URL(url).origin === origin)).toBe(true)
  expect(await page.evaluate(() => globalThis.__folkkitCspViolations)).toEqual([])
  expect(consoleViolations).toEqual([])
  expect(pageErrors).toEqual([])
  await expect(page.locator('[style]')).toHaveCount(0)
})
