// @vitest-environment node
import { afterEach, expect, test } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { init } from '@embedpdf/pdfium'
import { PdfEngine } from './pdfEngine.js'
import { PdfSession } from './pdfSession.js'

const sessions = []
afterEach(() => sessions.splice(0).forEach(session => session.close()))
async function fixture(form = true) {
  const pdf = await PDFDocument.create()
  pdf.setTitle('Keep document title')
  pdf.setAuthor('Synthetic fixture')
  const first = pdf.addPage([300, 220]); pdf.addPage([400, 250]); pdf.addPage([500, 300])
  if (form) {
    const field = pdf.getForm().createTextField('customer')
    field.setText('Original')
    field.addToPage(first, { x: 30, y: 80, width: 120, height: 25 })
  }
  return pdf.save()
}
async function session(bytes) {
  const result = new PdfSession(new PdfEngine(await init()))
  result.open(bytes); sessions.push(result); return result
}
async function assertPreserved(engine, count, hasForm = true) {
  const pdf = await PDFDocument.load(engine.save())
  expect(pdf.getTitle()).toBe('Keep document title')
  expect(pdf.getAuthor()).toBe('Synthetic fixture')
  expect(pdf.getPageCount()).toBe(count)
  if (hasForm) {
    expect(pdf.getForm().getFields().map(field => field.getName())).toEqual(['customer'])
    expect(pdf.getForm().getTextField('customer').getText()).toBe('Original')
  }
  return pdf
}

test('moving pages retains existing AcroForm values and document metadata through session saves', async () => {
  const state = await session(await fixture())
  state.change('pageAction', ['move', 0, 2])
  const pdf = await assertPreserved(state.engine, 3)
  expect(pdf.getPages().map(page => page.getWidth())).toEqual([400, 500, 300])
  expect(pdf.getForm().getTextField('customer').acroField.getWidgets()[0].P().toString()).toBe(pdf.getPages()[2].ref.toString())
  state.undo(); await assertPreserved(state.engine, 3)
  state.redo(); await assertPreserved(state.engine, 3)
})
test('deleting a page without widgets retains the form on another page and metadata', async () => {
  const state = await session(await fixture())
  state.change('pageAction', ['delete', 2])
  await assertPreserved(state.engine, 2)
})
test('duplicating a plain page retains the original document metadata', async () => {
  const state = await session(await fixture(false))
  state.change('pageAction', ['duplicate', 0])
  const pdf = await assertPreserved(state.engine, 4, false)
  expect(pdf.getPages().map(page => page.getWidth())).toEqual([300, 300, 400, 500])
})
test('unsafe form duplication, widget-page deletion and form extraction are rejected without changing input', async () => {
  const state = await session(await fixture())
  for (const action of ['duplicate', 'delete']) {
    expect(() => state.change('pageAction', [action, 0])).toThrow('unsupported_structure')
    await assertPreserved(state.engine, 3)
    expect(state.state().dirty).toBe(false)
  }
  expect(() => state.engine.extract([0])).toThrow('unsupported_structure')
})
test('merge preserves destination forms and metadata, but rejects form-bearing incoming PDFs', async () => {
  const state = await session(await fixture())
  state.change('merge', [await fixture(false)])
  await assertPreserved(state.engine, 6)
  expect(() => state.change('merge', [state.original])).toThrow('unsupported_structure')
  await assertPreserved(state.engine, 6)
})
