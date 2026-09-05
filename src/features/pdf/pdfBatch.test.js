// @vitest-environment node
import { expect, test } from 'vitest'
import { PDFDocument, StandardFonts } from 'pdf-lib'
import { init } from '@embedpdf/pdfium'
import { PdfEngine } from './pdfEngine.js'
import { PdfSession } from './pdfSession.js'

async function sessionFixture(form = false) {
  const pdf = await PDFDocument.create(), font = await pdf.embedFont(StandardFonts.Helvetica)
  for (let i = 0; i < 4; i++) pdf.addPage([300, 200]).drawText(`Page ${i + 1}`, { font, x: 20, y: 100 })
  if (form) pdf.getForm().createTextField('Preserved').addToPage(pdf.getPage(2), { x: 10, y: 10, width: 90, height: 20 })
  const session = new PdfSession(new PdfEngine(await init()))
  session.open(await pdf.save()); return session
}
test('batch rotation and reorder have one undo step and noncontiguous extraction follows document order', async () => {
  const session = await sessionFixture()
  try {
    session.change('batchPageAction', ['rotate', [2, 0]])
    expect(session.state().pages.map(p => p.rotation)).toEqual([1, 0, 1, 0])
    expect(session.history).toHaveLength(1)
    session.undo(); expect(session.state().pages.every(p => p.rotation === 0)).toBe(true)
    session.change('reorderPages', [[2, 0, 1, 3]])
    const output = await PDFDocument.load(session.engine.extract([3, 0]))
    expect(output.getPageCount()).toBe(2)
    const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs')
    const task = getDocument({ data: session.engine.extract([3, 0]), useSystemFonts: true })
    try {
      const doc = await task.promise
      expect((await (await doc.getPage(1)).getTextContent()).items[0].str).toBe('Page 3')
      expect((await (await doc.getPage(2)).getTextContent()).items[0].str).toBe('Page 4')
    } finally { await task.destroy() }
    session.undo(); expect(session.engine.objects(0)[0].text).toBe('Page 1')
    session.change('batchPageAction', ['delete', [2, 0]])
    expect(session.state().pages).toHaveLength(2)
    expect(session.engine.objects(0)[0].text).toBe('Page 2')
    session.undo(); expect(session.state().pages).toHaveLength(4)
  } finally { session.close() }
})
test('unsafe batch deletion rolls back all pages and leaves form fields and history intact', async () => {
  const session = await sessionFixture(true)
  try {
    expect(() => session.change('batchPageAction', ['delete', [0, 2, 3]])).toThrow('unsupported_structure')
    expect(session.state().pages).toHaveLength(4); expect(session.history).toHaveLength(0)
    expect((await PDFDocument.load(session.engine.save())).getForm().getTextField('Preserved')).toBeDefined()
    expect(() => session.change('batchPageAction', ['delete', [0, 1, 2, 3]])).toThrow('last_page')
    expect(() => session.engine.extract([0, 2])).toThrow('unsupported_structure')
  } finally { session.close() }
})

test('a failure halfway through a batch restores native bytes and creates no history', async () => {
  const session = await sessionFixture()
  try {
    const nativeAction = session.engine.pageAction.bind(session.engine)
    let calls = 0
    session.engine.pageAction = (...args) => {
      if (++calls === 2) throw new Error('native failure')
      return nativeAction(...args)
    }
    expect(() => session.change('batchPageAction', ['rotate', [0, 2]])).toThrow('invalid_file')
    expect(session.state().pages.map(p => p.rotation)).toEqual([0, 0, 0, 0])
    expect(session.state()).toMatchObject({ dirty: false, canUndo: false })
    expect(session.engine.objects(0)[0].text).toBe('Page 1')
  } finally { session.close() }
})
test('batch rotation and native permutation retain the existing form dictionary', async () => {
  const session = await sessionFixture(true)
  try {
    session.change('batchPageAction', ['rotate', [0, 2]])
    session.change('reorderPages', [[2, 0, 3, 1]])
    const pdf = await PDFDocument.load(session.engine.save())
    expect(pdf.getForm().getFields().map(field => field.getName())).toEqual(['Preserved'])
    expect(pdf.getPages().map(page => page.getRotation().angle)).toEqual([90, 90, 0, 0])
    session.undo(); session.undo()
    expect(session.state().dirty).toBe(false)
  } finally { session.close() }
})
