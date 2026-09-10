import { buildQrOptions, svgHasOnlyEmbeddedImages } from './qrModel.js'
import { renderCroppedLogo } from './logoAsset.js'

function qrError(code) {
  const error = new Error(code)
  error.code = code
  return error
}

export async function generateQrBlob(request, extension = 'svg') {
  if (!['png', 'svg'].includes(extension)) throw qrError('unsupported_format')
  const logoDataUrl = request.logoAsset
    ? renderCroppedLogo(request.logoAsset.bitmap, request.crop)
    : null
  const options = buildQrOptions({ ...request, logoDataUrl, type: extension === 'png' ? 'canvas' : 'svg' })
  const { default: QRCodeStyling } = await import('qr-code-styling')
  const qrCode = new QRCodeStyling(options)
  const blob = await qrCode.getRawData(extension)
  if (!(blob instanceof Blob)) throw qrError('generation_failed')

  if (extension === 'svg' && !svgHasOnlyEmbeddedImages(await blob.text())) {
    throw qrError('external_reference')
  }
  return blob
}

export function downloadQrBlob(blob, filename, urlApi = URL) {
  const url = urlApi.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.hidden = true
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => urlApi.revokeObjectURL(url), 0)
}


export function canCopyQrPng(clipboard = globalThis.navigator?.clipboard, Item = globalThis.ClipboardItem) {
  return typeof clipboard?.write === 'function' && typeof Item === 'function'
    && (typeof Item.supports !== 'function' || Item.supports('image/png'))
}

export function copyQrPng(generate, isCurrent = () => true, clipboard = globalThis.navigator?.clipboard, Item = globalThis.ClipboardItem) {
  if (!canCopyQrPng(clipboard, Item)) return Promise.reject(qrError('clipboard_unavailable'))
  const png = Promise.resolve().then(() => {
    if (!isCurrent()) throw qrError('cancelled')
    return generate()
  }).then(blob => {
    if (!isCurrent()) throw qrError('cancelled')
    if (!(blob instanceof Blob) || blob.type !== 'image/png') throw qrError('generation_failed')
    return blob
  })
  // Keep write() in the click event while the PNG is produced asynchronously.
  // A permission rejection can happen before the browser consumes this promise.
  png.catch(() => {})
  try { return Promise.resolve(clipboard.write([new Item({ 'image/png': png })])) }
  catch (error) { return Promise.reject(error) }
}
