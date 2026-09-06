import { IMAGE_LIMITS, imageError, multiplyMatrix } from './imageModel.js'

const OUTPUT_MIME = Object.freeze({ png: 'image/png', jpeg: 'image/jpeg', webp: 'image/webp' })
const SYSTEM_FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

function abortIfNeeded(signal) {
  if (signal?.aborted) throw imageError('cancelled')
}

export function computePreviewSize(width, height, maxAxis = IMAGE_LIMITS.previewAxis) {
  if (![width, height].every(Number.isFinite) || width < 1 || height < 1 || (maxAxis !== Infinity && (!Number.isFinite(maxAxis) || maxAxis < 1))) throw imageError('invalid_settings')
  const scale = Math.min(1, maxAxis / Math.max(width, height))
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)), scale }
}

function defaultCanvasFactory(width, height) {
  if (typeof OffscreenCanvas === 'function') return new OffscreenCanvas(width, height)
  if (globalThis.document?.createElement) {
    const canvas = document.createElement('canvas')
    canvas.width = width; canvas.height = height
    return canvas
  }
  throw imageError('unsupported_browser')
}

async function defaultBitmapFactory(source) {
  if (typeof createImageBitmap !== 'function') throw imageError('unsupported_browser')
  return createImageBitmap(source, { imageOrientation: 'from-image' })
}

async function resolveBitmap(source, bitmapFactory) {
  if (source && Number.isFinite(source.width) && Number.isFinite(source.height) && typeof source.close !== 'undefined') return { bitmap: source, owned: false }
  if (source && Number.isFinite(source.width) && Number.isFinite(source.height) && !('arrayBuffer' in source)) return { bitmap: source, owned: false }
  return { bitmap: await bitmapFactory(source), owned: true }
}

function scaledMatrix(matrix, scale) {
  return multiplyMatrix([scale, 0, 0, scale, 0, 0], matrix)
}

function drawText(context, element) {
  context.fillStyle = element.color
  context.font = `${element.fontSize}px ${SYSTEM_FONT}`
  context.textBaseline = 'top'
  const lineHeight = element.fontSize * 1.2
  const paragraphs = String(element.text).split('\n')
  let y = 0
  for (const paragraph of paragraphs) {
    const words = paragraph.split(/\s+/).filter(Boolean)
    if (!words.length) { y += lineHeight; continue }
    let line = ''
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word
      const measured = typeof context.measureText === 'function' ? context.measureText(candidate).width : 0
      if (line && measured > element.width) {
        context.fillText(line, 0, y, element.width)
        y += lineHeight; line = word
        if (y >= element.height) return
      } else line = candidate
    }
    context.fillText(line, 0, y, element.width)
    y += lineHeight
    if (y >= element.height) return
  }
}

export async function paintImageDocument({
  document: imageDocument,
  source,
  resources = new Map(),
  canvas,
  maxAxis = Infinity,
  canvasFactory = defaultCanvasFactory,
  bitmapFactory = defaultBitmapFactory,
  signal,
}) {
  abortIfNeeded(signal)
  if (!imageDocument || imageDocument.width < 1 || imageDocument.height < 1 || !Array.isArray(imageDocument.sourceTransform) || !Array.isArray(imageDocument.elements)) throw imageError()
  const size = computePreviewSize(imageDocument.width, imageDocument.height, maxAxis)
  const target = canvas || canvasFactory(size.width, size.height)
  target.width = size.width; target.height = size.height
  const context = target.getContext('2d', { alpha: true })
  if (!context) throw imageError('unsupported_browser')
  context.setTransform(1, 0, 0, 1, 0, 0)
  context.clearRect(0, 0, size.width, size.height)

  const decodedSource = await resolveBitmap(source, bitmapFactory)
  try {
    abortIfNeeded(signal)
    context.save()
    context.setTransform(...scaledMatrix(imageDocument.sourceTransform, size.scale))
    context.drawImage(decodedSource.bitmap, 0, 0)
    context.restore()
  } finally {
    if (decodedSource.owned) decodedSource.bitmap.close?.()
  }

  for (const element of imageDocument.elements) {
    abortIfNeeded(signal)
    context.save()
    context.setTransform(...scaledMatrix(element.matrix, size.scale))
    context.globalAlpha = element.opacity
    if (element.type === 'text') {
      drawText(context, element)
    } else {
      const resource = resources.get(element.resourceId)
      if (!resource?.file) { context.restore(); throw imageError('invalid_file') }
      const decoded = await resolveBitmap(resource.file, bitmapFactory)
      try {
        abortIfNeeded(signal)
        context.drawImage(decoded.bitmap, 0, 0, element.width, element.height)
      } finally {
        if (decoded.owned) decoded.bitmap.close?.()
      }
    }
    context.restore()
  }
  abortIfNeeded(signal)
  return { canvas: target, width: size.width, height: size.height, scale: size.scale }
}

function canvasToBlob(canvas, options) {
  if (typeof canvas.convertToBlob === 'function') return canvas.convertToBlob(options)
  if (typeof canvas.toBlob === 'function') return new Promise((resolve, reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(imageError('invalid_file')), options.type, options.quality)
  })
  throw imageError('unsupported_browser')
}

export async function renderImageDocument({ format = 'png', quality = 0.9, ...options }) {
  const type = OUTPUT_MIME[format]
  if (!type || !Number.isFinite(Number(quality)) || Number(quality) < 0.1 || Number(quality) > 1) throw imageError('invalid_settings')
  const result = await paintImageDocument(options)
  const context = result.canvas.getContext('2d')
  if (format === 'jpeg') {
    const copy = options.canvasFactory ? options.canvasFactory(result.width, result.height) : defaultCanvasFactory(result.width, result.height)
    copy.width = result.width; copy.height = result.height
    const copyContext = copy.getContext('2d')
    copyContext.fillStyle = '#ffffff'; copyContext.fillRect(0, 0, result.width, result.height)
    copyContext.drawImage(result.canvas, 0, 0)
    result.canvas = copy
  }
  abortIfNeeded(options.signal)
  const blob = await canvasToBlob(result.canvas, { type, quality: Number(quality) })
  abortIfNeeded(options.signal)
  if (!(blob instanceof Blob) || blob.type !== type || blob.size > IMAGE_LIMITS.outputBytes) throw imageError('resource_limit')
  if (context && result.canvas !== options.canvas) context.setTransform?.(1, 0, 0, 1, 0, 0)
  return { ...result, blob }
}

export { OUTPUT_MIME, SYSTEM_FONT }
