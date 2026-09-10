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
  await expect(page.getByRole('button', { name: /^Textobjekt 1:/ })).toBeVisible({ timeout: 45000 })
  await context.setOffline(true)
  await page.getByRole('button', { name: /^Textobjekt 1:/ }).click()
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
  await page.setViewportSize({ width: 1280, height: 600 })
  await page.addInitScript(() => localStorage.setItem('folkkit:locale', 'en'))
  await page.goto('/pdf')
  await page.getByLabel('Choose PDF', { exact: true }).setInputFiles(await pdfFixture())
  await expect(page.getByRole('button', { name: /^Text object 1:/ })).toBeVisible({ timeout: 45000 })
  await page.getByRole('button', { name: 'Text', exact: true }).click()
  await page.getByLabel('Text content', { exact: true }).fill('Added locally')
  await page.getByRole('button', { name: 'Insert', exact: true }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('button', { name: 'Undo', exact: true })).toBeEnabled()
  await page.getByRole('button', { name: 'Duplicate page', exact: true }).click()
  await expect(page.getByRole('button', { name: /Page 2/ })).toBeVisible()
  await page.getByRole('button', { name: 'Rotate page', exact: true }).click()
  const thumbnail = page.locator('.pdf-page-list [aria-current="page"] canvas')
  // Thumbnails update lazily; page actions can scroll the sidebar past this item.
  await thumbnail.scrollIntoViewIfNeeded()
  await expect(thumbnail).toBeInViewport()
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
  await expect(page.getByRole('button', { name: /^Textobjekt 1:/ })).toBeVisible()
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
  const object = page.getByRole('button', { name: /^Textobjekt 1:/ })
  await expect(object).toBeVisible()
  await object.focus(); await page.keyboard.press('Enter')
  await expect(page.getByLabel('Textinhalt', { exact: true })).toHaveValue('Before')
  const accessibility = await new AxeBuilder({ page }).include('.pdf-editor').analyze()
  expect(accessibility.violations).toEqual([])
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
  expect(overflow).toBe(false)
  await page.screenshot({ path: testInfo.outputPath('pdf-editor.png'), fullPage: true })
  await page.getByRole('button', { name: 'Dunkles Design', exact: true }).click()
  await page.locator('body').evaluate(async body => { await Promise.all(body.getAnimations().map(animation => animation.finished.catch(() => {}))) })
  expect((await new AxeBuilder({ page }).include('.pdf-editor').analyze()).violations).toEqual([])
  await page.getByRole('button', { name: /^Eigenschaften:/ }).click()
  await expect(page.getByLabel('Textinhalt', { exact: true })).toBeHidden()
  await page.getByRole('button', { name: /^Eigenschaften:/ }).click()
  await expect(page.getByLabel('Textinhalt', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: /^Seiten 1/ }).click()
  await expect(page.locator('.pdf-page-list')).toBeHidden()
  await page.getByRole('button', { name: /^Seiten 1/ }).click()
  await expect(page.locator('.pdf-page-list')).toBeVisible()
  await page.locator('.pdf-stage').scrollIntoViewIfNeeded()
  const toolbar = await page.locator('.pdf-tool-strip').boundingBox(), header = await page.locator('.site-header').boundingBox()
  expect(toolbar.y).toBeGreaterThanOrEqual(header.y + header.height - 1)
  await page.screenshot({ path: testInfo.outputPath('pdf-editor-dark.png'), fullPage: true })
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
  await expect(page.getByRole('button', { name: /^Textobjekt 1:/ })).toBeVisible()
  const workers = await page.evaluate(() => window.pdfWorkerCount)
  await page.getByLabel('PDF auswählen', { exact: true }).setInputFiles({ ...file, name: 'pdf-editor-delayed.pdf' })
  await page.getByRole('button', { name: 'Abbrechen', exact: true }).click()
  await page.evaluate(async () => { await window.pdfReleaseRead(); await new Promise(resolve => setTimeout(resolve, 0)) })
  expect(await page.evaluate(() => window.pdfWorkerCount)).toBe(workers)
  await expect(page.getByRole('button', { name: /^Textobjekt 1:/ })).toBeVisible()
})

