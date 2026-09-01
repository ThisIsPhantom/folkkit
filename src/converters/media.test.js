import { expect, test, vi } from 'vitest'
import { attachMediaProgress, createFFmpegRuntime, createMediaDownloadResult, executeFfmpegWithBudget, preflightMediaFile } from './media'
import { MEDIA_LIMITS } from '../runtime/workBudgets'

function deferred() {
  let resolve
  let reject
  const promise = new Promise((done, fail) => {
    resolve = done
    reject = fail
  })
  return { promise, resolve, reject }
}

test('media conversion results retain the Blob without allocating a download URL', () => {
  const blob = new Blob(['media-result'], { type: 'audio/mpeg' })

  expect(createMediaDownloadResult(blob, 'result.mp3')).toEqual({
    kind: 'download',
    blob,
    filename: 'result.mp3',
  })
})

test('media progress stops reaching the UI after its detach function runs', () => {
  const listeners = new Set()
  const ffmpeg = {
    on: (_event, listener) => listeners.add(listener),
    off: (_event, listener) => listeners.delete(listener),
  }
  const progress = []
  const detach = attachMediaProgress(ffmpeg, (value) => progress.push(value))

  for (const listener of listeners) listener({ progress: 0.4 })
  detach()
  for (const listener of listeners) listener({ progress: 0.9 })

  expect(progress).toEqual([40])
})

test('reliable WAV metadata rejects excessive duration before FFmpeg work', async () => {
  const bytes = new Uint8Array(44)
  const view = new DataView(bytes.buffer)
  bytes.set(new TextEncoder().encode('RIFF'), 0)
  bytes.set(new TextEncoder().encode('WAVE'), 8)
  bytes.set(new TextEncoder().encode('fmt '), 12)
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, 8000, true)
  view.setUint32(28, 16000, true)
  bytes.set(new TextEncoder().encode('data'), 36)
  view.setUint32(40, Math.ceil(16000 * (MEDIA_LIMITS.maxDurationSeconds + 1)), true)

  await expect(preflightMediaFile(new File([bytes], 'long.wav', { type: 'audio/wav' }))).rejects.toMatchObject({ code: 'resource_limit' })
})

test('non-WAV metadata fails closed for excessive duration and always revokes its object URL', async () => {
  const listeners = {}
  const audio = {
    duration: MEDIA_LIMITS.maxDurationSeconds + 1,
    addEventListener: (name, listener) => { listeners[name] = listener },
    removeEventListener: vi.fn(),
    removeAttribute: vi.fn(),
    load: () => queueMicrotask(() => listeners.loadedmetadata()),
  }
  const urlApi = { createObjectURL: vi.fn(() => 'blob:metadata'), revokeObjectURL: vi.fn() }

  await expect(preflightMediaFile(
    new File(['mp3'], 'long.mp3', { type: 'audio/mpeg' }),
    { createMediaElement: () => audio, urlApi, metadataTimeoutMs: 100 },
  )).rejects.toMatchObject({ code: 'resource_limit', message: 'resource_limit' })
  expect(urlApi.revokeObjectURL).toHaveBeenCalledWith('blob:metadata')
  expect(audio.removeAttribute).toHaveBeenCalledWith('src')
})

test('non-WAV metadata timeout fails closed and cleans the object URL', async () => {
  const audio = { addEventListener: vi.fn(), removeEventListener: vi.fn(), removeAttribute: vi.fn(), load: vi.fn() }
  const urlApi = { createObjectURL: vi.fn(() => 'blob:timeout'), revokeObjectURL: vi.fn() }

  await expect(preflightMediaFile(
    new File(['ogg'], 'unknown.ogg', { type: 'audio/ogg' }),
    { createMediaElement: () => audio, urlApi, metadataTimeoutMs: 5 },
  )).rejects.toMatchObject({ code: 'resource_limit' })
  expect(urlApi.revokeObjectURL).toHaveBeenCalledWith('blob:timeout')
})

test('FFmpeg work budget adds a CPU backstop and hard-terminates a stalled execution', async () => {
  const ffmpeg = { exec: vi.fn(() => new Promise(() => {})), terminate: vi.fn() }
  await expect(executeFfmpegWithBudget(ffmpeg, ['-i', 'input.wav', 'output.mp3'], { maxElapsedMs: 5 })).rejects.toMatchObject({ code: 'resource_limit' })
  expect(ffmpeg.exec).toHaveBeenCalledWith([
    '-timelimit', '120', '-i', 'input.wav',
    '-t', String(MEDIA_LIMITS.maxDurationSeconds),
    '-fs', String(MEDIA_LIMITS.maxOutputBytes + 1),
    'output.mp3',
  ])
  expect(ffmpeg.terminate).toHaveBeenCalledTimes(1)
})

