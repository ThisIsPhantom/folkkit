import { categories, converterModuleIds } from '../converters'
import { formats } from '../formats'
import { getMessages, normalizeLocale, translate } from '../i18n'
import { TOOL_LIMITS } from '../runtime/limits'
import { getFormatEvidence } from './evidenceRegistry'

export const releaseTiers = Object.freeze(['core', 'advanced', 'experimental', 'hidden'])

const moduleCategories = Object.freeze({
  text: 'encode',
  qr: 'encode',
  image: 'image',
  hash: 'hash',
  crypto: 'hash',
  data: 'data',
  web: 'web',
  number: 'number',
  color: 'color',
  utility: 'utility',
  imageFormat: 'image',
  media: 'media',
  pdf: 'document',
})

const hiddenReasons = Object.freeze({
  text: 'Hidden pending a named bounded-output fixture and localized release copy.',
  qr: 'Hidden pending QR capability verification.',
  image: 'Hidden pending exact input signatures, Blob result normalization, and image fixtures.',
  hash: 'Hidden pending digest fixtures and copy that does not imply password or security validation.',
  crypto: 'Hidden because cryptographic, password, or randomness claims require a separate security review.',
  data: 'Hidden pending bounded structured-data fixtures and output-size review.',
  web: 'Hidden pending per-tool review of validators, generators, and any live-lookup implication.',
  number: 'Hidden pending bounded numerical fixtures and expansion limits.',
  color: 'Hidden pending deterministic color fixtures and review of accessibility claims.',
  utility: 'Hidden pending per-tool review for dated data, professional advice, and bounded output.',
  imageFormat: 'Hidden pending exact PNG/JPEG validation, Canvas cleanup, and Blob result fixtures.',
  media: 'Hidden pending same-origin FFmpeg network and cancellation evidence.',
  pdf: 'Hidden pending PDF runtime evidence.',
})

function released({
  module,
  category = moduleCategories[module],
  tier,
  translationKey,
  runtimeClass,
  inputLimitClass,
  outputNaming,
  evidenceId,
  ...toolMetadata
}) {
  return Object.freeze({
    module,
    category,
    tier,
    translationKey,
    runtimeClass,
    inputLimitClass,
    outputNaming,
    evidenceId,
    ...toolMetadata,
  })
}

function pureTool(id, module, translationKey, options = {}) {
  return released({
    module,
    category: options.category,
    tier: 'advanced',
    translationKey,
    runtimeClass: options.runtimeClass || 'main-thread',
    inputLimitClass: 'text-5-mib',
    outputNaming: 'inline-text',
    evidenceId: `tool:${id}`,
    placeholderKey: options.placeholderKey,
    noticeKey: options.noticeKey,
  })
}

function experimentalMedia(id, translationKey, acceptTypes, options = {}) {
  return released({
    module: 'media',
    tier: 'experimental',
    translationKey,
    runtimeClass: 'ffmpeg-wasm',
    inputLimitClass: 'media-device',
    outputNaming: 'converter-filename',
    evidenceId: `tool:${id}`,
    acceptsFile: true,
    acceptTypes,
    isMediaConverter: true,
    limits: TOOL_LIMITS.media,
    noticeKey: 'labels.mediaWarning',
    hasTextInput: options.hasTextInput,
    parameterPlaceholderKey: options.parameterPlaceholderKey,
  })
}

