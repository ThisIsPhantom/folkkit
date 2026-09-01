import { expect, test } from 'vitest'
import { hexToRgb, normalizeColorToHex, parseHsl, parseHsv, parseRgb } from './color'

test.each([
  ['malformed HEX', () => hexToRgb('#ff000z')],
  ['negative RGB', () => parseRgb('rgb(-1, 0, 0)')],
  ['trailing RGB content', () => parseRgb('rgb(255, 0, 0)garbage')],
  ['negative HSL', () => parseHsl('hsl(-1, 100%, 50%)')],
  ['trailing HSV content', () => parseHsv('hsv(240, 100%, 100%)garbage')],
])('rejects %s with a fully anchored parser', (_label, parse) => {
  expect(parse()).toBeNull()
})

test('preserves the established valid color syntax and surrounding whitespace', () => {
  expect(hexToRgb('  #ff0000  ')).toEqual({ r: 255, g: 0, b: 0 })
  expect(hexToRgb('#f00')).toEqual({ r: 255, g: 0, b: 0 })
  expect(parseRgb('  rgb(255, 0, 0)  ')).toEqual({ r: 255, g: 0, b: 0 })
  expect(parseRgb('rgb(255 0 0)')).toEqual({ r: 255, g: 0, b: 0 })
  expect(parseHsl(' hsl(120, 100%, 50%) ')).toEqual({ h: 120, s: 100, l: 50 })
  expect(parseHsv(' hsv(240 100% 100%) ')).toEqual({ h: 240, s: 100, v: 100 })
})

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
