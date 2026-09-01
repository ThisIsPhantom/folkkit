import { afterEach, describe, expect, test, vi } from 'vitest'
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

afterEach(() => {
  vi.unstubAllGlobals()
})

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
        return { kind: 'text', text: 'done' }
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
        return { kind: 'text', text: 'late result' }
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
      convert: async () => ({ kind: 'text', text: 'done' }),
      terminate: () => { terminated += 1 },
    }

    await expect(executeTool({ tool, text: 'input', signal: controller.signal }))
      .resolves.toEqual({ kind: 'text', text: 'done' })
    controller.abort()

    expect(terminated).toBe(0)
  })

  test('rejects a corrupt PNG before calling the image converter', async () => {
    let conversionCalls = 0
    const tool = {
      acceptTypes: 'image/*',
      limits: TOOL_LIMITS.images,
      fileConvert: async () => {
        conversionCalls += 1
        return { kind: 'text', text: 'unreachable' }
      },
    }
    const file = new File(['private non-image bytes'], 'private.png', { type: 'image/png' })

    await expect(executeTool({ tool, files: [file] })).rejects.toMatchObject({ code: 'invalid_file' })
    expect(conversionCalls).toBe(0)
  })

  test.each([
    {
      value: { kind: 'text', text: 'safe', info: 'details' },
      expected: { kind: 'text', text: 'safe', info: 'details' },
    },
    {
      value: { kind: 'download', blob: new Blob(['download']), filename: 'result.bin', info: 'details' },
      expected: { kind: 'download', blob: expect.any(Blob), filename: 'result.bin', info: 'details' },
    },
    {
      value: { kind: 'image', blob: new Blob(['image']), filename: 'result.png' },
      expected: { kind: 'image', blob: expect.any(Blob), filename: 'result.png' },
    },
  ])('accepts the exact declared fields for $value.kind results', async ({ value, expected }) => {
    await expect(executeTool({ tool: { convert: async () => value }, text: 'input' })).resolves.toEqual(expected)
  })

  test.each([
    { kind: 'download', blob: new Blob(['x']), filename: '' },
    { kind: 'image', blob: new Blob(['x']), filename: '   ' },
    { kind: 'download', blob: 'not-a-blob', filename: 'result.bin' },
    { kind: 'text', text: 42 },
    { kind: 'text', text: 'safe', info: 42 },
    { kind: 'unknown', text: 'safe' },
    { blob: new Blob(['legacy']), filename: 'legacy.bin' },
    { kind: 'text', text: 'safe', filename: 'extra.txt' },
    { kind: 'download', blob: new Blob(['x']), filename: 'result.bin', url: 'blob:extra' },
    { kind: 'image', blob: new Blob(['x']), filename: 'result.png', payload: 'extra' },
  ])('rejects malformed ToolResult %#', async (value) => {
    await expect(executeTool({ tool: { convert: async () => value }, text: 'input' }))
      .rejects.toMatchObject({ code: 'conversion_failed', messageKey: 'errors.conversionFailed' })
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

test.each([
  { label: 'success', detect: async () => [{ rawValue: 'decoded' }], expected: 'decoded' },
  { label: 'failure', detect: async () => { throw new Error('decode failed') }, expected: null },
])('QR reader closes its ImageBitmap after $label', async ({ detect, expected }) => {
  let closeCount = 0
  vi.stubGlobal('createImageBitmap', async () => ({ close: () => { closeCount += 1 } }))
  vi.stubGlobal('BarcodeDetector', class {
    async detect(bitmap) { return detect(bitmap) }
  })
  const file = new File([
    new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  ], 'qr.png', { type: 'image/png' })
  const tool = qrConverters.find((entry) => entry.id === 'qr-to-text')

  if (expected) {
    await expect(executeTool({ tool, files: [file] })).resolves.toEqual({ kind: 'text', text: expected })
  } else {
    await expect(executeTool({ tool, files: [file] })).rejects.toMatchObject({ code: 'invalid_file' })
  }
  expect(closeCount).toBe(1)
})

test.each([
  { label: 'success', failDraw: false },
  { label: 'failure', failDraw: true },
])('images-to-PDF closes its fallback ImageBitmap after $label', async ({ failDraw }) => {
  let closeCount = 0
  vi.stubGlobal('createImageBitmap', async () => ({
    width: 1,
    height: 1,
    close: () => { closeCount += 1 },
  }))
  const pngBytes = Uint8Array.from(
    atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9ZQmcAAAAASUVORK5CYII='),
    character => character.charCodeAt(0),
  )
  vi.stubGlobal('OffscreenCanvas', class {
    getContext() {
      return {
        drawImage() {
          if (failDraw) throw new Error('draw failed')
        },
      }
    }
    async convertToBlob() { return new Blob([pngBytes], { type: 'image/png' }) }
  })
  const file = new File(['webp fixture'], 'image.webp', { type: 'image/webp' })
  const tool = pdfConverters.find((entry) => entry.id === 'images-to-pdf')

  if (failDraw) {
    await expect(tool.fileConvert([file])).rejects.toThrow('draw failed')
  } else {
    await expect(tool.fileConvert([file])).resolves.toMatchObject({
      kind: 'download',
      filename: 'combined.pdf',
    })
  }
  expect(closeCount).toBe(1)
})

test.each([
  new File(['not a webp'], 'invalid.webp', { type: 'image/webp' }),
  new File([
    new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  ], 'mismatch.png', { type: 'image/webp' }),
])('released QR rejects unsupported or mismatched WebP before decoding', async (file) => {
  let bitmapCalls = 0
  vi.stubGlobal('createImageBitmap', async () => {
    bitmapCalls += 1
    return { close() {} }
  })
  vi.stubGlobal('BarcodeDetector', class {
    async detect() { return [{ rawValue: 'must not decode' }] }
  })
  const tool = qrConverters.find((entry) => entry.id === 'qr-to-text')

  await expect(executeTool({ tool, files: [file] })).rejects.toMatchObject({ code: 'unsupported_type' })
  expect(bitmapCalls).toBe(0)
})

test('released images-to-PDF accepts real PNG and JPEG fixtures', async () => {
  const png = bytesFromBase64('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9ZQmcAAAAASUVORK5CYII=')
  const jpeg = bytesFromBase64('/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKpAB//Z')
  const tool = pdfConverters.find((entry) => entry.id === 'images-to-pdf')

  const result = await executeTool({
    tool,
    files: [
      new File([png], 'one.png', { type: 'image/png' }),
      new File([jpeg], 'two.jpg', { type: 'image/jpeg' }),
    ],
  })

  expect(result).toMatchObject({ kind: 'download', filename: 'combined.pdf' })
  expect((await PDFDocument.load(await result.blob.arrayBuffer())).getPageCount()).toBe(2)
})

function bytesFromBase64(value) {
  return Uint8Array.from(atob(value), character => character.charCodeAt(0))
}

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

test('manual presentation enforces and sanitizes the exact ToolResult union', () => {
  const runtime = createToolRuntime({
    urlApi: {
      createObjectURL: () => 'blob:manual',
      revokeObjectURL: () => {},
    },
  })

  expect(() => runtime.present({ kind: 'download', blob: new Blob(['x']), filename: '' }))
    .toThrow(expect.objectContaining({ code: 'conversion_failed' }))
  expect(() => runtime.present({
    kind: 'download',
    blob: new Blob(['x']),
    filename: 'extra.txt',
    payload: 'undeclared',
  })).toThrow(expect.objectContaining({ code: 'conversion_failed' }))
  expect(runtime.present({
    kind: 'download',
    blob: new Blob(['safe']),
    filename: 'safe.txt',
  }).result).toEqual({
    kind: 'download',
    blob: expect.any(Blob),
    filename: 'safe.txt',
  })
})
