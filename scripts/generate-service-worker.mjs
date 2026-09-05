import { createHash } from 'node:crypto'
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { posix, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { parse } from 'acorn'

const STATIC_SHELL_URLS = ['/', '/index.html', '/favicon.svg', '/manifest.json', '/theme-init.js']
const CORE_MODULE_PATTERN = /(?:^|\/)src\/converters\/(?:qr|pdf)\.js$/
const STUDIO_MODULE_PATTERN = /^src\/features\/(?:qr\/QrDesignerPage|pdf\/PdfEditorPage|convert\/FileConverterPage|calculate\/CalculatorPage)\.jsx$/
const STUDIO_CHUNK_NAMES = new Set(['QrDesignerPage', 'PdfEditorPage', 'FileConverterPage', 'CalculatorPage'])
const isStudioChunk = (key, chunk) => STUDIO_MODULE_PATTERN.test(key)
  || (key.startsWith('_') && chunk.isDynamicEntry === true && STUDIO_CHUNK_NAMES.has(chunk.name))
const EXCLUDED_PATTERN = /(?:\.map$|(?:^|\/)tests?(?:\/|\.)|(?:^|[\/_-])(?:ffmpeg|media(?:Engine)?|experimental)(?:[\/_\-.]|$))/i

function toSameOriginPath(value) {
  if (typeof value !== 'string' || !value) throw new Error('Vite manifest emitted an empty asset URL.')
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value)) {
    throw new Error(`Vite manifest asset must be same-origin: ${value}`)
  }
  const path = value.startsWith('/') ? value : `/${value}`
  if (EXCLUDED_PATTERN.test(path)) return null
  return path
}

function collectStaticGraph(manifest, key, selected, includeDynamic = false, visiting = new Set()) {
  if (visiting.has(key)) return
  visiting.add(key)
  const chunk = manifest[key]
  if (!chunk) throw new Error(`Vite manifest references an unknown chunk: ${key}`)
  const file = toSameOriginPath(chunk.file)
  if (!file) return
  selected.add(file)
  for (const cssFile of chunk.css || []) {
    const cssPath = toSameOriginPath(cssFile)
    if (cssPath) selected.add(cssPath)
  }
  for (const assetFile of chunk.assets || []) {
    const assetPath = toSameOriginPath(assetFile)
    if (assetPath) selected.add(assetPath)
  }
  for (const importKey of chunk.imports || []) collectStaticGraph(manifest, importKey, selected, false, visiting)
  if (includeDynamic) {
    for (const importKey of chunk.dynamicImports || []) collectStaticGraph(manifest, importKey, selected, true, visiting)
  }
}

// Vite's main manifest omits modules imported by dedicated workers. Follow
// their emitted module graph, including the pinned, hashed PDFium WASM URL.
async function collectWorkerGraph(distDir, file, selected, visited = new Set()) {
  const normalized = posix.normalize(file)
  if (!/^assets\/[A-Za-z0-9_.-]+\.(?:js|wasm)$/.test(normalized)) throw new Error(`Worker asset escapes the build: ${file}`)
  if (visited.has(normalized)) return
  visited.add(normalized)
  const bytes = await readFile(resolve(distDir, normalized))
  selected.add(toSameOriginPath(normalized))
  if (!normalized.endsWith('.js')) return
  const ast = parse(bytes.toString('utf8'), { ecmaVersion: 'latest', sourceType: 'module' })
  const dependencies = new Set()
  const visit = node => {
    if (!node || typeof node !== 'object') return
    if (node.type === 'ImportDeclaration' || node.type === 'ImportExpression' || node.type === 'ExportAllDeclaration' || node.type === 'ExportNamedDeclaration' && node.source) {
      const source = node.source.value
      if (typeof source !== 'string' || !source.startsWith('.')) throw new Error(`Worker module must be a local build asset: ${source}`)
      dependencies.add(posix.join(posix.dirname(normalized), source))
    }
    if (node.type === 'Literal' && typeof node.value === 'string' && /^\/assets\/[A-Za-z0-9_.-]+-[A-Za-z0-9_-]{6,}\.(?:wasm|js)$/.test(node.value)) {
      dependencies.add(node.value.slice(1))
    }
    for (const [key, value] of Object.entries(node)) {
      if (['start', 'end', 'loc'].includes(key)) continue
      if (Array.isArray(value)) value.forEach(visit)
      else if (value && typeof value === 'object') visit(value)
    }
  }
  visit(ast)
  for (const dependency of dependencies) await collectWorkerGraph(distDir, dependency, selected, visited)
}