test('ffmpeg loads the core module and WASM directly from same-origin URLs', async () => {
  const loadCalls = []
  const checkedAssets = []
  const runtime = createFFmpegRuntime({
    baseURL: '/vendor/ffmpeg',
    createFFmpeg: async () => ({
      load: async options => loadCalls.push(options),
      terminate() {},
    }),
    ensureAsset: async url => checkedAssets.push(url),
    notify: () => {},
  })

  await runtime.get()

  expect(loadCalls).toEqual([{
    coreURL: '/vendor/ffmpeg/ffmpeg-core.js',
    wasmURL: '/vendor/ffmpeg/ffmpeg-core.wasm',
  }])
  expect(checkedAssets).toEqual([
    '/vendor/ffmpeg/ffmpeg-core.js',
    '/vendor/ffmpeg/ffmpeg-core.wasm',
  ])
})

test('terminating during ffmpeg.load stops the loading instance and prevents late activation', async () => {
  const firstLoad = deferred()
  const notifications = []
  let createCount = 0
  const instances = []
  const runtime = createFFmpegRuntime({
    baseURL: '/vendor/ffmpeg',
    createFFmpeg: async () => {
      createCount += 1
      const instance = {
        terminateCount: 0,
        load: createCount === 1 ? () => firstLoad.promise : async () => {},
        terminate() { this.terminateCount += 1 },
      }
      instances.push(instance)
      return instance
    },
    notify: (status) => notifications.push(status),
  })

  const staleLoad = runtime.get()
  await waitUntil(() => instances.length === 1)
  await waitUntil(() => notifications.includes('downloading'))
  runtime.terminate()

  expect(instances[0].terminateCount).toBe(1)
  firstLoad.resolve()
  await expect(staleLoad).rejects.toMatchObject({ name: 'AbortError' })
  expect(notifications).not.toContain('ready')

  await expect(runtime.get()).resolves.toBe(instances[1])
  expect(createCount).toBe(2)
})

test('ffmpeg runtime retries direct same-origin assets after a load failure', async () => {
  const loadCalls = []
  let failLoad = false
  const runtime = createFFmpegRuntime({
    baseURL: '/vendor/ffmpeg',
    createFFmpeg: async () => ({
      load: async options => {
        loadCalls.push(options)
        if (failLoad) throw new Error('load failed')
      },
      terminate() {},
    }),
    notify: () => {},
  })

  await runtime.get()
  runtime.terminate()
  failLoad = true
  await expect(runtime.get()).rejects.toThrow('load failed')
  expect(loadCalls).toEqual([
    { coreURL: '/vendor/ffmpeg/ffmpeg-core.js', wasmURL: '/vendor/ffmpeg/ffmpeg-core.wasm' },
    { coreURL: '/vendor/ffmpeg/ffmpeg-core.js', wasmURL: '/vendor/ffmpeg/ffmpeg-core.wasm' },
  ])
})

test('an offline FFmpeg core fetch failure exposes a stable media runtime error', async () => {
  const runtime = createFFmpegRuntime({
    baseURL: '/vendor/ffmpeg',
    createFFmpeg: async () => ({ load: async () => { throw new TypeError('Failed to fetch') }, terminate() {} }),
    notify: () => {},
    isOnline: () => false,
  })

  await expect(runtime.get()).rejects.toMatchObject({ code: 'media_runtime_unavailable' })
})

test('an offline FFmpeg wrapper import failure uses the same stable runtime error', async () => {
  const runtime = createFFmpegRuntime({
    baseURL: '/vendor/ffmpeg',
    createFFmpeg: async () => { throw new TypeError('Failed to fetch dynamically imported module') },
    notify: () => {},
    isOnline: () => false,
  })

  await expect(runtime.get()).rejects.toMatchObject({ code: 'media_runtime_unavailable' })
})

test('a stale load cannot deactivate a ready replacement instance', async () => {
  const firstLoad = deferred()
  const secondLoad = deferred()
  const instances = []
  let firstLoadStarted = false
  const runtime = createFFmpegRuntime({
    baseURL: '/vendor/ffmpeg',
    createFFmpeg: async () => {
      const instance = {
        load: instances.length === 0
          ? () => {
            firstLoadStarted = true
            return firstLoad.promise
          }
          : () => secondLoad.promise,
        terminate() {},
      }
      instances.push(instance)
      return instance
    },
    notify: () => {},
  })

  const stale = runtime.get()
  await waitUntil(() => firstLoadStarted)
  runtime.terminate()
  const replacement = runtime.get()
  await waitUntil(() => instances.length === 2)
  secondLoad.resolve()
  const readyReplacement = await replacement

  firstLoad.resolve()
  await expect(stale).rejects.toMatchObject({ name: 'AbortError' })
  expect(await runtime.get()).toBe(readyReplacement)
  expect(instances).toHaveLength(2)
})

async function waitUntil(predicate) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (predicate()) return
    await Promise.resolve()
  }
  throw new Error('condition_not_reached')
}
