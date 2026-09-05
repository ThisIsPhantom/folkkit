// @vitest-environment node
import { afterEach, expect, test } from 'vitest'
import { PDFDocument, PDFDict, PDFName, StandardFonts, rgb } from 'pdf-lib'
import { readFile } from 'node:fs/promises'
import { toPdfPoint, toViewPoint } from './pdfGeometry.js'

const engines = []
afterEach(() => engines.splice(0).forEach(engine => engine.close()))

async function fixture() {
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([300, 200])
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  page.drawText('Before', { x: 40, y: 110, size: 20, font })
  page.drawRectangle({ x: 200, y: 20, width: 30, height: 30, color: rgb(0, 0.5, 0) })
  return pdf.save()
}

async function makeEngine() {
  const { PdfEngine } = await import('./pdfEngine.js')
  const { init } = await import('@embedpdf/pdfium')
  const engine = new PdfEngine(await init())
  engines.push(engine)
  engine.open(await fixture())
  return engine
}

test('adds real text, vector drawings and image objects and updates image geometry', async () => {
  const engine = await makeEngine()
  expect(engine.addText).toBeTypeOf('function')
  engine.addText(0, { text: 'Added', x: 20, y: 30, size: 12, color: '#112233' })
  engine.addDrawing(0, { kind: 'rectangle', points: [[100, 30], [130, 70]], color: '#123456', width: 2 })
  engine.addImage(0, { pixels: new Uint8ClampedArray([255, 0, 0, 255]), width: 1, height: 1, x: 50, y: 50, displayWidth: 20, displayHeight: 20 })
  const objects = engine.objects(0)
  expect(objects.filter(item => item.type === 'text').map(item => item.text)).toEqual(['Before', 'Added'])
  const image = objects.find(item => item.type === 'image')
  expect(image).toBeDefined()
  engine.transformObject(0, image.index, { dx: 20, dy: 10, scale: 2 })
  engine.open(engine.save())
  expect(engine.objects(0).find(item => item.type === 'image').bounds[0]).toBeCloseTo(70)
})

test('reorders, rotates, duplicates, deletes, extracts, merges and adds blank pages', async () => {
  const engine = await makeEngine()
  expect(engine.pageAction).toBeTypeOf('function')
  engine.pageAction('blank', 1)
  engine.addText(1, { text: 'Second', x: 20, y: 20, size: 12, color: '#000000' })
  engine.pageAction('duplicate', 0)
  expect(engine.metadata().pages).toHaveLength(3)
  engine.pageAction('move', 2, 0)
  expect(engine.objects(0).some(item => item.text === 'Second')).toBe(true)
  engine.pageAction('rotate', 0)
  expect(engine.metadata().pages[0].rotation).toBe(1)
  const extracted = engine.extract([0])
  expect((await PDFDocument.load(extracted)).getPageCount()).toBe(1)
  engine.pageAction('delete', 0)
  engine.merge(extracted)
  expect(engine.metadata().pages).toHaveLength(3)
})

test('rejects malformed input and unsafe allocations while retaining a valid document', async () => {
  const engine = await makeEngine()
  expect(() => engine.open(new Uint8Array(20))).toThrow('invalid_file')
  expect(() => engine.render(0, { scale: 1000 })).toThrow('resource_limit')
  expect(engine.render(0, { scale: 300 / 72 }).width).toBe(1250)
  expect(engine.metadata().pages).toHaveLength(1)
})

test('subset-named fonts are excluded from text replacement', async () => {
  const pdf = await PDFDocument.load(await fixture())
  const fonts = pdf.getPage(0).node.Resources().lookup(PDFName.of('Font'), PDFDict)
  for (const name of fonts.keys()) fonts.lookup(name, PDFDict).set(PDFName.of('BaseFont'), PDFName.of('ABCDEF+Helvetica'))
  const engine = await makeEngine()
  engine.open(await pdf.save())
  expect(engine.objects(0)[0].editable).toBe(false)
  expect(() => engine.replaceText(0, 0, 'After')).toThrow('unsupported_text')
})

test('uses the native viewport transform for rotated pages with a nonzero crop origin', async () => {
  const pdf = await PDFDocument.load(await fixture())
  pdf.getPage(0).setCropBox(20, 30, 250, 150)
  const engine = await makeEngine()
  engine.open(await pdf.save())
  const page = engine.metadata().pages[0]
  expect(page.viewToPdf).toHaveLength(6)
  expect(toPdfPoint([0, page.height], page)).toEqual([20, 30])
  expect(toViewPoint([20, 30], page)[0]).toBeCloseTo(0); expect(toViewPoint([20, 30], page)[1]).toBeCloseTo(page.height)
  engine.pageAction('rotate', 0)
  const rotated = engine.metadata().pages[0]
  const point = toPdfPoint([50, 70], rotated)
  expect(toViewPoint(point, rotated)).toEqual([50, 70])
})

