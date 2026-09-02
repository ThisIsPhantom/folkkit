// Image format conversions using Canvas API — zero external dependencies
import { assertImageDimensionBudget, getImageDimensionLimits } from '../runtime/workBudgets.js'

const nativeCreateImageBitmap = typeof globalThis.createImageBitmap === 'function'
  ? globalThis.createImageBitmap.bind(globalThis)
  : null
const NativeOffscreenCanvas = typeof globalThis.OffscreenCanvas === 'function'
  ? globalThis.OffscreenCanvas
  : null

function missingApiError(feature, apiName) {
  return new Error(`${feature} is not supported in this browser (missing ${apiName}).`)
}

function canvasToBlobCompat(canvas, options, nativeConvertToBlob) {
  if (typeof nativeConvertToBlob === 'function') {
    return nativeConvertToBlob(options)
  }

  if (typeof canvas.toBlob === 'function') {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas export failed: toBlob returned null.'))
          return
        }
        resolve(blob)
      }, options?.type, options?.quality)
    })
  }

  throw missingApiError('Image conversion', 'OffscreenCanvas.convertToBlob/canvas.toBlob')
}

function OffscreenCanvas(width, height) {
  if (NativeOffscreenCanvas) {
    const canvas = new NativeOffscreenCanvas(width, height)
    if (typeof canvas.convertToBlob !== 'function') {
      const nativeConvertToBlob = null
      canvas.convertToBlob = (options) => canvasToBlobCompat(canvas, options, nativeConvertToBlob)
    }
    return canvas
  }

  if (typeof document !== 'undefined' && typeof document.createElement === 'function') {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.convertToBlob = (options) => canvasToBlobCompat(canvas, options, null)
    return canvas
  }

  throw missingApiError('Image conversion', 'OffscreenCanvas')
}

async function createImageBitmap(source, ...rest) {
  if (!nativeCreateImageBitmap) {
    throw missingApiError('Image conversion', 'createImageBitmap')
  }
  const bitmap = await nativeCreateImageBitmap(source, ...rest)
  try {
    assertImageDimensionBudget({ width: bitmap.width, height: bitmap.height }, getImageDimensionLimits())
    return bitmap
  } catch (error) {
    bitmap.close?.()
    throw error
  }
}

