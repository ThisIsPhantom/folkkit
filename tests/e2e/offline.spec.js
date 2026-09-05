import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'
import { fixtureFile, onePagePdfBase64, secondOnePagePdfBase64, tinyWavFixture } from '../fixtures/coreFixtures'

const viteManifest = JSON.parse(await readFile(new URL('../../dist/.vite/manifest.json', import.meta.url), 'utf8'))
const ffmpegWrapperPaths = [
  'src/converters/media.js',
  'node_modules/@ffmpeg/ffmpeg/dist/esm/index.js',
  'node_modules/@ffmpeg/util/dist/esm/index.js',
].map(key => `/${viteManifest[key].file}`)

async function installFromHome(page) {
  await page.goto('./')
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
    if (!navigator.serviceWorker.controller) {
      await new Promise(resolve => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }))
    }
  })
}

test('opens the home shell offline after its first load', async ({ page, context }) => {
  await installFromHome(page)
  await context.setOffline(true)

  await page.goto('./')
  await expect(page.getByRole('heading', { name: 'Was möchtest du machen?' })).toBeVisible()
})

test('runs core text, QR, and PDF workflows offline after the first load', async ({ page, context }) => {
  await installFromHome(page)
  await context.setOffline(true)

  await page.goto('./workspace?from=text&to=base64')
  await page.getByRole('textbox', { name: 'Eingabetext' }).fill('Folkkit offline')
  await expect(page.getByRole('textbox', { name: 'Konvertierungsergebnis' })).toHaveValue('Rm9sa2tpdCBvZmZsaW5l')

  await page.goto('./workspace?tool=text-to-qr')
  await page.getByRole('textbox', { name: 'Werkzeugeingabe' }).fill('Folkkit offline QR')
  await expect(page.getByRole('link', { name: 'Herunterladen' })).toHaveAttribute('href', /^blob:/)

  await page.goto('./workspace?tool=merge-pdf')
  await page.getByLabel('PDF-Dateien auswählen').setInputFiles([
    fixtureFile('offline-one.pdf', 'application/pdf', onePagePdfBase64),
    fixtureFile('offline-two.pdf', 'application/pdf', secondOnePagePdfBase64),
  ])
  await expect(page.getByRole('link', { name: 'Herunterladen' })).toHaveAttribute('href', /^blob:/)
})

test('identifies missing FFmpeg core offline, retries, and completes a real MP3 conversion', async ({ page, context }) => {
  test.setTimeout(120_000)
  await installFromHome(page)
  await page.evaluate(async paths => {
    await Promise.all(paths.map(async path => {
      const response = await fetch(path)
      if (!response.ok) throw new Error(`Unable to warm ${path}`)
    }))
  }, ffmpegWrapperPaths)
  await context.setOffline(true)

  await page.goto('./workspace?tool=audio-to-mp3')
  const input = page.getByLabel('Datei auswählen')
  await input.setInputFiles(tinyWavFixture('offline-core.wav'))
  await expect(page.getByRole('alert')).toContainText('FFmpeg-Core und WASM sind offline nicht verfügbar.')
  await expect(page.getByRole('button', { name: 'Erneut versuchen' })).toBeVisible()

  await context.setOffline(false)
  await page.getByRole('button', { name: 'Erneut versuchen' }).click()
  const downloadLink = page.getByRole('link', { name: 'Herunterladen' })
  await expect(downloadLink).toBeVisible({ timeout: 110_000 })
  const downloadPromise = page.waitForEvent('download')
  await downloadLink.click()
  const download = await downloadPromise
  const bytes = await readFile(await download.path())

  expect(download.suggestedFilename()).toBe('offline-core.mp3')
  expect(bytes.byteLength).toBeGreaterThan(100)
  const hasId3 = bytes.subarray(0, 3).toString('ascii') === 'ID3'
  const hasFrameSync = bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0
  expect(hasId3 || hasFrameSync).toBe(true)
})
