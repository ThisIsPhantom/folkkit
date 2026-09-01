import { gzipSync } from 'node:zlib'
import { randomBytes } from 'node:crypto'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { afterEach, describe, expect, test } from 'vitest'

const fixtureRoot = resolve('test-results', 'task-8-build-fixtures')

async function writeFixture(relativePath, contents) {
  const path = resolve(fixtureRoot, relativePath)
  await mkdir(resolve(path, '..'), { recursive: true })
  await writeFile(path, contents)
  return path
}

afterEach(async () => {
  await rm(fixtureRoot, { recursive: true, force: true })
})

describe('generated service worker', () => {
  test('precaches the shell and core QR/PDF graph without media or source maps', async () => {
    const { generateServiceWorker } = await import('../../scripts/generate-service-worker.mjs')
    const distDir = resolve(fixtureRoot, 'dist')
    await writeFixture('dist/.vite/manifest.json', JSON.stringify({
      'index.html': { file: 'assets/app-a1.js', isEntry: true, css: ['assets/app-a1.css'], imports: ['_react.js'], dynamicImports: ['src/converters/text.js', 'src/converters/media.js'] },
      '_react.js': { file: 'assets/react-a2.js' },
      'src/converters/qr.js': { file: 'assets/qr-b1.js', imports: ['index.html'], dynamicImports: ['_qrcode.js'], isDynamicEntry: true },
      '_qrcode.js': { file: 'assets/qrcode-b2.js' },
      'src/converters/pdf.js': { file: 'assets/pdf-c1.js', dynamicImports: ['_pdf-lib.js'], isDynamicEntry: true },
      '_pdf-lib.js': { file: 'assets/pdf-lib-c2.js' },
      'src/converters/media.js': { file: 'assets/media-d1.js', isDynamicEntry: true },
      'src/converters/text.js': { file: 'assets/text-d2.js', isDynamicEntry: true },
      'src/experimental.test.js': { file: 'assets/experimental-e1.js', isDynamicEntry: true },
      'src/main.jsx.map': { file: 'assets/app-a1.js.map' },
    }))
    const templatePath = await writeFixture('sw.template.js', '/* __CACHE_NAME__ __PRECACHE_URLS__ */\nconst CACHE_NAME = __CACHE_NAME__;\nconst PRECACHE_URLS = __PRECACHE_URLS__;')

    const result = await generateServiceWorker({ distDir, templatePath })
    const source = await readFile(resolve(distDir, 'sw.js'), 'utf8')

    expect(result.cacheName).toMatch(/^folkkit-app-[a-f0-9]{12}$/)
    expect(result.precacheUrls).toEqual([
      '/',
      '/assets/app-a1.css',
      '/assets/app-a1.js',
      '/assets/pdf-c1.js',
      '/assets/pdf-lib-c2.js',
      '/assets/qr-b1.js',
      '/assets/qrcode-b2.js',
      '/assets/react-a2.js',
      '/favicon.svg',
      '/index.html',
      '/manifest.json',
      '/theme-init.js',
    ])
    expect(source).not.toContain('media-d1')
    expect(source).not.toContain('.map')
    expect(source).not.toContain('__CACHE_NAME__')
    expect(source).not.toContain('__PRECACHE_URLS__')
    expect(source).toContain(`const CACHE_NAME = "${result.cacheName}"`)
  })

  test('rejects a cross-origin URL emitted by the Vite manifest', async () => {
    const { generateServiceWorker } = await import('../../scripts/generate-service-worker.mjs')
    const distDir = resolve(fixtureRoot, 'dist')
    await writeFixture('dist/.vite/manifest.json', JSON.stringify({
      'index.html': { file: 'https://cdn.example/app.js', isEntry: true },
    }))
    const templatePath = await writeFixture('sw.template.js', '__CACHE_NAME__\n__PRECACHE_URLS__')

    await expect(generateServiceWorker({ distDir, templatePath })).rejects.toThrow(/same-origin/i)
  })
})

describe('bundle budget', () => {
  test('rejects an initial JavaScript graph above 200 KiB gzip', async () => {
    const { checkBundleBudget } = await import('../../scripts/check-bundle-budget.mjs')
    const distDir = resolve(fixtureRoot, 'dist')
    const largeEntry = randomBytes(240 * 1024)
    await writeFixture('dist/assets/app.js', largeEntry)
    await writeFixture('dist/.vite/manifest.json', JSON.stringify({
      'index.html': { file: 'assets/app.js', isEntry: true },
    }))
    expect(gzipSync(largeEntry).byteLength).toBeGreaterThan(200 * 1024)

    await expect(checkBundleBudget({ distDir })).rejects.toThrow(/initial JavaScript.*200 KiB/i)
  })

  test('rejects an oversized non-FFmpeg lazy chunk but exempts an FFmpeg chunk', async () => {
    const { checkBundleBudget } = await import('../../scripts/check-bundle-budget.mjs')
    const distDir = resolve(fixtureRoot, 'dist')
    const smallEntry = 'export default 1'
    const largeLazy = randomBytes(260 * 1024)
    await writeFixture('dist/assets/app.js', smallEntry)
    await writeFixture('dist/assets/utility.js', largeLazy)
    await writeFixture('dist/assets/ffmpeg-core.js', largeLazy)
    await writeFixture('dist/.vite/manifest.json', JSON.stringify({
      'index.html': { file: 'assets/app.js', isEntry: true, dynamicImports: ['src/utility.js', 'src/media.js'] },
      'src/utility.js': { file: 'assets/utility.js' },
      'src/media.js': { file: 'assets/ffmpeg-core.js', isDynamicEntry: true },
    }))

    await expect(checkBundleBudget({ distDir })).rejects.toThrow(/utility\.js.*220 KiB/i)
  })

  test('rejects an oversized emitted worker even when Vite omits it from the manifest', async () => {
    const { checkBundleBudget } = await import('../../scripts/check-bundle-budget.mjs')
    const distDir = resolve(fixtureRoot, 'dist')
    await writeFixture('dist/assets/app.js', 'export default 1')
    await writeFixture('dist/assets/worker.js', randomBytes(260 * 1024))
    await writeFixture('dist/.vite/manifest.json', JSON.stringify({
      'index.html': { file: 'assets/app.js', isEntry: true },
    }))

    await expect(checkBundleBudget({ distDir })).rejects.toThrow(/worker\.js.*220 KiB/i)
  })
})