async function convertImage(file, outputType, quality) {
  const bitmap = await createImageBitmap(file)
  try {
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
    const ctx = canvas.getContext('2d')

    // White background for JPEG (no alpha)
    if (outputType === 'image/jpeg') {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    ctx.drawImage(bitmap, 0, 0)
    return await canvas.convertToBlob({ type: outputType, quality })
  } finally {
    bitmap.close?.()
  }
}

function makeConverter(id, name, description, acceptTypes, outputType, outputExt, quality) {
  return {
    id,
    name,
    category: 'image',
    description,
    acceptsFile: true,
    acceptTypes,
    isMediaConverter: true,
    fileConvert: async (files) => {
      const file = Array.isArray(files) ? files[0] : files
      const blob = await convertImage(file, outputType, quality)
      const filename = file.name.replace(/\.[^.]+$/, '') + '.' + outputExt
      return { kind: 'download', blob, filename }
    },
  }
}

export const imageFormatConverters = [
  makeConverter(
    'png-to-jpg', 'PNG to JPG', 'Convert PNG image to JPEG',
    'image/png', 'image/jpeg', 'jpg', 0.92
  ),
  makeConverter(
    'jpg-to-png', 'JPG to PNG', 'Convert JPEG image to PNG',
    'image/jpeg', 'image/png', 'png'
  ),
  makeConverter(
    'png-to-webp', 'PNG to WebP', 'Convert PNG image to WebP',
    'image/png', 'image/webp', 'webp', 0.9
  ),
  makeConverter(
    'jpg-to-webp', 'JPG to WebP', 'Convert JPEG image to WebP',
    'image/jpeg', 'image/webp', 'webp', 0.9
  ),
  makeConverter(
    'webp-to-png', 'WebP to PNG', 'Convert WebP image to PNG',
    'image/webp', 'image/png', 'png'
  ),
  makeConverter(
    'webp-to-jpg', 'WebP to JPG', 'Convert WebP image to JPEG',
    'image/webp', 'image/jpeg', 'jpg', 0.92
  ),
  makeConverter(
    'bmp-to-png', 'BMP to PNG', 'Convert BMP image to PNG',
    'image/bmp', 'image/png', 'png'
  ),
  makeConverter(
    'any-to-png', 'Image to PNG', 'Convert any image format to PNG',
    'image/*', 'image/png', 'png'
  ),
  makeConverter(
    'any-to-jpg', 'Image to JPG', 'Convert any image format to JPEG',
    'image/*', 'image/jpeg', 'jpg', 0.92
  ),
  makeConverter(
    'any-to-webp', 'Image to WebP', 'Convert any image format to WebP',
    'image/*', 'image/webp', 'webp', 0.9
  ),
  {
    id: 'image-resize',
    name: 'Image Resize',
    category: 'image',
    description: 'Resize an image — enter width in the text field (height auto-scales)',
    acceptsFile: true,
    acceptTypes: 'image/*',
    isMediaConverter: true,
    hasTextInput: true,
    textPlaceholder: 'Width in pixels, 10–10000 (default 800)',
    fileConvert: async (files, textInput) => {
      const file = Array.isArray(files) ? files[0] : files
      const targetWidth = Math.min(10000, Math.max(10, parseInt(textInput) || 800))
      const bitmap = await createImageBitmap(file)
      const ratio = bitmap.height / bitmap.width
      const targetHeight = Math.round(targetWidth * ratio)
      const canvas = new OffscreenCanvas(targetWidth, targetHeight)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight)
      const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
      const mime = file.type === 'image/png' ? 'image/png' : file.type === 'image/webp' ? 'image/webp' : 'image/jpeg'
      const blob = await canvas.convertToBlob({ type: mime, quality: 0.92 })
      const filename = file.name.replace(/\.[^.]+$/, '') + `_${targetWidth}x${targetHeight}.${ext}`
      const url = URL.createObjectURL(blob)
      return { url, filename, size: blob.size, info: `Resized to ${targetWidth}x${targetHeight} (was ${bitmap.width}x${bitmap.height})` }
    },
  },
  {
    id: 'image-compress',
    name: 'Image Compress',
    category: 'image',
    description: 'Compress an image — enter quality 1-100 (default 70)',
    acceptsFile: true,
    acceptTypes: 'image/*',
    isMediaConverter: true,
    hasTextInput: true,
    textPlaceholder: 'Quality 1–100 (default 70, lower = smaller file)',
    fileConvert: async (files, textInput) => {
      const file = Array.isArray(files) ? files[0] : files
      const quality = Math.min(100, Math.max(1, parseInt(textInput) || 70)) / 100
      const bitmap = await createImageBitmap(file)
      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(bitmap, 0, 0)
      // Compress to WebP for best compression, or JPEG
      const blob = await canvas.convertToBlob({ type: 'image/webp', quality })
      const filename = file.name.replace(/\.[^.]+$/, '') + '_compressed.webp'
      const url = URL.createObjectURL(blob)
      const reduction = Math.round((1 - blob.size / file.size) * 100)
      return {
        url, filename, size: blob.size,
        info: `${formatSize(file.size)} → ${formatSize(blob.size)} (${reduction}% smaller)`,
      }
    },
  },
  {
    id: 'svg-to-png',
    name: 'SVG to PNG',
    category: 'image',
    description: 'Rasterize SVG to PNG — enter width (default: SVG native size)',
    acceptsFile: true,
    acceptTypes: 'image/svg+xml,.svg',
    isMediaConverter: true,
    hasTextInput: true,
    textPlaceholder: 'Width in pixels (optional)',
    fileConvert: async (files, textInput) => {
      const file = Array.isArray(files) ? files[0] : files
      const svgText = await file.text()

      return new Promise((resolve, reject) => {
        const img = new Image()
        const svgBlob = new Blob([svgText], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(svgBlob)

        img.onload = () => {
          const targetWidth = parseInt(textInput) || img.naturalWidth || 512
          const ratio = img.naturalHeight / img.naturalWidth
          const targetHeight = Math.round(targetWidth * ratio)

          const canvas = document.createElement('canvas')
          canvas.width = targetWidth
          canvas.height = targetHeight
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight)

          canvas.toBlob((blob) => {
            if (!blob) {
              URL.revokeObjectURL(url)
              reject(new Error('Failed to rasterize SVG: canvas.toBlob returned null'))
              return
            }
            URL.revokeObjectURL(url)
            const filename = file.name.replace(/\.svg$/i, '') + '.png'
            const dlUrl = URL.createObjectURL(blob)
            resolve({ url: dlUrl, filename, size: blob.size, info: `${targetWidth}x${targetHeight}` })
          }, 'image/png')
        }

        img.onerror = () => {
          URL.revokeObjectURL(url)
          reject(new Error('Failed to load SVG'))
        }

        img.src = url
      })
    },
  },
]

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// Additional image converters: rotate, flip, crop, grayscale
const imageExtras = [
  {
    id: 'image-rotate',
    name: 'Image Rotate',
    category: 'image',
    description: 'Rotate an image — enter degrees (90, 180, 270)',
    acceptsFile: true,
    acceptTypes: 'image/*',
    isMediaConverter: true,
    hasTextInput: true,
    textPlaceholder: 'Degrees: 90, 180, or 270',
    fileConvert: async (files, textInput) => {
      const file = Array.isArray(files) ? files[0] : files
      const deg = parseInt(textInput) || 90
      const bitmap = await createImageBitmap(file)
      const swap = deg === 90 || deg === 270
      const w = swap ? bitmap.height : bitmap.width
      const h = swap ? bitmap.width : bitmap.height
      const canvas = new OffscreenCanvas(w, h)
      const ctx = canvas.getContext('2d')
      ctx.translate(w / 2, h / 2)
      ctx.rotate((deg * Math.PI) / 180)
      ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2)
      const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
      const mime = file.type === 'image/png' ? 'image/png' : file.type === 'image/webp' ? 'image/webp' : 'image/jpeg'
      const blob = await canvas.convertToBlob({ type: mime, quality: 0.92 })
      const filename = file.name.replace(/\.[^.]+$/, '') + `_rotated${deg}.${ext}`
      const url = URL.createObjectURL(blob)
      return { url, filename, size: blob.size, info: `Rotated ${deg} degrees (${w}x${h})` }
    },
  },
  {
    id: 'image-flip-h',
    name: 'Image Flip Horizontal',
    category: 'image',
    description: 'Flip an image horizontally (mirror)',
    acceptsFile: true,
    acceptTypes: 'image/*',
    isMediaConverter: true,
    fileConvert: async (files) => {
      const file = Array.isArray(files) ? files[0] : files
      const bitmap = await createImageBitmap(file)
      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
      const ctx = canvas.getContext('2d')
      ctx.translate(bitmap.width, 0)
      ctx.scale(-1, 1)
      ctx.drawImage(bitmap, 0, 0)
      const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
      const mime = file.type === 'image/png' ? 'image/png' : file.type === 'image/webp' ? 'image/webp' : 'image/jpeg'
      const blob = await canvas.convertToBlob({ type: mime, quality: 0.92 })
      const filename = file.name.replace(/\.[^.]+$/, '') + `_flipped.${ext}`
      return { url: URL.createObjectURL(blob), filename, size: blob.size }
    },
  },
  {
    id: 'image-flip-v',
    name: 'Image Flip Vertical',
    category: 'image',
    description: 'Flip an image vertically',
    acceptsFile: true,
    acceptTypes: 'image/*',
    isMediaConverter: true,
    fileConvert: async (files) => {
      const file = Array.isArray(files) ? files[0] : files
      const bitmap = await createImageBitmap(file)
      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
      const ctx = canvas.getContext('2d')
      ctx.translate(0, bitmap.height)
      ctx.scale(1, -1)
      ctx.drawImage(bitmap, 0, 0)
      const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
      const mime = file.type === 'image/png' ? 'image/png' : file.type === 'image/webp' ? 'image/webp' : 'image/jpeg'
      const blob = await canvas.convertToBlob({ type: mime, quality: 0.92 })
      const filename = file.name.replace(/\.[^.]+$/, '') + `_flipped_v.${ext}`
      return { url: URL.createObjectURL(blob), filename, size: blob.size }
    },
  },
  {
    id: 'image-grayscale',
    name: 'Image Grayscale',
    category: 'image',
    description: 'Convert an image to grayscale',
    acceptsFile: true,
    acceptTypes: 'image/*',
    isMediaConverter: true,
    fileConvert: async (files) => {
      const file = Array.isArray(files) ? files[0] : files
      const bitmap = await createImageBitmap(file)
      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(bitmap, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] * 0.299 + data[i+1] * 0.587 + data[i+2] * 0.114
        data[i] = data[i+1] = data[i+2] = gray
      }
      ctx.putImageData(imageData, 0, 0)
      const blob = await canvas.convertToBlob({ type: 'image/png' })
      const filename = file.name.replace(/\.[^.]+$/, '') + '_gray.png'
      return { url: URL.createObjectURL(blob), filename, size: blob.size }
    },
  },
  {
    id: 'image-invert',
    name: 'Image Invert Colors',
    category: 'image',
    description: 'Invert all colors in an image',
    acceptsFile: true,
    acceptTypes: 'image/*',
    isMediaConverter: true,
    fileConvert: async (files) => {
      const file = Array.isArray(files) ? files[0] : files
      const bitmap = await createImageBitmap(file)
      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(bitmap, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i]
        data[i+1] = 255 - data[i+1]
        data[i+2] = 255 - data[i+2]
      }
      ctx.putImageData(imageData, 0, 0)
      const blob = await canvas.convertToBlob({ type: 'image/png' })
      const filename = file.name.replace(/\.[^.]+$/, '') + '_inverted.png'
      return { url: URL.createObjectURL(blob), filename, size: blob.size }
    },
  },
  {
    id: 'image-crop-square',
    name: 'Image Crop to Square',
    category: 'image',
    description: 'Crop an image to a centered square',
    acceptsFile: true,
    acceptTypes: 'image/*',
    isMediaConverter: true,
    fileConvert: async (files) => {
      const file = Array.isArray(files) ? files[0] : files
      const bitmap = await createImageBitmap(file)
      const size = Math.min(bitmap.width, bitmap.height)
      const x = (bitmap.width - size) / 2
      const y = (bitmap.height - size) / 2
      const canvas = new OffscreenCanvas(size, size)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(bitmap, x, y, size, size, 0, 0, size, size)
      const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
      const mime = file.type === 'image/png' ? 'image/png' : file.type === 'image/webp' ? 'image/webp' : 'image/jpeg'
      const blob = await canvas.convertToBlob({ type: mime, quality: 0.92 })
      const filename = file.name.replace(/\.[^.]+$/, '') + `_square.${ext}`
      return { url: URL.createObjectURL(blob), filename, size: blob.size, info: `Cropped to ${size}x${size}` }
    },
  },
]

