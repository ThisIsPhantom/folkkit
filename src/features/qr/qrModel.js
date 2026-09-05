import qrcode from 'qrcode-generator'

export const QR_BYTE_CAPACITY = Object.freeze({ L: 2953, M: 2331, Q: 1663, H: 1273 })

const qrTextEncoder = new TextEncoder()
qrcode.stringToBytes = value => Array.from(qrTextEncoder.encode(String(value)))

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, Number(value)))
}

export function analyseQrPayload(data, level = 'Q') {
  const value = String(data ?? '')
  const normalizedLevel = ['L', 'M', 'Q', 'H'].includes(level) ? level : 'Q'
  const bytes = qrcode.stringToBytes(value).length
  if (!value) {
    return { ok: false, reason: 'empty', level: normalizedLevel, bytes, capacity: QR_BYTE_CAPACITY[normalizedLevel] }
  }

  try {
    const qr = qrcode(0, normalizedLevel)
    qr.addData(value, 'Byte')
    qr.make()
    return {
      ok: true,
      level: normalizedLevel,
      bytes,
      capacity: QR_BYTE_CAPACITY[normalizedLevel],
      moduleCount: qr.getModuleCount(),
    }
  } catch {
    return { ok: false, reason: 'capacity', level: normalizedLevel, bytes, capacity: QR_BYTE_CAPACITY[normalizedLevel] }
  }
}

export function quietZonePixels(size, moduleCount, quietZone) {
  const width = clamp(size, 256, 1024)
  const modules = clamp(moduleCount, 21, 177)
  const requested = clamp(quietZone, 4, 12)
  return Math.ceil(width * requested / (modules + (2 * requested)))
}

export function buildQrOptions({
  data,
  size,
  quietZone,
  foreground,
  background,
  dotStyle,
  cornerSquareStyle,
  cornerDotStyle,
  logoDataUrl,
  logoSize,
  logoSpacing,
  analysis,
  type = 'svg',
}) {
  const width = clamp(size, 256, 1024)
  const hasLogo = typeof logoDataUrl === 'string' && logoDataUrl.startsWith('data:image/')
  const level = hasLogo ? 'H' : 'Q'
  const payloadAnalysis = analysis?.ok && analysis.level === level
    ? analysis
    : analyseQrPayload(data, level)
  if (!payloadAnalysis.ok) {
    const error = new Error(payloadAnalysis.reason)
    error.code = payloadAnalysis.reason
    throw error
  }

  const options = {
    type,
    width,
    height: width,
    data: String(data),
    margin: quietZonePixels(width, payloadAnalysis.moduleCount, quietZone),
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: level,
    },
    dotsOptions: { type: dotStyle, color: foreground, roundSize: dotStyle !== 'dots' },
    cornersSquareOptions: { type: cornerSquareStyle, color: foreground },
    cornersDotOptions: { type: cornerDotStyle, color: foreground },
    backgroundOptions: { color: background },
  }

  if (hasLogo) {
    options.image = logoDataUrl
    options.imageOptions = {
      saveAsBlob: false,
      hideBackgroundDots: true,
      imageSize: clamp(logoSize, 12, 24) / 100,
      margin: Math.round(clamp(logoSpacing, 0, 12)),
    }
  }
  return options
}

function channelToLinear(value) {
  const channel = value / 255
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
}

function luminance(hex) {
  const value = String(hex).replace('#', '')
  if (!/^[0-9a-f]{6}$/i.test(value)) return 0
  const channels = [0, 2, 4].map(index => channelToLinear(Number.parseInt(value.slice(index, index + 2), 16)))
  return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2])
}

export function contrastRatio(first, second) {
  const light = Math.max(luminance(first), luminance(second))
  const dark = Math.min(luminance(first), luminance(second))
  return (light + 0.05) / (dark + 0.05)
}

function readUint24LittleEndian(bytes, offset) {
  return bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16)
}

export function inspectLogoHeader(input, expectedFileSize) {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input || 0)
  if (
    bytes.length >= 24
    && [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((byte, index) => bytes[index] === byte)
  ) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
    return { kind: 'png', width: view.getUint32(16), height: view.getUint32(20) }
  }

  if (bytes.length >= 12 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    let offset = 2
    while (offset + 8 < bytes.length) {
      if (bytes[offset] !== 0xff) { offset += 1; continue }
      const marker = bytes[offset + 1]
      if (marker === 0xd8 || marker === 0xd9) { offset += 2; continue }
      const segmentLength = (bytes[offset + 2] << 8) | bytes[offset + 3]
      if (segmentLength < 2 || offset + 2 + segmentLength > bytes.length) return null
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        return {
          kind: 'jpeg',
          height: (bytes[offset + 5] << 8) | bytes[offset + 6],
          width: (bytes[offset + 7] << 8) | bytes[offset + 8],
        }
      }
      offset += 2 + segmentLength
    }
  }

  const ascii = (offset, length) => String.fromCharCode(...bytes.slice(offset, offset + length))
  if (bytes.length >= 20 && ascii(0, 4) === 'RIFF' && ascii(8, 4) === 'WEBP') {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
    const declaredFileSize = view.getUint32(4, true) + 8
    const chunkSize = view.getUint32(16, true)
    if (Number.isSafeInteger(expectedFileSize) && declaredFileSize !== expectedFileSize) return null
    if (chunkSize < 1 || chunkSize + 20 > declaredFileSize) return null
    const chunk = ascii(12, 4)
    if (chunk === 'VP8X' && chunkSize >= 10 && bytes.length >= 30) {
      return {
        kind: 'webp',
        width: readUint24LittleEndian(bytes, 24) + 1,
        height: readUint24LittleEndian(bytes, 27) + 1,
      }
    }
    if (
      chunk === 'VP8 '
      && chunkSize >= 10
      && bytes.length >= 30
      && (bytes[20] & 1) === 0
      && bytes[23] === 0x9d
      && bytes[24] === 0x01
      && bytes[25] === 0x2a
    ) {
      return {
        kind: 'webp',
        width: view.getUint16(26, true) & 0x3fff,
        height: view.getUint16(28, true) & 0x3fff,
      }
    }
    if (chunk === 'VP8L' && chunkSize >= 5 && bytes.length >= 25 && bytes[20] === 0x2f) {
      const dimensions = view.getUint32(21, true)
      return {
        kind: 'webp',
        width: (dimensions & 0x3fff) + 1,
        height: ((dimensions >>> 14) & 0x3fff) + 1,
      }
    }
  }
  return null
}

export function svgHasOnlyEmbeddedImages(svgText) {
  const parser = new DOMParser()
  const documentNode = parser.parseFromString(String(svgText), 'image/svg+xml')
  if (documentNode.querySelector('parsererror')) return false
  return Array.from(documentNode.querySelectorAll('image')).every((image) => {
    const href = image.getAttribute('href') || image.getAttribute('xlink:href') || ''
    return href.startsWith('data:image/')
  })
}
