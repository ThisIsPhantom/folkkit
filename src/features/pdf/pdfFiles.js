import { PDF_LIMITS, pdfError } from './pdfEngine.js'
import { parseImageDimensions } from '../../runtime/workBudgets.js'

function imageHeader(bytes) {
  const standard = parseImageDimensions(bytes)
  if (standard) return standard
  const text = (offset, size) => String.fromCharCode(...bytes.subarray(offset, offset + size))
  if (bytes.length < 30 || text(0, 4) !== 'RIFF' || text(8, 4) !== 'WEBP') return null
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const kind = 'webp'
  if (text(12, 4) === 'VP8X') return { kind, width: 1 + bytes[24] + (bytes[25] << 8) + (bytes[26] << 16), height: 1 + bytes[27] + (bytes[28] << 8) + (bytes[29] << 16) }
  if (text(12, 4) === 'VP8 ' && bytes[23] === 0x9d && bytes[24] === 1 && bytes[25] === 0x2a) return { kind, width: view.getUint16(26, true) & 0x3fff, height: view.getUint16(28, true) & 0x3fff }
  if (text(12, 4) === 'VP8L' && bytes[20] === 0x2f) return { kind, width: 1 + (view.getUint32(21, true) & 0x3fff), height: 1 + ((view.getUint32(21, true) >> 14) & 0x3fff) }
  return null
}

export async function readPdfFile(file) {
  if (!file || file.size > PDF_LIMITS.bytes || file.size < 8) throw pdfError('resource_limit')
  const bytes = new Uint8Array(await file.arrayBuffer())
  if (new TextDecoder().decode(bytes.subarray(0, 5)) !== '%PDF-') throw pdfError()
  return bytes
}
export async function readPdfImage(file) {
  if (!file || !['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 12 * 1024 * 1024) throw pdfError('resource_limit')
  const dimensions = imageHeader(new Uint8Array(await file.slice(0, 65536).arrayBuffer()))
  if (!dimensions || file.type !== `image/${dimensions.kind}`) throw pdfError()
  if (dimensions.width < 1 || dimensions.height < 1 || dimensions.width > 8192 || dimensions.height > 8192 || dimensions.width * dimensions.height > PDF_LIMITS.pixels) throw pdfError('resource_limit')
  const bitmap = await createImageBitmap(file)
  try {
    if (bitmap.width !== dimensions.width || bitmap.height !== dimensions.height) throw pdfError()
    const canvas = document.createElement('canvas')
    canvas.width = bitmap.width; canvas.height = bitmap.height
    const context = canvas.getContext('2d', { willReadFrequently: true })
    context.drawImage(bitmap, 0, 0)
    const pixels = context.getImageData(0, 0, bitmap.width, bitmap.height).data
    canvas.width = canvas.height = 0
    return { pixels, width: bitmap.width, height: bitmap.height }
  } finally { bitmap.close() }
}
export function downloadPdf(bytes, name = 'folkkit-edited.pdf') {
  const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }))
  const anchor = document.createElement('a')
  anchor.href = url; anchor.download = name
  document.body.append(anchor)
  try { anchor.click() } finally { anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000) }
}
