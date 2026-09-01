// Media converters use the browser's MediaRecorder, Canvas, and Web Audio APIs
// For more complex conversions, we use ffmpeg.wasm loaded on demand

import { runtimeAssetUrl } from '../runtime/runtimeAssets'
import { TOOL_LIMITS } from '../runtime/limits'
import { MEDIA_LIMITS, readWavDurationSeconds, resourceLimitError } from '../runtime/workBudgets'

let ffmpegLoadListeners = []
let ffmpegTempFileCounter = 0

export function onFFmpegLoad(fn) {
  ffmpegLoadListeners.push(fn)
  return () => { ffmpegLoadListeners = ffmpegLoadListeners.filter(l => l !== fn) }
}

export function attachMediaProgress(ffmpeg, onProgress) {
  if (!onProgress) return () => {}
  const listener = ({ progress }) => onProgress(Math.round(progress * 100))
  ffmpeg.on('progress', listener)
  return () => ffmpeg.off('progress', listener)
}

function notifyLoadListeners(status) {
  for (const fn of ffmpegLoadListeners) fn(status)
}

function abortLoadError() {
  const error = new Error('cancelled')
  error.name = 'AbortError'
  return error
}

function mediaRuntimeUnavailableError() {
  const error = new Error('media_runtime_unavailable')
  error.code = 'media_runtime_unavailable'
  return error
}

export function createFFmpegRuntime({
  baseURL,
  createFFmpeg,
  ensureAsset = async () => {},
  notify,
  isOnline = () => globalThis.navigator?.onLine !== false,
}) {
  let generation = 0
  let activeInstance = null
  let ready = false
  let loadState = null

  const beginLoad = (state) => (async () => {
    notify('downloading')
    let ffmpeg = null
    let phase = 'wrapper'
    try {
      ffmpeg = await createFFmpeg()
      if (state.generation !== generation) {
        ffmpeg.terminate?.()
        throw abortLoadError()
      }
      activeInstance = ffmpeg
      const coreURL = `${baseURL}/ffmpeg-core.js`
      const wasmURL = `${baseURL}/ffmpeg-core.wasm`
      phase = 'core'
      await ensureAsset(coreURL, 'text/javascript')
      if (state.generation !== generation) throw abortLoadError()
      await ensureAsset(wasmURL, 'application/wasm')
      if (state.generation !== generation) throw abortLoadError()
      phase = 'engine'
      await ffmpeg.load({
        coreURL,
        wasmURL,
      })
      if (state.generation !== generation || activeInstance !== ffmpeg) throw abortLoadError()
      ready = true
      notify('ready')
      return ffmpeg
    } catch (error) {
      if (state.generation === generation) {
        if (ffmpeg && activeInstance === ffmpeg) {
          try { ffmpeg.terminate?.() } catch { /* best-effort worker cleanup */ }
          activeInstance = null
        }
        ready = false
        if (error?.name !== 'AbortError') notify('error')
      }
      if (state.generation !== generation) throw abortLoadError()
      if (error?.name !== 'AbortError' && (phase === 'core' || !isOnline())) {
        throw mediaRuntimeUnavailableError()
      }
      throw error
    }
  })()

  const get = () => {
    if (ready && activeInstance) return Promise.resolve(activeInstance)
    if (loadState?.generation === generation) return loadState.promise
    const state = { generation, promise: null }
    state.promise = beginLoad(state).finally(() => {
      if (loadState === state) loadState = null
    })
    loadState = state
    return state.promise
  }

  const terminate = () => {
    generation += 1
    ready = false
    loadState = null
    const instance = activeInstance
    activeInstance = null
    try { instance?.terminate?.() } catch { /* cancellation cleanup is best effort */ }
  }

  return Object.freeze({ get, terminate })
}

