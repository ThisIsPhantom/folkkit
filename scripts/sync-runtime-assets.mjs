import { access, copyFile as copyRuntimeFile, mkdir, mkdtemp, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises'
import { basename, dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const runtimeFiles = ['ffmpeg-core.js', 'ffmpeg-core.wasm']
const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const defaultSourceDirectory = join(projectRoot, 'node_modules', '@ffmpeg', 'core', 'dist', 'esm')
const defaultDestinationDirectory = join(projectRoot, 'public', 'vendor', 'ffmpeg')
const defaultVendorDirectory = dirname(defaultDestinationDirectory)
const expectedVendorFiles = runtimeFiles.map(filename => `ffmpeg/${filename}`).sort()

async function listVendorFiles(directory, root = directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await listVendorFiles(path, root))
    else if (entry.isFile()) files.push(relative(root, path).replaceAll('\\', '/'))
    else throw new Error(`Unexpected runtime vendor entry type: ${relative(root, path).replaceAll('\\', '/')}`)
  }
  return files.sort()
}

export async function assertExactRuntimeAssets({ vendorDirectory = defaultVendorDirectory } = {}) {
  let actualFiles
  try {
    actualFiles = await listVendorFiles(vendorDirectory)
  } catch (error) {
    if (error.code === 'ENOENT') throw new Error('Missing runtime vendor directory.')
    throw error
  }
  const unexpected = actualFiles.filter(path => !expectedVendorFiles.includes(path))
  if (unexpected.length > 0) throw new Error(`Unexpected runtime vendor file: ${unexpected.join(', ')}`)
  const missing = expectedVendorFiles.filter(path => !actualFiles.includes(path))
  if (missing.length > 0) throw new Error(`Missing required runtime vendor file: ${missing.join(', ')}`)
  return actualFiles
}

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
    const stagedCorePath = join(stagingDirectory, 'ffmpeg-core.js')
    const stagedCore = await readFile(stagedCorePath, 'utf8')
    if (stagedCore.includes('//address:port')) {
      await writeFile(stagedCorePath, stagedCore.replaceAll('//address:port', 'address:port'), 'utf8')
    }

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
  syncRuntimeAssets()
    .then(() => assertExactRuntimeAssets())
    .catch((error) => {
      console.error(error.message)
      process.exitCode = 1
    })
}
