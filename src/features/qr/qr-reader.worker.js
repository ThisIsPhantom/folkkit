import jsQR from 'jsqr'

function replyResult(imageData, width, height) {
  const decoded = jsQR(new Uint8ClampedArray(imageData), width, height, {
    inversionAttempts: 'attemptBoth',
  })
  self.postMessage({ type: 'result', value: decoded?.data ?? null })
}

self.addEventListener('message', async ({ data }) => {
  if (data?.type === 'decode-pixels') {
    if (!(data.width > 0) || !(data.height > 0) || data.width * data.height > data.maxPixels) {
      self.postMessage({ type: 'error', code: 'too_large' })
      return
    }
    replyResult(data.data, data.width, data.height)
    return
  }

  if (data?.type !== 'decode-file') return
  if (typeof createImageBitmap !== 'function' || typeof OffscreenCanvas !== 'function') {
    self.postMessage({ type: 'fallback' })
    return
  }

  let bitmap
  try {
    bitmap = await createImageBitmap(data.file)
    if (
      bitmap.width !== data.width
      || bitmap.height !== data.height
      || bitmap.width * bitmap.height > data.maxPixels
    ) throw Object.assign(new Error('invalid_file'), { code: 'invalid_file' })
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context) {
      self.postMessage({ type: 'fallback' })
      return
    }
    context.drawImage(bitmap, 0, 0)
    const pixels = context.getImageData(0, 0, bitmap.width, bitmap.height)
    replyResult(pixels.data.buffer, pixels.width, pixels.height)
  } catch (error) {
    self.postMessage({ type: 'error', code: error?.code === 'too_large' ? 'too_large' : 'invalid_file' })
  } finally {
    bitmap?.close?.()
  }
})