const ffmpegRuntime = createFFmpegRuntime({
  baseURL: runtimeAssetUrl('vendor/ffmpeg'),
  createFFmpeg: async () => {
    const { FFmpeg } = await import('@ffmpeg/ffmpeg')
    return new FFmpeg()
  },
  ensureAsset: async (url, expectedType) => {
    const response = await fetch(url, { method: 'HEAD', cache: 'no-store' })
    const contentType = response.headers.get('content-type')?.toLowerCase() || ''
    if (!response.ok || !contentType.startsWith(expectedType)) {
      throw new TypeError(`FFmpeg asset is unavailable: ${url}`)
    }
  },
  notify: notifyLoadListeners,
})

export function terminateMediaExecution() {
  ffmpegRuntime.terminate()
}

export async function preflightMediaFile(file, {
  createMediaElement = (kind) => document.createElement(kind),
  urlApi = URL,
  metadataTimeoutMs = 5000,
} = {}) {
  const type = String(file?.type || '').toLowerCase()
  const name = String(file?.name || '').toLowerCase()
  if (type === 'audio/wav' || type === 'audio/wave' || name.endsWith('.wav')) {
    const prefix = new Uint8Array(await file.slice(0, 44).arrayBuffer())
    const duration = readWavDurationSeconds(prefix)
    if (duration !== null && duration > MEDIA_LIMITS.maxDurationSeconds) throw resourceLimitError()
    return { durationSeconds: duration, reliable: duration !== null }
  }
  if (!type.startsWith('audio/') && !type.startsWith('video/')) throw resourceLimitError()
  if (typeof createMediaElement !== 'function' || typeof urlApi?.createObjectURL !== 'function') throw resourceLimitError()
  const media = createMediaElement(type.startsWith('video/') ? 'video' : 'audio')
  const objectUrl = urlApi.createObjectURL(file)
  let timer
  let onLoaded
  let onError
  try {
    const duration = await new Promise((resolve, reject) => {
      onLoaded = () => {
        const value = Number(media.duration)
        if (!Number.isFinite(value) || value <= 0) reject(resourceLimitError())
        else resolve(value)
      }
      onError = () => reject(resourceLimitError())
      media.addEventListener('loadedmetadata', onLoaded, { once: true })
      media.addEventListener('error', onError, { once: true })
      timer = setTimeout(() => reject(resourceLimitError()), metadataTimeoutMs)
      media.preload = 'metadata'
      media.src = objectUrl
      media.load()
    })
    if (duration > MEDIA_LIMITS.maxDurationSeconds) throw resourceLimitError()
    return { durationSeconds: duration, reliable: true }
  } finally {
    clearTimeout(timer)
    media.removeEventListener?.('loadedmetadata', onLoaded)
    media.removeEventListener?.('error', onError)
    media.removeAttribute?.('src')
    try { media.load?.() } catch { /* cleanup remains best effort */ }
    urlApi.revokeObjectURL?.(objectUrl)
  }
}

export async function executeFfmpegWithBudget(ffmpeg, args, {
  maxElapsedMs = MEDIA_LIMITS.maxElapsedMs,
  onTimeout = () => ffmpeg.terminate?.(),
} = {}) {
  const output = args.at(-1)
  if (typeof output !== 'string' || args.length < 2) throw resourceLimitError()
  const boundedArgs = [
    '-timelimit', '120',
    ...args.slice(0, -1),
    '-t', String(MEDIA_LIMITS.maxDurationSeconds),
    '-fs', String(MEDIA_LIMITS.maxOutputBytes + 1),
    output,
  ]
  let timer
  try {
    return await Promise.race([
      ffmpeg.exec(boundedArgs),
      new Promise((_resolve, reject) => {
        timer = setTimeout(() => {
          try { onTimeout() } catch { /* best effort */ }
          reject(resourceLimitError())
        }, maxElapsedMs)
      }),
    ])
  } finally {
    clearTimeout(timer)
  }
}

async function getFFmpeg() {
  return ffmpegRuntime.get()
}

function createTempFileName(prefix, extension = '') {
  ffmpegTempFileCounter += 1
  return `${prefix}-${Date.now()}-${ffmpegTempFileCounter}${extension}`
}

