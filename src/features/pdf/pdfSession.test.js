// @vitest-environment node
import { expect, test } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { init } from '@embedpdf/pdfium'
import { PdfEngine } from './pdfEngine.js'

test('undo and redo restore actual PDF bytes; errors roll back and original stays intact', async () => {
  const modulePath = './pdfSession.js'
  const module = await import(/* @vite-ignore */ modulePath).catch(() => null)
  expect(module?.PdfSession).toBeTypeOf('function')
  const pdf = await PDFDocument.create()
  pdf.addPage([200, 200])
  const original = await pdf.save()
  const session = new module.PdfSession(new PdfEngine(await init()))
  try {
    session.open(original)
    session.change('addText', [0, { text: 'Added', x: 10, y: 100 }])
    expect(session.state()).toMatchObject({ dirty: true, canUndo: true, canRedo: false })
    session.undo()
    expect(session.engine.objects(0)).toHaveLength(0)
    session.redo()
    expect(session.engine.objects(0)[0].text).toBe('Added')
    expect(() => session.change('replaceText', [0, 0, '😀'])).toThrow('unsupported_text')
    expect(session.engine.objects(0)[0].text).toBe('Added')
    expect(session.original).toEqual(original)
    session.markSaved()
    expect(session.state().dirty).toBe(false)
    expect(() => session.change('__proto__', [])).toThrow('invalid_file')
  } finally { session.close() }
})

test('a cancelled worker can restore a bounded committed checkpoint including dirty state and undo', async () => {
  const { PdfSession } = await import('./pdfSession.js')
  const api = await init()
  const session = new PdfSession(new PdfEngine(api))
  const restored = new PdfSession(new PdfEngine(api))
  try {
    const pdf = await PDFDocument.create(); pdf.addPage([200, 200])
    session.open(await pdf.save())
    session.change('addText', [0, { text: 'Keep this edit', x: 20, y: 100 }])
    expect(session.checkpoint).toBeTypeOf('function')
    const checkpoint = session.checkpoint()
    session.change('addText', [0, { text: 'Cancelled edit', x: 20, y: 50 }])
    session.close()
    restored.restore(checkpoint)
    expect(restored.engine.objects(0).map(item => item.text)).toEqual(['Keep this edit'])
    expect(restored.state()).toMatchObject({ dirty: true, canUndo: true })
    restored.undo()
    expect(restored.engine.objects(0)).toHaveLength(0)
    const size = checkpoint.bytes.length + checkpoint.original.length + [...checkpoint.history, ...checkpoint.future].reduce((sum, item) => sum + item.bytes.length, 0)
    expect(size).toBeLessThanOrEqual(64 * 1024 * 1024)
  } finally { session.close(); restored.close() }
})
