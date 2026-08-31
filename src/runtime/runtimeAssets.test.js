import { afterEach, expect, test } from 'vitest'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { runtimeAssetUrl } from './runtimeAssets'
import { syncRuntimeAssets } from '../../scripts/sync-runtime-assets.mjs'
import { assertPassiveAdsenseOwnershipMeta } from '../../scripts/assert-ownership-meta.mjs'

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

test('fails asset synchronization when a required FFmpeg core file is absent', async () => {
  const sourceDirectory = await createTemporaryDirectory()
  const destinationDirectory = await createTemporaryDirectory()
  await writeFile(join(sourceDirectory, 'ffmpeg-core.js'), 'ffmpeg core JavaScript')

  await expect(syncRuntimeAssets({ sourceDirectory, destinationDirectory })).rejects.toThrow('ffmpeg-core.wasm')
})

test('accepts built HTML with one passive AdSense ownership meta tag', () => {
  expect(() => assertPassiveAdsenseOwnershipMeta('<meta name="google-adsense-account" content="ca-pub-7877827162675091">')).not.toThrow()
})

test('rejects built HTML without exactly one passive AdSense ownership meta tag', () => {
  const ownershipMeta = '<meta name="google-adsense-account" content="ca-pub-7877827162675091">'

  expect(() => assertPassiveAdsenseOwnershipMeta('<head></head>')).toThrow('exactly one')
  expect(() => assertPassiveAdsenseOwnershipMeta(`${ownershipMeta}${ownershipMeta}`)).toThrow('exactly one')
})
