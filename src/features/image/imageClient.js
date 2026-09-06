import { IMAGE_LIMITS, imageError } from './imageModel.js'
import { renderImageDocument } from './imageRenderer.js'

let nextRequestId = 1

function normalizeCode(code) {
  return ['cancelled', 'resource_limit', 'invalid_settings', 'unsupported_browser'].includes(code) ? code : 'invalid_file'
}

function resourcePayload(resources) {
  return [...resources.entries()].map(([id, resource]) => ({ id, file: resource.file }))
}

function workerExport({ source, document, resources, format, quality, signal, WorkerCtor, timeoutMs }) {
  const id = `imageEditorWorker-${nextRequestId++}`
  const worker = WorkerCtor
    ? new WorkerCtor()
    : new Worker(new URL('./imageEditorWorker.js', import.meta.url), { type: 'module', name: 'imageEditorWorker-export' })
  return new Promise((resolve, reject) => {
    let settled = false
    const finish = (callback, value) => {
      if (settled) return
      settled = true; clearTimeout(timer); signal?.removeEventListener('abort', abort); worker.terminate(); callback(value)
    }
    const abort = () => finish(reject, imageError('cancelled'))
    const timer = setTimeout(() => finish(reject, imageError('resource_limit')), timeoutMs)
    signal?.addEventListener('abort', abort, { once: true })
    worker.onmessage = ({ data }) => {
      if (data?.id !== id) return
      if (!data.ok) return finish(reject, imageError(normalizeCode(data.code)))
      if (!(data.blob instanceof Blob) || data.blob.size > IMAGE_LIMITS.outputBytes) return finish(reject, imageError('resource_limit'))
      finish(resolve, data.blob)
    }
    worker.onerror = () => finish(reject, imageError('invalid_file'))
    if (signal?.aborted) return abort()
    try { worker.postMessage({ id, command: 'render', source, document, resources: resourcePayload(resources), format, quality }) }
    catch { finish(reject, imageError('invalid_file')) }
  })
}

async function fallbackExport({ source, document, resources, format, quality, signal, renderer, timeoutMs }) {
  const timeout = new AbortController()
  let timedOut = false
  const abort = () => timeout.abort()
  signal?.addEventListener('abort', abort, { once: true })
  const timer = setTimeout(() => { timedOut = true; timeout.abort() }, timeoutMs)
  try {
    if (signal?.aborted) throw imageError('cancelled')
    const result = await Promise.race([
      renderer({ source, document, resources, format, quality, signal: timeout.signal }),
      new Promise((_, reject) => timeout.signal.addEventListener('abort', () => reject(imageError(timedOut ? 'resource_limit' : 'cancelled')), { once: true })),
    ])
    if (signal?.aborted) throw imageError('cancelled')
    const blob = result instanceof Blob ? result : result?.blob
    if (!(blob instanceof Blob) || blob.size > IMAGE_LIMITS.outputBytes) throw imageError('resource_limit')
    return blob
  } finally {
    clearTimeout(timer); signal?.removeEventListener('abort', abort)
  }
}

export function exportImage({
  source,
  document,
  resources = new Map(),
  format = 'png',
  quality = 0.9,
  signal,
  WorkerCtor,
  workerSupported = typeof Worker === 'function' && typeof OffscreenCanvas === 'function',
  renderer = renderImageDocument,
  timeoutMs = IMAGE_LIMITS.timeoutMs,
}) {
  if (!['png', 'jpeg', 'webp'].includes(format)) return Promise.reject(imageError('invalid_settings'))
  if (workerSupported) return workerExport({ source, document, resources, format, quality, signal, WorkerCtor, timeoutMs })
  return fallbackExport({ source, document, resources, format, quality, signal, renderer, timeoutMs })
}

export function downloadImage(blob, fileName) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url; anchor.download = fileName
  document.body.append(anchor)
  try { anchor.click() } finally { anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000) }
}
