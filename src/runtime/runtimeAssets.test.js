import { afterEach, expect, test } from 'vitest'
import { copyFile, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { runtimeAssetUrl } from './runtimeAssets'
import { syncRuntimeAssets } from '../../scripts/sync-runtime-assets.mjs'
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
