import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { converterModuleIds } from '../src/converters/index.js'
import { formatAuditCatalog, releaseCatalog } from '../src/catalog/releaseCatalog.js'
import { formats, getTargets } from '../src/formats.js'
import messagesDe from '../src/i18n/messages.de.js'
import messagesEn from '../src/i18n/messages.en.js'

const requiredReleasedFields = Object.freeze([
  'category',
  'tier',
  'runtimeClass',
  'inputLimitClass',
  'outputNaming',
  'testName',
])

function readMessage(messages, key) {
  return key.split('.').reduce((value, part) => value?.[part], messages)
}

function duplicateIds(items) {
  const seen = new Set()
  const duplicates = new Set()
  for (const item of items) {
    if (seen.has(item.id)) duplicates.add(item.id)
    seen.add(item.id)
  }
  return duplicates
}

export function auditCatalogData({
  rawConverters,
  rawFormats,
  releaseCatalog: toolAudit,
  formatAuditCatalog: formatAudit,
  messagesDe: de,
  messagesEn: en,
}) {
  const errors = []

  for (const id of duplicateIds(rawConverters)) errors.push(`Duplicate raw converter ID: ${id}`)
  for (const id of duplicateIds(rawFormats)) errors.push(`Duplicate raw format ID: ${id}`)
  for (const id of duplicateIds(toolAudit)) errors.push(`Duplicate release catalog ID: ${id}`)
  for (const id of duplicateIds(formatAudit)) errors.push(`Duplicate format audit ID: ${id}`)

  const rawConverterIds = new Set(rawConverters.map(item => item.id))
  const auditedConverterIds = new Set(toolAudit.map(item => item.id))
  for (const item of rawConverters) {
    if (!auditedConverterIds.has(item.id)) errors.push(`Unaudited raw converter: ${item.id}`)
  }
  for (const entry of toolAudit) {
    if (!rawConverterIds.has(entry.id)) errors.push(`Unknown converter in release catalog: ${entry.id}`)
  }

  const rawFormatIds = new Set(rawFormats.map(item => item.id))
  const auditedFormatIds = new Set(formatAudit.map(item => item.id))
  for (const item of rawFormats) {
    if (!auditedFormatIds.has(item.id)) errors.push(`Unaudited raw format: ${item.id}`)
  }
  for (const entry of formatAudit) {
    if (!rawFormatIds.has(entry.id)) errors.push(`Unknown format in audit catalog: ${entry.id}`)
  }

  for (const entry of toolAudit) {
    if (entry.tier === 'hidden') {
      if (typeof entry.hiddenReason !== 'string' || !entry.hiddenReason.trim()) {
        errors.push(`Undocumented hidden tool: ${entry.id}`)
      }
      continue
    }

    for (const field of requiredReleasedFields) {
      if (typeof entry[field] !== 'string' || !entry[field].trim()) {
        errors.push(`Missing ${field} for released tool: ${entry.id}`)
      }
    }
    for (const [locale, messages] of [['de', de], ['en', en]]) {
      for (const field of ['name', 'description']) {
        const value = readMessage(messages, `tools.${entry.translationKey}.${field}`)
        if (typeof value !== 'string' || !value.trim()) {
          errors.push(`Missing ${locale} ${field} for released tool: ${entry.id}`)
        }
      }
      const category = readMessage(messages, `categories.${entry.category}`)
      if (typeof category !== 'string' || !category.trim()) {
        errors.push(`Missing ${locale} category for released tool: ${entry.id}`)
      }
    }
  }

  for (const entry of formatAudit) {
    for (const field of requiredReleasedFields) {
      if (typeof entry[field] !== 'string' || !entry[field].trim()) {
        errors.push(`Missing ${field} for released format: ${entry.id}`)
      }
    }
    for (const field of ['nameDe', 'nameEn', 'descriptionDe', 'descriptionEn']) {
      if (typeof entry[field] !== 'string' || !entry[field].trim()) {
        errors.push(`Missing ${field} for released format: ${entry.id}`)
      }
    }
  }

  return errors
}

async function loadRawConverters() {
  const loaders = new Map([
    ['text', async () => (await import('../src/converters/text.js')).textConverters],
    ['qr', async () => (await import('../src/converters/qr.js')).qrConverters],
    ['image', async () => (await import('../src/converters/image.js')).imageConverters],
    ['hash', async () => (await import('../src/converters/hash.js')).hashConverters],
    ['crypto', async () => (await import('../src/converters/crypto.js')).cryptoConverters],
    ['data', async () => (await import('../src/converters/data.js')).dataConverters],
    ['web', async () => (await import('../src/converters/web.js')).webConverters],
    ['number', async () => (await import('../src/converters/number.js')).numberConverters],
    ['color', async () => (await import('../src/converters/color.js')).colorConverters],
    ['utility', async () => (await import('../src/converters/utility.js')).utilityConverters],
    ['imageFormat', async () => (await import('../src/converters/imageFormat.js')).imageFormatConverters],
    ['media', async () => (await import('../src/converters/media.js')).mediaConverters],
    ['pdf', async () => (await import('../src/converters/pdf.js')).pdfConverters],
  ])

  const rawConverters = []
  for (const [module, expectedIds] of Object.entries(converterModuleIds)) {
    const converters = await loaders.get(module)()
    const actualIds = converters.map(converter => converter.id)
    if (actualIds.join('\n') !== expectedIds.join('\n')) {
      throw new Error(`Static converter manifest does not match raw module: ${module}`)
    }
    rawConverters.push(...converters.map(converter => ({
      id: converter.id,
      module,
      category: converter.category,
      hasBehavior: typeof converter.convert === 'function'
        || typeof converter.fileConvert === 'function'
        || typeof converter.generate === 'function',
    })))
  }
  return rawConverters
}

export async function runCatalogAudit() {
  const rawConverters = await loadRawConverters()
  const rawFormats = formats.map(format => ({
    id: format.id,
    hasConversion: getTargets(format.id).length > 0
      || formats.some(source => getTargets(source.id).includes(format.id)),
  }))
  const errors = auditCatalogData({
    rawConverters,
    rawFormats,
    releaseCatalog,
    formatAuditCatalog,
    messagesDe,
    messagesEn,
  })

  for (const converter of rawConverters) {
    const audit = releaseCatalog.find(entry => entry.id === converter.id)
    if (audit?.tier !== 'hidden' && !converter.hasBehavior) {
      errors.push(`Released converter has no callable behavior: ${converter.id}`)
    }
  }
  for (const format of rawFormats) {
    if (!format.hasConversion) errors.push(`Released format has no conversion edge: ${format.id}`)
  }

  if (errors.length) {
    for (const error of errors) console.error(error)
    return { ok: false, errors }
  }

  const releasedTools = releaseCatalog.filter(entry => entry.tier !== 'hidden').length
  const hiddenTools = releaseCatalog.length - releasedTools
  console.log(`Catalog audit passed: ${rawConverters.length} converters (${releasedTools} released, ${hiddenTools} hidden), ${rawFormats.length} formats.`)
  return { ok: true, errors: [], rawConverterCount: rawConverters.length, rawFormatCount: rawFormats.length, releasedTools, hiddenTools }
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : ''
if (invokedPath === resolve(fileURLToPath(import.meta.url))) {
  const result = await runCatalogAudit()
  if (!result.ok) process.exitCode = 1
}
