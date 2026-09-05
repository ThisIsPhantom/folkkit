import { expect, test } from '@playwright/test'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { readFile } from 'node:fs/promises'
import { Buffer } from 'node:buffer'
import AxeBuilder from '@axe-core/playwright'

test.setTimeout(90000)

async function pdfFixture() {
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const page = pdf.addPage([300, 220])
  page.drawText('Before', { font, size: 20, x: 40, y: 130 })
  page.drawRectangle({ x: 220, y: 30, width: 40, height: 40, color: rgb(0, 0.5, 0) })
  return { name: 'pdf-editor-private-fixture.pdf', mimeType: 'application/pdf', buffer: Buffer.from(await pdf.save()) }
}

test('native PDF text replacement exports offline with same-origin assets and undo @matrix', async ({ page, context }) => {
  const requests = []
  page.on('request', request => requests.push({ url: request.url(), method: request.method(), body: request.postData() }))
  await page.goto('/pdf')
  await page.getByLabel('PDF auswählen', { exact: true }).setInputFiles(await pdfFixture())
  await expect(page.getByRole('button', { name: 'Textobjekt 1', exact: true })).toBeVisible({ timeout: 45000 })
  await context.setOffline(true)
  await page.getByRole('button', { name: 'Textobjekt 1', exact: true }).click()
  await page.getByLabel('Textinhalt', { exact: true }).fill('Grüsse für Jörg')
  await page.getByRole('button', { name: 'Übernehmen', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Rückgängig', exact: true })).toBeEnabled()
  await page.getByRole('button', { name: 'Rückgängig', exact: true }).click()
  await page.getByRole('button', { name: 'Wiederholen', exact: true }).click()
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'PDF herunterladen', exact: true }).click()
  const bytes = new Uint8Array(await readFile(await (await download).path()))
  expect((await PDFDocument.load(bytes)).getPageCount()).toBe(1)
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const loading = getDocument({ data: bytes, useSystemFonts: true })
  try {
    const document = await loading.promise
    const contents = await (await document.getPage(1)).getTextContent()
    expect(contents.items.map(item => item.str).join('')).toBe('Grüsse für Jörg')
  } finally { await loading.destroy() }
  await expect(page.getByText('Ungespeicherte Änderungen', { exact: true })).toHaveCount(0)
  await context.setOffline(false)
  expect(requests.filter(request => /^https?:/.test(request.url)).every(request => new URL(request.url).origin === new URL(page.url()).origin)).toBe(true)
  expect(requests.every(request => request.method === 'GET' && !request.body)).toBe(true)
  expect(requests.some(request => request.url.includes('pdfium') && request.url.includes('.wasm'))).toBe(true)
  const storage = await page.evaluate(() => JSON.stringify({ ...localStorage }))
  expect(storage).not.toContain('Before')
  expect(storage).not.toContain('Grüsse')
})

test('English PDF keyboard insertion and page actions preserve real PDF contents', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('folkkit:locale', 'en'))
  await page.goto('/pdf')
  await page.getByLabel('Choose PDF', { exact: true }).setInputFiles(await pdfFixture())
  await expect(page.getByRole('button', { name: 'Text object 1', exact: true })).toBeVisible({ timeout: 45000 })
  await page.getByRole('button', { name: 'Text', exact: true }).click()
  await page.getByLabel('Text content', { exact: true }).fill('Added locally')
  await page.getByRole('button', { name: 'Insert', exact: true }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('button', { name: 'Undo', exact: true })).toBeEnabled()
  await page.getByRole('button', { name: 'Duplicate page', exact: true }).click()
  await expect(page.getByRole('button', { name: /Page 2/ })).toBeVisible()
  await page.getByRole('button', { name: 'Rotate page', exact: true }).click()
  const thumbnail = page.locator('.pdf-page-list [aria-current="page"] canvas')
  await expect(thumbnail).toBeVisible()
  await expect.poll(() => thumbnail.evaluate(canvas => canvas.width < canvas.height)).toBe(true)
  expect(await thumbnail.evaluate(canvas => Array.from(canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data).some((value, index) => index % 4 !== 3 && value < 220))).toBe(true)
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download PDF', exact: true }).click()
  const pdf = await PDFDocument.load(await readFile(await (await download).path()))
  expect(pdf.getPageCount()).toBe(2)
  expect(pdf.getPage(0).getRotation().angle).toBe(90)
})

