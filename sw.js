/* eslint-disable no-undef */
const CACHE_NAME = "folkkit-app-bd09fc899369"
const PRECACHE_URLS = [
  "/",
  "/assets/AudioEditorPage-C0vXb6x0.css",
  "/assets/AudioEditorPage-bcRkLl4e.js",
  "/assets/CalculatorPage-CR4xN-z2.js",
  "/assets/CalculatorPage-DiVfOUWI.css",
  "/assets/FileConverterPage-D53_vJiB.css",
  "/assets/FileConverterPage-HJg1ldeR.js",
  "/assets/IconDownload-okdeq8TL.js",
  "/assets/ImageEditorPage-DIoWR3ha.css",
  "/assets/ImageEditorPage-o6FcBvco.js",
  "/assets/PdfEditorPage-BQzwtDAS.css",
  "/assets/PdfEditorPage-DW2dkrTX.js",
  "/assets/QrDesignerPage-ChEg-R_g.js",
  "/assets/QrDesignerPage-CmBXaxUL.css",
  "/assets/WorkspacePage-D6ik98MG.js",
  "/assets/WorkspacePage-x1HfyxUR.css",
  "/assets/audioEngine-DQyCS0mT.js",
  "/assets/browser-CWKGGv8Z.js",
  "/assets/detection-DMG7egO-.js",
  "/assets/documentEngine-CvuePVqx.js",
  "/assets/imageEditorWorker-DxkKnnWm.js",
  "/assets/imageFallback-Bsl3TReA.js",
  "/assets/imageOperations-D0KBE-jR.js",
  "/assets/imageWorker-D3sST9Yt.js",
  "/assets/index-B8PIt-2V.js",
  "/assets/index-BhTHSIFf.js",
  "/assets/index-CVM9K9M-.css",
  "/assets/jpegOrientation-CVoaSQDi.js",
  "/assets/pdf-DmmQ8Qn-.js",
  "/assets/pdf-lib-BYCLJ2U_.js",
  "/assets/pdfClient-B3O83sLH.js",
  "/assets/pdfStudioWorker-CnwFVfxc.js",
  "/assets/pdfWorker-DVDq7ZnQ.js",
  "/assets/pdfium-RAgkpwfK.wasm",
  "/assets/profiles-DFty1oBE.js",
  "/assets/qr-code-styling-MS6qhoCe.js",
  "/assets/qr-preview-DebKZAhx.svg",
  "/assets/qr-reader.worker-DjRSJn4m.js",
  "/assets/qr-x4h7c0cn.js",
  "/assets/qrcode-DgLtAz-0.js",
  "/assets/workBudgets-Do-Hk6pD.js",
  "/favicon.svg",
  "/index.html",
  "/manifest.json",
  "/theme-init.js"
]
const PRECACHE_PATHS = new Set(PRECACHE_URLS)
const CACHE_PREFIX = 'folkkit-app-'
const LEGACY_CACHE_NAMES = new Set(['convert-everything-v2'])
const OPTIONAL_RUNTIME_PATHS = new Set(['/vendor/ffmpeg/ffmpeg-core.js', '/vendor/ffmpeg/ffmpeg-core.wasm', '/vendor/pandoc/pandoc.wasm'])
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
  if (request.method !== 'GET' && request.method !== 'HEAD') return

  const url = new URL(request.url)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return
  if (url.origin !== self.location.origin) return

  if (request.method === 'HEAD') {
    if (url.search || !OPTIONAL_RUNTIME_PATHS.has(url.pathname)) return
    event.respondWith(caches.open(CACHE_NAME).then(async cache => {
      const cached = await cache.match(url.pathname, { ignoreVary: true })
      return cached ? new Response(null, { status: cached.status, statusText: cached.statusText, headers: cached.headers }) : fetch(request)
    }))
    return
  }

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

  if (!url.search && OPTIONAL_RUNTIME_PATHS.has(url.pathname)) {
    event.respondWith(caches.open(CACHE_NAME).then(async cache => {
      const cached = await cache.match(url.pathname, { ignoreVary: true })
      if (cached) return cached
      const response = await fetch(request)
      const mime = (response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase()
      const expectedMime = url.pathname.endsWith('.wasm') ? mime === 'application/wasm' : /(?:java|ecma)script/.test(mime)
      if (response.ok && response.type === 'basic' && expectedMime) await cache.put(url.pathname, response.clone())
      return response
    }))
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