const releaseMetadata = Object.freeze({
  'base64-encode': released({
    module: 'text',
    tier: 'advanced',
    translationKey: 'base64Encode',
    runtimeClass: 'main-thread',
    inputLimitClass: 'text-5-mib',
    outputNaming: 'inline-text',
    evidenceId: 'tool:base64-encode',
    placeholderKey: 'tools.base64Encode.placeholder',
  }),
  'base64-decode': pureTool('base64-decode', 'text', 'base64Decode'),
  'url-encode': pureTool('url-encode', 'text', 'urlEncode'),
  'url-decode': pureTool('url-decode', 'text', 'urlDecode'),
  'html-encode': pureTool('html-encode', 'text', 'htmlEncode'),
  'html-decode': pureTool('html-decode', 'text', 'htmlDecode'),
  'hex-encode': pureTool('hex-encode', 'text', 'hexEncode'),
  'hex-decode': pureTool('hex-decode', 'text', 'hexDecode'),
  'binary-encode': pureTool('binary-encode', 'text', 'binaryEncode'),
  'binary-decode': pureTool('binary-decode', 'text', 'binaryDecode'),
  'unicode-escape': pureTool('unicode-escape', 'text', 'unicodeEscape'),
  'unicode-unescape': pureTool('unicode-unescape', 'text', 'unicodeUnescape'),
  rot13: pureTool('rot13', 'text', 'rot13'),
  atbash: pureTool('atbash', 'text', 'atbash'),
  sha256: pureTool('sha256', 'hash', 'sha256', { runtimeClass: 'web-crypto' }),
  'json-prettify': pureTool('json-prettify', 'data', 'jsonPrettify'),
  'json-minify': pureTool('json-minify', 'data', 'jsonMinify'),
  'json-escape': pureTool('json-escape', 'data', 'jsonEscape'),
  'csv-to-json': pureTool('csv-to-json', 'data', 'csvToJson'),
  'dec-to-hex': pureTool('dec-to-hex', 'number', 'decToHex'),
  'hex-to-dec': pureTool('hex-to-dec', 'number', 'hexToDec'),
  'dec-to-bin': pureTool('dec-to-bin', 'number', 'decToBin'),
  'bin-to-dec': pureTool('bin-to-dec', 'number', 'binToDec'),
  'dec-to-oct': pureTool('dec-to-oct', 'number', 'decToOct'),
  'oct-to-dec': pureTool('oct-to-dec', 'number', 'octToDec'),
  'color-convert': pureTool('color-convert', 'color', 'colorConvert'),
  'css-minify': pureTool('css-minify', 'web', 'cssMinify', { category: 'data' }),
  'json-validate': pureTool('json-validate', 'web', 'jsonValidate', { category: 'data' }),
  'base64url-encode': pureTool('base64url-encode', 'web', 'base64urlEncode', { category: 'encode' }),
  'base64url-decode': pureTool('base64url-decode', 'web', 'base64urlDecode', { category: 'encode' }),
  'slug-gen': pureTool('slug-gen', 'web', 'slugGen', { category: 'utility' }),
  'char-count': pureTool('char-count', 'utility', 'charCount'),
  'reverse-text': pureTool('reverse-text', 'utility', 'reverseText'),
  'percentage-calc': pureTool('percentage-calc', 'utility', 'percentageCalc', { placeholderKey: 'tools.percentageCalc.placeholder' }),
  'aspect-ratio': pureTool('aspect-ratio', 'utility', 'aspectRatio'),
  'loan-calc': released({
    module: 'utility',
    tier: 'advanced',
    translationKey: 'loanCalc',
    runtimeClass: 'main-thread',
    inputLimitClass: 'text-5-mib',
    outputNaming: 'inline-text',
    evidenceId: 'tool:loan-calc',
    placeholderKey: 'tools.loanCalc.placeholder',
    noticeKey: 'tools.loanCalc.notice',
  }),
  'bmi-calc': released({
    module: 'utility',
    tier: 'advanced',
    translationKey: 'bmiCalc',
    runtimeClass: 'main-thread',
    inputLimitClass: 'text-5-mib',
    outputNaming: 'inline-text',
    evidenceId: 'tool:bmi-calc',
    placeholderKey: 'tools.bmiCalc.placeholder',
    noticeKey: 'tools.bmiCalc.notice',
  }),
  'png-to-jpg': released({
    module: 'imageFormat',
    tier: 'advanced',
    translationKey: 'pngToJpg',
    runtimeClass: 'canvas',
    inputLimitClass: 'image-device',
    outputNaming: 'converter-filename',
    evidenceId: 'tool:png-to-jpg',
    acceptsFile: true,
    acceptTypes: 'image/png,.png',
    isMediaConverter: true,
    limits: TOOL_LIMITS.images,
  }),
  'jpg-to-png': released({
    module: 'imageFormat',
    tier: 'advanced',
    translationKey: 'jpgToPng',
    runtimeClass: 'canvas',
    inputLimitClass: 'image-device',
    outputNaming: 'converter-filename',
    evidenceId: 'tool:jpg-to-png',
    acceptsFile: true,
    acceptTypes: 'image/jpeg,.jpg,.jpeg',
    isMediaConverter: true,
    limits: TOOL_LIMITS.images,
  }),
  'audio-to-mp3': experimentalMedia('audio-to-mp3', 'audioToMp3', 'audio/*'),
  'text-to-qr': released({
    module: 'qr',
    tier: 'core',
    translationKey: 'textToQr',
    runtimeClass: 'main-thread',
    inputLimitClass: 'text-5-mib',
    outputNaming: 'generated-image',
    evidenceId: 'tool:text-to-qr',
    showsPreview: true,
    placeholderKey: 'tools.textToQr.placeholder',
  }),
  'qr-to-text': released({
    module: 'qr',
    tier: 'experimental',
    translationKey: 'qrToText',
    runtimeClass: 'browser-api',
    inputLimitClass: 'image-device',
    outputNaming: 'inline-text',
    evidenceId: 'tool:qr-to-text',
    acceptsFile: true,
    acceptTypes: 'image/png,image/jpeg,.png,.jpg,.jpeg',
    limits: TOOL_LIMITS.images,
    isMediaConverter: true,
  }),
  'images-to-pdf': released({
    module: 'pdf',
    tier: 'core',
    translationKey: 'imagesToPdf',
    runtimeClass: 'pdf-lib',
    inputLimitClass: 'image-device',
    outputNaming: 'converter-filename',
    evidenceId: 'tool:images-to-pdf',
    acceptsFile: true,
    acceptTypes: 'image/png,image/jpeg,.png,.jpg,.jpeg',
    multipleFiles: true,
    isMediaConverter: true,
    limits: TOOL_LIMITS.images,
  }),
  'merge-pdf': released({
    module: 'pdf',
    tier: 'core',
    translationKey: 'mergePdf',
    runtimeClass: 'pdf-lib',
    inputLimitClass: 'pdf-device',
    outputNaming: 'converter-filename',
    evidenceId: 'tool:merge-pdf',
    acceptsFile: true,
    acceptTypes: 'application/pdf,.pdf',
    multipleFiles: true,
    isMediaConverter: true,
    limits: TOOL_LIMITS.pdf,
  }),
  'pdf-page-count': released({
    module: 'pdf',
    tier: 'core',
    translationKey: 'pdfPageCount',
    runtimeClass: 'pdf-lib',
    inputLimitClass: 'pdf-device',
    outputNaming: 'inline-text',
    evidenceId: 'tool:pdf-page-count',
    acceptsFile: true,
    acceptTypes: 'application/pdf,.pdf',
    isMediaConverter: true,
    limits: TOOL_LIMITS.pdf,
  }),
  'pdf-split': released({
    module: 'pdf',
    tier: 'core',
    translationKey: 'pdfSplit',
    runtimeClass: 'pdf-lib',
    inputLimitClass: 'pdf-device',
    outputNaming: 'converter-filename',
    evidenceId: 'tool:pdf-split',
    acceptsFile: true,
    acceptTypes: 'application/pdf,.pdf',
    isMediaConverter: true,
    hasTextInput: true,
    parameterPlaceholderKey: 'tools.pdfSplit.parameterPlaceholder',
    limits: TOOL_LIMITS.pdf,
  }),
  'pdf-extract-range': released({
    module: 'pdf',
    tier: 'core',
    translationKey: 'pdfExtractRange',
    runtimeClass: 'pdf-lib',
    inputLimitClass: 'pdf-device',
    outputNaming: 'converter-filename',
    evidenceId: 'tool:pdf-extract-range',
    acceptsFile: true,
    acceptTypes: 'application/pdf,.pdf',
    isMediaConverter: true,
    hasTextInput: true,
    parameterPlaceholderKey: 'tools.pdfExtractRange.parameterPlaceholder',
    limits: TOOL_LIMITS.pdf,
  }),
  'text-to-pdf': released({
    module: 'pdf',
    tier: 'core',
    translationKey: 'textToPdf',
    runtimeClass: 'pdf-lib',
    inputLimitClass: 'text-5-mib',
    outputNaming: 'converter-filename',
    evidenceId: 'tool:text-to-pdf',
    placeholderKey: 'tools.textToPdf.placeholder',
  }),
  'pdf-metadata': released({
    module: 'pdf',
    tier: 'core',
    translationKey: 'pdfMetadata',
    runtimeClass: 'pdf-lib',
    inputLimitClass: 'pdf-device',
    outputNaming: 'inline-text',
    evidenceId: 'tool:pdf-metadata',
    acceptsFile: true,
    acceptTypes: 'application/pdf,.pdf',
    isMediaConverter: true,
    limits: TOOL_LIMITS.pdf,
  }),
  'pdf-rotate': released({
    module: 'pdf',
    tier: 'core',
    translationKey: 'pdfRotate',
    runtimeClass: 'pdf-lib',
    inputLimitClass: 'pdf-device',
    outputNaming: 'converter-filename',
    evidenceId: 'tool:pdf-rotate',
    acceptsFile: true,
    acceptTypes: 'application/pdf,.pdf',
    isMediaConverter: true,
    hasTextInput: true,
    parameterPlaceholderKey: 'tools.pdfRotate.parameterPlaceholder',
    limits: TOOL_LIMITS.pdf,
  }),
})

