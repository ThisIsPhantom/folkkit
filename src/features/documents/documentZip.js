import { inflateSync } from 'fflate'
import { DOCUMENT_LIMITS as L, documentError } from './documentConstants.js'
export function decodeDocumentText(bytes) {
  try {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    // eslint-disable-next-line no-control-regex -- Reject binary control bytes in document text.
    if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(text)) throw documentError('invalid_document')
    return text
  } catch { throw documentError('invalid_document') }
}
export function inspectDocx(bytes, { inflate = true } = {}) {
  const fail = (code = 'invalid_document') => { throw documentError(code) }
  if (!(bytes instanceof Uint8Array) || bytes.length < 22) fail()
  if (bytes.length > L.docx) fail('document_too_large')
  const v = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const u16 = p => { if (p < 0 || p + 2 > bytes.length) fail(); return v.getUint16(p, true) }
  const u32 = p => { if (p < 0 || p + 4 > bytes.length) fail(); return v.getUint32(p, true) }
  let end = bytes.length - 22
  while (end >= Math.max(0, bytes.length - 65557) && u32(end) !== 0x06054b50) end--
  if (end < 0 || u32(end) !== 0x06054b50 || end + 22 + u16(end + 20) !== bytes.length) fail()
  const count = u16(end + 10), centralSize = u32(end + 12), start = u32(end + 16)
  if (count > L.entries) fail('document_too_large')
  if (!count || u16(end + 4) || u16(end + 6) || count !== u16(end + 8) || start + centralSize !== end) fail()
  let p = start, total = 0
  const names = new Set(), ranges = [], directory = []
  for (let i = 0; i < count; i++) {
    if (p + 46 > end || u32(p) !== 0x02014b50) fail()
    const flags = u16(p + 8), method = u16(p + 10), compressed = u32(p + 20), size = u32(p + 24), n = u16(p + 28), extra = u16(p + 30), comment = u16(p + 32), local = u32(p + 42)
    if (flags & 0x2041) fail('unsafe_document')
    if (![0, 8].includes(method) || u16(p + 34) || p + 46 + n + extra + comment > end) fail()
    total += size
    if (total > L.output) fail('document_too_large')
    const name = decodeDocumentText(bytes.subarray(p + 46, p + 46 + n))
    // eslint-disable-next-line no-control-regex -- ZIP paths must contain no control characters.
    if (!name || name.length > 240 || /[\\:\u0000-\u001f]/u.test(name) || name.startsWith('/') || name.split('/').some(c => c === '..' || c === '.') || name.includes('//') || names.has(name)) fail('unsafe_document')
    names.add(name)
    if (local + 30 > start || u32(local) !== 0x04034b50 || u16(local + 6) !== flags || u16(local + 8) !== method || u16(local + 26) !== n) fail()
    if (decodeDocumentText(bytes.subarray(local + 30, local + 30 + n)) !== name) fail()
    if (!(flags & 8) && (u32(local + 18) !== compressed || u32(local + 22) !== size || u32(local + 14) !== u32(p + 16))) fail()
    const dataEnd = local + 30 + n + u16(local + 28) + compressed
    if (dataEnd > start || dataEnd < local) fail()
    ranges.push([local, dataEnd])
    directory.push({name, size, method, crc: u32(p + 16), start: dataEnd - compressed, end: dataEnd})
    p += 46 + n + extra + comment
  }
  if (p !== end) fail()
  ranges.sort((a, b) => a[0] - b[0])
  if (ranges.some((range, i) => i > 0 && range[0] < ranges[i - 1][1])) fail()
  for (const required of ['[Content_Types].xml', '_rels/.rels', 'word/document.xml']) if (!names.has(required)) fail()
  if (!inflate) return directory
  const entries = Object.create(null)
  for (const item of directory) {
    const packed = bytes.subarray(item.start, item.end)
    let unpacked
    try {
      // One sentinel byte detects forged small sizes. fflate never resizes an explicit output buffer.
      unpacked = item.method === 0 ? packed : inflateSync(packed, { out: new Uint8Array(item.size + 1) })
    } catch { fail() }
    if (unpacked.length !== item.size || crc32(unpacked) !== item.crc) fail()
    entries[item.name] = unpacked
  }
  let expanded = 0
  for (const [name, data] of Object.entries(entries)) {
    expanded += data.length
    if (expanded > L.output) fail('document_too_large')
    if (/\.(?:xml|rels)$/i.test(name)) {
      const xml = decodeDocumentText(data)
      if (/<!DOCTYPE|<!ENTITY/i.test(xml)) fail('unsafe_document')
    }
  }
  const types = decodeDocumentText(entries['[Content_Types].xml'])
  const relationships = decodeDocumentText(entries['_rels/.rels'])
  const doc = decodeDocumentText(entries['word/document.xml'])
  if (!types.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml') || !relationships.includes('/officeDocument') || !relationships.includes('word/document.xml') || !/<(?:\w+:)?document[\s>]/.test(doc) || !doc.includes('wordprocessingml/2006/main')) fail()
  return entries
}

const crcTable = Uint32Array.from({ length: 256 }, (_, index) => {
  let value = index
  for (let i = 0; i < 8; i++) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1
  return value >>> 0
})
function crc32(bytes) {
  let crc = 0xffffffff
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}
