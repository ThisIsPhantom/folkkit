import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'
import { fixtureFile, onePixelJpegBase64, onePixelPngBase64 } from '../fixtures/coreFixtures'
import { runBrowserEvidence } from '../../src/catalog/browserEvidence'

const viteManifest = JSON.parse(await readFile(new URL('../../dist/.vite/manifest.json', import.meta.url), 'utf8'))

test('shows the derived released count and excludes hidden entries', async ({ page }) => {
  await page.goto('./tools')

  await expect(page.getByText('49 Werkzeuge')).toBeVisible()
  await expect(page.locator('.catalog-list > li')).toHaveCount(49)
  await expect(page.getByText('Random Password', { exact: true })).toHaveCount(0)
  await expect(page.getByText('QR-Code lesen', { exact: true })).toHaveCount(0)
})

test('loads only the owning converter module after released metadata selection', async ({ page }) => {
  const requests = []
  page.on('request', request => requests.push(request.url()))

  await page.goto('./?tool=base64-encode')
  await page.getByRole('textbox', { name: 'Tool input text' }).fill('Folkkit')
  await expect(page.getByRole('textbox', { name: 'Tool output text' })).toHaveValue('Rm9sa2tpdA==')

  expect(requests.some(url => url.endsWith(`/${viteManifest['src/converters/text.js'].file}`))).toBe(true)
  expect(requests.some(url => url.endsWith(`/${viteManifest['src/converters/data.js'].file}`))).toBe(false)
  expect(requests.some(url => url.endsWith(`/${viteManifest['src/converters/media.js'].file}`))).toBe(false)
})

test('converts a real PNG fixture to a runtime-owned JPEG download', async ({ page }) => {
  const png = fixtureFile('catalog-private.png', 'image/png', onePixelPngBase64)
  await page.goto('./?tool=png-to-jpg')

  await page.getByLabel('Datei auswählen').setInputFiles(png)
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('link', { name: 'Herunterladen' }).click()
  const download = await downloadPromise
  const bytes = await readFile(await download.path())

  const evidence = runBrowserEvidence('tool:png-to-jpg', {
    filename: download.suggestedFilename(),
    bytes,
  })
  expect(evidence.behaviorAssertions).toBeGreaterThanOrEqual(3)
})

test('converts a real JPEG fixture to a runtime-owned PNG download', async ({ page }) => {
  const jpeg = fixtureFile('catalog-private.jpg', 'image/jpeg', onePixelJpegBase64)
  await page.goto('./?tool=jpg-to-png')

  await page.getByLabel('Datei auswählen').setInputFiles(jpeg)
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('link', { name: 'Herunterladen' }).click()
  const download = await downloadPromise
  const bytes = await readFile(await download.path())

  const evidence = runBrowserEvidence('tool:jpg-to-png', {
    filename: download.suggestedFilename(),
    bytes,
  })
  expect(evidence.behaviorAssertions).toBeGreaterThanOrEqual(3)
})

test('combines real PNG and JPEG fixtures through the shared PDF browser evidence runner', async ({ page }) => {
  const png = fixtureFile('one.png', 'image/png', onePixelPngBase64)
  const jpeg = fixtureFile('two.jpg', 'image/jpeg', onePixelJpegBase64)
  await page.goto('./?tool=images-to-pdf')

  await page.getByLabel('PDF-Dateien auswählen').setInputFiles([png, jpeg])
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('link', { name: 'Herunterladen' }).click()
  const download = await downloadPromise
  const bytes = await readFile(await download.path())
  const evidence = runBrowserEvidence('tool:images-to-pdf', {
    filename: download.suggestedFilename(),
    bytes,
  })

  expect(evidence.behaviorAssertions).toBeGreaterThanOrEqual(3)
})
