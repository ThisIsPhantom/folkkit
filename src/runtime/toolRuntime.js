import { TEXT_LIMIT, TOOL_LIMITS, validateFiles } from './limits'
import { createObjectUrlRegistry } from './objectUrlRegistry'
import {
  IMAGE_PREFIX_LIMIT_BYTES,
  assertImageDimensionBudget,
  assertOutputBudget,
  getImageDimensionLimits,
  parseImageDimensions,
} from './workBudgets'

const errorMessageKeys = Object.freeze({
  unsupported_type: 'errors.unsupportedType',
  unsupported_pair: 'errors.unsupportedPair',
  unsupported_browser: 'errors.unsupportedBrowser',
  too_large: 'errors.tooLarge',
  invalid_file: 'errors.invalidFile',
  out_of_memory: 'errors.outOfMemory',
  cancelled: 'errors.cancelled',
  conversion_failed: 'errors.conversionFailed',
  media_runtime_unavailable: 'errors.mediaRuntimeUnavailable',
  resource_limit: 'errors.resourceLimit',
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

function hasImageContract(tool) {
  return tool?.limits === TOOL_LIMITS.images
    || String(tool?.acceptTypes || '').toLowerCase().includes('image/')
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
  const dimensionLimits = getImageDimensionLimits()
  let aggregatePixels = 0
  for (const file of files) {
    if (hasPdfContract(tool)) {
      const prefix = await readFilePrefix(file, 5)
      if (String.fromCharCode(...prefix) !== '%PDF-') throw runtimeError('invalid_file')
      continue
    }
    if (!hasImageContract(tool)) continue
    const mime = String(file.type || '').toLowerCase()
    const name = String(file.name || '').toLowerCase()
    if (mime === 'image/png' || name.endsWith('.png')) {
      const prefix = await readFilePrefix(file, IMAGE_PREFIX_LIMIT_BYTES)
      const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
      if (!signature.every((byte, index) => prefix[index] === byte)) throw runtimeError('invalid_file')
      if (['images-to-pdf', 'png-to-jpg'].includes(tool?.id)) {
        aggregatePixels += assertImageDimensionBudget(parseImageDimensions(prefix), dimensionLimits)
      }
    } else if (mime === 'image/jpeg' || mime === 'image/jpg' || name.endsWith('.jpg') || name.endsWith('.jpeg')) {
      const prefix = await readFilePrefix(file, IMAGE_PREFIX_LIMIT_BYTES)
      if (prefix[0] !== 0xff || prefix[1] !== 0xd8 || prefix[2] !== 0xff) throw runtimeError('invalid_file')
      if (['images-to-pdf', 'jpg-to-png'].includes(tool?.id)) {
        aggregatePixels += assertImageDimensionBudget(parseImageDimensions(prefix), dimensionLimits)
      }
    }
    if (aggregatePixels > dimensionLimits.maxAggregatePixels) throw runtimeError('resource_limit')
  }
}

function normalizeResult(value) {
  if (!value || typeof value !== 'object') throw runtimeError('conversion_failed')
  const hasOwnInfo = Object.hasOwn(value, 'info')
  const ownInfo = hasOwnInfo ? value.info : undefined
  if (ownInfo !== undefined && typeof ownInfo !== 'string') throw runtimeError('conversion_failed')
  const info = ownInfo === undefined ? {} : { info: ownInfo }
  if (
    value.kind === 'text'
    && hasExactResultKeys(value, ['kind', 'text', 'info'], ['kind', 'text'])
    && typeof value.text === 'string'
  ) {
    return assertOutputBudget({ kind: 'text', text: value.text, ...info })
  }
  if (
    (value.kind === 'download' || value.kind === 'image')
    && hasExactResultKeys(value, ['kind', 'blob', 'filename', 'info'], ['kind', 'blob', 'filename'])
    && value.blob instanceof Blob
    && typeof value.filename === 'string'
    && value.filename.trim()
  ) {
    return assertOutputBudget({ kind: value.kind, blob: value.blob, filename: value.filename, ...info })
  }
  throw runtimeError('conversion_failed')
}

function hasExactResultKeys(value, allowedKeys, requiredKeys) {
  const ownKeys = Reflect.ownKeys(value)
  return requiredKeys.every(key => Object.hasOwn(value, key))
    && ownKeys.every(key => typeof key === 'string' && allowedKeys.includes(key))
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
  const configuredTextLimit = Number(tool?.textLimit)
  const textLimit = Number.isFinite(configuredTextLimit) && configuredTextLimit > 0
    ? Math.min(TEXT_LIMIT, Math.floor(configuredTextLimit))
    : TEXT_LIMIT
  if (new TextEncoder().encode(String(text || '')).byteLength > textLimit) throw runtimeError('too_large')

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
    const normalized = normalizeResult(result)
    stop()
    const url = normalized.kind === 'download' || normalized.kind === 'image'
      ? objectUrls.create(normalized.blob)
      : null
    return { result: normalized, ...(url ? { url } : {}) }
  }

  return Object.freeze({
    run,
    present,
    cancel: stop,
    reset: stop,
    dispose: stop,
  })
}
