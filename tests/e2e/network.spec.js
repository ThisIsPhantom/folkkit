import { expect, test } from '@playwright/test'
import { fixtureFile, onePagePdfBase64, secondOnePagePdfBase64 } from '../fixtures/coreFixtures'

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
