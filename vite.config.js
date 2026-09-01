import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { env } from 'node:process'
import { assertPassiveAdsenseOwnershipMeta } from './scripts/assert-ownership-meta.mjs'

function assertBuiltOwnershipMetadata() {
  return {
    name: 'assert-built-ownership-metadata',
    closeBundle() {
      const builtHtml = readFileSync(resolve('dist', 'index.html'), 'utf8')
      assertPassiveAdsenseOwnershipMeta(builtHtml)
    },
  }
}

function selfHostFFmpegWorkerFallback() {
  return {
    name: 'self-host-ffmpeg-worker-fallback',
    transform(code, id) {
      const normalizedId = id.replaceAll('\\', '/')
      if (!normalizedId.endsWith('/node_modules/@ffmpeg/ffmpeg/dist/esm/const.js')) return null

      const transformedCode = code.replace(
        /`https:\/\/unpkg\.com\/@ffmpeg\/core@\$\{CORE_VERSION\}\/dist\/umd\/ffmpeg-core\.js`/,
        "'/vendor/ffmpeg/ffmpeg-core.js'",
      )
      if (transformedCode === code) {
        throw new Error('Unable to replace the inherited FFmpeg worker fallback URL.')
      }
      return { code: transformedCode, map: null }
    },
  }
}

function testOldServiceWorker() {
  const source = `
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    await caches.open('folkkit-app-test-old')
    await caches.open('convert-everything-v2')
    await self.skipWaiting()
  })())
})
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim())
})
`
  return {
    name: 'test-old-service-worker',
    configurePreviewServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.url !== '/__folkkit-test__/old-sw.js') return next()
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/javascript; charset=utf-8')
        response.setHeader('Cache-Control', 'no-store')
        response.setHeader('Service-Worker-Allowed', '/')
        response.end(source)
      })
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    selfHostFFmpegWorkerFallback(),
    assertBuiltOwnershipMetadata(),
    ...(env.FOLKKIT_E2E_OLD_SW === '1' ? [testOldServiceWorker()] : []),
  ],
  worker: {
    plugins: () => [selfHostFFmpegWorkerFallback()],
  },
  build: {
    manifest: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          'pdf-lib': ['pdf-lib'],
          'qrcode': ['qrcode'],
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
  },
})
