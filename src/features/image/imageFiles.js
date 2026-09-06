import { readBytes, signatureType } from '../convert/detection.js'
import { imageDimensions } from '../convert/imageOperations.js'
import { assertImageDescriptor, imageError } from './imageModel.js'

const IMAGE_MIME = Object.freeze({ png: 'image/png', jpeg: 'image/jpeg', webp: 'image/webp' })
const IMAGE_EXTENSIONS = Object.freeze({ png: 'png', jpg: 'jpeg', jpeg: 'jpeg', webp: 'webp' })

function abortIfNeeded(signal) {
  if (!signal?.aborted) return
  throw imageError('cancelled')
}

export async function inspectImageFile(file, { role = 'original', signal } = {}) {
  abortIfNeeded(signal)
  if (!file || !Number.isSafeInteger(file.size) || file.size < 1) throw imageError()
  const byteLimit = role === 'watermark' ? 8 * 1024 * 1024 : 32 * 1024 * 1024
  if (file.size > byteLimit) throw imageError('resource_limit')
  const prefix = await readBytes(file.slice(0, 64 * 1024))
  abortIfNeeded(signal)
  const kind = signatureType(prefix)
  if (!['png', 'jpeg', 'webp'].includes(kind)) throw imageError('unsupported_type')
  const extension = String(file.name || '').match(/\.([^.]+)$/)?.[1]?.toLowerCase()
  const mime = String(file.type || '').toLowerCase()
  if (!extension || IMAGE_EXTENSIONS[extension] !== kind || mime !== IMAGE_MIME[kind]) throw imageError('type_mismatch')
  const dimensions = imageDimensions(prefix)
  assertImageDescriptor({ size: file.size, width: dimensions?.width, height: dimensions?.height }, role)
  return { file, kind, type: IMAGE_MIME[kind], width: dimensions.width, height: dimensions.height }
}

export async function loadImageFile(file, { role = 'original', signal, bitmapFactory = globalThis.createImageBitmap } = {}) {
  const descriptor = await inspectImageFile(file, { role, signal })
  if (typeof bitmapFactory !== 'function') throw imageError('unsupported_browser')
  let bitmap
  try {
    bitmap = await bitmapFactory(file, { imageOrientation: 'from-image' })
    abortIfNeeded(signal)
    if (bitmap.width !== descriptor.width || bitmap.height !== descriptor.height) throw imageError('invalid_file')
    if (role === 'watermark') {
      bitmap.close?.()
      return descriptor
    }
    return { ...descriptor, bitmap }
  } catch (error) {
    if (bitmap && role !== 'watermark') bitmap.close?.()
    if (error?.code) throw error
    throw imageError('invalid_file')
  }
}

export { IMAGE_EXTENSIONS, IMAGE_MIME }
