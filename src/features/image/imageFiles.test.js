import { afterEach, describe, expect, it, vi } from 'vitest'
import { loadImageFile } from './imageFiles.js'

function pngFile(width = 120, height = 80, name = 'source.png', type = 'image/png') {
  const bytes = new Uint8Array(24)
  bytes.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  const view = new DataView(bytes.buffer); view.setUint32(16, width); view.setUint32(20, height)
  return new File([bytes], name, { type })
}

describe('image file loading', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('accepts only matching PNG, JPEG and WebP signatures, MIME types and extensions', async () => {
    const close = vi.fn()
    vi.stubGlobal('createImageBitmap', vi.fn(async () => ({ width: 120, height: 80, close })))
    await expect(loadImageFile(pngFile())).resolves.toMatchObject({ kind: 'png', width: 120, height: 80 })
    expect(close).not.toHaveBeenCalled()
    await expect(loadImageFile(pngFile(120, 80, 'source.jpg'))).rejects.toMatchObject({ code: 'type_mismatch' })
    await expect(loadImageFile(pngFile(120, 80, 'source.png', 'image/gif'))).rejects.toMatchObject({ code: 'type_mismatch' })
    await expect(loadImageFile(new File([Uint8Array.from([0x47, 0x49, 0x46])], 'source.gif', { type: 'image/gif' }))).rejects.toMatchObject({ code: 'unsupported_type' })
  })

  it('rejects a late decode after abort and closes the decoded bitmap', async () => {
    let release
    const close = vi.fn()
    vi.stubGlobal('createImageBitmap', vi.fn(() => new Promise(resolve => { release = () => resolve({ width: 120, height: 80, close }) })))
    const controller = new AbortController()
    const pending = loadImageFile(pngFile(), { signal: controller.signal })
    await vi.waitFor(() => expect(release).toBeTypeOf('function'))
    controller.abort(); release()
    await expect(pending).rejects.toMatchObject({ code: 'cancelled' })
    expect(close).toHaveBeenCalledOnce()
  })

  it('uses the strict four-megapixel watermark budget', async () => {
    vi.stubGlobal('createImageBitmap', vi.fn(async () => ({ width: 2000, height: 2000, close: vi.fn() })))
    await expect(loadImageFile(pngFile(2000, 2000, 'mark.png'), { role: 'watermark' })).resolves.toMatchObject({ width: 2000, height: 2000 })
    await expect(loadImageFile(pngFile(2001, 2000, 'mark.png'), { role: 'watermark' })).rejects.toMatchObject({ code: 'resource_limit' })
  })
})
