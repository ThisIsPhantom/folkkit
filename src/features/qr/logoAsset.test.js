import { describe, expect, it, vi } from 'vitest'
import { computeSquareCrop, loadLogoAsset, MAX_LOGO_BYTES, moveCropByPixels } from './logoAsset.js'

function pngFile({ name = 'logo.png', type = 'image/png', size = 24 } = {}) {
  const bytes = new Uint8Array(Math.max(size, 24))
  bytes.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  new DataView(bytes.buffer).setUint32(16, 128)
  new DataView(bytes.buffer).setUint32(20, 64)
  return new File([bytes], name, { type })
}

const webpFixtures = Object.freeze([
  {
    name: 'lossy-vp8.webp',
    base64: 'UklGRkYAAABXRUJQVlA4IDoAAABQAwCdASogABgAPm0ylUekIqIhKAgAgA2JZQB2APwAAIMoIAD+54v//+LORiOzzf//PTNeYP6aAAAA',
  },
  {
    name: 'lossless-vp8l.webp',
    base64: 'UklGRh4AAABXRUJQVlA4TBEAAAAvH8AFAAdQqPoWpf+BiOh/AAA=',
  },
])

function bytesFromBase64(value) {
  return Uint8Array.from(atob(value), character => character.charCodeAt(0))
}

describe('QR logo assets', () => {
  it('rejects oversized files before attempting to decode them', async () => {
    const createBitmap = vi.fn()
    const file = { name: 'large.png', type: 'image/png', size: MAX_LOGO_BYTES + 1 }

    await expect(loadLogoAsset(file, { createBitmap })).rejects.toMatchObject({ code: 'too_large' })
    expect(createBitmap).not.toHaveBeenCalled()
  })

  it('rejects malformed files and mismatched MIME metadata', async () => {
    const createBitmap = vi.fn()
    const malformed = new File([Uint8Array.from([1, 2, 3])], 'logo.png', { type: 'image/png' })
    const mismatch = pngFile({ name: 'logo.jpg', type: 'image/jpeg' })

    await expect(loadLogoAsset(malformed, { createBitmap })).rejects.toMatchObject({ code: 'invalid_file' })
    await expect(loadLogoAsset(mismatch, { createBitmap })).rejects.toMatchObject({ code: 'invalid_file' })
    expect(createBitmap).not.toHaveBeenCalled()
  })

  it('closes a decoded bitmap whose dimensions disagree with the file header', async () => {
    const close = vi.fn()
    const createBitmap = vi.fn().mockResolvedValue({ width: 120, height: 64, close })

    await expect(loadLogoAsset(pngFile(), { createBitmap })).rejects.toMatchObject({ code: 'invalid_file' })
    expect(close).toHaveBeenCalledOnce()
  })

  it('maps zoom and crop controls to a bounded square source crop', () => {
    expect(computeSquareCrop({ width: 400, height: 200 }, { zoom: 1, x: 0, y: 0 })).toEqual({
      sx: 100,
      sy: 0,
      sourceSize: 200,
    })
    expect(computeSquareCrop({ width: 400, height: 200 }, { zoom: 2, x: 100, y: -100 })).toEqual({
      sx: 300,
      sy: 0,
      sourceSize: 100,
    })
  })

  it('maps display drag pixels to image movement while keeping an immobile axis centred', () => {
    const next = moveCropByPixels(
      { width: 400, height: 200 },
      { zoom: 1, x: 0, y: 0 },
      { deltaX: 100, deltaY: 80, displaySize: 200 },
    )

    expect(next).toEqual({ zoom: 1, x: -100, y: 0 })
  })

  it('accounts for zoom when mapping drag distance and clamps both axes', () => {
    expect(moveCropByPixels(
      { width: 400, height: 200 },
      { zoom: 2, x: 0, y: 0 },
      { deltaX: 60, deltaY: 60, displaySize: 200 },
    )).toEqual({ zoom: 2, x: -20, y: -60 })

    expect(moveCropByPixels(
      { width: 400, height: 200 },
      { zoom: 3, x: -95, y: 95 },
      { deltaX: 500, deltaY: -500, displaySize: 200 },
    )).toEqual({ zoom: 3, x: -100, y: 100 })
  })

  it.each(webpFixtures)('accepts a real $name image after bounded header validation', async ({ name, base64 }) => {
    const bytes = bytesFromBase64(base64)
    const close = vi.fn()
    const createBitmap = vi.fn().mockResolvedValue({ width: 32, height: 24, close })
    const file = new File([bytes], name, { type: 'image/webp' })

    const asset = await loadLogoAsset(file, { createBitmap })

    expect(asset).toMatchObject({ kind: 'webp', width: 32, height: 24, name })
    expect(createBitmap).toHaveBeenCalledOnce()
    expect(close).not.toHaveBeenCalled()
  })

  it('rejects oversized VP8L dimensions before browser decoding', async () => {
    const bytes = new Uint8Array(26)
    bytes.set([0x52, 0x49, 0x46, 0x46], 0)
    new DataView(bytes.buffer).setUint32(4, 18, true)
    bytes.set([0x57, 0x45, 0x42, 0x50, 0x56, 0x50, 0x38, 0x4c], 8)
    new DataView(bytes.buffer).setUint32(16, 5, true)
    bytes[20] = 0x2f
    new DataView(bytes.buffer).setUint32(21, 0x0fffffff, true)
    const createBitmap = vi.fn()
    const file = new File([bytes], 'oversized.webp', { type: 'image/webp' })

    await expect(loadLogoAsset(file, { createBitmap })).rejects.toMatchObject({ code: 'too_large' })
    expect(createBitmap).not.toHaveBeenCalled()
  })
})
