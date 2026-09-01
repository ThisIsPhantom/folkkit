import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'
import { fixtureFile, onePagePdfBase64, secondOnePagePdfBase64, tinyWavFixture } from '../fixtures/coreFixtures'
import { runBrowserEvidence } from '../../src/catalog/browserEvidence'

test('merges PDFs without cross-origin requests or request leakage', async ({ page }) => {
  const observedRequests = []
  const testServerOrigin = new URL(test.info().project.use.baseURL).origin
  const firstFile = fixtureFile('network-private-one.pdf', 'application/pdf', onePagePdfBase64)
  const secondFile = fixtureFile('network-private-two.pdf', 'application/pdf', secondOnePagePdfBase64)
  const privateMarkers = [
    'network-private-one.pdf',
    'network-private-two.pdf',
    'Folkkit fixture one',
    'Folkkit fixture two',
  ]

  page.on('request', (request) => {
    observedRequests.push({
      url: request.url(),
      headers: request.headers(),
      body: request.postDataBuffer(),
    })
  })

  await page.goto('./?tool=merge-pdf', { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('button', { name: 'PDFs zusammenführen' })).toBeVisible()
  await page.getByLabel('PDF-Dateien auswählen').setInputFiles([firstFile, secondFile])
  await expect(page.getByRole('link', { name: 'Herunterladen' })).toBeVisible()
  await page.waitForLoadState('networkidle')

  expect(observedRequests.length).toBeGreaterThan(1)
  expect(observedRequests.some(request => request.url.includes('pdf-lib'))).toBe(true)
  expect(observedRequests.filter(request => new URL(request.url).origin !== testServerOrigin)).toEqual([])
  for (const request of observedRequests) {
    const metadata = `${decodeURIComponent(request.url)}\n${JSON.stringify(request.headers)}`
    for (const marker of privateMarkers) expect(metadata).not.toContain(marker)
    for (const file of [firstFile, secondFile]) expect(metadata).not.toContain(file.buffer.toString('base64'))
    if (!request.body) continue
    for (const file of [firstFile, secondFile]) {
      expect(request.body.indexOf(file.buffer)).toBe(-1)
    }
    const bodyText = request.body.toString('utf8')
    for (const marker of privateMarkers) expect(bodyText).not.toContain(marker)
    for (const file of [firstFile, secondFile]) expect(bodyText).not.toContain(file.buffer.toString('base64'))
  }
})

test('converts real media with same-origin FFmpeg assets and no input leakage', async ({ page }) => {
  test.setTimeout(120_000)
  const observedRequests = []
  const testServerOrigin = new URL(test.info().project.use.baseURL).origin
  const audio = tinyWavFixture()

  page.on('request', (request) => {
    observedRequests.push({
      url: request.url(),
      headers: request.headers(),
      body: request.postDataBuffer(),
    })
  })

  await page.goto('./?tool=audio-to-mp3', { waitUntil: 'domcontentloaded' })
  await expect(page.getByText('Experimentell')).toBeVisible()
  await page.getByLabel('Datei auswählen').setInputFiles(audio)
  await expect(page.getByRole('link', { name: 'Herunterladen' })).toBeVisible({ timeout: 110_000 })

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('link', { name: 'Herunterladen' }).click()
  const download = await downloadPromise
  const outputBytes = await readFile(await download.path())

  expect(observedRequests.some(request => request.url.includes('/vendor/ffmpeg/ffmpeg-core.js'))).toBe(true)
  expect(observedRequests.some(request => request.url.includes('/vendor/ffmpeg/ffmpeg-core.wasm'))).toBe(true)
  const sameOriginOnly = observedRequests.every(request => (
    request.url.startsWith('blob:') || new URL(request.url).origin === testServerOrigin
  ))
  let leakFree = true

  for (const request of observedRequests) {
    const metadata = `${decodeURIComponent(request.url)}\n${JSON.stringify(request.headers)}`
    if (metadata.includes(audio.name) || metadata.includes(audio.buffer.toString('base64'))) leakFree = false
    if (!request.body) continue
    if (request.body.indexOf(audio.buffer) !== -1) leakFree = false
    if (request.body.toString('utf8').includes(audio.name)) leakFree = false
    if (request.body.toString('utf8').includes(audio.buffer.toString('base64'))) leakFree = false
  }
  const evidence = runBrowserEvidence('tool:audio-to-mp3', {
    filename: download.suggestedFilename(),
    bytes: outputBytes,
    sameOriginOnly,
    leakFree,
  })
  expect(evidence.behaviorAssertions).toBeGreaterThanOrEqual(5)
})

test('cancels an experimental media load and leaves the input reusable', async ({ page }) => {
  test.setTimeout(60_000)
  const audio = tinyWavFixture('cancel-private.wav')
  await page.route('**/vendor/ffmpeg/ffmpeg-core.wasm', async (route) => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    await route.continue()
  })

  await page.goto('./?tool=audio-to-mp3')
  const input = page.getByLabel('Datei auswählen')
  await input.setInputFiles(audio)
  await page.getByRole('button', { name: 'Abbrechen' }).click()

  await expect(page.getByRole('alert')).toContainText('Der Vorgang wurde abgebrochen.')
  await expect(input).toBeEnabled()
  await expect(input).toHaveValue('')
})