test('replaces German Latin1 text in a standard font and a reusable full embedded font', async () => {
  const engine = await makeEngine()
  engine.replaceText(0, 0, 'Grüsse für Jörg')
  expect(engine.objects(0)[0].text).toBe('Grüsse für Jörg')
  const fontData = new Uint8Array(await readFile(new URL('../../../node_modules/pdfjs-dist/standard_fonts/LiberationSans-Regular.ttf', import.meta.url).pathname.replace(/^\/(\w:)/, '$1')).catch(() => readFile('node_modules/pdfjs-dist/standard_fonts/LiberationSans-Regular.ttf')))
  engine.allocation(fontData.length, pointer => {
    engine.heap.HEAPU8.set(fontData, pointer)
    const font = engine.api.FPDFText_LoadFont(engine.document, pointer, fontData.length, 2, true)
    expect(font).toBeTruthy()
    engine.page(0, page => {
      const object = engine.api.FPDFPageObj_CreateTextObj(engine.document, font, 16)
      engine.allocation(14, textPointer => {
        engine.heap.HEAPU16.set([66, 101, 102, 111, 114, 101, 0], textPointer / 2)
        expect(engine.api.FPDFText_SetText(object, textPointer)).toBeTruthy()
      })
      engine.api.FPDFPageObj_Transform(object, 1, 0, 0, 1, 20, 60)
      engine.api.FPDFPage_InsertObject(page, object)
      engine.api.FPDFPage_GenerateContent(page)
    })
  })
  engine.open(engine.save())
  const embedded = engine.objects(0).find(item => item.embedded)
  expect(embedded).toMatchObject({ editable: true })
  engine.replaceText(0, embedded.index, 'Über Grösse')
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const task = getDocument({ data: engine.save(), useSystemFonts: true })
  try {
    const doc = await task.promise
    const text = (await (await doc.getPage(1)).getTextContent()).items.map(item => item.str).join(' ')
    expect(text).toContain('Über Grösse')
    expect(text).not.toContain('Before')
  } finally { await task.destroy() }
  expect(() => engine.replaceText(0, embedded.index, '漢字')).toThrow('unsupported_text')
})

test('scan-only pages expose no editable text and rotated text is honestly unsupported', async () => {
  const engine = await makeEngine()
  engine.removeObject(0, 0)
  engine.addImage(0, { pixels: new Uint8ClampedArray([0, 0, 0, 255]), width: 1, height: 1, x: 20, y: 30, displayWidth: 100, displayHeight: 100 })
  expect(engine.objects(0).some(item => item.type === 'text')).toBe(false)
  engine.addText(0, { text: 'Rotated', x: 20, y: 20 })
  engine.page(0, page => {
    const object = engine.api.FPDFPage_GetObject(page, 2)
    engine.api.FPDFPageObj_Transform(object, 0, 1, -1, 0, 100, 0)
    engine.api.FPDFPage_GenerateContent(page)
  })
  expect(engine.objects(0).find(item => item.type === 'text').editable).toBe(false)
})

test('native notes and all vector annotation tools survive independent export reopening', async () => {
  const engine = await makeEngine()
  engine.addNote(0, { text: 'Private local note', x: 20, y: 30 })
  for (const kind of ['highlight', 'underline', 'draw', 'signature', 'line', 'rectangle', 'ellipse']) {
    engine.addDrawing(0, { kind, points: [[30, 30], [100, 60]], color: '#e0a020', width: 2 })
  }
  const bytes = engine.save()
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const loading = getDocument({ data: bytes.slice(), useSystemFonts: true })
  try {
    const doc = await loading.promise
    const page = await doc.getPage(1)
    const notes = await page.getAnnotations()
    expect(notes).toHaveLength(1)
    expect(notes[0].contentsObj.str).toBe('Private local note')
    expect((await page.getOperatorList()).fnArray.length).toBeGreaterThan(20)
  } finally { await loading.destroy() }
  engine.open(bytes)
  expect(engine.objects(0)).toHaveLength(9)
})

test('replaces the existing text object, exports and preserves unrelated pixels', async () => {
  const modulePath = './pdfEngine.js'
  const module = await import(/* @vite-ignore */ modulePath).catch(() => null)
  expect(module?.PdfEngine, 'real PDF editing engine is implemented').toBeTypeOf('function')
  const { init } = await import('@embedpdf/pdfium')
  const engine = new module.PdfEngine(await init())
  engines.push(engine)
  const original = await fixture()
  engine.open(original)
  const before = engine.render(0, { scale: 1 })
  const [object] = engine.objects(0).filter(item => item.type === 'text')
  expect(object).toMatchObject({ text: 'Before', editable: true })
  engine.replaceText(0, object.index, 'After')
  const output = engine.save()
  const reopened = await PDFDocument.load(output)
  expect(reopened.getPageCount()).toBe(1)
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const loading = getDocument({ data: output.slice(), useSystemFonts: true })
  const independent = await loading.promise
  expect((await (await independent.getPage(1)).getTextContent()).items.map(item => item.str).join('')).toBe('After')
  await loading.destroy()
  engine.open(output)
  const after = engine.render(0, { scale: 1 })
  const outsideBefore = [], outsideAfter = []
  for (let y = 0; y < before.height; y++) for (let x = 0; x < before.width; x++) {
    if (x >= 35 && x <= 115 && y >= 65 && y <= 95) continue
    const start = (y * before.width + x) * 4
    outsideBefore.push(...before.pixels.subarray(start, start + 4))
    outsideAfter.push(...after.pixels.subarray(start, start + 4))
  }
  expect(new Uint8Array(outsideAfter)).toEqual(new Uint8Array(outsideBefore))
  expect(engine.objects(0).filter(item => item.type === 'text')).toHaveLength(1)
})
