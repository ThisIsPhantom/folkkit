import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
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

export default defineConfig({
  base: '/',
  plugins: [react(), selfHostFFmpegWorkerFallback(), assertBuiltOwnershipMetadata()],
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
