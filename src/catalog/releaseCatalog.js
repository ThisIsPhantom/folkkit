import { categories, converters, findConverter } from '../converters'
import { getMessages, normalizeLocale, translate } from '../i18n'

export const releaseTiers = Object.freeze(['core', 'advanced', 'experimental', 'hidden'])

const releaseMetadata = Object.freeze({
  'text-to-qr': Object.freeze({ tier: 'core', translationKey: 'textToQr' }),
  'images-to-pdf': Object.freeze({ tier: 'core', translationKey: 'imagesToPdf' }),
  'merge-pdf': Object.freeze({ tier: 'core', translationKey: 'mergePdf' }),
  'pdf-page-count': Object.freeze({ tier: 'core', translationKey: 'pdfPageCount' }),
  'pdf-split': Object.freeze({ tier: 'core', translationKey: 'pdfSplit' }),
  'pdf-extract-range': Object.freeze({ tier: 'core', translationKey: 'pdfExtractRange' }),
  'text-to-pdf': Object.freeze({ tier: 'core', translationKey: 'textToPdf' }),
  'pdf-metadata': Object.freeze({ tier: 'core', translationKey: 'pdfMetadata' }),
  'pdf-rotate': Object.freeze({ tier: 'core', translationKey: 'pdfRotate' }),
  'qr-to-text': Object.freeze({ tier: 'experimental', translationKey: 'qrToText' }),
})

export const releaseCatalog = Object.freeze(converters.map((converter) => {
  const metadata = releaseMetadata[converter.id]
  return Object.freeze({
    id: converter.id,
    category: converter.category,
    tier: metadata?.tier || 'hidden',
    translationKey: metadata?.translationKey || converter.id,
  })
}))

export const releasedToolCount = releaseCatalog.filter(tool => tool.tier !== 'hidden').length

function getLocalizedTool(entry, locale) {
  const converter = findConverter(entry.id)
  if (!converter) throw new Error(`Missing converter: ${entry.id}`)

  const messages = getMessages(locale)
  return {
    ...converter,
    tier: entry.tier,
    name: translate(messages, `tools.${entry.translationKey}.name`),
    description: translate(messages, `tools.${entry.translationKey}.description`),
    categoryName: translate(messages, `categories.${entry.category}`),
  }
}

export function getReleasedTools(locale = 'de') {
  const normalizedLocale = normalizeLocale(locale)
  return releaseCatalog
    .filter(tool => tool.tier !== 'hidden')
    .sort((left, right) => releaseTiers.indexOf(left.tier) - releaseTiers.indexOf(right.tier))
    .map(tool => getLocalizedTool(tool, normalizedLocale))
}

export function findReleasedTool(id, locale = 'de') {
  const entry = releaseCatalog.find(tool => tool.id === id && tool.tier !== 'hidden')
  return entry ? getLocalizedTool(entry, normalizeLocale(locale)) : null
}

export function getReleasedCategories(locale = 'de') {
  const messages = getMessages(normalizeLocale(locale))
  const releasedCategoryIds = new Set(
    releaseCatalog.filter(tool => tool.tier !== 'hidden').map(tool => tool.category),
  )

  return categories
    .filter(category => releasedCategoryIds.has(category.id))
    .map(category => ({
      id: category.id,
      name: translate(messages, `categories.${category.id}`),
    }))
}
