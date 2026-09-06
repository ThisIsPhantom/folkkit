import { DOCUMENT_FORMATS, DOCUMENT_LIMITS as L, documentError } from './documentConstants.js'
export function convertDocumentFile(file, from, to, { signal, onProgress } = {}) {
  if (signal?.aborted) return Promise.reject(documentError('cancelled'))
  if (!DOCUMENT_FORMATS.includes(from) || !DOCUMENT_FORMATS.includes(to) || from === to) return Promise.reject(documentError('unsupported_type'))
  if (!file || !Number.isFinite(file.size) || file.size <= 0) return Promise.reject(documentError('invalid_document'))
  if (file.size > (from === 'docx' ? L.docx : L.text)) return Promise.reject(documentError('document_too_large'))
  return new Promise((resolve, reject) => {
    let worker, timer, settled = false, ready = false
    const finish = (error, result) => {
      if (settled) return
      settled = true; clearTimeout(timer); signal?.removeEventListener('abort', abort)
      if (worker) { worker.onmessage = null; worker.onerror = null; worker.onmessageerror = null; worker.terminate() }
      if (error) reject(error); else resolve(result)
    }
    const abort = () => finish(documentError('cancelled'))
    try {
      worker = new Worker(new URL('./documentWorker.js', import.meta.url), { type: 'module' })
      signal?.addEventListener('abort', abort, { once: true })
      timer = setTimeout(() => finish(documentError('document_timeout')), L.timeout)
      worker.onmessage = ({ data }) => {
        if (settled) return
        if (data?.ready === true) { ready = true; return }
        if (typeof data?.progress === 'number') { onProgress?.(Math.max(0, Math.min(100, data.progress))); return }
        if (data?.error) return finish(documentError(data.error))
        if (!Array.isArray(data?.result) || data.result.length !== 1 || !(data.result[0].blob instanceof Blob) || data.result[0].blob.size <= 0 || data.result[0].blob.size > L.output) return finish(documentError('conversion_failed'))
        finish(null, data.result)
      }
      worker.onerror = () => finish(documentError(ready ? 'conversion_failed' : 'document_runtime_unavailable'))
      worker.onmessageerror = () => finish(documentError('conversion_failed'))
      worker.postMessage({ file, from, to })
      if (signal?.aborted) abort()
    } catch { finish(documentError('document_runtime_unavailable')) }
  })
}