test('invalid PDFs fail without document content in the error', async ({ page }) => {
  await page.goto('/pdf')
  await page.getByLabel('PDF auswählen', { exact: true }).setInputFiles({ name: 'pdf-editor-private-secret.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-private-secret-invalid') })
  await expect(page.getByRole('alert')).toContainText('gültige, unverschlüsselte Datei', { timeout: 45000 })
  await expect(page.getByRole('alert')).not.toContainText('private-secret')
})

test('cancelling an in-flight change preserves previous edits, dirty status and undo', async ({ page }) => {
  await page.addInitScript(() => {
    const post = Worker.prototype.postMessage
    Worker.prototype.postMessage = function (message, ...args) {
      if (window.pdfTestStallNext && message.method === 'change') { window.pdfTestStallNext = false; return }
      return post.call(this, message, ...args)
    }
  })
  await page.goto('/pdf')
  await page.getByLabel('PDF auswählen', { exact: true }).setInputFiles(await pdfFixture())
  await expect(page.getByRole('button', { name: 'Textobjekt 1', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Text', exact: true }).click()
  await page.getByLabel('Textinhalt', { exact: true }).fill('Keep this edit')
  await page.getByRole('button', { name: 'Einfügen', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Rückgängig', exact: true })).toBeEnabled()
  await page.getByLabel('Textinhalt', { exact: true }).fill('Cancelled edit')
  await page.evaluate(() => { window.pdfTestStallNext = true })
  await page.getByRole('button', { name: 'Einfügen', exact: true }).click()
  await page.getByRole('button', { name: 'Abbrechen', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Rückgängig', exact: true })).toBeEnabled()
  await expect(page.getByText('Ungespeicherte Änderungen', { exact: true })).toBeVisible()
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'PDF herunterladen', exact: true }).click()
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const loading = getDocument({ data: new Uint8Array(await readFile(await (await download).path())), useSystemFonts: true })
  try {
    const pdf = await loading.promise
    const text = (await (await pdf.getPage(1)).getTextContent()).items.map(item => item.str).join(' ')
    expect(text).toContain('Keep this edit')
    expect(text).not.toContain('Cancelled edit')
  } finally { await loading.destroy() }
})

test('PDF editor controls pass automated accessibility checks and fit the viewport @matrix', async ({ page }, testInfo) => {
  await page.goto('/pdf')
  await page.getByLabel('PDF auswählen', { exact: true }).setInputFiles(await pdfFixture())
  const object = page.getByRole('button', { name: 'Textobjekt 1', exact: true })
  await expect(object).toBeVisible()
  await object.focus(); await page.keyboard.press('Enter')
  await expect(page.getByLabel('Textinhalt', { exact: true })).toHaveValue('Before')
  const accessibility = await new AxeBuilder({ page }).include('.pdf-editor').analyze()
  expect(accessibility.violations).toEqual([])
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
  expect(overflow).toBe(false)
  await page.screenshot({ path: testInfo.outputPath('pdf-editor.png'), fullPage: true })
})

test('cancelling a pending file read prevents a late worker and preserves the open document', async ({ page }) => {
  await page.addInitScript(() => {
    const read = File.prototype.arrayBuffer
    File.prototype.arrayBuffer = function () {
      if (this.name === 'pdf-editor-delayed.pdf') return new Promise(resolve => { window.pdfReleaseRead = async () => resolve(await read.call(this)) })
      return read.call(this)
    }
    const NativeWorker = Worker
    window.pdfWorkerCount = 0
    window.Worker = class extends NativeWorker { constructor(...args) { super(...args); window.pdfWorkerCount++ } }
  })
  await page.goto('/pdf')
  const file = await pdfFixture()
  await page.getByLabel('PDF auswählen', { exact: true }).setInputFiles(file)
  await expect(page.getByRole('button', { name: 'Textobjekt 1', exact: true })).toBeVisible()
  const workers = await page.evaluate(() => window.pdfWorkerCount)
  await page.getByLabel('PDF auswählen', { exact: true }).setInputFiles({ ...file, name: 'pdf-editor-delayed.pdf' })
  await page.getByRole('button', { name: 'Abbrechen', exact: true }).click()
  await page.evaluate(async () => { await window.pdfReleaseRead(); await new Promise(resolve => setTimeout(resolve, 0)) })
  expect(await page.evaluate(() => window.pdfWorkerCount)).toBe(workers)
  await expect(page.getByRole('button', { name: 'Textobjekt 1', exact: true })).toBeVisible()
})

test('reselecting the active PDF page preserves preview pixels and text objects', async ({ page }) => {
  await page.goto('/pdf')
  await page.getByLabel('PDF auswählen', { exact: true }).setInputFiles(await pdfFixture())
  const object = page.getByRole('button', { name: 'Textobjekt 1', exact: true })
  await expect(object).toBeVisible({ timeout: 45000 })
  const canvas = page.locator('.pdf-sheet canvas')
  const width = await canvas.getAttribute('width')
  await page.locator('.pdf-page-list [aria-current="page"]').click()
  await expect(canvas).toHaveAttribute('width', width)
  await expect(object).toBeVisible()
})

test('a same-page PDF search result preserves the preview and object selection', async ({ page }) => {
  await page.goto('/pdf')
  await page.getByLabel('PDF auswählen', { exact: true }).setInputFiles(await pdfFixture())
  const object = page.getByRole('button', { name: 'Textobjekt 1', exact: true })
  await expect(object).toBeVisible({ timeout: 45000 })
  await page.getByRole('searchbox', { name: 'Text suchen', exact: true }).fill('Before')
  await page.getByRole('button', { name: 'Suchen', exact: true }).click()
  await page.locator('.pdf-search-results button').click()
  await expect(object).toBeVisible()
  await object.click()
  await expect(page.getByLabel('Textinhalt', { exact: true })).toHaveValue('Before')
})

for (const angle of [90, 180, 270]) {
  test('rotated cropped PDF ' + angle + ' uses screen-relative movement and horizontal underlining', async ({ page }) => {
    const fixture = await pdfFixture()
    const pdf = await PDFDocument.load(fixture.buffer)
    pdf.getPage(0).setCropBox(20, 10, 260, 200)
    pdf.getPage(0).setRotation({ type: 'degrees', angle })
    await page.goto('/pdf')
    await page.getByLabel('PDF auswählen', { exact: true }).setInputFiles({ ...fixture, buffer: Buffer.from(await pdf.save()) })
    const object = page.getByRole('button', { name: 'Textobjekt 1', exact: true })
    await expect(object).toBeVisible({ timeout: 45000 })
    const rectangle = object.locator('rect')
    for (const [label, dx, dy] of [['Nach rechts', 10, 0], ['Nach links', -10, 0], ['Nach oben', 0, -10], ['Nach unten', 0, 10]]) {
      const x = Number(await rectangle.getAttribute('x')), y = Number(await rectangle.getAttribute('y'))
      await object.click()
      await page.getByRole('button', { name: label, exact: true }).click()
      await expect.poll(async () => Number(await rectangle.getAttribute('x'))).toBeCloseTo(x + dx, 3)
      await expect.poll(async () => Number(await rectangle.getAttribute('y'))).toBeCloseTo(y + dy, 3)
    }
    await page.getByRole('button', { name: 'Unterstreichen', exact: true }).click()
    const overlay = page.locator('.pdf-overlay')
    await overlay.scrollIntoViewIfNeeded()
    const bounds = await overlay.boundingBox()
    await page.mouse.move(bounds.x + bounds.width * 0.25, bounds.y + bounds.height * 0.5)
    await page.mouse.down()
    await page.mouse.move(bounds.x + bounds.width * 0.65, bounds.y + bounds.height * 0.5, { steps: 8 })
    await page.mouse.up()
    const download = page.waitForEvent('download')
    await page.getByRole('button', { name: 'PDF herunterladen', exact: true }).click()
    const bytes = new Uint8Array(await readFile(await (await download).path()))
    const { PdfEngine } = await import('../../src/features/pdf/pdfEngine.js')
    const { viewBounds } = await import('../../src/features/pdf/pdfGeometry.js')
    const { init } = await import('@embedpdf/pdfium')
    const engine = new PdfEngine(await init())
    try {
      engine.open(bytes)
      const paths = engine.objects(0).filter(item => item.type === 'other')
      expect(paths).toHaveLength(2)
      const line = viewBounds(paths.at(-1).bounds, engine.metadata().pages[0])
      expect(line.width).toBeGreaterThan(30)
      // viewBounds uses an eight-point minimum interaction target.
      expect(line.height).toBe(8)
    } finally { engine.close() }
    const { getDocument, OPS } = await import('pdfjs-dist/legacy/build/pdf.mjs')
    const loading = getDocument({ data: bytes.slice(), useSystemFonts: true })
    try {
      const independent = await loading.promise
      const operators = await (await independent.getPage(1)).getOperatorList()
      expect(operators.fnArray.filter(item => item === OPS.constructPath).length).toBeGreaterThanOrEqual(2)
    } finally { await loading.destroy() }
  })
}

test('existing PDF form values and metadata survive page moves and unsafe operations show a clear refusal', async ({ page }) => {
  const file = await pdfFixture()
  const pdf = await PDFDocument.load(file.buffer)
  pdf.setTitle('Browser original metadata')
  pdf.addPage([400, 250])
  const field = pdf.getForm().createTextField('customer')
  field.setText('Original')
  field.addToPage(pdf.getPage(0), { x: 20, y: 20, width: 140, height: 25 })
  const formFile = { ...file, buffer: Buffer.from(await pdf.save()) }
  await page.goto('/pdf')
  await page.getByLabel('PDF auswählen', { exact: true }).setInputFiles(formFile)
  await expect(page.getByRole('button', { name: 'Textobjekt 1', exact: true })).toBeVisible({ timeout: 45000 })
  await page.getByRole('button', { name: 'Seite nach hinten', exact: true }).click()
  await page.getByRole('button', { name: 'Seite duplizieren', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('Formularstrukturen', { timeout: 45000 })
  await page.locator('.pdf-page-list button').nth(1).click()
  await expect(page.getByRole('button', { name: 'Textobjekt 1', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Seite löschen', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('Formularstrukturen')
  await page.getByRole('button', { name: 'Seite herunterladen', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('Formularstrukturen')
  await page.getByLabel('Weiteres PDF anfügen', { exact: true }).setInputFiles(formFile)
  await expect(page.getByRole('alert')).toContainText('Formularstrukturen')
  await expect(page.locator('.pdf-page-list button')).toHaveCount(2)
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'PDF herunterladen', exact: true }).click()
  const restored = await PDFDocument.load(await readFile(await (await download).path()))
  expect(restored.getTitle()).toBe('Browser original metadata')
  expect(restored.getForm().getTextField('customer').getText()).toBe('Original')
  expect(restored.getPages().map(item => item.getWidth())).toEqual([400, 300])
})
