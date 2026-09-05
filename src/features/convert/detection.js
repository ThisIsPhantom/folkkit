import { CONVERT_LIMITS, conversionError } from './profiles.js'

const extensions = { png: 'png', jpg: 'jpeg', jpeg: 'jpeg', webp: 'webp', pdf: 'pdf', mp3: 'mp3', wav: 'wav', wave: 'wav', flac: 'flac', ogg: 'ogg', oga: 'ogg', mp4: 'mp4', m4v: 'mp4', webm: 'webm', mov: 'mov', qt: 'mov' }
const mimes = { 'image/png': 'png', 'image/jpeg': 'jpeg', 'image/jpg': 'jpeg', 'image/webp': 'webp', 'application/pdf': 'pdf', 'audio/mpeg': 'mp3', 'audio/mp3': 'mp3', 'audio/wav': 'wav', 'audio/x-wav': 'wav', 'audio/wave': 'wav', 'audio/flac': 'flac', 'audio/x-flac': 'flac', 'audio/ogg': 'ogg', 'application/ogg': 'ogg', 'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov' }
export async function readBytes(blob) {
  if (blob.arrayBuffer) return new Uint8Array(await blob.arrayBuffer())
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(new Uint8Array(reader.result))
    reader.onerror = () => reject(conversionError('invalid_file'))
    reader.readAsArrayBuffer(blob)
  })
}
export function signatureType(bytes) {
  const text = (offset, length) => String.fromCharCode(...bytes.subarray(offset, offset + length))
  if ([137,80,78,71,13,10,26,10].every((b, i) => bytes[i] === b)) return 'png'
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'jpeg'
  if (text(0, 4) === 'RIFF' && text(8, 4) === 'WEBP') return 'webp'
  if (text(0, 5) === '%PDF-') return 'pdf'
  if (text(0, 4) === 'RIFF' && text(8, 4) === 'WAVE') return 'wav'
  if (text(0, 4) === 'fLaC') return 'flac'
  if (text(0, 4) === 'OggS') return 'ogg'
  if (text(0, 3) === 'ID3' || (bytes[0] === 255 && (bytes[1] & 0xe0) === 0xe0 && (bytes[1] & 6) !== 0)) return 'mp3'
  if ([0x1a, 0x45, 0xdf, 0xa3].every((b, i) => bytes[i] === b) && text(0, Math.min(4096, bytes.length)).includes('webm')) return 'webm'
  if (text(4, 4) === 'ftyp') return text(8, 4) === 'qt  ' ? 'mov' : 'mp4'
  return null
}
export async function detectFile(file) {
  if (!file || file.size <= 0) throw conversionError('invalid_file')
  if (file.size > CONVERT_LIMITS.perFile) throw conversionError('too_large')
  const kind = signatureType(await readBytes(file.slice(0, 64 * 1024)))
  if (!kind) throw conversionError('unsupported_type')
  if (kind === 'pdf' && file.size > CONVERT_LIMITS.pdfInput) throw conversionError('too_large')
  const ext = String(file.name || '').match(/\.([^.]+)$/)?.[1]?.toLowerCase()
  const mime = String(file.type || '').toLowerCase()
  if ((ext && extensions[ext] !== kind) || (mime && mime !== 'application/octet-stream' && mimes[mime] !== kind)) throw conversionError('type_mismatch')
  return kind
}
