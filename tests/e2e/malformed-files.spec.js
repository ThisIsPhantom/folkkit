import { expect, test } from '@playwright/test'
import { PDFDocument } from 'pdf-lib'
import { Buffer } from 'node:buffer'
import { QR_TEXT_LIMIT_BYTES } from '../../src/runtime/workBudgets'

const tinyPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9ZQmcAAAAASUVORK5CYII=', 'base64')

async function expectGermanResourceLimit(page) {
  await expect(page.getByRole('alert')).toHaveText('Die Eingabe überschreitet die sichere Verarbeitungsgrenze.')
}

test('rejects corrupt, double-extension and oversized PDF inputs with content-free errors', async ({ page }) => {
  await page.goto('./workspace?tool=pdf-page-count')
  await page.getByLabel('Datei auswählen').setInputFiles({ name: 'PRIVATE-corrupt.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-corrupt') })
  await expect(page.getByRole('alert')).toHaveText('Die Datei ist beschädigt oder ungültig.')
  await expect(page.getByRole('alert')).not.toContainText('PRIVATE')

  await page.getByLabel('Datei auswählen').setInputFiles({ name: 'PRIVATE.pdf.exe', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-corrupt') })
  await expect(page.getByRole('alert')).toHaveText('Dieser Dateityp wird von diesem Werkzeug nicht unterstützt.')

  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByLabel('Datei auswählen').setInputFiles({ name: 'PRIVATE-large.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(26 * 1024 * 1024) })
  await expect(page.getByRole('alert')).toHaveText('Die ausgewählte Datei ist für dieses Gerät zu gross.')
})

test('rejects excessive image dimensions and file count before canvas or PDF work', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('./workspace?tool=images-to-pdf')
  const dimensions = Buffer.alloc(24)
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52]).copy(dimensions)
  dimensions.writeUInt32BE(50000, 16)
  dimensions.writeUInt32BE(50000, 20)
  await page.getByLabel(/Dateien auswählen/).setInputFiles({ name: 'PRIVATE-dimensions.png', mimeType: 'image/png', buffer: dimensions })
  await expectGermanResourceLimit(page)

  await page.getByLabel(/Dateien auswählen/).setInputFiles(Array.from({ length: 13 }, (_, index) => ({
    name: `PRIVATE-${index}.png`, mimeType: 'image/png', buffer: tinyPng,
  })))
  await expectGermanResourceLimit(page)
  await expect(page.getByText('PRIVATE-12.png')).toHaveCount(0)
})

test('rejects excessive batch, CSV, QR and PDF page complexity before dangerous work', async ({ page }) => {
  await page.goto('./workspace?from=text&to=base64')
  await page.getByTitle('Enable batch mode').click()
  await page.getByRole('textbox', { name: 'Input text' }).fill(Array.from({ length: 501 }, () => 'x').join('\n'))
  await expectGermanResourceLimit(page)

  await page.goto('./workspace?tool=csv-to-json')
  const wideCsv = Array.from({ length: 101 }, (_, index) => `c${index}`).join(',')
  await page.getByRole('textbox', { name: 'Tool input text' }).fill(`${wideCsv}\n${wideCsv}`)
  await expectGermanResourceLimit(page)

  await page.goto('./workspace?tool=text-to-qr')
  await page.getByRole('textbox', { name: 'Tool input text' }).fill('x'.repeat(QR_TEXT_LIMIT_BYTES + 1))
  await expectGermanResourceLimit(page)

  const document = await PDFDocument.create()
  for (let index = 0; index < 1001; index += 1) document.addPage([1, 1])
  await page.goto('./workspace?tool=pdf-page-count')
  await page.getByLabel('Datei auswählen').setInputFiles({ name: 'PRIVATE-pages.pdf', mimeType: 'application/pdf', buffer: Buffer.from(await document.save()) })
  await expectGermanResourceLimit(page)
})
