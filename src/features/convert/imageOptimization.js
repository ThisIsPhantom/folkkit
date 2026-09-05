import { detectFile, readBytes } from './detection.js'
import { IMAGE_FORMATS, conversionError } from './profiles.js'
import { imageDimensions, resolveOptimizedImageSize, resolveOptimizationQuality, validateDimensions } from './imageOperations.js'
import { workerOperation } from './engine.js'

export function selectOptimizedBlob(original,encoded,sourceDimensions,outputDimensions) {
  const unchanged = sourceDimensions.width === outputDimensions.width && sourceDimensions.height === outputDimensions.height
  return unchanged && encoded.size >= original.size ? { blob:original,keptOriginal:true } : { blob:encoded,keptOriginal:false }
}

export function optimizationFilename(name,target,keptOriginal) {
  if (keptOriginal) return String(name || 'result')
  const stem = String(name || '').replace(/\.[^.]+$/,'') || 'result'
  return `${stem}-smaller.${target === 'jpeg' ? 'jpg' : target}`
}

export async function optimizeImageItem(item,{ signal,onProgress } = {}) {
  const from = await detectFile(item.file)
  if (!IMAGE_FORMATS.includes(from) || item.target !== from) throw conversionError('unsupported_pair')
  const sourceDimensions = validateDimensions(imageDimensions(await readBytes(item.file.slice(0,64 * 1024))))
  const outputDimensions = resolveOptimizedImageSize(sourceDimensions,item.settings)
  const quality = from === 'png' ? undefined : resolveOptimizationQuality(item.settings.qualityPreset)
  const settings = { width:outputDimensions.width,height:outputDimensions.height,quality }
  let encoded
  if (typeof OffscreenCanvas !== 'function') {
    const { convertImageFallback } = await import('./imageFallback.js')
    encoded = await convertImageFallback(item.file,from,settings,signal)
  } else {
    encoded = await workerOperation({ operation:'image',file:item.file,target:from,quality,settings },signal)
  }
  if (signal?.aborted) throw conversionError('cancelled')
  const selected = selectOptimizedBlob(item.file,encoded,sourceDimensions,outputDimensions)
  onProgress?.(100)
  return [{
    name:optimizationFilename(item.file.name,from,selected.keptOriginal),
    blob:selected.blob,
    keptOriginal:selected.keptOriginal,
    sourceDimensions,
    outputDimensions,
  }]
}
