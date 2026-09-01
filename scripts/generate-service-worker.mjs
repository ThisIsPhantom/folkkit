import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const STATIC_SHELL_URLS = ['/', '/index.html', '/favicon.svg', '/manifest.json', '/theme-init.js']
const CORE_MODULE_PATTERN = /(?:^|\/)src\/converters\/(?:qr|pdf)\.js$/
const EXCLUDED_PATTERN = /(?:\.map$|(?:^|\/)tests?(?:\/|\.)|(?:^|[\/_-])(?:ffmpeg|media|experimental)(?:[\/_\-.]|$))/i

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
  if (file) selected.add(file)
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
    .filter(([key, chunk]) => chunk.isEntry || CORE_MODULE_PATTERN.test(key))
    .map(([key]) => key)

  if (!roots.some(key => manifest[key].isEntry)) throw new Error('Vite manifest has no application entry.')
  if (!roots.some(key => CORE_MODULE_PATTERN.test(key) && key.endsWith('/qr.js'))) throw new Error('Vite manifest has no core QR chunk.')
  if (!roots.some(key => CORE_MODULE_PATTERN.test(key) && key.endsWith('/pdf.js'))) throw new Error('Vite manifest has no core PDF chunk.')
  for (const key of roots) collectStaticGraph(manifest, key, selected, CORE_MODULE_PATTERN.test(key))

  const precacheUrls = [...selected].sort()
  for (const url of precacheUrls) toSameOriginPath(url)
  const version = createHash('sha256').update(precacheUrls.join('\n')).digest('hex').slice(0, 12)
  const cacheName = `folkkit-app-${version}`
  const template = await readFile(templatePath, 'utf8')
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
