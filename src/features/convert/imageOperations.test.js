// @vitest-environment node
import { expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { withJpegOrientation } from '../../../tests/e2e/file-converter-fixtures/exif.mjs'
import * as imageOperations from './imageOperations.js'
const { imageDimensions, validateDimensions, resolveImageSize, imagePdfSize } = imageOperations
const jpeg = readFileSync(new URL('../../../tests/e2e/file-converter-fixtures/sample.jpg',import.meta.url))
it('uses upright JPEG dimensions for EXIF6/8, resizing and PDF page sizing in either byte order', () => {
  for (const orientation of [6,8]) {
    const dimensions = imageDimensions(withJpegOrientation(jpeg,orientation,orientation === 6))
    expect(dimensions).toMatchObject({ width:64,height:96 })
    expect(resolveImageSize(dimensions,{ width:32 })).toEqual({ width:32,height:48 })
    expect(imagePdfSize(dimensions)).toEqual([48,72])
  }
})
it('bounds malformed EXIF offsets and leaves non-transposed JPEG axes intact', () => {
  for (const orientation of [1,2,3,4]) expect(imageDimensions(withJpegOrientation(jpeg,orientation))).toMatchObject({ width:96,height:64 })
  const malformed = withJpegOrientation(jpeg,6)
  new DataView(malformed.buffer).setUint32(16,0xffffffff,true)
  expect(imageDimensions(malformed)).toMatchObject({ width:96,height:64 })
})
it('preserves image aspect ratio for custom bounds and sizes printable PDF pages', () => {
  expect(resolveImageSize({ width: 96, height: 64 }, { width: 48 })).toEqual({ width: 48, height: 32 })
  expect(resolveImageSize({ width: 96, height: 64 }, { width: 48, height: 16 })).toEqual({ width: 24, height: 16 })
  expect(imagePdfSize({ width: 96, height: 64 }, { pageSize: 'letter', orientation: 'landscape' })).toEqual([792, 612])
  expect(() => resolveImageSize({ width: 96, height: 64 }, { width: 99999 })).toThrow('resource_limit')
})
it('never enlarges optimized images and maps the three lossy quality levels', () => {
  expect(imageOperations.resolveOptimizedImageSize).toBeTypeOf('function')
  expect(imageOperations.resolveOptimizationQuality).toBeTypeOf('function')
  const { resolveOptimizedImageSize, resolveOptimizationQuality } = imageOperations
  expect(resolveOptimizedImageSize({ width: 96, height: 64 }, { width: 192 })).toEqual({ width: 96, height: 64 })
  expect(resolveOptimizedImageSize({ width: 96, height: 64 }, { width: 48 })).toEqual({ width: 48, height: 32 })
  expect(resolveOptimizedImageSize({ width: 96, height: 64 }, { width: 80, height: 20 })).toEqual({ width: 30, height: 20 })
  expect(['small', 'balanced', 'high'].map(resolveOptimizationQuality)).toEqual([70, 82, 92])
  expect(() => resolveOptimizationQuality('unknown')).toThrow('invalid_settings')
})
it('reads VP8X dimensions before expensive bitmap decoding and rejects huge images', () => {
  const bytes = new Uint8Array(30)
  bytes.set(new TextEncoder().encode('RIFF'), 0)
  bytes.set(new TextEncoder().encode('WEBPVP8X'), 8)
  bytes[24] = 99; bytes[27] = 49
  expect(imageDimensions(bytes)).toEqual({ width: 100, height: 50 })
  expect(() => validateDimensions({ width: 100000, height: 1 })).toThrow('resource_limit')
})
