export const OUTPUT_LIMIT_BYTES = 16 * 1024 * 1024
export const BATCH_ITEM_LIMIT = 500
export const BATCH_CONCURRENCY = 4
export const LINE_NUMBER_RENDER_LIMIT = 5000
export const QR_TEXT_LIMIT_BYTES = 2048
export const IMAGE_PREFIX_LIMIT_BYTES = 64 * 1024

export const CSV_LIMITS = Object.freeze({ maxRows: 5000, maxColumns: 100, maxCells: 200000 })
export const PDF_TEXT_LIMITS = Object.freeze({
  maxLogicalLines: 5000,
  maxCharactersPerLogicalLine: 10000,
  maxEstimatedPages: 200,
})
export const PDF_WORK_LIMITS = Object.freeze({ maxPages: 1000, maxElapsedMs: 30000 })
export const MEDIA_LIMITS = Object.freeze({ maxDurationSeconds: 7200, maxElapsedMs: 120000, maxOutputBytes: 64 * 1024 * 1024 })
export const IMAGE_LIMITS = Object.freeze({
  lowMemory: Object.freeze({ maxWidth: 8192, maxHeight: 8192, maxPixels: 24_000_000, maxAggregatePixels: 60_000_000 }),
  standard: Object.freeze({ maxWidth: 16384, maxHeight: 16384, maxPixels: 64_000_000, maxAggregatePixels: 180_000_000 }),
})

export function resourceLimitError() {
  const error = new Error('resource_limit')
  error.code = 'resource_limit'
  return error
}

export function assertOutputBudget(result, limit = OUTPUT_LIMIT_BYTES) {
  const bytes = result?.kind === 'text'
    ? new TextEncoder().encode(String(result.text || '')).byteLength
    : result?.blob instanceof Blob
      ? result.blob.size
      : 0
  if (bytes > limit) throw resourceLimitError()
  return result
}

export function assertCsvBudget(input, parseRow) {
  const value = String(input).trim()
  let rows = 1
  let columns = 1
  let currentColumns = 1
  let totalCellCharacters = 0
  let headerCharacters = 0
  let inQuotes = false
  let inHeader = true
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index]
    if (character === '"') {
      if (inQuotes && value[index + 1] === '"') { totalCellCharacters += 1; if (inHeader) headerCharacters += 1; index += 1 }
      else inQuotes = !inQuotes
      continue
    }
    if (!inQuotes && character === ',') {
      currentColumns += 1
      if (currentColumns > CSV_LIMITS.maxColumns) throw resourceLimitError()
      continue
    }
    if (!inQuotes && (character === '\n' || character === '\r')) {
      if (character === '\r' && value[index + 1] === '\n') index += 1
      columns = Math.max(columns, currentColumns)
      rows += 1
      if (rows > CSV_LIMITS.maxRows) throw resourceLimitError()
      currentColumns = 1
      inHeader = false
      continue
    }
    totalCellCharacters += 1
    if (inHeader) headerCharacters += 1
  }
  columns = Math.max(columns, currentColumns)
  const cells = rows * columns
  if (cells > CSV_LIMITS.maxCells) throw resourceLimitError()
  const dataRows = Math.max(0, rows - 1)
  const estimatedOutputBytes = 2 + totalCellCharacters * 6 + dataRows * (headerCharacters * 6 + columns * 8 + 4)
  if (estimatedOutputBytes > OUTPUT_LIMIT_BYTES) throw resourceLimitError()

  const lines = value.split(/\r?\n/)
  const parsedRows = []
  for (const line of lines) {
    const columns = parseRow(line)
    if (columns.length > CSV_LIMITS.maxColumns) throw resourceLimitError()
    parsedRows.push(columns)
  }
  return parsedRows
}

export function countLinesBounded(value, limit = LINE_NUMBER_RENDER_LIMIT) {
  if (!value) return { count: 0, overflow: false }
  let count = 1
  for (let index = 0; index < value.length; index += 1) {
    if (value.charCodeAt(index) !== 10) continue
    count += 1
    if (count > limit) return { count: limit + 1, overflow: true }
  }
  return { count, overflow: false }
}

export function getImageDimensionLimits(environment = globalThis) {
  const memory = Number(environment?.deviceMemory ?? environment?.navigator?.deviceMemory)
  const width = Number(environment?.viewportWidth ?? environment?.innerWidth ?? environment?.document?.documentElement?.clientWidth)
  return (Number.isFinite(memory) && memory <= 4) || (Number.isFinite(width) && width < 768)
    ? IMAGE_LIMITS.lowMemory
    : IMAGE_LIMITS.standard
}

export function assertTextPdfBudget(input) {
  const lines = String(input).split('\n')
  if (lines.length > PDF_TEXT_LIMITS.maxLogicalLines) throw resourceLimitError()
  let estimatedWrappedLines = 0
  for (const line of lines) {
    if (line.length > PDF_TEXT_LIMITS.maxCharactersPerLogicalLine) throw resourceLimitError()
    estimatedWrappedLines += Math.max(1, Math.ceil(line.length / 90))
  }
  if (Math.ceil(estimatedWrappedLines / 50) > PDF_TEXT_LIMITS.maxEstimatedPages) throw resourceLimitError()
  return lines
}

export function parseImageDimensions(bytes) {
  const value = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes || 0)
  if (value.length >= 24 && [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((byte, index) => value[index] === byte)) {
    const view = new DataView(value.buffer, value.byteOffset, value.byteLength)
    return { kind: 'png', width: view.getUint32(16), height: view.getUint32(20) }
  }
  if (value.length < 4 || value[0] !== 0xff || value[1] !== 0xd8) return null
  let offset = 2
  while (offset + 8 < value.length) {
    if (value[offset] !== 0xff) { offset += 1; continue }
    const marker = value[offset + 1]
    if (marker === 0xd8 || marker === 0xd9) { offset += 2; continue }
    const segmentLength = (value[offset + 2] << 8) | value[offset + 3]
    if (segmentLength < 2 || offset + 2 + segmentLength > value.length) return null
    if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
      return {
        kind: 'jpeg',
        height: (value[offset + 5] << 8) | value[offset + 6],
        width: (value[offset + 7] << 8) | value[offset + 8],
      }
    }
    offset += 2 + segmentLength
  }
  return null
}

export function assertImageDimensionBudget(dimensions, limits) {
  if (!dimensions || !Number.isInteger(dimensions.width) || !Number.isInteger(dimensions.height)) throw resourceLimitError()
  const pixels = dimensions.width * dimensions.height
  if (dimensions.width < 1 || dimensions.height < 1 || dimensions.width > limits.maxWidth || dimensions.height > limits.maxHeight || pixels > limits.maxPixels) {
    throw resourceLimitError()
  }
  return pixels
}

export function readWavDurationSeconds(bytes) {
  const value = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes || 0)
  if (value.length < 44) return null
  const text = (offset, length) => String.fromCharCode(...value.slice(offset, offset + length))
  if (text(0, 4) !== 'RIFF' || text(8, 4) !== 'WAVE' || text(12, 4) !== 'fmt ' || text(36, 4) !== 'data') return null
  const view = new DataView(value.buffer, value.byteOffset, value.byteLength)
  const byteRate = view.getUint32(28, true)
  const dataBytes = view.getUint32(40, true)
  if (!byteRate || !dataBytes) return null
  const duration = dataBytes / byteRate
  return Number.isFinite(duration) && duration > 0 ? duration : null
}