const imageExtras2 = [
  {
    id: 'image-sepia',
    name: 'Image Sepia',
    category: 'image',
    description: 'Apply a sepia (vintage) filter to an image',
    acceptsFile: true,
    acceptTypes: 'image/*',
    isMediaConverter: true,
    fileConvert: async (files) => {
      const file = Array.isArray(files) ? files[0] : files
      const bitmap = await createImageBitmap(file)
      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(bitmap, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const d = imageData.data
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i+1], b = d[i+2]
        d[i]   = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189)
        d[i+1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168)
        d[i+2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131)
      }
      ctx.putImageData(imageData, 0, 0)
      const blob = await canvas.convertToBlob({ type: 'image/png' })
      const filename = file.name.replace(/\.[^.]+$/, '') + '_sepia.png'
      return { url: URL.createObjectURL(blob), filename, size: blob.size }
    },
  },
  {
    id: 'image-brightness',
    name: 'Image Brightness',
    category: 'image',
    description: 'Adjust brightness — enter a value from -100 to 100 (default: 30)',
    acceptsFile: true,
    acceptTypes: 'image/*',
    isMediaConverter: true,
    hasTextInput: true,
    textPlaceholder: 'Brightness: -100 to 100 (default: 30)',
    fileConvert: async (files, textInput) => {
      const file = Array.isArray(files) ? files[0] : files
      const amount = Math.max(-100, Math.min(100, parseInt(textInput) || 30))
      const bitmap = await createImageBitmap(file)
      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(bitmap, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const d = imageData.data
      const factor = amount * 2.55
      for (let i = 0; i < d.length; i += 4) {
        d[i]   = Math.max(0, Math.min(255, d[i] + factor))
        d[i+1] = Math.max(0, Math.min(255, d[i+1] + factor))
        d[i+2] = Math.max(0, Math.min(255, d[i+2] + factor))
      }
      ctx.putImageData(imageData, 0, 0)
      const blob = await canvas.convertToBlob({ type: 'image/png' })
      const filename = file.name.replace(/\.[^.]+$/, '') + `_bright${amount}.png`
      return { url: URL.createObjectURL(blob), filename, size: blob.size, info: `Brightness: ${amount > 0 ? '+' : ''}${amount}` }
    },
  },
  {
    id: 'image-contrast',
    name: 'Image Contrast',
    category: 'image',
    description: 'Adjust contrast — enter a value from -100 to 100 (default: 30)',
    acceptsFile: true,
    acceptTypes: 'image/*',
    isMediaConverter: true,
    hasTextInput: true,
    textPlaceholder: 'Contrast: -100 to 100 (default: 30)',
    fileConvert: async (files, textInput) => {
      const file = Array.isArray(files) ? files[0] : files
      const amount = Math.max(-100, Math.min(100, parseInt(textInput) || 30))
      const bitmap = await createImageBitmap(file)
      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(bitmap, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const d = imageData.data
      const factor = (259 * (amount + 255)) / (255 * (259 - amount))
      for (let i = 0; i < d.length; i += 4) {
        d[i]   = Math.max(0, Math.min(255, factor * (d[i] - 128) + 128))
        d[i+1] = Math.max(0, Math.min(255, factor * (d[i+1] - 128) + 128))
        d[i+2] = Math.max(0, Math.min(255, factor * (d[i+2] - 128) + 128))
      }
      ctx.putImageData(imageData, 0, 0)
      const blob = await canvas.convertToBlob({ type: 'image/png' })
      const filename = file.name.replace(/\.[^.]+$/, '') + `_contrast${amount}.png`
      return { url: URL.createObjectURL(blob), filename, size: blob.size, info: `Contrast: ${amount > 0 ? '+' : ''}${amount}` }
    },
  },
]

imageFormatConverters.push(...imageExtras, ...imageExtras2)
