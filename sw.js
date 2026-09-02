/* eslint-disable no-undef */
const CACHE_NAME = "folkkit-app-3a1a6d5b3053"
const PRECACHE_URLS = [
  "/",
  "/assets/browser-CWKGGv8Z.js",
  "/assets/index-D0xUixas.css",
  "/assets/index-DgNTkYYX.js",
  "/assets/pdf-Yf3fw-AF.js",
  "/assets/pdf-lib-BYCLJ2U_.js",
  "/assets/pdfWorker-0NtRspGg.js",
  "/assets/qr-CbYtd9Ss.js",
  "/assets/qrcode-DgLtAz-0.js",
  "/favicon.svg",
  "/index.html",
  "/manifest.json",
  "/theme-init.js"
]
const PRECACHE_PATHS = new Set(PRECACHE_URLS)
const CACHE_PREFIX = 'folkkit-app-'
const LEGACY_CACHE_NAMES = new Set(['convert-everything-v2'])
const HASHED_ASSET_PATH = /^\/assets\/.+-[A-Za-z0-9_-]{6,}\.(?:css|js|json|svg|png|jpe?g|webp|gif|woff2?)$/

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME)
    await cache.addAll(PRECACHE_URLS)
    await self.skipWaiting()
  })())
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys()
    await Promise.all(keys
      .filter(name => (name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME) || LEGACY_CACHE_NAMES.has(name))
      .map(name => caches.delete(name)))
    await self.clients.claim()
  })())
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(async () => {
      const cache = await caches.open(CACHE_NAME)
      return cache.match('/', { ignoreVary: true })
    }))
    return
  }

  if (!url.search && PRECACHE_PATHS.has(url.pathname)) {
    event.respondWith(caches.open(CACHE_NAME).then(cache => cache.match(url.pathname, { ignoreVary: true })))
    return
  }

  if (url.search || !HASHED_ASSET_PATH.test(url.pathname)) return
  event.respondWith(caches.open(CACHE_NAME).then(async (cache) => {
    const cached = await cache.match(request, { ignoreVary: true })
    if (cached) return cached
    const response = await fetch(request)
    if (response.ok && response.type === 'basic') {
      await cache.put(request, response.clone())
    }
    return response
  }))
})
