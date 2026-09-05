import { expect, test, vi } from 'vitest'
import { readPdfImage } from './pdfFiles.js'

test('rejects oversized image dimensions before asking the browser to decode pixels', async () => {
  const bytes = new Uint8Array(40)
  bytes.set([137, 80, 78, 71, 13, 10, 26, 10])
  const view = new DataView(bytes.buffer)
  view.setUint32(16, 100000); view.setUint32(20, 100000)
  const decode = vi.fn().mockRejectedValue(new Error('decode must not be called'))
  vi.stubGlobal('createImageBitmap', decode)
  try {
    await expect(readPdfImage(new File([bytes], 'image.png', { type: 'image/png' }))).rejects.toMatchObject({ code: 'resource_limit' })
    expect(decode).not.toHaveBeenCalled()
  } finally { vi.unstubAllGlobals() }
})