test('reselecting the active PDF page preserves preview pixels and text objects', async ({ page }) => {
  await page.goto('/pdf')
  await page.getByLabel('PDF auswählen', { exact: true }).setInputFiles(await pdfFixture())
  const object = page.getByRole('button', { name: /^Textobjekt 1:/ })
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
  const object = page.getByRole('button', { name: /^Textobjekt 1:/ })
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
    const object = page.getByRole('button', { name: /^Textobjekt 1:/ })
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
    const stageBounds = await page.locator('.pdf-stage').boundingBox(), toolBounds = await page.locator('.pdf-tool-strip').boundingBox()
    const drawY = Math.max(stageBounds.y + 20, toolBounds.y + toolBounds.height + 20, Math.min(bounds.y + bounds.height * 0.5, stageBounds.y + stageBounds.height - 20))
    await page.mouse.move(bounds.x + bounds.width * 0.25, drawY)
    await page.mouse.down()
    await page.mouse.move(bounds.x + bounds.width * 0.65, drawY, { steps: 8 })
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
  await expect(page.getByRole('button', { name: /^Textobjekt 1:/ })).toBeVisible({ timeout: 45000 })
  await page.getByRole('button', { name: 'Seite nach hinten', exact: true }).click()
  await page.getByRole('button', { name: 'Seite duplizieren', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('Formularstrukturen', { timeout: 45000 })
  await page.locator('.pdf-page-list button').nth(1).click()
  await expect(page.getByRole('button', { name: /^Textobjekt 1:/ })).toBeVisible()
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

async function downloadEditor(page) {
  const pending = page.waitForEvent('download')
  await page.getByRole('button', { name: 'PDF herunterladen', exact: true }).click()
  return new Uint8Array(await readFile(await (await pending).path()))
}
async function inspectPdf(bytes) {
  const { getDocument, OPS, Util } = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const task = getDocument({ data: bytes.slice(), useSystemFonts: true })
  try {
    const doc = await task.promise, first = await doc.getPage(1)
    const text = (await first.getTextContent()).items.find(item => item.str === 'Before')
    const ops = await first.getOperatorList(), stack = [], images = []
    let matrix = [1, 0, 0, 1, 0, 0]
    for (let i = 0; i < ops.fnArray.length; i++) {
      if (ops.fnArray[i] === OPS.save) stack.push([...matrix])
      if (ops.fnArray[i] === OPS.restore) matrix = stack.pop()
      if (ops.fnArray[i] === OPS.transform) matrix = Util.transform(matrix, ops.argsArray[i])
      if ([OPS.paintImageXObject, OPS.paintInlineImageXObject].includes(ops.fnArray[i])) images.push([...matrix])
    }
    return { text, images, viewport: first.getViewport({ scale: 1 }) }
  } finally { await task.destroy() }
}
async function manipulate(page, object, mode, dx, dy) {
  await object.click()
  const overlay = page.locator('.pdf-overlay')
  await overlay.scrollIntoViewIfNeeded()
  const sheet = await overlay.boundingBox(), view = await overlay.getAttribute('viewBox')
  const [, , width, height] = view.split(' ').map(Number)
  const objectBox = await object.locator('rect').boundingBox()
  const control = mode === 'scale' ? await page.locator('.pdf-resize-se rect').boundingBox() : objectBox
  const start = { x: control.x + control.width / 2, y: control.y + control.height / 2 }
  const delta = mode === 'scale' ? { x: objectBox.width * dx, y: objectBox.height * dy } : { x: dx * sheet.width / width, y: dy * sheet.height / height }
  await page.mouse.move(start.x, start.y); await page.mouse.down()
  await page.mouse.move(start.x + delta.x, start.y + delta.y, { steps: 6 }); await page.mouse.up()
  await expect(object).toBeVisible()
  await expect(page.getByRole('button', { name: 'PDF herunterladen', exact: true })).toBeEnabled()
}
for (const angle of [0, 90, 180, 270]) {
  test('real pointer text and image geometry survives cropped rotation ' + angle, async ({ page }) => {
    const fixture = await pdfFixture(), pdf = await PDFDocument.load(fixture.buffer)
    pdf.getPage(0).translateContent(40, -20)
    const { PNG } = await import('pngjs')
    const png = new PNG({ width: 2, height: 2 }); png.data.fill(200)
    for (let i = 3; i < png.data.length; i += 4) png.data[i] = 255
    const image = await pdf.embedPng(PNG.sync.write(png))
    pdf.getPage(0).drawImage(image, { x: 150, y: 70, width: 40, height: 30 })
    pdf.getPage(0).setCropBox(20, 10, 260, 200)
    pdf.getPage(0).setRotation({ type: 'degrees', angle })
    const original = await pdf.save(), before = await inspectPdf(original)
    await page.goto('/pdf')
    await page.getByLabel('PDF auswählen', { exact: true }).setInputFiles({ ...fixture, buffer: Buffer.from(original) })
    const object = page.getByRole('button', { name: /^Textobjekt 1:/ })
    await expect(object).toBeVisible()
    await object.dblclick(); await expect(page.getByLabel('Textinhalt', { exact: true })).toBeFocused()
    await manipulate(page, object, 'move', 20, 12)
    const moved = await inspectPdf(await downloadEditor(page))
    const a = before.viewport.convertToPdfPoint(0, 0), b = before.viewport.convertToPdfPoint(20, 12)
    expect(moved.text.transform[4]).toBeCloseTo(before.text.transform[4] + b[0] - a[0], 1)
    expect(moved.text.transform[5]).toBeCloseTo(before.text.transform[5] + b[1] - a[1], 1)
    await page.getByRole('button', { name: 'Rückgängig', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Rückgängig', exact: true })).toBeDisabled()
    await page.getByRole('button', { name: 'Wiederholen', exact: true }).click()
    await manipulate(page, object, 'scale', 0.5, 0.5)
    const textScaled = await inspectPdf(await downloadEditor(page))
    expect(textScaled.text.width / moved.text.width).toBeCloseTo(1.5, 1)
    const imageObject = page.getByRole('button', { name: /^Bildobjekt/ })
    await manipulate(page, imageObject, 'move', 10, 8)
    const imageMoved = await inspectPdf(await downloadEditor(page))
    const c = before.viewport.convertToPdfPoint(10, 8)
    expect(imageMoved.images[0][4]).toBeCloseTo(before.images[0][4] + c[0] - a[0], 1)
    expect(imageMoved.images[0][5]).toBeCloseTo(before.images[0][5] + c[1] - a[1], 1)
    await manipulate(page, imageObject, 'scale', 0.5, 0.5)
    const imageScaled = await inspectPdf(await downloadEditor(page))
    expect(Math.hypot(...imageScaled.images[0].slice(0, 2)) / Math.hypot(...imageMoved.images[0].slice(0, 2))).toBeCloseTo(1.5, 1)
    expect(Math.hypot(...imageScaled.images[0].slice(2, 4)) / Math.hypot(...imageMoved.images[0].slice(2, 4))).toBeCloseTo(1.5, 1)
  })
}

test('captured pointer cancellation rolls back and touch completes exactly one undoable gesture @matrix', async ({ page, browserName }) => {
  await page.goto('/pdf')
  await page.getByLabel('PDF auswählen', { exact: true }).setInputFiles(await pdfFixture())
  const object = page.getByRole('button', { name: /^Textobjekt 1:/ })
  await expect(object).toBeVisible(); await object.click()
  const original = await object.locator('rect').getAttribute('x')
  await page.locator('.pdf-overlay').evaluate(svg => svg.addEventListener('pointerdown', event => { svg.dataset.testPointer = event.pointerId }))
  // Selecting reveals the inspector and can move the target outside a short viewport.
  await object.evaluate(element => element.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' }))
  await expect.poll(() => object.evaluate(element => {
    const box = element.getBoundingClientRect()
    return element.contains(document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2))
  })).toBe(true)
  const box = await object.boundingBox()
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down()
  await page.mouse.move(box.x + box.width / 2 + 20, box.y + box.height / 2 + 10)
  await page.locator('.pdf-overlay').evaluate(svg => svg.releasePointerCapture(Number(svg.dataset.testPointer)))
  await page.mouse.up()
  await expect(object.locator('rect')).toHaveAttribute('x', original)
  await expect(page.getByRole('button', { name: 'Rückgängig', exact: true })).toBeDisabled()
  if (browserName !== 'chromium') return
  await object.scrollIntoViewIfNeeded()
  const touchBox = await object.boundingBox(), cdp = await page.context().newCDPSession(page)
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: touchBox.x + touchBox.width / 2, y: touchBox.y + touchBox.height / 2 }] })
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: touchBox.x + touchBox.width / 2 + 25, y: touchBox.y + touchBox.height / 2 + 15 }] })
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await expect(page.getByRole('button', { name: 'Rückgängig', exact: true })).toBeEnabled()
  await page.getByRole('button', { name: 'Rückgängig', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Rückgängig', exact: true })).toBeDisabled()
  await expect(object.locator('rect')).toHaveAttribute('x', original)
  await cdp.detach()
})

