import { once } from 'node:events'
import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { expect, test } from '@playwright/test'

const viteManifest = JSON.parse(await readFile(new URL('../../dist/.vite/manifest.json', import.meta.url), 'utf8'))
const appEntryPath = `/${viteManifest['index.html'].file}`
let alternateServer
let alternateOrigin

test.beforeAll(async () => {
  alternateServer = createServer((_request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Content-Type', 'text/plain')
    response.end('alternate-local-origin')
  })
  alternateServer.listen(0, '127.0.0.1')
  await once(alternateServer, 'listening')
  const address = alternateServer.address()
  alternateOrigin = `http://127.0.0.1:${address.port}`
})

test.afterAll(async () => {
  if (!alternateServer) return
  alternateServer.close()
  await once(alternateServer, 'close')
})

test('exposes an installable Folkkit manifest and same-origin service worker', async ({ page }) => {
  await page.goto('./')

  const manifest = await page.locator('link[rel="manifest"]').evaluate(async (link) => (
    fetch(link.href).then(response => response.json())
  ))
  expect(manifest).toMatchObject({
    id: '/',
    name: 'Folkkit',
    short_name: 'Folkkit',
    start_url: '/',
    scope: '/',
    display: 'standalone',
  })
  expect(manifest.icons.some(icon => icon.src === '/favicon.svg' && icon.sizes === 'any')).toBe(true)

  const registration = await page.evaluate(async () => {
    const ready = await navigator.serviceWorker.ready
    return { scope: ready.scope, scriptURL: ready.active?.scriptURL }
  })
  expect(new URL(registration.scope).origin).toBe(new URL(page.url()).origin)
  expect(new URL(registration.scriptURL).origin).toBe(new URL(page.url()).origin)
  expect(new URL(registration.scriptURL).pathname).toBe('/sw.js')
})

test('upgrades a real old worker, cleans owned caches, and controls the client', async ({ page }) => {
  await page.goto('./manifest.json')
  await page.evaluate(async () => {
    const controllerChanged = new Promise(resolve => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }))
    await navigator.serviceWorker.register('/__folkkit-test__/old-sw.js', { scope: '/' })
    if (!navigator.serviceWorker.controller) await controllerChanged
    const foreign = await caches.open('unrelated-application-cache')
    await foreign.put('/', new Response('foreign root'))
  })
  await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller?.scriptURL)).toContain('/__folkkit-test__/old-sw.js')

  await page.evaluate(async () => {
    const controllerChanged = new Promise(resolve => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }))
    const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' })
    const worker = registration.installing || registration.waiting || registration.active
    if (worker?.state !== 'activated') {
      await new Promise(resolve => worker.addEventListener('statechange', () => {
        if (worker.state === 'activated') resolve()
      }))
    }
    if (!navigator.serviceWorker.controller?.scriptURL.endsWith('/sw.js')) await controllerChanged
    await navigator.serviceWorker.ready
  })

  const lifecycle = await page.evaluate(async () => ({
    cacheNames: await caches.keys(),
    controller: navigator.serviceWorker.controller?.scriptURL,
  }))
  expect(lifecycle.cacheNames).not.toContain('convert-everything-v2')
  expect(lifecycle.cacheNames).not.toContain('folkkit-app-test-old')
  expect(lifecycle.cacheNames.filter(name => name.startsWith('folkkit-app-'))).toHaveLength(1)
  expect(lifecycle.cacheNames).toContain('unrelated-application-cache')
  expect(lifecycle.controller).toMatch(/\/sw\.js$/)
})

test('isolates Folkkit cache reads and excludes private or foreign requests', async ({ page, context }) => {
  await page.goto('./manifest.json')
  await page.evaluate(async entryPath => {
    const foreign = await caches.open('unrelated-application-cache')
    await foreign.put('/', new Response('<h1>FOREIGN ROOT</h1>', { headers: { 'Content-Type': 'text/html' } }))
    await foreign.put(entryPath, new Response('throw new Error("FOREIGN ASSET")', { headers: { 'Content-Type': 'text/javascript' } }))
  }, appEntryPath)
  await page.goto('./')
  await page.evaluate(() => navigator.serviceWorker.ready)

  const privateMarker = 'private-marker-task-8'
  await page.evaluate(async ({ alternateUrl, entryPath, marker }) => {
    await fetch('/unknown-runtime-path.txt').catch(() => null)
    await fetch(`${entryPath}?private=${encodeURIComponent(marker)}`).catch(() => null)
    await fetch('/unknown-runtime-path.txt', { method: 'POST', body: marker }).catch(() => null)
    await fetch(alternateUrl).catch(() => null)
    const objectUrl = URL.createObjectURL(new Blob([marker]))
    try {
      await fetch(objectUrl)
    } finally {
      URL.revokeObjectURL(objectUrl)
    }
  }, { alternateUrl: `${alternateOrigin}/foreign.js`, entryPath: appEntryPath, marker: privateMarker })

  const cacheSnapshot = await page.evaluate(async () => {
    const currentName = (await caches.keys()).find(name => name.startsWith('folkkit-app-'))
    const current = await caches.open(currentName)
    const foreign = await caches.open('unrelated-application-cache')
    return {
      currentUrls: (await current.keys()).map(request => request.url),
      foreignUrls: (await foreign.keys()).map(request => request.url),
    }
  })
  const origin = new URL(page.url()).origin

  expect(cacheSnapshot.currentUrls.length).toBeGreaterThan(4)
  expect(cacheSnapshot.currentUrls.every(url => new URL(url).origin === origin)).toBe(true)
  expect(cacheSnapshot.currentUrls.some(url => url.includes('unknown-runtime-path'))).toBe(false)
  expect(cacheSnapshot.currentUrls.some(url => url.includes(privateMarker))).toBe(false)
  expect(cacheSnapshot.currentUrls.some(url => new URL(url).origin === alternateOrigin)).toBe(false)
  expect(cacheSnapshot.currentUrls.some(url => url.startsWith('blob:'))).toBe(false)
  expect(cacheSnapshot.currentUrls.some(url => url.includes('/vendor/ffmpeg/'))).toBe(false)
  expect(cacheSnapshot.currentUrls.some(url => /\/assets\/media-[^/]+\.js$/.test(new URL(url).pathname))).toBe(false)
  expect(cacheSnapshot.foreignUrls).toEqual(expect.arrayContaining([
    `${origin}/`,
    `${origin}${appEntryPath}`,
  ]))

  await context.setOffline(true)
  await page.goto('./')
  await expect(page.getByRole('heading', { name: 'Was möchtest du machen?' })).toBeVisible()
})