export async function generateServiceWorker({
  distDir = resolve('dist'),
  templatePath = resolve('public', 'sw.template.js'),
} = {}) {
  const manifestPath = resolve(distDir, '.vite', 'manifest.json')
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  for (const chunk of Object.values(manifest)) {
    toSameOriginPath(chunk.file)
    for (const value of [...(chunk.css || []), ...(chunk.assets || [])]) toSameOriginPath(value)
  }
  const selected = new Set(STATIC_SHELL_URLS)
  const roots = Object.entries(manifest)
    .filter(([key, chunk]) => chunk.isEntry || CORE_MODULE_PATTERN.test(key) || isStudioChunk(key, chunk) || key === 'src/pages/WorkspacePage.jsx')
    .map(([key]) => key)

  if (!roots.some(key => manifest[key].isEntry)) throw new Error('Vite manifest has no application entry.')
  if (!roots.some(key => CORE_MODULE_PATTERN.test(key) && key.endsWith('/qr.js'))) throw new Error('Vite manifest has no core QR chunk.')
  if (!roots.some(key => CORE_MODULE_PATTERN.test(key) && key.endsWith('/pdf.js'))) throw new Error('Vite manifest has no core PDF chunk.')
  for (const key of roots) collectStaticGraph(manifest, key, selected, CORE_MODULE_PATTERN.test(key) || isStudioChunk(key, manifest[key]))
  const pdfWorkerFiles = (await readdir(resolve(distDir, 'assets')))
    .filter(file => /^pdfWorker-[A-Za-z0-9_-]+\.js$/.test(file))
  if (pdfWorkerFiles.length !== 1) throw new Error(`Expected exactly one emitted PDF worker, found ${pdfWorkerFiles.length}.`)
  selected.add(toSameOriginPath(`assets/${pdfWorkerFiles[0]}`))
  if (roots.some(key => isStudioChunk(key, manifest[key]))) {
    const emitted = await readdir(resolve(distDir, 'assets'))
    for (const prefix of ['pdfStudioWorker', 'imageWorker']) {
      const files = emitted.filter(file => new RegExp(`^${prefix}-[A-Za-z0-9_-]+\\.js$`).test(file))
      if (files.length !== 1) throw new Error(`Expected one emitted ${prefix}, found ${files.length}.`)
      await collectWorkerGraph(distDir, `assets/${files[0]}`, selected)
    }
  }

  const precacheUrls = [...selected].sort()
  for (const url of precacheUrls) toSameOriginPath(url)
  const versionHash = createHash('sha256')
  const template = await readFile(templatePath, 'utf8')
  versionHash.update(template).update('\0')
  for (const url of precacheUrls) {
    const file = url === '/' || url === '/index.html' ? 'index.html' : url.slice(1)
    const bytes = await readFile(resolve(distDir, file))
    versionHash.update(url).update('\0').update(bytes).update('\0')
  }
  // Optional modules are cached only after use, but their bytes still bind
  // the cache version so a runtime update cannot reuse an older engine.
  for (const file of ['vendor/ffmpeg/ffmpeg-core.js', 'vendor/ffmpeg/ffmpeg-core.wasm']) {
    try {
      versionHash.update(file).update('\0').update(await readFile(resolve(distDir, file))).update('\0')
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
  }
  const version = versionHash.digest('hex').slice(0, 12)
  const cacheName = `folkkit-app-${version}`
  if (!template.includes('__CACHE_NAME__') || !template.includes('__PRECACHE_URLS__')) {
    throw new Error('Service worker template is missing a generation placeholder.')
  }
  const source = template
    .replaceAll('__CACHE_NAME__', JSON.stringify(cacheName))
    .replaceAll('__PRECACHE_URLS__', JSON.stringify(precacheUrls, null, 2))
  await writeFile(resolve(distDir, 'sw.js'), source)
  return { cacheName, precacheUrls }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const result = await generateServiceWorker()
  console.log(`Generated ${result.cacheName} with ${result.precacheUrls.length} same-origin assets.`)
}
