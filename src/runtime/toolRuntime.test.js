import { describe, expect, test } from 'vitest'
import { createToolRuntime, executeTool } from './toolRuntime'
import { PDFDocument } from 'pdf-lib'
import { TOOL_LIMITS } from './limits'
import { pdfConverters } from '../converters/pdf'
import { qrConverters } from '../converters/qr'

function deferred() {
  let resolve
  const promise = new Promise((done) => { resolve = done })
  return { promise, resolve }
}

describe('executeTool', () => {
  test('rejects a corrupt PDF with a stable content-free error', async () => {
    const file = new File(['private payload belonging to Alice'], 'alice-secret.pdf', { type: 'application/pdf' })
    const tool = {
      acceptTypes: 'application/pdf,.pdf',
      limits: TOOL_LIMITS.pdf,
      multipleFiles: false,
      fileConvert: async () => ({ kind: 'text', text: 'unreachable' }),
    }

    await expect(executeTool({ tool, files: [file], text: '' })).rejects.toMatchObject({
      code: 'invalid_file',
      messageKey: 'errors.invalidFile',
      message: 'invalid_file',
    })
    await expect(executeTool({ tool, files: [file], text: '' })).rejects.not.toHaveProperty(
      'message',
      expect.stringContaining('alice-secret.pdf'),
    )
  })

  test('normalizes fractional, percentage, and out-of-range progress', async () => {
    const progress = []
    const tool = {
      convert: async (_text, { onProgress }) => {
        onProgress(0.25)
        onProgress(40)
        onProgress(140)
        return 'done'
      },
    }

    await expect(executeTool({ tool, text: 'input', onProgress: (value) => progress.push(value) }))
      .resolves.toEqual({ kind: 'text', text: 'done' })
    expect(progress).toEqual([25, 40, 100])
  })

  test('aborts, detaches progress, and requests converter termination', async () => {
    const gate = deferred()
    const controller = new AbortController()
    let emitProgress
    let terminated = 0
    const progress = []
    const tool = {
      convert: async (_text, context) => {
        emitProgress = context.onProgress
        await gate.promise
        return 'late result'
      },
      terminate: () => { terminated += 1 },
    }

    const execution = executeTool({
      tool,
      text: 'input',
      signal: controller.signal,
      onProgress: (value) => progress.push(value),
    })
    await Promise.resolve()
    emitProgress(10)
    controller.abort()
    emitProgress(90)
    gate.resolve()

    await expect(execution).rejects.toMatchObject({ code: 'cancelled', messageKey: 'errors.cancelled' })
    expect(progress).toEqual([10])
    expect(terminated).toBe(1)
  })

  test('detaches the abort listener after a successful run', async () => {
    const controller = new AbortController()
    let terminated = 0
    const tool = {
      convert: async () => 'done',
      terminate: () => { terminated += 1 },
    }

    await expect(executeTool({ tool, text: 'input', signal: controller.signal }))
      .resolves.toEqual({ kind: 'text', text: 'done' })
    controller.abort()

    expect(terminated).toBe(0)
  })
})

test('released PDF converters return reusable Blob results', async () => {
  async function onePagePdf(label) {
    const document = await PDFDocument.create()
    document.addPage([200, 100]).drawText(label)
    return new File([await document.save()], `${label}.pdf`, { type: 'application/pdf' })
  }
  const first = await onePagePdf('first')
  const second = await onePagePdf('second')
  const mergeTool = pdfConverters.find((tool) => tool.id === 'merge-pdf')
  const rotateTool = pdfConverters.find((tool) => tool.id === 'pdf-rotate')

  const merged = await executeTool({ tool: mergeTool, files: [first, second] })
  expect(merged).toMatchObject({ kind: 'download', filename: 'merged.pdf' })
  expect(merged.blob).toBeInstanceOf(Blob)
  expect((await PDFDocument.load(await merged.blob.arrayBuffer())).getPageCount()).toBe(2)

  const rotated = await executeTool({ tool: rotateTool, files: [first], text: '90' })
  expect(rotated).toMatchObject({ kind: 'download', filename: 'first_rotated90.pdf' })
  expect((await PDFDocument.load(await rotated.blob.arrayBuffer())).getPage(0).getRotation().angle).toBe(90)
})

test('the released QR generator returns an image Blob rather than an unmanaged URL', async () => {
  const tool = qrConverters.find((entry) => entry.id === 'text-to-qr')
  const result = await executeTool({ tool, text: 'Folkkit QR fixture' })

  expect(result).toMatchObject({ kind: 'image', filename: 'folkkit-qr.svg' })
  expect(result.blob.type).toBe('image/svg+xml')
  expect(await result.blob.text()).toContain('<svg')
})

test('a newer run suppresses a late older result and revokes its previous URL', async () => {
  const first = deferred()
  const revoked = []
  let nextUrl = 0
  const runtime = createToolRuntime({
    execute: ({ text }) => text === 'first'
      ? first.promise
      : Promise.resolve({ kind: 'download', blob: new Blob(['new']), filename: 'new.txt' }),
    urlApi: {
      createObjectURL: () => `blob:result-${++nextUrl}`,
      revokeObjectURL: (url) => revoked.push(url),
    },
  })

  const oldRun = runtime.run({ tool: {}, text: 'first' })
  const newRun = await runtime.run({ tool: {}, text: 'second' })
  first.resolve({ kind: 'text', text: 'stale' })

  await expect(oldRun).resolves.toBeNull()
  expect(newRun).toMatchObject({ result: { kind: 'download', filename: 'new.txt' }, url: 'blob:result-1' })
  runtime.reset()
  expect(revoked).toEqual(['blob:result-1'])
})

test('manual downloads also receive URLs from the runtime owner and replace prior URLs', () => {
  const revoked = []
  let nextUrl = 0
  const runtime = createToolRuntime({
    urlApi: {
      createObjectURL: () => `blob:manual-${++nextUrl}`,
      revokeObjectURL: (url) => revoked.push(url),
    },
  })

  const first = runtime.present({ kind: 'download', blob: new Blob(['one']), filename: 'one.txt' })
  const second = runtime.present({ kind: 'download', blob: new Blob(['two']), filename: 'two.txt' })

  expect(first.url).toBe('blob:manual-1')
  expect(second.url).toBe('blob:manual-2')
  expect(revoked).toEqual(['blob:manual-1'])
})
