import { gzipSync } from 'node:zlib'
import { randomBytes } from 'node:crypto'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { runInNewContext } from 'node:vm'
import { afterEach, describe, expect, test, vi } from 'vitest'

const fixtureRoot = resolve('test-results', 'task-8-build-fixtures')

async function writeFixture(relativePath, contents) {
  const path = resolve(fixtureRoot, relativePath)
  await mkdir(resolve(path, '..'), { recursive: true })
  await writeFile(path, contents)
  return path
}

async function writeGeneratorAssets() {
  const files = [
    'index.html',
    'favicon.svg',
    'manifest.json',
    'theme-init.js',
    'assets/app-a1.css',
    'assets/app-a1.js',
    'assets/pdf-c1.js',
    'assets/pdf-lib-c2.js',
    'assets/pdfWorker-w1.js',
    'assets/qr-b1.js',
    'assets/qrcode-b2.js',
    'assets/react-a2.js',
  ]
  for (const file of files) await writeFixture(`dist/${file}`, `fixture:${file}`)
}

async function writeThemeInit() {
  await writeFixture('dist/theme-init.js', 'document.documentElement.dataset.theme = "light"')
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
    await writeGeneratorAssets()
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
      '/assets/pdfWorker-w1.js',
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

  test('changes the cache version when precached bytes change and stays deterministic otherwise', async () => {
    const { generateServiceWorker } = await import('../../scripts/generate-service-worker.mjs')
    const distDir = resolve(fixtureRoot, 'dist')
    await writeFixture('dist/.vite/manifest.json', JSON.stringify({
      'index.html': { file: 'assets/app-a1.js', isEntry: true },
      'src/converters/qr.js': { file: 'assets/qr-b1.js', isDynamicEntry: true },
      'src/converters/pdf.js': { file: 'assets/pdf-c1.js', isDynamicEntry: true },
    }))
    await writeGeneratorAssets()
    const templatePath = await writeFixture('sw.template.js', 'const CACHE_NAME = __CACHE_NAME__;\nconst PRECACHE_URLS = __PRECACHE_URLS__;')

    const first = await generateServiceWorker({ distDir, templatePath })
    const firstSource = await readFile(resolve(distDir, 'sw.js'), 'utf8')
    const identical = await generateServiceWorker({ distDir, templatePath })
    const identicalSource = await readFile(resolve(distDir, 'sw.js'), 'utf8')
    await writeFixture('dist/favicon.svg', 'fixture:favicon.svg:changed-bytes')
    const changed = await generateServiceWorker({ distDir, templatePath })
    const changedSource = await readFile(resolve(distDir, 'sw.js'), 'utf8')

    expect(identical.cacheName).toBe(first.cacheName)
    expect(identicalSource).toBe(firstSource)
    expect(changed.cacheName).not.toBe(first.cacheName)
    expect(changedSource).not.toBe(firstSource)
  })

  test('keeps skipWaiting and clients.claim inside their lifecycle promises', async () => {
    const template = await readFile(resolve('public', 'sw.template.js'), 'utf8')
    const source = template
      .replaceAll('__CACHE_NAME__', JSON.stringify('folkkit-app-test'))
      .replaceAll('__PRECACHE_URLS__', JSON.stringify(['/']))
    const listeners = new Map()
    let resolveSkipWaiting
    let resolveClaim
    const skipWaitingPromise = new Promise(resolvePromise => { resolveSkipWaiting = resolvePromise })
    const claimPromise = new Promise(resolvePromise => { resolveClaim = resolvePromise })
    const context = {
      URL,
      caches: {
        open: vi.fn(async () => ({ addAll: vi.fn(async () => {}), match: vi.fn() })),
        keys: vi.fn(async () => []),
      },
      self: {
        addEventListener: (type, listener) => listeners.set(type, listener),
        skipWaiting: vi.fn(() => skipWaitingPromise),
        clients: { claim: vi.fn(() => claimPromise) },
        location: { origin: 'https://folkkit.test' },
      },
      Set,
    }
    runInNewContext(source, context)

    let installPromise
    listeners.get('install')({ waitUntil: promise => { installPromise = promise } })
    const installState = await Promise.race([
      installPromise.then(() => 'settled'),
      new Promise(resolvePromise => setTimeout(() => resolvePromise('pending'), 0)),
    ])
    expect(installState).toBe('pending')
    resolveSkipWaiting()
    await installPromise

    let activatePromise
    listeners.get('activate')({ waitUntil: promise => { activatePromise = promise } })
    const activateState = await Promise.race([
      activatePromise.then(() => 'settled'),
      new Promise(resolvePromise => setTimeout(() => resolvePromise('pending'), 0)),
    ])
    expect(activateState).toBe('pending')
    resolveClaim()
    await activatePromise
  })
})

