import { readBytes } from '../convert/detection.js'
import { decodeDocumentText, inspectDocx } from './documentZip.js'
import { DOCUMENT_LIMITS, documentError } from './documentConstants.js'
export { DOCUMENT_FORMATS, DOCUMENT_LIMITS } from './documentConstants.js'
const extensions = { docx: 'docx', md: 'markdown', markdown: 'markdown', html: 'html', htm: 'html' }
const mimes = { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx', 'text/markdown': 'markdown', 'text/x-markdown': 'markdown', 'text/html': 'html' }
export async function detectDocumentFile(file) {
  const ext = String(file?.name || '').split('.').pop().toLowerCase()
  const mime = String(file?.type || '').split(';')[0].trim().toLowerCase()
  const from = extensions[ext] || mimes[mime]
  if (!from) return null
  if ((extensions[ext] && mimes[mime] && extensions[ext] !== mimes[mime]) || (mime && !mimes[mime] && !['application/octet-stream', 'text/plain'].includes(mime)) || (!extensions[ext] && ext !== String(file?.name || '').toLowerCase())) throw documentError('invalid_document')
  if (!file || !Number.isFinite(file.size) || file.size <= 0) throw documentError('invalid_document')
  if (file.size > (from === 'docx' ? DOCUMENT_LIMITS.docx : DOCUMENT_LIMITS.text)) throw documentError('document_too_large')
  let bytes
  try { bytes = await readBytes(file) } catch { throw documentError('invalid_document') }
  if (from === 'docx') inspectDocx(bytes, { inflate: false }); else decodeDocumentText(bytes)
  return from
}
