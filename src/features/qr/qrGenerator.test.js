import { describe, expect, it } from 'vitest'
import { generateQrBlob } from './qrGenerator.js'
import { svgHasOnlyEmbeddedImages } from './qrModel.js'

describe('QR generator', () => {
  it('creates a self-contained SVG through qr-code-styling', async () => {
    const blob = await generateQrBlob({
      data: 'Folkkit generator fixture',
      size: 320,
      quietZone: 4,
      foreground: '#111111',
      background: '#ffffff',
      dotStyle: 'rounded',
      cornerSquareStyle: 'extra-rounded',
      cornerDotStyle: 'dot',
      logoAsset: null,
      logoSize: 20,
      logoSpacing: 4,
      crop: { zoom: 1, x: 0, y: 0 },
    }, 'svg')
    const text = await blob.text()

    expect(blob.type).toBe('image/svg+xml')
    expect(text).toContain('<svg')
    expect(svgHasOnlyEmbeddedImages(text)).toBe(true)
    expect(text).not.toMatch(/blob:/)
  })

  it('rejects an unsupported export format before allocating a QR renderer', async () => {
    await expect(generateQrBlob({ data: 'Folkkit' }, 'pdf')).rejects.toMatchObject({ code: 'unsupported_format' })
  })
})
