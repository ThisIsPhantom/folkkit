import { access, copyFile as copyRuntimeFile, mkdir, mkdtemp, rename, rm } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const runtimeFiles = ['ffmpeg-core.js', 'ffmpeg-core.wasm']
const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const defaultSourceDirectory = join(projectRoot, 'node_modules', '@ffmpeg', 'core', 'dist', 'esm')
const defaultDestinationDirectory = join(projectRoot, 'public', 'vendor', 'ffmpeg')

export async function syncRuntimeAssets({
  sourceDirectory = defaultSourceDirectory,
  destinationDirectory = defaultDestinationDirectory,
  copyFile = copyRuntimeFile,
} = {}) {
  const sourcePaths = await Promise.all(runtimeFiles.map(async (filename) => {
    const sourcePath = join(sourceDirectory, filename)
    try {
      await access(sourcePath)
    } catch {
      throw new Error(`Missing required FFmpeg runtime asset: ${filename}`)
    }
    return sourcePath
  }))

  const destinationParentDirectory = dirname(destinationDirectory)
  await mkdir(destinationParentDirectory, { recursive: true })
  const stagingDirectory = await mkdtemp(join(destinationParentDirectory, `.${basename(destinationDirectory)}-stage-`))
  let backupDirectory = null

  try {
    const stagingResults = await Promise.allSettled(sourcePaths.map((sourcePath, index) => (
      copyFile(sourcePath, join(stagingDirectory, runtimeFiles[index]))
    )))
    const failedStagingResult = stagingResults.find((result) => result.status === 'rejected')
    if (failedStagingResult) throw failedStagingResult.reason

    let destinationExists = true
    try {
      await access(destinationDirectory)
    } catch {
      destinationExists = false
    }

    if (destinationExists) {
      backupDirectory = await mkdtemp(join(destinationParentDirectory, `.${basename(destinationDirectory)}-backup-`))
      await rm(backupDirectory, { recursive: true, force: true })
      await rename(destinationDirectory, backupDirectory)
    }

    try {
      await rename(stagingDirectory, destinationDirectory)
    } catch (error) {
      if (backupDirectory) await rename(backupDirectory, destinationDirectory)
      throw error
    }

    if (backupDirectory) await rm(backupDirectory, { recursive: true, force: true })
  } finally {
    await rm(stagingDirectory, { recursive: true, force: true })
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  syncRuntimeAssets().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
