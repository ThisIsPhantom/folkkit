import { TEXT_LIMIT, TOOL_LIMITS, validateFiles } from './limits'
import { createObjectUrlRegistry } from './objectUrlRegistry'

const errorMessageKeys = Object.freeze({
  unsupported_type: 'errors.unsupportedType',
  unsupported_browser: 'errors.unsupportedBrowser',
  too_large: 'errors.tooLarge',
  invalid_file: 'errors.invalidFile',
  out_of_memory: 'errors.outOfMemory',
  cancelled: 'errors.cancelled',
  conversion_failed: 'errors.conversionFailed',
})

export class ToolRuntimeError extends Error {
  constructor(code) {
    super(code)
    this.name = 'ToolRuntimeError'
    this.code = code
    this.messageKey = errorMessageKeys[code] || errorMessageKeys.conversion_failed
  }
}

function runtimeError(code) {
  return new ToolRuntimeError(code)
}

function normalizeProgress(value) {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return null
  const percentage = numeric >= 0 && numeric <= 1 ? numeric * 100 : numeric
  return Math.round(Math.min(100, Math.max(0, percentage)))
}

function hasPdfContract(tool) {
  return tool?.limits === TOOL_LIMITS.pdf
    || String(tool?.acceptTypes || '').toLowerCase().includes('pdf')
}

async function readFilePrefix(file, length) {
  const blob = file.slice(0, length)
  if (typeof blob.arrayBuffer === 'function') {
    return new Uint8Array(await blob.arrayBuffer())
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(runtimeError('invalid_file'))
    reader.onload = () => resolve(new Uint8Array(reader.result))
    reader.readAsArrayBuffer(blob)
  })
}

async function validateSignatures(tool, files) {
  if (!hasPdfContract(tool)) return
  for (const file of files) {
    const prefix = await readFilePrefix(file, 5)
    if (String.fromCharCode(...prefix) !== '%PDF-') throw runtimeError('invalid_file')
  }
}

function normalizeResult(value) {
  if (value?.kind === 'text' && typeof value.text === 'string') return value
  if ((value?.kind === 'download' || value?.kind === 'image') && value.blob instanceof Blob) return value
  if (value?.blob instanceof Blob && typeof value.filename === 'string') {
    return { kind: 'download', blob: value.blob, filename: value.filename, ...(value.info ? { info: value.info } : {}) }
  }
  if (typeof value?.text === 'string') {
    return { kind: 'text', text: value.text, ...(value.info ? { info: value.info } : {}) }
  }
  if (typeof value === 'string') return { kind: 'text', text: value }
  throw runtimeError('conversion_failed')
}

function mapFailure(error, tool) {
  if (error instanceof ToolRuntimeError) return error
  if (errorMessageKeys[error?.code]) return runtimeError(error.code)
  if (error?.name === 'AbortError' || error?.code === 'cancelled') return runtimeError('cancelled')
  if (error instanceof RangeError || /out of memory|allocation failed|memory access/i.test(String(error?.message || ''))) {
    return runtimeError('out_of_memory')
  }
  if (hasPdfContract(tool)) return runtimeError('invalid_file')
  return runtimeError('conversion_failed')
}

function throwIfAborted(signal) {
  if (signal?.aborted) throw runtimeError('cancelled')
}

export async function executeTool({ tool, files = [], text = '', signal, onProgress, environment = globalThis }) {
  throwIfAborted(signal)
  const selectedFiles = Array.from(files || [])
  const validation = validateFiles(tool, selectedFiles, environment)
  if (!validation.ok) throw runtimeError(validation.code)
  if (new TextEncoder().encode(String(text || '')).byteLength > TEXT_LIMIT) throw runtimeError('too_large')

  let acceptsProgress = true
  let terminated = false
  const terminate = () => {
    if (terminated) return
    terminated = true
    try { tool?.terminate?.() } catch { /* cancellation must remain content-free */ }
  }
  let removeAbortListener = () => {}
  const abortPromise = signal
    ? new Promise((_resolve, reject) => {
      const onAbort = () => {
        acceptsProgress = false
        terminate()
        reject(runtimeError('cancelled'))
      }
      signal.addEventListener('abort', onAbort, { once: true })
      removeAbortListener = () => signal.removeEventListener('abort', onAbort)
    })
    : null
  const normalizedProgress = (value) => {
    if (!acceptsProgress || signal?.aborted) return
    const normalized = normalizeProgress(value)
    if (normalized !== null) onProgress?.(normalized)
  }

  try {
    await validateSignatures(tool, selectedFiles)
    throwIfAborted(signal)
    let conversion
    if (typeof tool?.fileConvert === 'function') {
      const fileInput = tool.multipleFiles ? selectedFiles : selectedFiles[0]
      conversion = tool.hasTextInput
        ? tool.fileConvert(fileInput, text, { signal, onProgress: normalizedProgress })
        : tool.fileConvert(fileInput, normalizedProgress, { signal })
    } else if (typeof tool?.convert === 'function') {
      conversion = tool.convert(text, { signal, onProgress: normalizedProgress })
    } else {
      throw runtimeError('conversion_failed')
    }
    const value = await (abortPromise ? Promise.race([conversion, abortPromise]) : conversion)
    throwIfAborted(signal)
    return normalizeResult(value)
  } catch (error) {
    throw mapFailure(error, tool)
  } finally {
    acceptsProgress = false
    removeAbortListener()
  }
}

export function createToolRuntime({ execute = executeTool, urlApi = URL } = {}) {
  const objectUrls = createObjectUrlRegistry(urlApi)
  let activeRun = 0
  let activeController = null

  function stop() {
    activeRun += 1
    activeController?.abort()
    activeController = null
    objectUrls.revokeAll()
  }

  async function run(args) {
    stop()
    const runId = activeRun
    const controller = new AbortController()
    activeController = controller
    const externalSignal = args.signal
    const forwardAbort = () => controller.abort()
    externalSignal?.addEventListener('abort', forwardAbort, { once: true })
    if (externalSignal?.aborted) controller.abort()

    try {
      const result = await execute({ ...args, signal: controller.signal })
      if (runId !== activeRun || controller.signal.aborted) return null
      const url = result.kind === 'download' || result.kind === 'image'
        ? objectUrls.create(result.blob)
        : null
      return { result, ...(url ? { url } : {}) }
    } catch (error) {
      if (runId !== activeRun) return null
      throw error
    } finally {
      externalSignal?.removeEventListener('abort', forwardAbort)
      if (runId === activeRun) activeController = null
    }
  }

  function present(result) {
    stop()
    const url = result.kind === 'download' || result.kind === 'image'
      ? objectUrls.create(result.blob)
      : null
    return { result, ...(url ? { url } : {}) }
  }

  return Object.freeze({
    run,
    present,
    cancel: stop,
    reset: stop,
    dispose: stop,
  })
}
