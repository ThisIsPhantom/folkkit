import { expect, test, vi } from 'vitest'
import {
  BATCH_ITEM_LIMIT,
  CSV_LIMITS,
  MEDIA_LIMITS,
  OUTPUT_LIMIT_BYTES,
  PDF_TEXT_LIMITS,
  QR_TEXT_LIMIT_BYTES,
  assertCsvBudget,
  assertOutputBudget,
  assertTextPdfBudget,
  parseImageDimensions,
  readWavDurationSeconds,
} from './workBudgets'

function pngDimensions(width, height) {
  const bytes = new Uint8Array(24)
  bytes.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52])
  new DataView(bytes.buffer).setUint32(16, width)
  new DataView(bytes.buffer).setUint32(20, height)
  return bytes
}

function jpegDimensions(width, height) {
  return new Uint8Array([
    0xff, 0xd8, 0xff, 0xc0, 0x00, 0x11, 0x08,
    (height >> 8) & 0xff, height & 0xff, (width >> 8) & 0xff, width & 0xff,
    0x03, 0x01, 0x11, 0x00, 0x02, 0x11, 0x00, 0x03, 0x11, 0x00, 0xff, 0xd9,
  ])
}

test('parses PNG IHDR and JPEG SOF dimensions from bounded prefixes', () => {
  expect(parseImageDimensions(pngDimensions(1200, 800))).toEqual({ kind: 'png', width: 1200, height: 800 })
  expect(parseImageDimensions(jpegDimensions(640, 480))).toEqual({ kind: 'jpeg', width: 640, height: 480 })
})

test('CSV budget rejects excessive rows, columns and cells before row conversion', () => {
  const parseRow = vi.fn(line => line.split(','))
  const excessiveRows = Array.from({ length: CSV_LIMITS.maxRows + 1 }, () => 'a,b').join('\n')
  expect(() => assertCsvBudget(excessiveRows, parseRow)).toThrow(/resource_limit/)
  expect(parseRow).not.toHaveBeenCalled()
  const excessiveColumns = Array.from({ length: CSV_LIMITS.maxColumns + 1 }, () => 'x').join(',')
  expect(() => assertCsvBudget(`${excessiveColumns}\n${excessiveColumns}`, parseRow)).toThrow(/resource_limit/)
})

test('text-to-PDF budget rejects excessive logical lines and pages before PDF import', () => {
  expect(() => assertTextPdfBudget(Array.from({ length: PDF_TEXT_LIMITS.maxLogicalLines + 1 }, () => 'line').join('\n'))).toThrow(/resource_limit/)
  expect(() => assertTextPdfBudget('x'.repeat(PDF_TEXT_LIMITS.maxCharactersPerLogicalLine + 1))).toThrow(/resource_limit/)
})

test('output and declared capacity budgets are finite', () => {
  expect(BATCH_ITEM_LIMIT).toBeGreaterThan(0)
  expect(QR_TEXT_LIMIT_BYTES).toBeGreaterThan(0)
  expect(MEDIA_LIMITS.maxDurationSeconds).toBeGreaterThan(0)
  expect(() => assertOutputBudget({ kind: 'text', text: 'x'.repeat(OUTPUT_LIMIT_BYTES + 1) })).toThrow(/resource_limit/)
  expect(() => assertOutputBudget({ kind: 'download', blob: new Blob(['x'.repeat(OUTPUT_LIMIT_BYTES + 1)]) })).toThrow(/resource_limit/)
})

test('reads reliable WAV duration and rejects impossible headers', () => {
  const bytes = new Uint8Array(44)
  const view = new DataView(bytes.buffer)
  bytes.set(new TextEncoder().encode('RIFF'), 0)
  bytes.set(new TextEncoder().encode('WAVE'), 8)
  bytes.set(new TextEncoder().encode('fmt '), 12)
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, 8000, true)
  view.setUint32(28, 16000, true)
  bytes.set(new TextEncoder().encode('data'), 36)
  view.setUint32(40, 32000, true)
  expect(readWavDurationSeconds(bytes)).toBe(2)
  expect(readWavDurationSeconds(new Uint8Array(44))).toBeNull()
})
