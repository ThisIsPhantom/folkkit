import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'
import { converterModuleIds } from '../src/converters/index.js'
import { formatAuditCatalog, releaseCatalog } from '../src/catalog/releaseCatalog.js'
import { formats } from '../src/formats.js'
import messagesDe from '../src/i18n/messages.de.js'
import messagesEn from '../src/i18n/messages.en.js'
import { catalogEvidenceRegistry } from '../src/catalog/evidenceRegistry.js'
import { evidenceRunErrors, runEvidenceRegistry } from '../src/catalog/evidenceRunner.js'
import { browserEvidenceLinkErrors } from '../src/catalog/browserEvidence.js'

const requiredReleasedFields = Object.freeze([
  'category',
  'tier',
  'runtimeClass',
  'inputLimitClass',
  'outputNaming',
  'evidenceId',
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
  evidenceRegistry = [],
  evidenceRunResults = [],
}) {
  const errors = []

  for (const id of duplicateIds(rawConverters)) errors.push(`Duplicate raw converter ID: ${id}`)
  for (const id of duplicateIds(rawFormats)) errors.push(`Duplicate raw format ID: ${id}`)
  for (const id of duplicateIds(toolAudit)) errors.push(`Duplicate release catalog ID: ${id}`)
  for (const id of duplicateIds(formatAudit)) errors.push(`Duplicate format audit ID: ${id}`)
  for (const id of duplicateIds(evidenceRegistry.map(entry => ({ id: entry.evidenceId })))) {
    errors.push(`Duplicate evidence registry ID: ${id}`)
  }

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
    if (entry.tier === 'hidden') {
      if (typeof entry.hiddenReason !== 'string' || !entry.hiddenReason.trim()) {
        errors.push(`Undocumented hidden format: ${entry.id}`)
      }
      continue
    }
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

  const evidenceById = new Map(evidenceRegistry.map(entry => [entry.evidenceId, entry]))
  const releasedSubjects = [
    ...toolAudit.filter(entry => entry.tier !== 'hidden').map(entry => ({ kind: 'tool', entry })),
    ...formatAudit.filter(entry => entry.tier !== 'hidden').map(entry => ({ kind: 'format', entry })),
  ]
  const referencedEvidenceIds = new Set()
  for (const { kind, entry } of releasedSubjects) {
    const evidence = evidenceById.get(entry.evidenceId)
    if (!evidence) {
      errors.push(`Missing evidence registry entry for released ${kind}: ${entry.id} (${entry.evidenceId})`)
      continue
    }
    referencedEvidenceIds.add(entry.evidenceId)
    if (evidence.subjectKind !== kind || evidence.subjectId !== entry.id) {
      errors.push(`Evidence subject mismatch for released ${kind}: ${entry.id} (${entry.evidenceId})`)
    }
  }
  for (const evidence of evidenceRegistry) {
    if (!referencedEvidenceIds.has(evidence.evidenceId)) {
      errors.push(`Unreferenced evidence registry entry: ${evidence.evidenceId}`)
    }
  }
  errors.push(...evidenceRunErrors(evidenceRegistry, evidenceRunResults))
  errors.push(...browserEvidenceLinkErrors(evidenceRegistry))

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
  const rawFormats = formats.map(format => ({ id: format.id }))
  const evidenceRunResults = await runEvidenceRegistry()
  const errors = auditCatalogData({
    rawConverters,
    rawFormats,
    releaseCatalog,
    formatAuditCatalog,
    messagesDe,
    messagesEn,
    evidenceRegistry: catalogEvidenceRegistry,
    evidenceRunResults,
  })
  const browserManifest = JSON.parse(await readFile(resolve('scripts', 'released-browser-converters.json'), 'utf8'))
  const expectedBrowserManifest = {}
  for (const entry of releaseCatalog.filter(item => item.tier !== 'hidden')) {
    if (!expectedBrowserManifest[entry.module]) expectedBrowserManifest[entry.module] = []
    expectedBrowserManifest[entry.module].push(entry.id)
  }
  for (const ids of Object.values(expectedBrowserManifest)) ids.sort()
  const canonicalizeBrowserManifest = manifest => Object.fromEntries(
    Object.keys(manifest).sort().map(moduleId => [moduleId, [...manifest[moduleId]].sort()]),
  )
  if (JSON.stringify(canonicalizeBrowserManifest(browserManifest)) !== JSON.stringify(canonicalizeBrowserManifest(expectedBrowserManifest))) {
    errors.push('Released browser converter manifest does not match the canonical released catalog.')
  }

  for (const converter of rawConverters) {
    const audit = releaseCatalog.find(entry => entry.id === converter.id)
    if (audit?.tier !== 'hidden' && !converter.hasBehavior) {
      errors.push(`Released converter has no callable behavior: ${converter.id}`)
    }
  }
  if (errors.length) {
    for (const error of errors) console.error(error)
    return { ok: false, errors }
  }

  const releasedTools = releaseCatalog.filter(entry => entry.tier !== 'hidden').length
  const hiddenTools = releaseCatalog.length - releasedTools
  const releasedFormats = formatAuditCatalog.filter(entry => entry.tier !== 'hidden').length
  const hiddenFormats = formatAuditCatalog.length - releasedFormats
  console.log(`Catalog audit passed: ${rawConverters.length} converters (${releasedTools} released, ${hiddenTools} hidden), ${rawFormats.length} formats (${releasedFormats} released, ${hiddenFormats} hidden).`)
  return { ok: true, errors: [], rawConverterCount: rawConverters.length, rawFormatCount: rawFormats.length, releasedTools, hiddenTools, releasedFormats, hiddenFormats }
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : ''
if (invokedPath === resolve(fileURLToPath(import.meta.url))) {
  const result = await runCatalogAudit()
  if (!result.ok) process.exitCode = 1
}
