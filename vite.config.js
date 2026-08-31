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

export default defineConfig({
  base: '/',
  plugins: [react(), assertBuiltOwnershipMetadata()],
  build: {
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
