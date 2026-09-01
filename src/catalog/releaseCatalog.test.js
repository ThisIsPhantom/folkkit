import { describe, expect, it } from 'vitest'
import messagesDe from '../i18n/messages.de'
import messagesEn from '../i18n/messages.en'
import {
  findReleasedTool,
  getReleasedCategories,
  getReleasedTools,
  releaseCatalog,
  releasedToolCount,
} from './releaseCatalog'
import { TOOL_LIMITS } from '../runtime/limits'

const expectedReleasedIds = [
  'text-to-qr',
  'images-to-pdf',
  'merge-pdf',
  'pdf-page-count',
  'pdf-split',
  'pdf-extract-range',
  'text-to-pdf',
  'pdf-metadata',
  'pdf-rotate',
  'base64-encode',
  'base64-decode',
  'url-encode',
  'url-decode',
  'html-encode',
  'html-decode',
  'hex-encode',
  'hex-decode',
  'binary-encode',
  'binary-decode',
  'unicode-escape',
  'unicode-unescape',
  'rot13',
  'atbash',
  'sha256',
  'json-prettify',
  'json-minify',
  'json-escape',
  'csv-to-json',
  'css-minify',
  'json-validate',
  'base64url-encode',
  'base64url-decode',
  'slug-gen',
  'dec-to-hex',
  'hex-to-dec',
  'dec-to-bin',
  'bin-to-dec',
  'dec-to-oct',
  'oct-to-dec',
  'color-convert',
  'char-count',
  'reverse-text',
  'aspect-ratio',
  'percentage-calc',
  'loan-calc',
  'bmi-calc',
  'png-to-jpg',
  'jpg-to-png',
  'qr-to-text',
  'video-to-audio',
  'video-to-wav',
  'audio-to-mp3',
  'audio-to-wav',
  'audio-to-ogg',
  'video-to-mp4',
  'video-to-webm',
  'video-to-gif',
  'audio-to-aac',
  'audio-to-flac',
  'video-to-audio-ogg',
  'audio-to-m4a',
  'video-trim',
  'audio-trim',
]

function readMessage(messages, key) {
  return key.split('.').reduce((value, part) => value?.[part], messages)
}

describe('released catalog', () => {
  it('exposes only the approved stable tool IDs', () => {
    expect(getReleasedTools('de').map(tool => tool.id)).toEqual(expectedReleasedIds)
    expect(findReleasedTool('merge-pdf', 'en')).toMatchObject({ id: 'merge-pdf', tier: 'core' })
    expect(findReleasedTool('unreleased-tool', 'de')).toBeNull()
  })

  it('derives the released count from unique catalog metadata', () => {
    expect(releasedToolCount).toBe(expectedReleasedIds.length)
    expect(new Set(releaseCatalog.map(tool => tool.id)).size).toBe(releaseCatalog.length)
    expect(new Set(releaseCatalog.map(tool => tool.translationKey)).size).toBe(releaseCatalog.length)
  })

  it('uses only the four supported release tiers', () => {
    expect(new Set(releaseCatalog.map(tool => tool.tier))).toEqual(new Set(['core', 'advanced', 'experimental', 'hidden']))
    expect(releaseCatalog.every(tool => ['core', 'advanced', 'experimental', 'hidden'].includes(tool.tier))).toBe(true)
  })

  it('provides localized category metadata for every released tool', () => {
    for (const locale of ['de', 'en']) {
      const tools = getReleasedTools(locale)
      const categories = getReleasedCategories(locale)

      expect(categories).toEqual(expect.arrayContaining([
        expect.objectContaining({ id: 'encode', name: expect.any(String) }),
        expect.objectContaining({ id: 'document', name: expect.any(String) }),
      ]))

      for (const tool of tools) {
        expect(tool.name).not.toHaveLength(0)
        expect(tool.description).not.toHaveLength(0)
        expect(tool.category).toEqual(expect.any(String))
        expect(tool.categoryName).not.toHaveLength(0)
      }
    }
  })

  it('has both production translations for every non-hidden catalog entry', () => {
    for (const entry of releaseCatalog.filter(tool => tool.tier !== 'hidden')) {
      for (const messages of [messagesDe, messagesEn]) {
        expect(readMessage(messages, `tools.${entry.translationKey}.name`)).toEqual(expect.any(String))
        expect(readMessage(messages, `tools.${entry.translationKey}.description`)).toEqual(expect.any(String))
        expect(readMessage(messages, `categories.${entry.category}`)).toEqual(expect.any(String))
      }
    }
  })

  it('carries conservative limit metadata on every released file tool', () => {
    const fileTools = getReleasedTools('de').filter(tool => tool.acceptsFile)

    expect(fileTools).not.toHaveLength(0)
    for (const tool of fileTools) {
      const expectedLimits = {
        'image-device': TOOL_LIMITS.images,
        'pdf-device': TOOL_LIMITS.pdf,
        'media-device': TOOL_LIMITS.media,
      }[tool.inputLimitClass]
      expect(tool.limits).toBe(expectedLimits)
    }
  })

  it('releases image inputs only for the signature-checked PNG and JPEG contract', () => {
    for (const id of ['images-to-pdf', 'qr-to-text']) {
      expect(findReleasedTool(id, 'de')?.acceptTypes).toBe('image/png,image/jpeg,.png,.jpg,.jpeg')
    }
  })
})