test('noncontiguous page selection exports in document order, rotates once and reorders with drag @matrix', async ({ page }) => {
  const fixture = await pdfFixture(), pdf = await PDFDocument.load(fixture.buffer)
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  for (let i = 2; i <= 4; i++) pdf.addPage([300, 220]).drawText('Page ' + i, { font, x: 40, y: 130, size: 20 })
  await page.goto('/pdf?action=extract')
  await page.getByLabel('PDF auswählen', { exact: true }).setInputFiles({ ...fixture, buffer: Buffer.from(await pdf.save()) })
  await expect(page.getByRole('checkbox', { name: 'Seite 4 auswählen', exact: true })).toBeVisible()
  await page.getByRole('checkbox', { name: 'Seite 3 auswählen', exact: true }).check()
  const pending = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Ausgewählte Seiten herunterladen', exact: true }).click()
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const task = getDocument({ data: new Uint8Array(await readFile(await (await pending).path())), useSystemFonts: true })
  try {
    const doc = await task.promise
    expect(doc.numPages).toBe(2)
    expect((await (await doc.getPage(1)).getTextContent()).items[0].str).toBe('Before')
    expect((await (await doc.getPage(2)).getTextContent()).items[0].str).toBe('Page 3')
  } finally { await task.destroy() }
  await page.getByRole('button', { name: 'Ausgewählte Seiten drehen', exact: true }).click()
  expect((await PDFDocument.load(await downloadEditor(page))).getPages().map(p => p.getRotation().angle)).toEqual([90, 0, 90, 0])
  await page.getByRole('button', { name: 'Rückgängig', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Rückgängig', exact: true })).toBeDisabled()
  await page.getByRole('button', { name: 'Seite nach hinten', exact: true }).click()
  await expect(page.getByRole('checkbox', { name: 'Seite 4 auswählen', exact: true })).toBeChecked()
  await page.getByRole('button', { name: 'Rückgängig', exact: true }).click()
  await page.getByRole('button', { name: 'Alle auswählen', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Ausgewählte Seiten löschen', exact: true })).toBeDisabled()
  await page.getByRole('button', { name: 'Auswahl aufheben', exact: true }).click()
  await page.getByRole('checkbox', { name: 'Seite 2 auswählen', exact: true }).check()
  await page.getByRole('checkbox', { name: 'Seite 4 auswählen', exact: true }).check()
  const source = page.locator('.pdf-page-card').nth(1), target = page.locator('.pdf-page-card').nth(0)
  await page.locator('.pdf-page-list').evaluate(list => {
    window.pdfReorderEvents = []
    window.pdfReorderOver = null
    list.addEventListener('dragover', event => { window.pdfReorderOver = [...list.children].indexOf(event.target.closest('.pdf-page-card')) })
    for (const type of ['dragstart', 'drop']) list.addEventListener(type, event => {
      window.pdfReorderEvents.push({ type, trusted: event.isTrusted, index: [...list.children].indexOf(event.target.closest('.pdf-page-card')) })
    })
  })
  await source.evaluate(element => element.addEventListener('pointermove', event => {
    window.pdfReorderStart = { x: event.clientX, y: event.clientY }
  }, { once: true }))
  await source.hover()
  const start = await page.evaluate(() => window.pdfReorderStart)
  expect(start).toBeDefined()
  await page.mouse.down()
  // Establish a native drag before scrolling changes the source's screen position.
  await page.mouse.move(start.x + 24, start.y, { steps: 6 })
  await expect.poll(() => page.evaluate(() => window.pdfReorderEvents[0]?.type)).toBe('dragstart')
  await target.scrollIntoViewIfNeeded()
  const dropPoint = () => target.evaluate(element => {
    const bounds = element.getBoundingClientRect()
    for (const offset of [.5, .4, .6, .3, .7, .2, .8]) {
      const x = bounds.x + bounds.width / 2, y = bounds.y + bounds.height * offset
      if (element.contains(document.elementFromPoint(x, y))) return { x, y }
    }
    return null
  })
  await expect.poll(dropPoint).not.toBeNull()
  const end = await dropPoint()
  await page.mouse.move(end.x, end.y, { steps: 8 })
  await page.mouse.move(end.x, end.y)
  await expect.poll(() => page.evaluate(() => window.pdfReorderOver)).toBe(0)
  await page.mouse.up()
  await expect.poll(() => page.evaluate(() => window.pdfReorderEvents)).toEqual([
    { type: 'dragstart', trusted: true, index: 1 }, { type: 'drop', trusted: true, index: 0 },
  ])
  await expect(page.getByRole('button', { name: 'Rückgängig', exact: true })).toBeEnabled()
  const reordered = getDocument({ data: await downloadEditor(page), useSystemFonts: true })
  try {
    const document = await reordered.promise
    const texts = []
    for (let index = 1; index <= document.numPages; index++) texts.push((await (await document.getPage(index)).getTextContent()).items.map(item => item.str).join(''))
    expect(texts).toEqual(['Page 2', 'Page 4', 'Before', 'Page 3'])
  } finally { await reordered.destroy() }
  await page.getByRole('button', { name: 'Ausgewählte Seiten löschen', exact: true }).click()
  await expect(page.locator('.pdf-page-card')).toHaveCount(2)
  await expect(page.getByText('0 ausgewählt', { exact: true })).toBeVisible()
})


test('page ranges and direct navigation preserve selections, undo and extracted pages @matrix', async ({ page, context }, testInfo) => {
  const pdf = await PDFDocument.create()
  for (let index = 0; index < 8; index++) pdf.addPage([300 + index, 220])
  const requests = []
  page.on('request', request => requests.push(request))
  await page.goto('/pdf')
  await page.getByLabel('PDF auswählen', { exact: true }).setInputFiles({ name: 'range-fixture.pdf', mimeType: 'application/pdf', buffer: Buffer.from(await pdf.save()) })
  const navigation = page.getByRole('navigation', { name: 'Seitennavigation', exact: true })
  const number = navigation.getByLabel('Seitennummer', { exact: true })
  const range = page.getByLabel('Seitenbereich', { exact: true })
  await expect(number).toHaveValue('1')
  await context.setOffline(true)
  await number.fill('7'); await number.press('Enter')
  await expect(page.locator('.pdf-page-list [aria-current="page"]')).toContainText('Seite 7')
  await expect(range).toHaveValue('1')
  await range.fill('8, 1–2, 2'); await range.press('Enter')
  await expect(range).toHaveValue('1–2, 8')
  await expect(page.locator('.pdf-page-check input:checked')).toHaveCount(3)
  await range.fill('1-9'); await range.press('Enter')
  await expect(range).toHaveAttribute('aria-invalid', 'true')
  await expect(page.locator('.pdf-page-check input:checked')).toHaveCount(3)
  await range.fill('8, 1-2'); await range.press('Enter')
  await number.fill('9'); await number.press('Enter')
  await expect(number).toHaveAttribute('aria-invalid', 'true')
  await navigation.getByRole('button', { name: 'Nächste Seite anzeigen', exact: true }).click()
  await expect(number).toHaveValue('8')
  await expect(navigation.getByRole('button', { name: 'Nächste Seite anzeigen', exact: true })).toBeDisabled()
  await page.getByRole('button', { name: 'Ausgewählte Seiten drehen', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Rückgängig', exact: true })).toBeEnabled()
  await page.getByRole('button', { name: 'Rückgängig', exact: true }).click()
  await expect(range).toHaveValue('1–2, 8')
  await expect(number).toHaveValue('8')
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Ausgewählte Seiten herunterladen', exact: true }).click()
  const extracted = await PDFDocument.load(await readFile(await (await download).path()))
  expect(extracted.getPages().map(item => [item.getWidth(), item.getRotation().angle])).toEqual([[300, 0], [301, 0], [307, 0]])
  await page.getByRole('button', { name: 'Ausgewählte Seiten löschen', exact: true }).click()
  await expect(number).toHaveValue('1')
  await expect(range).toHaveValue('')
  await page.getByRole('button', { name: 'Rückgängig', exact: true }).click()
  await expect(number).toHaveValue('8')
  await expect(range).toHaveValue('1–2, 8')
  await context.setOffline(false)
  await page.getByRole('button', { name: 'English', exact: true }).click()
  await expect(page.getByLabel('Page range', { exact: true })).toHaveValue('1–2, 8')
  await expect(page.getByRole('navigation', { name: 'Page navigation' })).toBeVisible()
  await page.getByRole('combobox', { name: 'Zoom', exact: true }).selectOption('200')
  const viewport = page.getByRole('region', { name: 'PDF page preview', exact: true })
  await viewport.focus()
  await expect(viewport).toBeFocused()
  const scrollAxis = await viewport.evaluate(element => element.scrollHeight > element.clientHeight ? 'vertical' : element.scrollWidth > element.clientWidth ? 'horizontal' : null)
  expect(scrollAxis).not.toBeNull()
  await viewport.press(scrollAxis === 'vertical' ? 'ArrowDown' : 'ArrowRight')
  await expect.poll(() => viewport.evaluate((element, axis) => axis === 'vertical' ? element.scrollTop : element.scrollLeft, scrollAxis)).toBeGreaterThan(0)
  await page.getByRole('combobox', { name: 'Zoom', exact: true }).selectOption('100')

  expect((await new AxeBuilder({ page }).include('.pdf-editor').analyze()).violations).toEqual([])
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false)
  expect(requests.every(request => request.method() === 'GET' && !request.postData())).toBe(true)
  expect(requests.filter(request => /^https?:/.test(request.url())).every(request => new URL(request.url()).origin === new URL(page.url()).origin)).toBe(true)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({ path: testInfo.outputPath('pdf-page-navigation.png'), fullPage: true })
})
