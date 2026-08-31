import { access, copyFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const runtimeFiles = ['ffmpeg-core.js', 'ffmpeg-core.wasm']
const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const defaultSourceDirectory = join(projectRoot, 'node_modules', '@ffmpeg', 'core', 'dist', 'esm')
const defaultDestinationDirectory = join(projectRoot, 'public', 'vendor', 'ffmpeg')

export async function syncRuntimeAssets({
  sourceDirectory = defaultSourceDirectory,
  destinationDirectory = defaultDestinationDirectory,
} = {}) {
  await mkdir(destinationDirectory, { recursive: true })

  const sourcePaths = await Promise.all(runtimeFiles.map(async (filename) => {
    const sourcePath = join(sourceDirectory, filename)
    try {
      await access(sourcePath)
    } catch {
      throw new Error(`Missing required FFmpeg runtime asset: ${filename}`)
    }
    return sourcePath
  }))

  await Promise.all(sourcePaths.map((sourcePath, index) => (
    copyFile(sourcePath, join(destinationDirectory, runtimeFiles[index]))
  )))
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  syncRuntimeAssets().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
