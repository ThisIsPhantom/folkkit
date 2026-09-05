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
