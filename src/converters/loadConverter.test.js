import { describe, expect, it, vi } from 'vitest'
import { createConverterLoader, loadConverter } from './loadConverter'
import { findReleasedTool } from '../catalog/releaseCatalog'
import { TOOL_LIMITS } from '../runtime/limits'

const pureFixtures = [
  ['base64-encode', 'Folkkit', 'Rm9sa2tpdA=='],
  ['base64-decode', 'Rm9sa2tpdA==', 'Folkkit'],
  ['url-encode', 'Folkkit & lokal', 'Folkkit%20%26%20lokal'],
  ['url-decode', 'Folkkit%20%26%20lokal', 'Folkkit & lokal'],
  ['html-encode', '<b>&</b>', '&lt;b&gt;&amp;&lt;/b&gt;'],
  ['html-decode', '&lt;b&gt;&amp;&lt;/b&gt;', '<b>&</b>'],
  ['hex-encode', 'Hi', '48 69'],
  ['hex-decode', '48 69', 'Hi'],
  ['binary-encode', 'Hi', '01001000 01101001'],
  ['binary-decode', '01001000 01101001', 'Hi'],
  ['unicode-escape', 'Hi ✓', '\\u0048\\u0069\\u0020\\u2713'],
  ['unicode-unescape', '\\u0048\\u0069', 'Hi'],
  ['rot13', 'Folkkit', 'Sbyxxvg'],
  ['atbash', 'Abc', 'Zyx'],
  ['sha256', 'Folkkit', '9b7c7fc175ad695c18d03e20295ea1b502cab00fc6ef3fb780c4ae512ff62275'],
  ['json-prettify', '{"a":1}', '{\n  "a": 1\n}'],
  ['json-minify', '{ "a": 1 }', '{"a":1}'],
  ['json-escape', 'line\nbreak', '"line\\nbreak"'],
  ['csv-to-json', 'name,age\nAda,36', '[\n  {\n    "name": "Ada",\n    "age": "36"\n  }\n]'],
  ['dec-to-hex', '255', '0xFF'],
  ['hex-to-dec', 'ff', '255'],
  ['dec-to-bin', '10', '0b1010'],
  ['bin-to-dec', '1010', '10'],
  ['dec-to-oct', '8', '0o10'],
  ['oct-to-dec', '10', '8'],
  ['color-convert', '#ff0000', 'HEX:  #ff0000\nRGB:  rgb(255, 0, 0)\nHSL:  hsl(0, 100%, 50%)'],
  ['css-minify', 'body { color: red; }', 'body{color:red}'],
  ['json-validate', '{"ok":true}', 'Valid JSON\n\nType: object\nContent: 1 keys\nSize: 11 chars\nMinified: 11 chars'],
  ['base64url-encode', 'Folkkit', 'Rm9sa2tpdA'],
  ['base64url-decode', 'Rm9sa2tpdA', 'Folkkit'],
  ['slug-gen', 'Hello Folkkit!', 'Hello Folkkit!\n  → hello-folkkit'],
  ['char-count', 'one two', 'Characters:  7\nWords:       2\nLines:       1\nBytes:       7'],
  ['reverse-text', 'Folkkit', 'tikkloF'],
  ['percentage-calc', '15% of 200', '15% of 200 = 30'],
  ['aspect-ratio', '1920x1080', 'Dimensions: 1920 x 1080\nRatio:      16:9\nDecimal:    1.7778\n\nNearest common: 16:9 (Widescreen / HD)\n\n-- Common sizes at this ratio --\n  853 x 480\n  1280 x 720\n  1920 x 1080\n  2560 x 1440\n  3840 x 2160'],
]

describe('lazy converter loading', () => {
  it('loads only the owning module for a released converter', async () => {
    const text = vi.fn(async () => ({
      textConverters: [{ id: 'base64-encode', convert: value => value }],
    }))
    const data = vi.fn(async () => ({ dataConverters: [] }))
    const loader = createConverterLoader(new Map([
      ['text', text],
      ['data', data],
    ]))

    await expect(loader('base64-encode')).resolves.toMatchObject({ id: 'base64-encode' })
    expect(text).toHaveBeenCalledTimes(1)
    expect(data).not.toHaveBeenCalled()
  })

  it.each(['unknown-tool', '__proto__', '../media', 'random-password'])('does not import hidden or unknown ID %s', async (id) => {
    const moduleLoader = vi.fn(async () => ({ textConverters: [] }))
    const loader = createConverterLoader(new Map([['text', moduleLoader]]))

    await expect(loader(id)).resolves.toBeNull()
    expect(moduleLoader).not.toHaveBeenCalled()
  })

  it('resolves an existing released converter through the production loader', async () => {
    await expect(loadConverter('text-to-qr')).resolves.toMatchObject({ id: 'text-to-qr' })
  })

  it.each(pureFixtures)('runs audited pure fixture: %s', async (id, input, expected) => {
    const converter = await loadConverter(id)

    expect(converter, `${id} is not released`).not.toBeNull()
    expect(await converter.convert(input)).toEqual({ kind: 'text', text: expected })
  })

  it.each([
    ['loan-calc', 'de', 'Nur eine lokale Rechenhilfe, keine Finanzberatung.'],
    ['loan-calc', 'en', 'Local calculation aid only, not financial advice.'],
    ['bmi-calc', 'de', 'Nur eine allgemeine Rechenhilfe, keine medizinische Beratung.'],
    ['bmi-calc', 'en', 'General calculation aid only, not medical advice.'],
  ])('publishes localized non-advice for %s in %s', (id, locale, notice) => {
    expect(findReleasedTool(id, locale)?.notice).toBe(notice)
  })

  it.each([
    ['loan-calc', '1000 12% 1', 'Monthly payment:  $88.85'],
    ['bmi-calc', '70kg 175cm', 'BMI:      22.9'],
  ])('runs audited advice-scoped fixture: %s', async (id, input, expected) => {
    const converter = await loadConverter(id)

    expect(converter, `${id} is not released`).not.toBeNull()
    expect((await converter.convert(input)).text).toContain(expected)
  })

  it.each([
    'video-to-audio', 'video-to-wav', 'audio-to-mp3', 'audio-to-wav',
    'audio-to-ogg', 'video-to-mp4', 'video-to-webm', 'video-to-gif',
    'audio-to-aac', 'audio-to-flac', 'video-to-audio-ogg', 'audio-to-m4a',
    'video-trim', 'audio-trim',
  ])('exposes audited experimental media contract: %s', async (id) => {
    const converter = await loadConverter(id)

    expect(converter).toMatchObject({
      id,
      limits: TOOL_LIMITS.media,
      isMediaConverter: true,
      acceptsFile: true,
    })
    expect(converter.fileConvert).toEqual(expect.any(Function))
    expect(converter.terminate).toEqual(expect.any(Function))
    expect(converter.onRuntimeStatus).toEqual(expect.any(Function))
  })
})