export const releaseCatalog = Object.freeze(
  Object.entries(converterModuleIds).flatMap(([module, ids]) => ids.map((id) => {
    const metadata = releaseMetadata[id]
    if (metadata) return Object.freeze({ id, ...metadata })
    return Object.freeze({
      id,
      module,
      category: moduleCategories[module],
      tier: 'hidden',
      translationKey: id,
      hiddenReason: hiddenReasons[module],
    })
  })),
)

export const formatAuditCatalog = Object.freeze(formats.map((format) => {
  const evidence = getFormatEvidence(format.id)
  if (!evidence) {
    return Object.freeze({
      id: format.id,
      kind: 'format',
      category: 'format',
      tier: 'hidden',
      hiddenReason: 'Hidden pending an independent literal fixture with exact output and a defensible input limit.',
    })
  }
  return Object.freeze({
    id: format.id,
    kind: 'format',
    category: evidence.category,
    tier: evidence.tier,
    runtimeClass: evidence.runtimeClass,
    inputLimitClass: evidence.inputLimitClass,
    outputNaming: evidence.outputNaming,
    evidenceId: evidence.evidenceId,
    nameDe: evidence.nameDe,
    nameEn: evidence.nameEn,
    descriptionDe: evidence.descriptionDe,
    descriptionEn: evidence.descriptionEn,
  })
}))

export const releasedToolCount = releaseCatalog.filter(tool => tool.tier !== 'hidden').length

function getLocalizedTool(entry, locale) {
  const messages = getMessages(locale)
  const tool = {
    ...entry,
    tierLabel: entry.tier === 'experimental' ? translate(messages, 'labels.experimental') : null,
    name: translate(messages, `tools.${entry.translationKey}.name`),
    description: translate(messages, `tools.${entry.translationKey}.description`),
    categoryName: translate(messages, `categories.${entry.category}`),
  }
  if (entry.placeholderKey) tool.placeholder = translate(messages, entry.placeholderKey)
  if (entry.parameterPlaceholderKey) tool.textPlaceholder = translate(messages, entry.parameterPlaceholderKey)
  if (entry.noticeKey) tool.notice = translate(messages, entry.noticeKey)
  return tool
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
