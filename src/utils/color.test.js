import { expect, test } from 'vitest'
import { normalizeColorToHex } from './color'

test.each([
  ['color-hex', '#abc', '#aabbcc'],
  ['color-rgb', 'rgb(255, 0, 0)', '#ff0000'],
  ['color-hsl', 'hsl(120, 100%, 50%)', '#00ff00'],
  ['color-hsv', 'hsv(240, 100%, 100%)', '#0000ff'],
])('normalizes %s output for a native color input', (format, value, expected) => {
  expect(normalizeColorToHex(format, value)).toBe(expected)
})

test.each([
  ['color-hex', '#gg0000'],
  ['color-rgb', 'rgb(256, 0, 0)'],
  ['color-hsl', 'hsl(0, 101%, 50%)'],
  ['color-hsv', 'hsv(0, 100%, 101%)'],
  ['text', '#ff0000'],
])('rejects invalid or unsupported %s preview output', (format, value) => {
  expect(normalizeColorToHex(format, value)).toBeNull()
})