async function safeDeleteTempFile(ffmpeg, filename) {
  try {
    await ffmpeg.deleteFile(filename)
  } catch {
    // ignore missing temp files
  }
}

async function convertMedia(file, outputExt, mimeType, onProgress) {
  await preflightMediaFile(file)
  const ffmpeg = await getFFmpeg()

  const inputName = createTempFileName('input', getExtension(file.name))
  const outputName = createTempFileName('output', '.' + outputExt)

  const { fetchFile } = await import('@ffmpeg/util')
  try {
    await ffmpeg.writeFile(inputName, await fetchFile(file))

    const detachProgress = attachMediaProgress(ffmpeg, onProgress)

    try {
      await executeFfmpegWithBudget(ffmpeg, ['-i', inputName, outputName], { onTimeout: terminateMediaExecution })

      const data = await ffmpeg.readFile(outputName)
      const blob = new Blob([data], { type: mimeType })
      if (blob.size > MEDIA_LIMITS.maxOutputBytes) throw resourceLimitError()
      return blob
    } finally {
      detachProgress()
    }
  } finally {
    await safeDeleteTempFile(ffmpeg, inputName)
    await safeDeleteTempFile(ffmpeg, outputName)
  }
}

function getExtension(filename) {
  const dot = filename.lastIndexOf('.')
  return dot >= 0 ? filename.substring(dot) : ''
}

export function createMediaDownloadResult(blob, filename) {
  return { kind: 'download', blob, filename }
}

