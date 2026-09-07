import { parseFragment } from 'parse5'
import { DOCUMENT_LIMITS as L, documentError } from './documentConstants.js'
export { inspectDocx, decodeDocumentText } from './documentZip.js'
const allowed = new Set('p h1 h2 h3 h4 h5 h6 div span section article header footer main blockquote pre code em strong b i u s del ins sub sup small mark abbr br hr ul ol li dl dt dd table caption colgroup col thead tbody tfoot tr th td a img figure figcaption'.split(' '))
const blocked = new Set('script style iframe frame frameset form input button textarea select option object embed applet svg math template noscript video audio source link meta base'.split(' '))
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
const safeIdentifier = value => typeof value === 'string' && /^[A-Za-z0-9_.:-]{1,100}$/.test(value) ? value : ''
export function safeLink(value) { return typeof value === 'string' && (/^https?:\/\/[^\s<>]+$/i.test(value) || /^#[A-Za-z0-9_.:-]+$/.test(value)) ? value : null }
export function rasterType(bytes) {
  if ([137,80,78,71,13,10,26,10].every((n, i) => bytes[i] === n)) return 'png'
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'jpeg'
  if (String.fromCharCode(...bytes.subarray(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.subarray(8, 12)) === 'WEBP') return 'webp'
  return null
}
export function readDataImage(value) {
  if (typeof value !== 'string' || value.length > Math.ceil(L.image * 4 / 3) + 100) return null
  const match = value.match(/^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]*={0,2})$/i)
  if (!match) return null
  try { const bytes = Uint8Array.from(atob(match[2]), c => c.charCodeAt(0)); return bytes.length <= L.image && rasterType(bytes) === match[1].toLowerCase() ? bytes : null } catch { return null }
}
export function dataImage(bytes, kind = rasterType(bytes)) {
  let binary = ''
  for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192))
  return `data:image/${kind};base64,${btoa(binary)}`
}
export function sanitizeHtml(source) {
  if (new TextEncoder().encode(source).length > L.output) throw documentError('document_too_large')
  const warnings = new Set(); let nodes = 0
  const visit = (node, depth) => {
    if (++nodes > L.nodes || depth > L.depth) throw documentError('document_too_large')
    if (node.nodeName === '#text') return escape(node.value)
    const tag = node.tagName
    if (blocked.has(tag)) return ''
    const children = () => (node.childNodes || []).map(child => visit(child, depth + 1)).join('')
    if (!allowed.has(tag)) return children()
    const attrs = Object.fromEntries((node.attrs || []).filter(a => !a.namespace && !a.prefix).map(a => [a.name, a.value]))
    const out = []
    if (tag === 'a' && safeLink(attrs.href)) out.push(`href="${escape(safeLink(attrs.href))}"`, 'rel="noreferrer noopener"')
    if (tag === 'img') {
      if (!readDataImage(attrs.src)) { warnings.add(/^data:/i.test(attrs.src || '') ? 'unsupported_images_omitted' : 'external_resources_omitted'); return '' }
      out.push(`src="${escape(attrs.src)}"`, `alt="${escape((attrs.alt || '').slice(0, 1000))}"`)
    }
    if (safeIdentifier(attrs.id)) out.push(`id="${attrs.id}"`)
    for (const key of ['colspan', 'rowspan', 'start']) if (/^\d{1,3}$/.test(attrs[key] || '')) out.push(`${key}="${attrs[key]}"`)
    return `<${tag}${out.length ? ` ${out.join(' ')}` : ''}>${['img', 'br', 'hr', 'col'].includes(tag) ? '' : `${children()}</${tag}>`}`
  }
  return { html: visit(parseFragment(source), 0), warnings: [...warnings] }
}
export function documentOptions(from, to) {
  const readers = { markdown: 'markdown-raw_html-raw_tex-yaml_metadata_block-pandoc_title_block', html: 'html', docx: 'docx', json: 'json' }
  const writers = { markdown: 'markdown-raw_html-raw_tex', html: 'html5', docx: 'docx', json: 'json' }
  if (!Object.hasOwn(readers, from) || !Object.hasOwn(writers, to) || (from !== 'json' && to !== 'json')) throw documentError('unsupported_type')
  return { from: readers[from], to: writers[to], sandbox: true, ...(from === 'docx' ? { 'input-files': ['input.docx'], 'extract-media': 'media' } : {}), ...(to === 'docx' ? { 'output-file': 'output.docx' } : {}), ...(to === 'markdown' ? { wrap: 'none' } : {}) }
}
export async function cleanDocumentAst(ast, media, target) {
  let nodes = 0, total = 0
  const resources = Object.create(null), mapped = new Map(), warnings = new Set()
  const resource = async src => {
    if (mapped.has(src)) return mapped.get(src)
    let bytes = readDataImage(src)
    if (!bytes && Object.hasOwn(media, src)) { if (media[src].size > L.image) { warnings.add('unsupported_images_omitted'); return null }; bytes = new Uint8Array(await media[src].arrayBuffer()) }
    const kind = bytes && rasterType(bytes)
    if (!kind) { warnings.add(/^data:/i.test(src) || Object.hasOwn(media, src) ? 'unsupported_images_omitted' : 'external_resources_omitted'); return null }
    total += bytes.length
    if (total > L.output / 2 || mapped.size >= L.entries) throw documentError('document_too_large')
    const name = `image-${mapped.size + 1}.${kind === 'jpeg' ? 'jpg' : kind}`
    resources[name] = bytes
    const result = target !== 'markdown' ? dataImage(bytes, kind) : name
    mapped.set(src, result); return result
  }
  const walk = async (value, depth = 0) => {
    if (++nodes > L.nodes || depth > L.depth) throw documentError('document_too_large')
    if (Array.isArray(value)) {
      if (value.length === 3 && typeof value[0] === 'string' && Array.isArray(value[1]) && Array.isArray(value[2])) return [safeIdentifier(value[0]), [], []]
      const result = []; for (const child of value) { const clean = await walk(child, depth + 1); if (clean !== undefined) result.push(clean) }; return result
    }
    if (!value || typeof value !== 'object') return value
    if (['RawBlock', 'RawInline'].includes(value.t)) return undefined
    if (value.t === 'Image') {
      const src = await resource(value.c?.[2]?.[0] || '')
      if (!src) return { t: 'Str', c: '' }
      return { t: 'Image', c: [['', [], []], await walk(value.c[1], depth + 1), [src, '']] }
    }
    if (value.t === 'Link') {
      const label = await walk(value.c[1], depth + 1), href = safeLink(value.c[2]?.[0])
      return href ? { t: 'Link', c: [['', [], []], label, [href, '']] } : { t: 'Span', c: [['', [], []], label] }
    }
    const result = {}; for (const [key, child] of Object.entries(value)) result[key] = await walk(child, depth + 1); return result
  }
  if (!ast || !Array.isArray(ast.blocks) || !Array.isArray(ast['pandoc-api-version'])) throw documentError('invalid_document')
  return { ast: { 'pandoc-api-version': ast['pandoc-api-version'], meta: {}, blocks: await walk(ast.blocks) }, resources, warnings: [...warnings] }
}
export function capWasmMemory(bytes) {
  let p = 8
  const read = () => { let value = 0, shift = 0, b; do { if (p >= bytes.length || shift > 28) throw documentError('document_runtime_unavailable'); b = bytes[p++]; value += (b & 127) * 2 ** shift; shift += 7 } while (b & 128); return value }
  const encode = n => { const out = []; do { const next = n >>> 7; out.push((n & 127) | (next ? 128 : 0)); n = next } while (n); return out }
  while (p < bytes.length) {
    const start = p, id = bytes[p++], size = read(), end = p + size
    if (end > bytes.length) throw documentError('document_runtime_unavailable')
    if (id === 5) {
      if (read() !== 1 || read() !== 0) throw documentError('document_runtime_unavailable')
      const min = read(); if (min > 8192 || p !== end) throw documentError('document_runtime_unavailable')
      const body = [1, 1, ...encode(min), ...encode(8192)], section = [5, ...encode(body.length), ...body]
      const result = new Uint8Array(bytes.length + section.length - (end - start)); result.set(bytes.subarray(0, start)); result.set(section, start); result.set(bytes.subarray(end), start + section.length); return result
    }
    p = end
  }
  throw documentError('document_runtime_unavailable')
}


