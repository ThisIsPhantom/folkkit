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
  'qr-to-text',
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
    expect(new Set(releaseCatalog.map(tool => tool.tier))).toEqual(new Set(['core', 'experimental', 'hidden']))
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
})
