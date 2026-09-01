import { expect, test } from '@playwright/test'

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

test('upgrades the inherited cache namespace without deleting unrelated caches', async ({ page }) => {
  await page.addInitScript(async () => {
    await caches.open('convert-everything-v2')
    await caches.open('folkkit-app-oldversion')
    await caches.open('unrelated-application-cache')
  })
  await page.goto('./')
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
    await new Promise(resolve => setTimeout(resolve, 100))
  })

  await expect.poll(() => page.evaluate(() => caches.keys())).toEqual(expect.arrayContaining(['unrelated-application-cache']))
  const cacheNames = await page.evaluate(() => caches.keys())
  expect(cacheNames).not.toContain('convert-everything-v2')
  expect(cacheNames).not.toContain('folkkit-app-oldversion')
  expect(cacheNames.filter(name => name.startsWith('folkkit-app-'))).toHaveLength(1)
})

test('stores only same-origin application assets in Cache Storage', async ({ page }) => {
  await page.goto('./')
  await page.evaluate(() => navigator.serviceWorker.ready)

  await page.evaluate(async () => {
    await fetch('/unknown-runtime-path.txt').catch(() => null)
    await fetch('/unknown-runtime-path.txt', { method: 'POST', body: 'private input' }).catch(() => null)
    const objectUrl = URL.createObjectURL(new Blob(['private input']))
    try {
      await fetch(objectUrl)
    } finally {
      URL.revokeObjectURL(objectUrl)
    }
  })

  const cachedUrls = await page.evaluate(async () => {
    const requests = (await Promise.all((await caches.keys()).map(async name => (
      caches.open(name).then(cache => cache.keys())
    )))).flat()
    return requests.map(request => request.url)
  })
  const origin = new URL(page.url()).origin

  expect(cachedUrls.length).toBeGreaterThan(4)
  expect(cachedUrls.every(url => new URL(url).origin === origin)).toBe(true)
  expect(cachedUrls.some(url => url.startsWith('blob:'))).toBe(false)
  expect(cachedUrls.some(url => url.includes('/vendor/ffmpeg/'))).toBe(false)
  expect(cachedUrls.some(url => /\/assets\/media-[^/]+\.js$/.test(new URL(url).pathname))).toBe(false)
})
