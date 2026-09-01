import { IMAGE_ACCEPT_TYPES, TOOL_LIMITS } from '../runtime/limits'

function qrFailure(code) {
  const error = new Error(code)
  error.code = code
  return error
}

export const qrConverters = [
  {
    id: 'text-to-qr',
    name: 'Text to QR Code',
    category: 'encode',
    description: 'Generate a QR code from any text or URL',
    convert: async (input) => {
      if (!input.trim()) return ''
      const QRCode = (await import('qrcode')).default
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
      const svg = await QRCode.toString(input, {
        type: 'svg',
        width: 300,
        margin: 2,
        color: {
          dark: isDark ? '#e8e5de' : '#2c2a25',
          light: isDark ? '#1a1916' : '#faf8f5',
        },
      })
      return {
        kind: 'image',
        blob: new Blob([svg], { type: 'image/svg+xml' }),
        filename: 'folkkit-qr.svg',
      }
    },
    showsPreview: true,
  },
  {
    id: 'qr-to-text',
    name: 'QR Code Reader',
    category: 'encode',
    description: 'Read text from a QR code image — drop or upload a QR code',
    acceptsFile: true,
    acceptTypes: IMAGE_ACCEPT_TYPES,
    limits: TOOL_LIMITS.images,
    isMediaConverter: true,
    fileConvert: async (files) => {
      const file = Array.isArray(files) ? files[0] : files

      if (typeof globalThis.BarcodeDetector !== 'function') {
        throw qrFailure('unsupported_browser')
      }

      if (typeof globalThis.createImageBitmap !== 'function') {
        throw qrFailure('unsupported_browser')
      }

      let bitmap
      try {
        bitmap = await globalThis.createImageBitmap(file)
        const detector = new globalThis.BarcodeDetector({ formats: ['qr_code'] })
        const results = await detector.detect(bitmap)
        if (results.length > 0 && results[0].rawValue) {
          return { kind: 'text', text: results[0].rawValue }
        }
        throw qrFailure('invalid_file')
      } catch (error) {
        if (error?.code) throw error
        throw qrFailure('invalid_file')
      } finally {
        bitmap?.close?.()
      }
    },
  },
]
