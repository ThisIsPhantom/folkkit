import { describe, expect, it } from 'vitest'
import {
  analyseQrPayload,
  buildQrOptions,
  contrastRatio,
  inspectLogoHeader,
  svgHasOnlyEmbeddedImages,
} from './qrModel.js'

describe('QR model', () => {
  it.each([
    'Grüsse für Jörg',
    '漢字 😀',
    'Text, Zürich, 漢字 und 😀',
  ])('analyses %s as UTF-8 bytes', (value) => {
    const analysis = analyseQrPayload(value, 'Q')

    expect(analysis.ok).toBe(true)
    expect(analysis.bytes).toBe(new TextEncoder().encode(value).byteLength)
  })

  it('uses TextEncoder replacement bytes for an unpaired UTF-16 surrogate', () => {
    const value = '\ud800'
    const analysis = analyseQrPayload(value, 'Q')

    expect(analysis.ok).toBe(true)
    expect(analysis.bytes).toBe(3)
  })

  it('rejects content that does not fit the selected QR error correction level', () => {
    const fitting = analyseQrPayload('a'.repeat(1273), 'H')
    const overflowing = analyseQrPayload('a'.repeat(1274), 'H')

    expect(fitting.ok).toBe(true)
    expect(overflowing).toMatchObject({ ok: false, reason: 'capacity', level: 'H' })
  })

  it('computes a quiet zone of at least the requested module count', () => {
    const analysis = analyseQrPayload('Folkkit QR fixture', 'Q')
    const options = buildQrOptions({
      data: 'Folkkit QR fixture',
      size: 320,
      quietZone: 4,
      foreground: '#111111',
      background: '#ffffff',
      dotStyle: 'rounded',
      cornerSquareStyle: 'extra-rounded',
      cornerDotStyle: 'dot',
      logoDataUrl: null,
      logoSize: 20,
      logoSpacing: 4,
      analysis,
    })
    const effectiveModules = options.margin * analysis.moduleCount / (options.width - (2 * options.margin))

    expect(effectiveModules).toBeGreaterThanOrEqual(4)
    expect(options.qrOptions.errorCorrectionLevel).toBe('Q')
  })

  it('uses high error correction and bounded logo coverage when a logo is present', () => {
    const analysis = analyseQrPayload('Folkkit logo fixture', 'H')
    const options = buildQrOptions({
      data: 'Folkkit logo fixture',
      size: 360,
      quietZone: 4,
      foreground: '#111111',
      background: '#ffffff',
      dotStyle: 'square',
      cornerSquareStyle: 'square',
      cornerDotStyle: 'square',
      logoDataUrl: 'data:image/png;base64,AA==',
      logoSize: 99,
      logoSpacing: 99,
      analysis,
    })

    expect(options.qrOptions.errorCorrectionLevel).toBe('H')
    expect(options.imageOptions.saveAsBlob).toBe(false)
    expect(options.imageOptions.imageSize).toBe(0.24)
    expect(options.imageOptions.margin).toBe(12)
  })

  it('reports low contrast from the actual output colours', () => {
    expect(contrastRatio('#111111', '#ffffff')).toBeGreaterThan(15)
    expect(contrastRatio('#777777', '#888888')).toBeLessThan(2)
  })

  it('recognises PNG, JPEG and WebP headers and dimensions', () => {
    const png = new Uint8Array(24)
    png.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    new DataView(png.buffer).setUint32(16, 128)
    new DataView(png.buffer).setUint32(20, 64)

    const jpeg = Uint8Array.from([
      0xff, 0xd8, 0xff, 0xc0, 0x00, 0x11, 0x08,
      0x00, 0x40, 0x00, 0x80, 0x03, 0x01, 0x11, 0x00,
      0x02, 0x11, 0x00, 0x03, 0x11, 0x00,
    ])

    const webp = new Uint8Array(30)
    webp.set([0x52, 0x49, 0x46, 0x46], 0)
    new DataView(webp.buffer).setUint32(4, 22, true)
    webp.set([0x57, 0x45, 0x42, 0x50, 0x56, 0x50, 0x38, 0x58], 8)
    new DataView(webp.buffer).setUint32(16, 10, true)
    webp[24] = 127
    webp[27] = 63

    expect(inspectLogoHeader(png)).toEqual({ kind: 'png', width: 128, height: 64 })
    expect(inspectLogoHeader(jpeg)).toEqual({ kind: 'jpeg', width: 128, height: 64 })
    expect(inspectLogoHeader(webp)).toEqual({ kind: 'webp', width: 128, height: 64 })
    expect(inspectLogoHeader(Uint8Array.from([1, 2, 3, 4]))).toBeNull()
  })

  it('rejects external image references in exported SVG files', () => {
    expect(svgHasOnlyEmbeddedImages('<svg><image href="data:image/png;base64,AA==" /></svg>')).toBe(true)
    expect(svgHasOnlyEmbeddedImages('<svg><image href="https://example.test/logo.png" /></svg>')).toBe(false)
    expect(svgHasOnlyEmbeddedImages('<svg><image href="blob:https://example.test/id" /></svg>')).toBe(false)
  })
})
