import { expect, test } from 'vitest'
import { attachMediaProgress, createFFmpegRuntime, createMediaDownloadResult } from './media'

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

test('terminating during ffmpeg.load stops the loading instance and prevents late activation', async () => {
  const firstLoad = deferred()
  const revoked = []
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
    toBlobURL: async (url) => `blob:${url}`,
    revokeObjectURL: (url) => revoked.push(url),
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
  expect(revoked).toEqual(expect.arrayContaining([
    'blob:/vendor/ffmpeg/ffmpeg-core.js',
    'blob:/vendor/ffmpeg/ffmpeg-core.wasm',
  ]))
})

test('ffmpeg runtime revokes core and wasm Blob URLs after success and failure', async () => {
  const revoked = []
  let failLoad = false
  const runtime = createFFmpegRuntime({
    baseURL: '/vendor/ffmpeg',
    createFFmpeg: async () => ({
      load: async () => {
        if (failLoad) throw new Error('load failed')
      },
      terminate() {},
    }),
    toBlobURL: async (url) => `blob:${url}`,
    revokeObjectURL: (url) => revoked.push(url),
    notify: () => {},
  })

  await runtime.get()
  expect(revoked.splice(0)).toEqual([
    'blob:/vendor/ffmpeg/ffmpeg-core.js',
    'blob:/vendor/ffmpeg/ffmpeg-core.wasm',
  ])

  runtime.terminate()
  failLoad = true
  await expect(runtime.get()).rejects.toThrow('load failed')
  expect(revoked).toEqual([
    'blob:/vendor/ffmpeg/ffmpeg-core.js',
    'blob:/vendor/ffmpeg/ffmpeg-core.wasm',
  ])
})

test('a stale load cannot revoke Blob URLs owned by its replacement load', async () => {
  const firstLoad = deferred()
  const secondLoad = deferred()
  const revoked = []
  let instanceCount = 0
  let urlCount = 0
  const runtime = createFFmpegRuntime({
    baseURL: '/vendor/ffmpeg',
    createFFmpeg: async () => {
      instanceCount += 1
      return {
        load: instanceCount === 1 ? () => firstLoad.promise : () => secondLoad.promise,
        terminate() {},
      }
    },
    toBlobURL: async (url) => `blob:${++urlCount}:${url}`,
    revokeObjectURL: (url) => revoked.push(url),
    notify: () => {},
  })

  const stale = runtime.get()
  await waitUntil(() => urlCount === 2)
  runtime.terminate()
  const replacement = runtime.get()
  await waitUntil(() => urlCount === 4)

  firstLoad.resolve()
  await expect(stale).rejects.toMatchObject({ name: 'AbortError' })
  expect(revoked).not.toContain('blob:3:/vendor/ffmpeg/ffmpeg-core.js')
  expect(revoked).not.toContain('blob:4:/vendor/ffmpeg/ffmpeg-core.wasm')

  secondLoad.resolve()
  await replacement
  expect(revoked).toEqual(expect.arrayContaining([
    'blob:3:/vendor/ffmpeg/ffmpeg-core.js',
    'blob:4:/vendor/ffmpeg/ffmpeg-core.wasm',
  ]))
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
    toBlobURL: async (url) => `blob:${instances.length}:${url}`,
    revokeObjectURL: () => {},
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
