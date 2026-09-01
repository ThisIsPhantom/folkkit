// Media converters use the browser's MediaRecorder, Canvas, and Web Audio APIs
// For more complex conversions, we use ffmpeg.wasm loaded on demand

import { runtimeAssetUrl } from '../runtime/runtimeAssets'
import { TOOL_LIMITS } from '../runtime/limits'

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
  toBlobURL,
  revokeObjectURL,
  notify,
  isOnline = () => globalThis.navigator?.onLine !== false,
}) {
  let generation = 0
  let activeInstance = null
  let ready = false
  let loadState = null

  const revokeAll = (state) => {
    if (!state) return
    for (const url of state.assetUrls) revokeObjectURL(url)
    state.assetUrls.clear()
  }
  const createAssetUrl = async (source, mimeType, state) => {
    const url = await toBlobURL(source, mimeType)
    if (state.generation !== generation) {
      revokeObjectURL(url)
      throw abortLoadError()
    }
    state.assetUrls.add(url)
    return url
  }

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
      phase = 'core'
      const coreURL = await createAssetUrl(`${baseURL}/ffmpeg-core.js`, 'text/javascript', state)
      const wasmURL = await createAssetUrl(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm', state)
      phase = 'engine'
      await ffmpeg.load({ coreURL, wasmURL })
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
    } finally {
      revokeAll(state)
    }
  })()

  const get = () => {
    if (ready && activeInstance) return Promise.resolve(activeInstance)
    if (loadState?.generation === generation) return loadState.promise
    const state = { generation, promise: null, assetUrls: new Set() }
    state.promise = beginLoad(state).finally(() => {
      if (loadState === state) loadState = null
    })
    loadState = state
    return state.promise
  }

  const terminate = () => {
    generation += 1
    ready = false
    const state = loadState
    loadState = null
    const instance = activeInstance
    activeInstance = null
    try { instance?.terminate?.() } catch { /* cancellation cleanup is best effort */ }
    revokeAll(state)
  }

  return Object.freeze({ get, terminate })
}

const ffmpegRuntime = createFFmpegRuntime({
  baseURL: runtimeAssetUrl('vendor/ffmpeg'),
  createFFmpeg: async () => {
    const { FFmpeg } = await import('@ffmpeg/ffmpeg')
    return new FFmpeg()
  },
  toBlobURL: async (...args) => {
    const { toBlobURL } = await import('@ffmpeg/util')
    return toBlobURL(...args)
  },
  revokeObjectURL: (url) => URL.revokeObjectURL(url),
  notify: notifyLoadListeners,
})

export function terminateMediaExecution() {
  ffmpegRuntime.terminate()
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
  const ffmpeg = await getFFmpeg()

  const inputName = createTempFileName('input', getExtension(file.name))
  const outputName = createTempFileName('output', '.' + outputExt)

  const { fetchFile } = await import('@ffmpeg/util')
  try {
    await ffmpeg.writeFile(inputName, await fetchFile(file))

    const detachProgress = attachMediaProgress(ffmpeg, onProgress)

    try {
      await ffmpeg.exec(['-i', inputName, outputName])

      const data = await ffmpeg.readFile(outputName)
      return new Blob([data], { type: mimeType })
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
