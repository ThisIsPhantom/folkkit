import { inspectLogoHeader } from './qrModel.js'

export const MAX_LOGO_BYTES = 4 * 1024 * 1024
export const MAX_LOGO_DIMENSION = 4096
export const MAX_LOGO_PIXELS = 12_000_000

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

function logoError(code) {
  const error = new Error(code)
  error.code = code
  return error
}

export async function loadLogoAsset(file, { createBitmap = globalThis.createImageBitmap } = {}) {
  if (!file || !Number.isSafeInteger(file.size) || file.size < 1) throw logoError('invalid_file')
  if (file.size > MAX_LOGO_BYTES) throw logoError('too_large')

  const declaredKind = kindsByMime[String(file.type || '').toLowerCase()] || null
  const namedKind = kindFromName(file.name)
  if (!declaredKind || !namedKind || declaredKind !== namedKind) throw logoError('invalid_file')

  const headerBuffer = await file.slice(0, 64 * 1024).arrayBuffer()
  const header = inspectLogoHeader(new Uint8Array(headerBuffer), file.size)
  if (!header || header.kind !== declaredKind) throw logoError('invalid_file')
  if (
    header.width < 1
    || header.height < 1
    || header.width > MAX_LOGO_DIMENSION
    || header.height > MAX_LOGO_DIMENSION
    || header.width * header.height > MAX_LOGO_PIXELS
  ) throw logoError('too_large')
  if (typeof createBitmap !== 'function') throw logoError('unsupported_browser')

  let bitmap
  try {
    bitmap = await createBitmap(file)
  } catch {
    throw logoError('invalid_file')
  }
  if (bitmap.width !== header.width || bitmap.height !== header.height) {
    bitmap.close?.()
    throw logoError('invalid_file')
  }

  return Object.freeze({
    file,
    bitmap,
    kind: header.kind,
    width: header.width,
    height: header.height,
    name: String(file.name),
  })
}

export function computeSquareCrop(bitmap, { zoom = 1, x = 0, y = 0 } = {}) {
  const width = Number(bitmap.width)
  const height = Number(bitmap.height)
  const boundedZoom = Math.min(3, Math.max(1, Number(zoom)))
  const sourceSize = Math.min(width, height) / boundedZoom
  const xRange = width - sourceSize
  const yRange = height - sourceSize
  return {
    sx: xRange * ((Math.min(100, Math.max(-100, Number(x))) + 100) / 200),
    sy: yRange * ((Math.min(100, Math.max(-100, Number(y))) + 100) / 200),
    sourceSize,
  }
}

export function moveCropByPixels(bitmap, crop, { deltaX = 0, deltaY = 0, displaySize } = {}) {
  const width = Number(bitmap.width)
  const height = Number(bitmap.height)
  const zoom = Math.min(3, Math.max(1, Number(crop.zoom)))
  const frameSize = Number(displaySize)
  const sourceSize = Math.min(width, height) / zoom
  const mapAxis = (value, delta, range) => {
    if (!(range > 0) || !(frameSize > 0)) return 0
    const sourceDelta = -Number(delta) * sourceSize / frameSize
    return Math.min(100, Math.max(-100, Number(value) + (sourceDelta / range * 200)))
  }
  return {
    zoom,
    x: mapAxis(crop.x, deltaX, width - sourceSize),
    y: mapAxis(crop.y, deltaY, height - sourceSize),
  }
}

export function renderCroppedLogo(bitmap, crop, { size = 512, createCanvas } = {}) {
  const canvas = createCanvas ? createCanvas(size) : document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  if (!context) throw logoError('unsupported_browser')
  const source = computeSquareCrop(bitmap, crop)
  context.clearRect(0, 0, size, size)
  context.drawImage(
    bitmap,
    source.sx,
    source.sy,
    source.sourceSize,
    source.sourceSize,
    0,
    0,
    size,
    size,
  )
  return canvas.toDataURL('image/png')
}
