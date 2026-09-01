import { PDF_WORK_LIMITS, resourceLimitError } from './workBudgets'
import PdfWorker from '../workers/pdfWorker.js?worker'

const activeWorkers = new Set()

function codedError(code) {
  const error = new Error(code)
  error.code = code
  return error
}

function normalizeWorkerResult(result) {
  if (result?.kind === 'text' && typeof result.text === 'string') return { kind: 'text', text: result.text }
  if (result?.kind === 'download' && result.bytes && typeof result.filename === 'string') {
    return {
      kind: 'download',
      blob: new Blob([result.bytes], { type: result.mimeType || 'application/pdf' }),
      filename: result.filename,
      ...(typeof result.info === 'string' ? { info: result.info } : {}),
    }
  }
  throw codedError('invalid_file')
}

export function terminatePdfWorkers() {
  for (const worker of activeWorkers) {
    try { worker.terminate() } catch { /* best effort */ }
  }
  activeWorkers.clear()
}

export async function runPdfWorkerTask({
  operation,
  files = [],
  textInput = '',
  signal,
  maxElapsedMs = PDF_WORK_LIMITS.maxElapsedMs,
  WorkerCtor = PdfWorker,
} = {}) {
  if (typeof WorkerCtor !== 'function' || (import.meta.env?.MODE === 'test' && WorkerCtor === PdfWorker)) {
    if (import.meta.env?.MODE === 'test') {
      const { runPdfOperation } = await import('../workers/pdfWorkerOperations')
      const payloadFiles = await Promise.all(Array.from(files).map(async file => ({
        name: String(file.name || 'document.pdf'),
        type: String(file.type || 'application/pdf'),
        bytes: new Uint8Array(await file.arrayBuffer()),
      })))
      return normalizeWorkerResult(await runPdfOperation({ operation, files: payloadFiles, textInput }))
    }
    throw codedError('unsupported_browser')
  }
  if (signal?.aborted) throw codedError('cancelled')
  const payloadFiles = await Promise.all(Array.from(files).map(async file => ({
    name: String(file.name || 'document.pdf'),
    type: String(file.type || 'application/pdf'),
    bytes: await file.arrayBuffer(),
  })))
  if (signal?.aborted) throw codedError('cancelled')
  const worker = WorkerCtor === PdfWorker
    ? new WorkerCtor({ name: 'folkkit-pdf' })
    : new WorkerCtor('folkkit-pdf-worker', { type: 'module', name: 'folkkit-pdf' })
  activeWorkers.add(worker)
  return new Promise((resolve, reject) => {
    let settled = false
    const finish = (callback, value) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      signal?.removeEventListener('abort', onAbort)
      activeWorkers.delete(worker)
      try { worker.terminate() } catch { /* best effort */ }
      callback(value)
    }
    const onAbort = () => finish(reject, codedError('cancelled'))
    const timer = setTimeout(() => finish(reject, resourceLimitError()), maxElapsedMs)
    signal?.addEventListener('abort', onAbort, { once: true })
    worker.onerror = () => finish(reject, codedError('invalid_file'))
    worker.onmessage = ({ data }) => {
      if (!data?.ok) {
        finish(reject, codedError(data?.code === 'resource_limit' ? 'resource_limit' : 'invalid_file'))
        return
      }
      try { finish(resolve, normalizeWorkerResult(data.result)) } catch (error) { finish(reject, error) }
    }
    const transfer = payloadFiles.map(file => file.bytes)
    worker.postMessage({ operation, files: payloadFiles, textInput }, transfer)
  })
}