describe('bundle budget', () => {
  test('rejects an initial JavaScript graph above 200 KiB gzip', async () => {
    const { checkBundleBudget } = await import('../../scripts/check-bundle-budget.mjs')
    const distDir = resolve(fixtureRoot, 'dist')
    const largeEntry = randomBytes(240 * 1024)
    await writeFixture('dist/assets/app.js', largeEntry)
    await writeThemeInit()
    await writeFixture('dist/.vite/manifest.json', JSON.stringify({
      'index.html': { file: 'assets/app.js', isEntry: true },
    }))
    expect(gzipSync(largeEntry).byteLength).toBeGreaterThan(200 * 1024)

    await expect(checkBundleBudget({ distDir })).rejects.toThrow(/initial JavaScript.*200 KiB/i)
  })

  test('rejects an oversized non-FFmpeg lazy chunk', async () => {
    const { checkBundleBudget } = await import('../../scripts/check-bundle-budget.mjs')
    const distDir = resolve(fixtureRoot, 'dist')
    const smallEntry = 'export default 1'
    const largeLazy = randomBytes(260 * 1024)
    await writeFixture('dist/assets/app.js', smallEntry)
    await writeFixture('dist/assets/utility.js', largeLazy)
    await writeThemeInit()
    await writeFixture('dist/.vite/manifest.json', JSON.stringify({
      'index.html': { file: 'assets/app.js', isEntry: true, dynamicImports: ['src/utility.js'] },
      'src/utility.js': { file: 'assets/utility.js' },
    }))

    await expect(checkBundleBudget({ distDir })).rejects.toThrow(/utility\.js.*220 KiB/i)
  })

  test('rejects an oversized emitted worker even when Vite omits it from the manifest', async () => {
    const { checkBundleBudget } = await import('../../scripts/check-bundle-budget.mjs')
    const distDir = resolve(fixtureRoot, 'dist')
    await writeFixture('dist/assets/app.js', 'export default 1')
    await writeFixture('dist/assets/worker.js', randomBytes(260 * 1024))
    await writeThemeInit()
    await writeFixture('dist/.vite/manifest.json', JSON.stringify({
      'index.html': { file: 'assets/app.js', isEntry: true },
    }))

    await expect(checkBundleBudget({ distDir })).rejects.toThrow(/worker\.js.*220 KiB/i)
  })

  test('rejects attempted budget overrides instead of allowing a bypass', async () => {
    const { checkBundleBudget } = await import('../../scripts/check-bundle-budget.mjs')
    const distDir = resolve(fixtureRoot, 'dist')
    await writeFixture('dist/assets/app.js', 'export default 1')
    await writeThemeInit()
    await writeFixture('dist/.vite/manifest.json', JSON.stringify({
      'index.html': { file: 'assets/app.js', isEntry: true },
    }))

    await expect(checkBundleBudget({ distDir, allowlist: { 'assets/app.js': 999999 } })).rejects.toThrow(/unsupported budget option.*allowlist/i)
    await expect(checkBundleBudget({ distDir, initialLimit: 999999, lazyLimit: 999999 })).rejects.toThrow(/unsupported budget option/i)
  })

  test('accounts for theme init initially and every emitted root or nested JavaScript file', async () => {
    const { checkBundleBudget } = await import('../../scripts/check-bundle-budget.mjs')
    const distDir = resolve(fixtureRoot, 'dist')
    await writeFixture('dist/assets/app.js', 'export default 1')
    await writeThemeInit()
    await writeFixture('dist/sw.js', 'self.addEventListener("fetch", () => {})')
    await writeFixture('dist/root-helper.js', 'export const root = true')
    await writeFixture('dist/nested/workers/converter-worker.js', 'self.onmessage = () => {}')
    await writeFixture('dist/.vite/manifest.json', JSON.stringify({
      'index.html': { file: 'assets/app.js', isEntry: true },
    }))

    const report = await checkBundleBudget({ distDir })

    expect(report.initialFiles.map(item => item.file).sort()).toEqual(['assets/app.js', 'theme-init.js'])
    expect(report.lazyChunks.map(item => item.file).sort()).toEqual([
      'nested/workers/converter-worker.js',
      'root-helper.js',
      'sw.js',
    ])
  })

  test('revalidates a hosting-ready dist after the private Vite manifest was removed', async () => {
    const { checkBundleBudget } = await import('../../scripts/check-bundle-budget.mjs')
    const distDir = resolve(fixtureRoot, 'dist')
    await writeFixture('dist/index.html', '<script type="module" src="/assets/app.js"></script>')
    await writeFixture('dist/assets/app.js', 'import "./shared.js"; export default 1')
    await writeFixture('dist/assets/shared.js', 'export const shared = true')
    await writeFixture('dist/assets/lazy.js', 'export const lazy = true')
    await writeThemeInit()

    const report = await checkBundleBudget({ distDir })

    expect(report.initialFiles.map(item => item.file).sort()).toEqual(['assets/app.js', 'assets/shared.js', 'theme-init.js'])
    expect(report.lazyChunks.map(item => item.file)).toEqual(['assets/lazy.js'])
  })

  test('recognizes hashed FFmpeg wrapper files through their manifest source keys', async () => {
    const { checkBundleBudget } = await import('../../scripts/check-bundle-budget.mjs')
    const distDir = resolve(fixtureRoot, 'dist')
    await writeFixture('dist/assets/app.js', 'export default 1')
    await writeFixture('dist/assets/index-hashed.js', 'export class FFmpeg {}')
    await writeThemeInit()
    await writeFixture('dist/.vite/manifest.json', JSON.stringify({
      'index.html': { file: 'assets/app.js', isEntry: true },
      'node_modules/@ffmpeg/ffmpeg/dist/esm/index.js': { file: 'assets/index-hashed.js', isDynamicEntry: true },
    }))

    const report = await checkBundleBudget({ distDir })

    expect(report.lazyChunks.find(item => item.file === 'assets/index-hashed.js')).toMatchObject({ exempt: true })
  })

  test.each([
    'assets/fake-ffmpeg-worker.js',
    'nested/path-with-ffmpeg/chunk.js',
  ])('keeps an oversized path fragment budgeted: %s', async (file) => {
    const { checkBundleBudget } = await import('../../scripts/check-bundle-budget.mjs')
    const distDir = resolve(fixtureRoot, 'dist')
    await writeFixture('dist/assets/app.js', 'export default 1')
    await writeFixture(`dist/${file}`, randomBytes(260 * 1024))
    await writeThemeInit()
    await writeFixture('dist/.vite/manifest.json', JSON.stringify({
      'index.html': { file: 'assets/app.js', isEntry: true },
    }))

    await expect(checkBundleBudget({ distDir })).rejects.toThrow(new RegExp(file.replaceAll('.', '\\.')))
  })

  test('exempts only real FFmpeg package entries and the exact synchronized vendor core', async () => {
    const { checkBundleBudget } = await import('../../scripts/check-bundle-budget.mjs')
    const distDir = resolve(fixtureRoot, 'dist')
    const oversized = randomBytes(260 * 1024)
    await writeFixture('dist/assets/app.js', 'export default 1')
    await writeFixture('dist/assets/ffmpeg-wrapper-hash.js', oversized)
    await writeFixture('dist/assets/util-wrapper-hash.js', oversized)
    await writeFixture('dist/vendor/ffmpeg/ffmpeg-core.js', oversized)
    await writeThemeInit()
    await writeFixture('dist/.vite/manifest.json', JSON.stringify({
      'index.html': { file: 'assets/app.js', isEntry: true },
      './node_modules//@ffmpeg//ffmpeg/dist/esm/index.js': { file: 'assets/ffmpeg-wrapper-hash.js', isDynamicEntry: true },
      'src/util-wrapper.js': { file: 'assets/util-wrapper-hash.js', src: '.\\node_modules\\@ffmpeg\\util\\dist\\esm\\index.js', isDynamicEntry: true },
    }))

    const report = await checkBundleBudget({ distDir })

    expect(report.lazyChunks.filter(item => item.exempt).map(item => item.file).sort()).toEqual([
      'assets/ffmpeg-wrapper-hash.js',
      'assets/util-wrapper-hash.js',
      'vendor/ffmpeg/ffmpeg-core.js',
    ])
  })

  test('does not trust a spoofed manifest key, display name, or near-package path', async () => {
    const { checkBundleBudget } = await import('../../scripts/check-bundle-budget.mjs')
    const distDir = resolve(fixtureRoot, 'dist')
    await writeFixture('dist/assets/app.js', 'export default 1')
    await writeFixture('dist/assets/spoofed.js', randomBytes(260 * 1024))
    await writeThemeInit()
    await writeFixture('dist/.vite/manifest.json', JSON.stringify({
      'index.html': { file: 'assets/app.js', isEntry: true },
      'node_modules/@ffmpeg/ffmpeg-fake/index.js': {
        file: 'assets/spoofed.js',
        src: 'src/not-a-package.js',
        name: 'node_modules/@ffmpeg/ffmpeg',
        isDynamicEntry: true,
      },
    }))

    await expect(checkBundleBudget({ distDir })).rejects.toThrow(/assets\/spoofed\.js.*220 KiB/i)
  })

  test.each([
    {
      index: 1,
      label: 'parent escape to ffmpeg-fake',
      key: 'node_modules/@ffmpeg/ffmpeg/../ffmpeg-fake/index.js',
    },
    {
      index: 2,
      label: 'nested dot parent escape',
      key: 'src/wrapper-a.js',
      src: 'node_modules/@ffmpeg/ffmpeg/dist/./../../ffmpeg-fake/index.js',
    },
    {
      index: 3,
      label: 'Windows backslash parent escape',
      key: 'src/wrapper-b.js',
      src: 'node_modules\\@ffmpeg\\util\\..\\evil\\index.js',
    },
    {
      index: 4,
      label: 'repeated slash near-package escape',
      key: 'node_modules/@ffmpeg/ffmpeg//../ffmpeg-fake/index.js',
    },
  ])('keeps a canonical package escape budgeted: $label', async ({ index, key, src }) => {
    const { checkBundleBudget } = await import('../../scripts/check-bundle-budget.mjs')
    const distDir = resolve(fixtureRoot, 'dist')
    const file = `assets/canonical-spoof-${index}.js`
    await writeFixture('dist/assets/app.js', 'export default 1')
    await writeFixture(`dist/${file}`, randomBytes(260 * 1024))
    await writeThemeInit()
    await writeFixture('dist/.vite/manifest.json', JSON.stringify({
      'index.html': { file: 'assets/app.js', isEntry: true },
      [key]: { file, ...(src ? { src } : {}), isDynamicEntry: true },
    }))

    await expect(checkBundleBudget({ distDir })).rejects.toThrow(/canonical-spoof-.*220 KiB/i)
  })

  test('keeps a shared non-package import budgeted when a real FFmpeg entry imports it', async () => {
    const { checkBundleBudget } = await import('../../scripts/check-bundle-budget.mjs')
    const distDir = resolve(fixtureRoot, 'dist')
    await writeFixture('dist/assets/app.js', 'export default 1')
    await writeFixture('dist/assets/ffmpeg-wrapper.js', 'export class FFmpeg {}')
    await writeFixture('dist/assets/shared-app-code.js', randomBytes(260 * 1024))
    await writeThemeInit()
    await writeFixture('dist/.vite/manifest.json', JSON.stringify({
      'index.html': { file: 'assets/app.js', isEntry: true },
      'node_modules/@ffmpeg/ffmpeg/dist/esm/index.js': {
        file: 'assets/ffmpeg-wrapper.js',
        src: 'node_modules/@ffmpeg/ffmpeg/dist/esm/index.js',
        imports: ['_shared.js'],
        isDynamicEntry: true,
      },
      '_shared.js': { file: 'assets/shared-app-code.js' },
    }))

    await expect(checkBundleBudget({ distDir })).rejects.toThrow(/assets\/shared-app-code\.js.*220 KiB/i)
  })
})
