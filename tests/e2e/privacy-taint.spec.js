import { expect, test } from '@playwright/test'
import { PDFDocument, StandardFonts } from 'pdf-lib'
import { Buffer } from 'node:buffer'

const MARKER = 'FOLKKIT-TAINT-7f4d2c91'

async function markerPdf() {
  const document = await PDFDocument.create()
  const page = document.addPage([200, 200])
  const font = await document.embedFont(StandardFonts.Helvetica)
  page.drawText(MARKER, { x: 10, y: 100, size: 8, font })
  return Buffer.from(await document.save())
}

test('file marker never reaches network, logs, storage, caches or navigation without history consent', async ({ page }) => {
  const requests = []
  const consoleMessages = []
  const pageErrors = []
  page.on('request', request => requests.push({ url: request.url(), headers: request.headers(), body: request.postData() || '' }))
  page.on('console', message => consoleMessages.push(message.text()))
  page.on('pageerror', error => pageErrors.push(error.message))
  await page.addInitScript(marker => {
    localStorage.setItem('folkkit:content-history', JSON.stringify([{ input: marker, output: marker }]))
    localStorage.setItem('convert-everything-history', JSON.stringify([{ input: marker }]))
  }, MARKER)

  await page.goto('./workspace?tool=pdf-page-count')
  await page.getByLabel('PDF auswählen', { exact: true }).setInputFiles({
    name: `${MARKER}.pdf`, mimeType: 'application/pdf', buffer: await markerPdf(),
  })
  await expect(page.locator('.pdf-page-card')).toHaveCount(1)
  await expect(page.getByRole('button', { name: new RegExp(MARKER) })).toBeVisible()

  const browserState = await page.evaluate(async marker => {
    const storage = { local: { ...localStorage }, session: { ...sessionStorage } }
    const cacheValues = []
    for (const cacheName of await caches.keys()) {
      const cache = await caches.open(cacheName)
      for (const request of await cache.keys()) {
        const response = await cache.match(request)
        cacheValues.push(`${request.url}\n${[...request.headers].join('\n')}\n${await response.clone().text().catch(() => '')}`)
      }
    }
    return { storage, cacheValues, href: location.href, hasMarker: document.documentElement.outerHTML.includes(marker) }
  }, MARKER)

  expect(requests.every(request => !JSON.stringify(request).includes(MARKER))).toBe(true)
  expect(consoleMessages.join('\n')).not.toContain(MARKER)
  expect(pageErrors.join('\n')).not.toContain(MARKER)
  expect(JSON.stringify(browserState.storage)).not.toContain(MARKER)
  expect(browserState.cacheValues.join('\n')).not.toContain(MARKER)
  expect(browserState.href).not.toContain(MARKER)
  expect(browserState.hasMarker).toBe(true)
  expect(await page.evaluate(() => localStorage.getItem('folkkit:content-history'))).toBeNull()
  expect(await page.evaluate(() => localStorage.getItem('convert-everything-history'))).toBeNull()
})
