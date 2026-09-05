import { inspectLogoHeader } from './qrModel.js'

export const MAX_QR_IMAGE_BYTES = 12 * 1024 * 1024
export const MAX_QR_IMAGE_DIMENSION = 4096
export const MAX_QR_IMAGE_PIXELS = 12_000_000
export const QR_READER_TIMEOUT_MS = 12_000

const kindsByMime = Object.freeze({
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpeg',
  'image/webp': 'webp',
})

function kindFromName(name) {
  const value = String(name || '').toLowerCase()
  if (value.endsWith('.png')) return 'png'
  if (value.endsWith('.jpg') || value.endsWith('.jpeg')) return 'jpeg'
  if (value.endsWith('.webp')) return 'webp'
  return null
}

function readerError(code) {
  return Object.assign(new Error(code), { code })
}

export async function validateQrImageFile(file) {
  if (!file || !Number.isSafeInteger(file.size) || file.size < 1) throw readerError('invalid_file')
  if (file.size > MAX_QR_IMAGE_BYTES) throw readerError('too_large')
  const declaredKind = kindsByMime[String(file.type || '').toLowerCase()] || null
  const namedKind = kindFromName(file.name)
  if (!declaredKind || declaredKind !== namedKind) throw readerError('invalid_file')
  const headerBuffer = await file.slice(0, 64 * 1024).arrayBuffer()
  const header = inspectLogoHeader(new Uint8Array(headerBuffer), file.size)
  if (!header || header.kind !== declaredKind) throw readerError('invalid_file')
  if (
    header.width < 1
    || header.height < 1
    || header.width > MAX_QR_IMAGE_DIMENSION
    || header.height > MAX_QR_IMAGE_DIMENSION
    || header.width * header.height > MAX_QR_IMAGE_PIXELS
  ) throw readerError('too_large')
  return Object.freeze({ ...header, file })
}

function canvasPixels(source, width, height, createCanvas) {
  const canvas = createCanvas ? createCanvas(width, height) : document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) throw readerError('unsupported_browser')
  context.drawImage(source, 0, 0)
  return context.getImageData(0, 0, width, height)
}

function decodeWithImage(file, header, { createCanvas, createUrl, revokeUrl, ImageClass }) {
  return new Promise((resolve, reject) => {
    const url = createUrl(file)
    const image = new ImageClass()
    const finish = () => revokeUrl(url)
    image.onload = () => {
      try {
        if (image.naturalWidth !== header.width || image.naturalHeight !== header.height) throw readerError('invalid_file')
        resolve(canvasPixels(image, header.width, header.height, createCanvas))
      } catch (error) {
        reject(error)
      } finally {
        image.removeAttribute?.('src')
        finish()
      }
    }
    image.onerror = () => {
      finish()
      reject(readerError('invalid_file'))
    }
    image.src = url
  })
}

export async function decodeQrImageOnMainThread(file, header, {
  createBitmap = globalThis.createImageBitmap,
  createCanvas,
  createUrl = value => URL.createObjectURL(value),
  revokeUrl = value => URL.revokeObjectURL(value),
  ImageClass = globalThis.Image,
} = {}) {
  if (typeof createBitmap === 'function') {
    let bitmap
    try {
      bitmap = await createBitmap(file)
      if (bitmap.width !== header.width || bitmap.height !== header.height) throw readerError('invalid_file')
      return canvasPixels(bitmap, header.width, header.height, createCanvas)
    } catch (error) {
      if (!ImageClass) throw error?.code ? error : readerError('invalid_file')
    } finally {
      bitmap?.close?.()
    }
  }
  if (!ImageClass || typeof createUrl !== 'function' || typeof revokeUrl !== 'function') throw readerError('unsupported_browser')
  return decodeWithImage(file, header, { createCanvas, createUrl, revokeUrl, ImageClass })
}

export function safeHttpUrl(value) {
  try {
    const url = new URL(String(value).trim())
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null
  } catch {
    return null
  }
}

export function createQrReader({
  createWorker = () => new Worker(new URL('./qr-reader.worker.js', import.meta.url), { type: 'module' }),
  decodeFallback = decodeQrImageOnMainThread,
  timeoutMs = QR_READER_TIMEOUT_MS,
} = {}) {
  return Object.freeze({
    async read(file, { signal, onProgress } = {}) {
      if (signal?.aborted) throw readerError('cancelled')
      onProgress?.('validating')
      const header = await validateQrImageFile(file)
      if (signal?.aborted) throw readerError('cancelled')
      const worker = createWorker()
      return new Promise((resolve, reject) => {
        let settled = false
        const cleanup = () => {
          clearTimeout(timer)
          signal?.removeEventListener('abort', cancel)
          worker.removeEventListener('message', receive)
          worker.removeEventListener('error', failWorker)
          worker.terminate()
        }
        const settle = (callback, value) => {
          if (settled) return
          settled = true
          cleanup()
          callback(value)
        }
        const cancel = () => settle(reject, readerError('cancelled'))
        const failWorker = () => settle(reject, readerError('decode_failed'))
        const receive = async ({ data }) => {
          if (settled) return
          if (data?.type === 'result') {
            settle(data.value ? resolve : reject, data.value || readerError('not_found'))
            return
          }
          if (data?.type === 'error') {
            settle(reject, readerError(data.code || 'decode_failed'))
            return
          }
          if (data?.type !== 'fallback') return
          onProgress?.('decoding')
          try {
            const pixels = await decodeFallback(file, header)
            if (settled || signal?.aborted) return
            worker.postMessage({
              type: 'decode-pixels',
              data: pixels.data.buffer,
              width: pixels.width,
              height: pixels.height,
              maxPixels: MAX_QR_IMAGE_PIXELS,
            }, [pixels.data.buffer])
          } catch (error) {
            settle(reject, error?.code ? error : readerError('decode_failed'))
          }
        }
        const timer = setTimeout(() => settle(reject, readerError('timeout')), timeoutMs)
        signal?.addEventListener('abort', cancel, { once: true })
        worker.addEventListener('message', receive)
        worker.addEventListener('error', failWorker)
        onProgress?.('decoding')
        worker.postMessage({
          type: 'decode-file',
          file,
          width: header.width,
          height: header.height,
          maxPixels: MAX_QR_IMAGE_PIXELS,
        })
      })
    },
  })
}

const defaultReader = createQrReader()
export const readQrImage = (file, options) => defaultReader.read(file, options)