export const mediaConverters = [
  {
    id: 'video-to-audio',
    name: 'Video to Audio (MP3)',
    category: 'media',
    description: 'Extract audio from a video file as MP3',
    acceptsFile: true,
    acceptTypes: 'video/*',
    isMediaConverter: true,
    fileConvert: async (file, onProgress) => {
      const blob = await convertMedia(file, 'mp3', 'audio/mpeg', onProgress)
      const name = file.name.replace(/\.[^.]+$/, '') + '.mp3'
      return createMediaDownloadResult(blob, name)
    },
  },
  {
    id: 'video-to-wav',
    name: 'Video to Audio (WAV)',
    category: 'media',
    description: 'Extract audio from a video file as WAV',
    acceptsFile: true,
    acceptTypes: 'video/*',
    isMediaConverter: true,
    fileConvert: async (file, onProgress) => {
      const blob = await convertMedia(file, 'wav', 'audio/wav', onProgress)
      const name = file.name.replace(/\.[^.]+$/, '') + '.wav'
      return createMediaDownloadResult(blob, name)
    },
  },
  {
    id: 'audio-to-mp3',
    name: 'Audio to MP3',
    category: 'media',
    description: 'Convert any audio file to MP3 format',
    acceptsFile: true,
    acceptTypes: 'audio/*',
    isMediaConverter: true,
    fileConvert: async (file, onProgress) => {
      const blob = await convertMedia(file, 'mp3', 'audio/mpeg', onProgress)
      const name = file.name.replace(/\.[^.]+$/, '') + '.mp3'
      return createMediaDownloadResult(blob, name)
    },
  },
  {
    id: 'audio-to-wav',
    name: 'Audio to WAV',
    category: 'media',
    description: 'Convert any audio file to WAV format',
    acceptsFile: true,
    acceptTypes: 'audio/*',
    isMediaConverter: true,
    fileConvert: async (file, onProgress) => {
      const blob = await convertMedia(file, 'wav', 'audio/wav', onProgress)
      const name = file.name.replace(/\.[^.]+$/, '') + '.wav'
      return createMediaDownloadResult(blob, name)
    },
  },
  {
    id: 'audio-to-ogg',
    name: 'Audio to OGG',
    category: 'media',
    description: 'Convert any audio file to OGG Vorbis format',
    acceptsFile: true,
    acceptTypes: 'audio/*',
    isMediaConverter: true,
    fileConvert: async (file, onProgress) => {
      const blob = await convertMedia(file, 'ogg', 'audio/ogg', onProgress)
      const name = file.name.replace(/\.[^.]+$/, '') + '.ogg'
      return createMediaDownloadResult(blob, name)
    },
  },
  {
    id: 'video-to-mp4',
    name: 'Video to MP4',
    category: 'media',
    description: 'Convert a video file to MP4 (H.264) format',
    acceptsFile: true,
    acceptTypes: 'video/*',
    isMediaConverter: true,
    fileConvert: async (file, onProgress) => {
      const blob = await convertMedia(file, 'mp4', 'video/mp4', onProgress)
      const name = file.name.replace(/\.[^.]+$/, '') + '.mp4'
      return createMediaDownloadResult(blob, name)
    },
  },
  {
    id: 'video-to-webm',
    name: 'Video to WebM',
    category: 'media',
    description: 'Convert a video file to WebM format',
    acceptsFile: true,
    acceptTypes: 'video/*',
    isMediaConverter: true,
    fileConvert: async (file, onProgress) => {
      const blob = await convertMedia(file, 'webm', 'video/webm', onProgress)
      const name = file.name.replace(/\.[^.]+$/, '') + '.webm'
      return createMediaDownloadResult(blob, name)
    },
  },
  {
    id: 'video-to-gif',
    name: 'Video to GIF',
    category: 'media',
    description: 'Convert a video clip to animated GIF',
    acceptsFile: true,
    acceptTypes: 'video/*',
    isMediaConverter: true,
    fileConvert: async (file, onProgress) => {
      const blob = await convertMedia(file, 'gif', 'image/gif', onProgress)
      const name = file.name.replace(/\.[^.]+$/, '') + '.gif'
      return createMediaDownloadResult(blob, name)
    },
  },
  {
    id: 'audio-to-aac',
    name: 'Audio to AAC',
    category: 'media',
    description: 'Convert any audio file to AAC format',
    acceptsFile: true,
    acceptTypes: 'audio/*',
    isMediaConverter: true,
    fileConvert: async (file, onProgress) => {
      const blob = await convertMedia(file, 'aac', 'audio/aac', onProgress)
      const name = file.name.replace(/\.[^.]+$/, '') + '.aac'
      return createMediaDownloadResult(blob, name)
    },
  },
  {
    id: 'audio-to-flac',
    name: 'Audio to FLAC',
    category: 'media',
    description: 'Convert any audio file to FLAC (lossless)',
    acceptsFile: true,
    acceptTypes: 'audio/*',
    isMediaConverter: true,
    fileConvert: async (file, onProgress) => {
      const blob = await convertMedia(file, 'flac', 'audio/flac', onProgress)
      const name = file.name.replace(/\.[^.]+$/, '') + '.flac'
      return createMediaDownloadResult(blob, name)
    },
  },
  {
    id: 'video-to-audio-ogg',
    name: 'Video to Audio (OGG)',
    category: 'media',
    description: 'Extract audio from a video file as OGG Vorbis',
    acceptsFile: true,
    acceptTypes: 'video/*',
    isMediaConverter: true,
    fileConvert: async (file, onProgress) => {
      const blob = await convertMedia(file, 'ogg', 'audio/ogg', onProgress)
      const name = file.name.replace(/\.[^.]+$/, '') + '.ogg'
      return createMediaDownloadResult(blob, name)
    },
  },
  {
    id: 'audio-to-m4a',
    name: 'Audio to M4A',
    category: 'media',
    description: 'Convert any audio file to M4A (AAC in MP4 container)',
    acceptsFile: true,
    acceptTypes: 'audio/*',
    isMediaConverter: true,
    fileConvert: async (file, onProgress) => {
      const ffmpeg = await getFFmpeg()
      const inputName = createTempFileName('input', getExtension(file.name))
      const outputName = createTempFileName('output', '.m4a')
      const { fetchFile } = await import('@ffmpeg/util')
      let blob
      try {
        await ffmpeg.writeFile(inputName, await fetchFile(file))
        const detachProgress = attachMediaProgress(ffmpeg, onProgress)
        try {
          await ffmpeg.exec(['-i', inputName, '-c:a', 'aac', '-b:a', '192k', outputName])
          const data = await ffmpeg.readFile(outputName)
          blob = new Blob([data], { type: 'audio/mp4' })
        } finally {
          detachProgress()
        }
      } finally {
        await safeDeleteTempFile(ffmpeg, inputName)
        await safeDeleteTempFile(ffmpeg, outputName)
      }
      const name = file.name.replace(/\.[^.]+$/, '') + '.m4a'
      return createMediaDownloadResult(blob, name)
    },
  },
  {
    id: 'video-trim',
    name: 'Video Trim',
    category: 'media',
    description: 'Trim a video — enter start-end in seconds (e.g. 5-30)',
    acceptsFile: true,
    acceptTypes: 'video/*',
    isMediaConverter: true,
    hasTextInput: true,
    textPlaceholder: 'Start-End in seconds (e.g. 5-30)',
    fileConvert: async (files, textInput) => {
      const file = Array.isArray(files) ? files[0] : files
      const ffmpeg = await getFFmpeg()
      const [start, end] = (textInput || '0-10').split('-').map(Number)
      const inputName = createTempFileName('input', getExtension(file.name))
      const ext = getExtension(file.name) || '.mp4'
      const outputName = createTempFileName('output', ext)
      const { fetchFile } = await import('@ffmpeg/util')
      let blob
      try {
        await ffmpeg.writeFile(inputName, await fetchFile(file))
        await ffmpeg.exec(['-i', inputName, '-ss', String(start), '-to', String(end), '-c', 'copy', outputName])
        const data = await ffmpeg.readFile(outputName)
        const mime = file.type || 'video/mp4'
        blob = new Blob([data], { type: mime })
      } finally {
        await safeDeleteTempFile(ffmpeg, inputName)
        await safeDeleteTempFile(ffmpeg, outputName)
      }
      const name = file.name.replace(/\.[^.]+$/, '') + `_trim${start}-${end}` + ext
      return createMediaDownloadResult(blob, name)
    },
  },
  {
    id: 'audio-trim',
    name: 'Audio Trim',
    category: 'media',
    description: 'Trim an audio file — enter start-end in seconds (e.g. 0-30)',
    acceptsFile: true,
    acceptTypes: 'audio/*',
    isMediaConverter: true,
    hasTextInput: true,
    textPlaceholder: 'Start-End in seconds (e.g. 0-30)',
    fileConvert: async (files, textInput) => {
      const file = Array.isArray(files) ? files[0] : files
      const ffmpeg = await getFFmpeg()
      const [start, end] = (textInput || '0-30').split('-').map(Number)
      const inputName = createTempFileName('input', getExtension(file.name))
      const ext = getExtension(file.name) || '.mp3'
      const outputName = createTempFileName('output', ext)
      const { fetchFile } = await import('@ffmpeg/util')
      let blob
      try {
        await ffmpeg.writeFile(inputName, await fetchFile(file))
        await ffmpeg.exec(['-i', inputName, '-ss', String(start), '-to', String(end), '-c', 'copy', outputName])
        const data = await ffmpeg.readFile(outputName)
        const mime = file.type || 'audio/mpeg'
        blob = new Blob([data], { type: mime })
      } finally {
        await safeDeleteTempFile(ffmpeg, inputName)
        await safeDeleteTempFile(ffmpeg, outputName)
      }
      const name = file.name.replace(/\.[^.]+$/, '') + `_trim${start}-${end}` + ext
      return createMediaDownloadResult(blob, name)
    },
  },
].map((converter) => ({
  ...converter,
  limits: TOOL_LIMITS.media,
  terminate: terminateMediaExecution,
}))
