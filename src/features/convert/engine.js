import { getProfile, CONVERT_LIMITS, conversionError, parsePageSelection, resolvePdfScale } from './profiles.js'
import { detectFile, readBytes } from './detection.js'
import { validateDimensions } from './imageOperations.js'

export function workerOperation(data, signal) {
  if (signal?.aborted) return Promise.reject(conversionError('cancelled'))
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./imageWorker.js', import.meta.url), { type: 'module' })
    let timer
    const finish = (error, result) => {
      clearTimeout(timer); signal?.removeEventListener('abort', abort); worker.terminate()
      if (error) reject(error); else resolve(result)
    }
    const abort = () => finish(conversionError('cancelled'))
    signal?.addEventListener('abort', abort, { once: true })
    timer = setTimeout(() => finish(conversionError('resource_limit')), CONVERT_LIMITS.timeout)
    worker.onmessage = ({ data: response }) => finish(response.error ? conversionError(response.error) : null, response.result)
    worker.onerror = () => finish(conversionError('conversion_failed'))
    worker.postMessage(data)
  })
}
export async function createZip(entries, signal) { return workerOperation({ operation: 'zip', entries }, signal) }

export async function convertFileItem(item, { signal, onProgress } = {}) {
  const from = await detectFile(item.file)
  const profile = getProfile(from, item.target)
  const stem = item.file.name.replace(/\.[^.]+$/, '') || 'result'
  if (profile.engine === 'media') {
    const { convertMediaFile } = await import('./mediaEngine.js')
    return [{ name: `${stem}.${profile.to}`, blob: await convertMediaFile(item.file, profile, item.settings, { signal, onProgress }) }]
  }
  if (profile.engine === 'image') {
    if (typeof OffscreenCanvas !== 'function') {
      const { convertImageFallback, preparePdfImages } = await import('./imageFallback.js')
      const settings = item.combinedSettings || item.settings
      const blob = profile.to === 'pdf'
        ? await workerOperation({ operation:'prepared-pdf', files:await preparePdfImages(item.combinedFiles || [item.file],settings,signal), settings },signal)
        : await convertImageFallback(item.file,profile.to,item.settings,signal)
      return [{ name:`${stem}.${profile.to === 'jpeg' ? 'jpg' : profile.to}`,blob }]
    }
    const blob = profile.to === 'pdf'
      ? await workerOperation({ operation: 'pdf', files: item.combinedFiles || [item.file], settings: item.combinedSettings || item.settings }, signal)
      : await workerOperation({ operation: 'image', file: item.file, target: profile.to, quality: item.settings.quality, settings: item.settings }, signal)
    return [{ name: `${stem}.${profile.to === 'jpeg' ? 'jpg' : profile.to}`, blob }]
  }
  const { PdfWorkerClient } = await import('../pdf/pdfClient.js')
  const client = new PdfWorkerClient()
  const abort = () => client.dispose()
  signal?.addEventListener('abort', abort, { once: true })
  const results = []
  let total = 0
  try {
    if (signal?.aborted) throw conversionError('cancelled')
    await client.open(await readBytes(item.file))
    const metadata = await client.metadata()
    const scale = resolvePdfScale(item.settings.dpi)
    const pages = parsePageSelection(item.settings.pages, metadata.pages.length)
    for (const [index, pageIndex] of pages.entries()) {
      if (signal?.aborted) throw conversionError('cancelled')
      const size = metadata.pages[pageIndex]
      const dimensions = validateDimensions({ width: Math.ceil(size.width * scale), height: Math.ceil(size.height * scale) })
      if (dimensions.width * dimensions.height > CONVERT_LIMITS.pdfPixels) throw conversionError('resource_limit')
      const rendered = await client.render(pageIndex, { scale })
      const blob = typeof OffscreenCanvas === 'function'
        ? await workerOperation({ operation: 'encode', ...rendered, target: profile.to }, signal)
        : await (await import('./imageFallback.js')).encodePixelsFallback(rendered,profile.to,signal)
      total += blob.size
      if (total > CONVERT_LIMITS.output) throw conversionError('resource_limit')
      results.push({ name: `${stem}-page-${pageIndex + 1}.${profile.to === 'jpeg' ? 'jpg' : profile.to}`, blob })
      onProgress?.((index + 1) / pages.length * 100)
    }
    return results
  } finally { signal?.removeEventListener('abort', abort); client.dispose() }
}
