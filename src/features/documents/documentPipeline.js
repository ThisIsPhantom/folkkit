import { zipSync } from 'fflate'
import { detectDocumentFile } from './documentModel.js'
import { inspectDocx, decodeDocumentText, sanitizeHtml, cleanDocumentAst, documentOptions, serializeDocumentAst } from './documentSafety.js'
import { DOCUMENT_LIMITS as L, DOCUMENT_FORMATS, documentError } from './documentConstants.js'
import { loadDocumentRuntime } from './documentRuntime.js'
const mime = { docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', markdown: 'text/markdown;charset=utf-8', html: 'text/html;charset=utf-8' }
export async function processDocument(file, from, to, progress = () => {}) {
  if (!DOCUMENT_FORMATS.includes(from) || !DOCUMENT_FORMATS.includes(to) || from === to) throw documentError('unsupported_type')
  if (await detectDocumentFile(file) !== from) throw documentError('invalid_document')
  progress(10)
  const warnings = new Set(['layout_changed'])
  let input = null
  const files = Object.create(null)
  if (from === 'docx') { inspectDocx(new Uint8Array(await file.arrayBuffer())); files['input.docx'] = file }
  else {
    input = decodeDocumentText(new Uint8Array(await file.arrayBuffer()))
    if (from === 'html') { const safe = sanitizeHtml(input); input = safe.html; safe.warnings.forEach(w => warnings.add(w)) }
  }
  const pandoc = await loadDocumentRuntime()
  progress(30)
  const parsed = await pandoc.convert(documentOptions(from, 'json'), input, files)
  if (!parsed.stdout || parsed.stderr || new TextEncoder().encode(parsed.stdout).length > L.output) throw documentError('invalid_document')
  let ast
  try { ast = JSON.parse(parsed.stdout) } catch { throw documentError('invalid_document') }
  const clean = await cleanDocumentAst(ast, parsed.mediaFiles || {}, to)
  clean.warnings.forEach(w => warnings.add(w))
  progress(60)
  const resources = Object.fromEntries(Object.entries(clean.resources).map(([name, bytes]) => [name, new Blob([bytes])]))
  const output = await pandoc.convert(documentOptions('json', to), serializeDocumentAst(clean.ast), resources)
  if (output.stderr) throw documentError('conversion_failed')
  let blob
  // eslint-disable-next-line no-control-regex -- Remove unsafe download filename characters.
  const stem = String(file.name || 'document').replace(/\.[^.]+$/, '').replace(/[\\/\u0000-\u001f<>:"|?*]/g, '_').slice(0, 120) || 'document'
  let extension = to === 'markdown' ? 'md' : to
  if (to === 'docx') blob = output.files['output.docx']
  else if (to === 'html') {
    const safe = sanitizeHtml(output.stdout); safe.warnings.forEach(w => warnings.add(w))
    blob = new Blob([`<!doctype html><html><head><meta charset="utf-8"><title>Document</title></head><body>${safe.html}</body></html>`], { type: mime.html })
  } else if (Object.keys(clean.resources).length) {
    const entries = { 'document.md': new TextEncoder().encode(output.stdout), ...clean.resources }
    if (Object.values(entries).reduce((sum, bytes) => sum + bytes.length, 0) > L.output - 100_000) throw documentError('document_too_large')
    blob = new Blob([zipSync(entries, { level: 0 })], { type: 'application/zip' }); extension = 'zip'
  } else blob = new Blob([output.stdout], { type: mime.markdown })
  if (!blob?.size) throw documentError('conversion_failed')
  if (blob.size > L.output) throw documentError('document_too_large')
  if (to === 'docx') blob = new Blob([blob], { type: mime.docx })
  progress(100)
  return [{ name: `${stem}.${extension}`, blob, warnings: [...warnings] }]
}