// Repeated image references share JS strings but JSON serialization duplicates them.
// Count UTF-8 and JSON escapes before allocating the serialized document.
export function serializeDocumentAst(value) {
  let size = 0, nodes = 0
  const add = count => { size += count; if (size > L.output) throw documentError('document_too_large') }
  const string = text => {
    add(2)
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i)
      if (code < 32) add(6)
      else if (code === 34 || code === 92) add(2)
      else if (code < 128) add(1)
      else if (code < 2048) add(2)
      else if (code >= 0xd800 && code <= 0xdbff && text.charCodeAt(i + 1) >= 0xdc00 && text.charCodeAt(i + 1) <= 0xdfff) { add(4); i++ }
      else if (code >= 0xd800 && code <= 0xdfff) add(6)
      else add(3)
    }
  }
  const visit = (item, depth = 0) => {
    if (++nodes > L.nodes || depth > L.depth) throw documentError('document_too_large')
    if (typeof item === 'string') string(item)
    else if (Array.isArray(item)) { add(2 + item.length); for (const child of item) visit(child, depth + 1) }
    else if (item && typeof item === 'object') { const entries = Object.entries(item); add(2 + entries.length * 2); for (const [key, child] of entries) { string(key); visit(child, depth + 1) } }
    else add(32)
  }
  visit(value)
  return JSON.stringify(value)
}
