// @vitest-environment node
import { expect, test, vi } from 'vitest'
import { readFile } from 'node:fs/promises'
import { runInNewContext } from 'node:vm'

async function runtimeCache(contentType = 'application/wasm') {
  const handlers = new Map()
  const entries = new Map()
  const response = new Response('module bytes', { status: 200, headers: { 'content-type': contentType } })
  Object.defineProperty(response, 'type', { value: 'basic' })
  const fetch = vi.fn(async () => response)
  const source = (await readFile('public/sw.template.js', 'utf8'))
    .replaceAll('__CACHE_NAME__', JSON.stringify('folkkit-app-test'))
    .replaceAll('__PRECACHE_URLS__', JSON.stringify(['/']))
  runInNewContext(source, {
    URL, Set, Response, fetch,
    self: { location: { origin: 'https://folkkit.test' }, addEventListener: (name, fn) => handlers.set(name, fn) },
    caches: { open: async () => ({ match: async key => entries.get(typeof key === 'string' ? key : key.url), put: async (key, value) => entries.set(typeof key === 'string' ? key : key.url, value) }) },
  })
  const request = (url, method = 'GET') => {
    let result
    handlers.get('fetch')({ request: { url, method, mode: 'cors' }, respondWith: value => { result = value } })
    return result
  }
  return { request, entries, fetch, response }
}

test('caches the exact same-origin WASM on first use and serves it without another fetch', async () => {
  const runtime = await runtimeCache()
  const url = 'https://folkkit.test/vendor/ffmpeg/ffmpeg-core.wasm'
  expect(await (await runtime.request(url)).text()).toBe('module bytes')
  expect(await (await runtime.request(url)).text()).toBe('module bytes')
  expect(runtime.fetch).toHaveBeenCalledTimes(1)
  expect(runtime.entries.size).toBe(1)
})

test('answers the loader HEAD preflight from a warm GET cache without network or a body', async () => {
  const runtime = await runtimeCache()
  const url = 'https://folkkit.test/vendor/ffmpeg/ffmpeg-core.wasm'
  await runtime.request(url)
  runtime.fetch.mockRejectedValue(new Error('offline'))
  const head = await runtime.request(url, 'HEAD')
  expect(head?.status).toBe(200)
  expect(await head.text()).toBe('')
  expect(head.headers.get('content-type')).toBe('application/wasm')
  expect(runtime.fetch).toHaveBeenCalledTimes(1)
  expect(runtime.entries.size).toBe(1)
})

test('does not cache an HTML fallback returned at a runtime URL', async () => {
  const runtime = await runtimeCache('text/html')
  await runtime.request('https://folkkit.test/vendor/ffmpeg/ffmpeg-core.wasm')
  expect(runtime.entries.size).toBe(0)
})

test('never adds user files, posts, queried URLs or external copies to the optional cache', async () => {
  const runtime = await runtimeCache()
  for (const [url, method] of [
    ['https://folkkit.test/vendor/ffmpeg/private.pdf', 'GET'],
    ['https://folkkit.test/vendor/ffmpeg/ffmpeg-core.wasm?file=private', 'GET'],
    ['https://other.test/vendor/ffmpeg/ffmpeg-core.wasm', 'GET'],
    ['https://folkkit.test/vendor/ffmpeg/ffmpeg-core.wasm', 'POST'],
    ['blob:https://folkkit.test/private', 'GET'],
  ]) expect(runtime.request(url, method)).toBeUndefined()
  expect(runtime.fetch).not.toHaveBeenCalled()
  expect(runtime.entries.size).toBe(0)
})
