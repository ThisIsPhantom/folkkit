import { parseImageDimensions } from '../../runtime/workBudgets.js'
import { CONVERT_LIMITS, conversionError, FORMAT_MIME } from './profiles.js'
import { readBytes } from './detection.js'
import { readJpegOrientation } from './jpegOrientation.js'

export function imageDimensions(bytes) {
  const standard = parseImageDimensions(bytes)
  if (standard?.kind === 'jpeg' && readJpegOrientation(bytes) >= 5) return { ...standard,width:standard.height,height:standard.width }
  if (standard) return standard
  const text = (offset, length) => String.fromCharCode(...bytes.subarray(offset, offset + length))
  if (text(0, 4) !== 'RIFF' || text(8, 4) !== 'WEBP' || bytes.length < 30) return null
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  if (text(12, 4) === 'VP8X') return { width: 1 + bytes[24] + (bytes[25] << 8) + (bytes[26] << 16), height: 1 + bytes[27] + (bytes[28] << 8) + (bytes[29] << 16) }
  if (text(12, 4) === 'VP8 ') return { width: view.getUint16(26, true) & 0x3fff, height: view.getUint16(28, true) & 0x3fff }
  if (text(12, 4) === 'VP8L' && bytes[20] === 0x2f) return { width: 1 + ((view.getUint32(21, true)) & 0x3fff), height: 1 + ((view.getUint32(21, true) >> 14) & 0x3fff) }
  return null
}
export function validateDimensions(dimensions) {
  if (!dimensions || !Number.isInteger(dimensions.width) || !Number.isInteger(dimensions.height) || dimensions.width < 1 || dimensions.height < 1 || dimensions.width > CONVERT_LIMITS.maxDimension || dimensions.height > CONVERT_LIMITS.maxDimension || dimensions.width * dimensions.height > CONVERT_LIMITS.maxPixels) throw conversionError('resource_limit')
  return dimensions
}
export function resolveImageSize(source, settings = {}) {
  const width = settings.width === '' || settings.width == null ? null : Number(settings.width)
  const height = settings.height === '' || settings.height == null ? null : Number(settings.height)
  if ([width, height].some(value => value !== null && (!Number.isInteger(value) || value < 1 || value > CONVERT_LIMITS.maxDimension))) throw conversionError('resource_limit')
  const scale = width && height ? Math.min(width / source.width, height / source.height) : width ? width / source.width : height ? height / source.height : 1
  return validateDimensions({ width: Math.max(1, Math.round(source.width * scale)), height: Math.max(1, Math.round(source.height * scale)) })
}
export function resolveOptimizedImageSize(source, settings = {}) {
  const dimensions = resolveImageSize(source, settings)
  return dimensions.width > source.width || dimensions.height > source.height ? validateDimensions({ width:source.width,height:source.height }) : dimensions
}
export function resolveOptimizationQuality(preset = 'balanced') {
  const quality = { small:70,balanced:82,high:92 }[preset]
  if (!quality) throw conversionError('invalid_settings')
  return quality
}
export function imagePdfSize(image, settings = {}) {
  if (!settings.pageSize || settings.pageSize === 'original') return [image.width * 0.75, image.height * 0.75]
  const sizes = { a4: [595.28, 841.89], letter: [612, 792] }
  const size = sizes[settings.pageSize]
  if (!size || !['portrait','landscape',undefined].includes(settings.orientation)) throw conversionError('invalid_settings')
  return settings.orientation === 'landscape' ? [size[1], size[0]] : [...size]
}
export async function rasterizeImage(file, target, quality, settings = {}) {
  validateDimensions(imageDimensions(await readBytes(file.slice(0, 64 * 1024))))
  const bitmap = await createImageBitmap(file)
  let canvas
  try {
    validateDimensions(bitmap)
    const dimensions = resolveImageSize(bitmap, settings)
    canvas = new OffscreenCanvas(dimensions.width, dimensions.height)
    const context = canvas.getContext('2d')
    if (target === 'jpeg') { context.fillStyle = '#ffffff'; context.fillRect(0, 0, canvas.width, canvas.height) }
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    const value = quality == null ? (target === 'jpeg' ? 0.92 : 0.9) : Number(quality) / 100
    if (!Number.isFinite(value) || value < 0.1 || value > 1) throw conversionError('invalid_file')
    const blob = await canvas.convertToBlob({ type: FORMAT_MIME[target], quality: value })
    if (blob.type !== FORMAT_MIME[target]) throw conversionError('unsupported_type')
    if (blob.size > CONVERT_LIMITS.output) throw conversionError('resource_limit')
    return blob
  } finally { bitmap.close(); if (canvas) { canvas.width = 1; canvas.height = 1 } }
}
export async function imagesToPdf(files, settings = {}, prepared = false) {
  const { PDFDocument } = await import('pdf-lib')
  const document = await PDFDocument.create()
  let pixels = 0
  for (const [index, file] of files.entries()) {
    const pageSettings = Array.isArray(settings) ? settings[index] : settings
    const dimensions = validateDimensions(imageDimensions(await readBytes(file.slice(0, 64 * 1024))))
    const outputDimensions = resolveImageSize(dimensions, pageSettings)
    pixels += outputDimensions.width * outputDimensions.height
    if (pixels > 60_000_000) throw conversionError('resource_limit')
    const png = prepared ? file : await rasterizeImage(file, 'png', undefined, pageSettings)
    const image = await document.embedPng(await png.arrayBuffer())
    const page = document.addPage(imagePdfSize(image, pageSettings))
    const margin = pageSettings.pageSize && pageSettings.pageSize !== 'original' ? 24 : 0
    const fit = Math.min((page.getWidth() - 2 * margin) / image.width, (page.getHeight() - 2 * margin) / image.height)
    const width = image.width * fit, height = image.height * fit
    page.drawImage(image, { x: (page.getWidth() - width) / 2, y: (page.getHeight() - height) / 2, width, height })
  }
  const bytes = await document.save()
  if (bytes.length > CONVERT_LIMITS.output) throw conversionError('resource_limit')
  return new Blob([bytes], { type: 'application/pdf' })
}
