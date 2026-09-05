import { rasterizeImage, imagesToPdf, validateDimensions } from './imageOperations.js'
import { assertArchiveBudget, conversionError, FORMAT_MIME } from './profiles.js'
import { zipSync } from 'fflate'

self.onmessage = async ({ data }) => {
  try {
    let result
    if (data.operation === 'image') result = await rasterizeImage(data.file, data.target, data.quality, data.settings)
    else if (data.operation === 'pdf') result = await imagesToPdf(data.files, data.settings)
    else if (data.operation === 'prepared-pdf') result = await imagesToPdf(data.files,data.settings,true)
    else if (data.operation === 'encode') {
      validateDimensions(data)
      const canvas = new OffscreenCanvas(data.width, data.height)
      canvas.getContext('2d').putImageData(new ImageData(data.pixels, data.width, data.height), 0, 0)
      result = await canvas.convertToBlob({ type: FORMAT_MIME[data.target], quality: 0.92 })
      canvas.width = 1; canvas.height = 1
    } else if (data.operation === 'zip') {
      assertArchiveBudget(data.entries)
      const entries = Object.create(null)
      for (const entry of data.entries) {
        entries[entry.name] = new Uint8Array(await entry.blob.arrayBuffer())
      }
      result = new Blob([zipSync(entries, { level: 0 })], { type: 'application/zip' })
    } else throw conversionError('unsupported_pair')
    self.postMessage({ result })
  } catch (error) { self.postMessage({ error: ['resource_limit', 'unsupported_type', 'unsupported_pair', 'invalid_settings'].includes(error?.code) ? error.code : 'invalid_file' }) }
}
