import { gzipSync } from 'node:zlib'
import { readFile, readdir } from 'node:fs/promises'
import { posix, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

export const INITIAL_JS_LIMIT = 200 * 1024
export const LAZY_JS_LIMIT = 220 * 1024

const SUPPORTED_OPTIONS = new Set(['distDir'])
const TRUSTED_FFMPEG_PACKAGE_ROOTS = Object.freeze([
  'node_modules/@ffmpeg/ffmpeg',
  'node_modules/@ffmpeg/util',
])
const TRUSTED_VENDOR_CORE_FILE = 'vendor/ffmpeg/ffmpeg-core.js'

function normalizeBuildPath(value) {
  const slashPath = String(value || '').replaceAll('\\', '/')
  const relativePath = slashPath.replace(/^(?:\.\/)+/, '')
  return posix.normalize(relativePath)
}

function isTrustedFfmpegPackageSource(value) {
  const normalized = normalizeBuildPath(value)
  return TRUSTED_FFMPEG_PACKAGE_ROOTS.some(root => normalized === root || normalized.startsWith(`${root}/`))
}

function collectInitialKeys(manifest) {
  const selected = new Set()
  const visit = (key) => {
    if (selected.has(key)) return
    const chunk = manifest[key]
    if (!chunk) throw new Error(`Vite manifest references an unknown chunk: ${key}`)
    selected.add(key)
    for (const importKey of chunk.imports || []) visit(importKey)
  }
  for (const [key, chunk] of Object.entries(manifest)) {
    if (chunk.isEntry) visit(key)
  }
  if (selected.size === 0) throw new Error('Vite manifest has no application entry.')
  return selected
}

async function gzipFileSize(distDir, file) {
  return gzipSync(await readFile(resolve(distDir, file))).byteLength
}

async function listJavaScriptFiles(directory, prefix = '') {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name
    if (entry.isDirectory()) {
      files.push(...await listJavaScriptFiles(resolve(directory, entry.name), relativePath))
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(relativePath)
    }
  }
  return files
}

function formatKiB(bytes) {
  return `${(bytes / 1024).toFixed(1)} KiB gzip`
}

export async function checkBundleBudget(options = {}) {
  const unsupportedOptions = Object.keys(options).filter(option => !SUPPORTED_OPTIONS.has(option))
  if (unsupportedOptions.length) {
    throw new Error(`Unsupported budget option: ${unsupportedOptions.join(', ')}`)
  }
  const distDir = options.distDir || resolve('dist')
  const manifest = JSON.parse(await readFile(resolve(distDir, '.vite', 'manifest.json'), 'utf8'))
  const initialKeys = collectInitialKeys(manifest)
  const initialFiles = [...new Set([...initialKeys]
    .map(key => manifest[key].file)
    .filter(file => file?.endsWith('.js')).concat('theme-init.js'))]
  const initialMeasurements = await Promise.all(initialFiles.map(async file => ({
    file,
    gzipBytes: await gzipFileSize(distDir, file),
  })))
  const initialGzipBytes = initialMeasurements.reduce((total, item) => total + item.gzipBytes, 0)
  const failures = []
  if (initialGzipBytes > INITIAL_JS_LIMIT) {
    failures.push(`Initial JavaScript is ${formatKiB(initialGzipBytes)}; limit is 200 KiB gzip.`)
  }

  const initialFileSet = new Set(initialFiles)
  const ffmpegFiles = new Set([TRUSTED_VENDOR_CORE_FILE])
  for (const [key, chunk] of Object.entries(manifest)) {
    if (isTrustedFfmpegPackageSource(chunk.src) || isTrustedFfmpegPackageSource(key)) {
      ffmpegFiles.add(normalizeBuildPath(chunk.file))
    }
  }
  const lazyChunks = []
  const emittedJavaScript = await listJavaScriptFiles(distDir)
  for (const file of emittedJavaScript) {
    if (initialFileSet.has(file)) continue
    const gzipBytes = await gzipFileSize(distDir, file)
    const isFfmpeg = ffmpegFiles.has(normalizeBuildPath(file))
    lazyChunks.push({ key: file, file, gzipBytes, exempt: isFfmpeg })
    if (!isFfmpeg && gzipBytes > LAZY_JS_LIMIT) {
      failures.push(`${file} is ${formatKiB(gzipBytes)}; limit is 220 KiB gzip.`)
    }
  }

  if (failures.length) throw new Error(`Bundle budget failed:\n${failures.join('\n')}`)
  return { initialGzipBytes, initialFiles: initialMeasurements, lazyChunks }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const report = await checkBundleBudget()
  console.log(`Initial JavaScript: ${formatKiB(report.initialGzipBytes)} / 200.0 KiB gzip`)
  for (const chunk of report.lazyChunks) {
    const suffix = chunk.exempt ? ' (FFmpeg exempt)' : ''
    console.log(`Lazy ${chunk.file}: ${formatKiB(chunk.gzipBytes)}${suffix}`)
  }
}
