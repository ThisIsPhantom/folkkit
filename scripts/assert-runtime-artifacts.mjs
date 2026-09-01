import { readFile, readdir } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const forbiddenTestServiceWorker = /(?:__folkkit-test__|folkkit-app-test-old)/i
const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const runtimeArtifactExtensions = new Set(['.css', '.html', '.js', '.json', '.mjs', '.svg'])
const externalOrigin = String.raw`(?:https?:)?//[^\s'"<>]+`
const automaticSinkPatterns = Object.freeze({
  css: [
    new RegExp(String.raw`(?:@import\s+(?:url\()?|url\()\s*['"]?${externalOrigin}`, 'i'),
  ],
  html: [
    new RegExp(String.raw`<(?:script|img|iframe|source|video|audio|link|object|embed)\b[^>]*(?:src|href|data)\s*=\s*['"]${externalOrigin}`, 'i'),
    new RegExp(String.raw`<form\b[^>]*action\s*=\s*['"]${externalOrigin}`, 'i'),
  ],
  javascript: [
    new RegExp(String.raw`(?:fetch|import|importScripts|navigator\.sendBeacon|new\s+(?:Worker|SharedWorker))\s*\(\s*['"]${externalOrigin}`, 'i'),
    new RegExp(String.raw`\.open\s*\(\s*['"][A-Z]+['"]\s*,\s*['"]${externalOrigin}`, 'i'),
    new RegExp(String.raw`(?:src|href)\s*=\s*['"]${externalOrigin}`, 'i'),
  ],
  svg: [
    new RegExp(String.raw`<(?:image|script|use)\b[^>]*(?:href|xlink:href)\s*=\s*['"]${externalOrigin}`, 'i'),
    new RegExp(String.raw`url\(\s*['"]?${externalOrigin}`, 'i'),
  ],
})

function hasExternalManifestSink(contents) {
  let value
  try { value = JSON.parse(contents) } catch { return false }
  const visit = (entry, key = '') => {
    if (typeof entry === 'string') {
      return ['src', 'start_url', 'scope', 'url'].includes(key) && /^(?:https?:)?\/\//i.test(entry)
    }
    if (Array.isArray(entry)) return entry.some(item => visit(item, key))
    if (entry && typeof entry === 'object') return Object.entries(entry).some(([childKey, child]) => visit(child, childKey))
    return false
  }
  return visit(value)
}

export function assertNoExternalRuntimeOrigins(artifactName, contents) {
  const lowerName = artifactName.toLowerCase()
  const patterns = lowerName.endsWith('.css')
    ? automaticSinkPatterns.css
    : lowerName.endsWith('.html')
      ? automaticSinkPatterns.html
      : lowerName.endsWith('.svg')
        ? automaticSinkPatterns.svg
        : lowerName.endsWith('.json')
          ? []
          : automaticSinkPatterns.javascript
  if (patterns.some(pattern => pattern.test(contents)) || (lowerName.endsWith('.json') && hasExternalManifestSink(contents))) {
    throw new Error(`${artifactName} contains an external runtime origin in an automatic sink.`)
  }
  if (forbiddenTestServiceWorker.test(contents)) {
    throw new Error(`${artifactName} contains the test-only service worker.`)
  }
}

async function listRuntimeArtifacts(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nestedArtifacts = await Promise.all(entries.map(async (entry) => {
    const entryPath = join(directory, entry.name)
    if (entry.isDirectory()) return listRuntimeArtifacts(entryPath)
    return runtimeArtifactExtensions.has(entry.name.slice(entry.name.lastIndexOf('.'))) ? [entryPath] : []
  }))
  return nestedArtifacts.flat()
}

export async function assertBuiltRuntimeArtifacts({
  distDirectory = join(projectRoot, 'dist'),
} = {}) {
  const artifactPaths = await listRuntimeArtifacts(distDirectory)
  await Promise.all(artifactPaths.map(async (artifactPath) => {
    const contents = await readFile(artifactPath, 'utf8')
    assertNoExternalRuntimeOrigins(relative(distDirectory, artifactPath), contents)
  }))
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  assertBuiltRuntimeArtifacts()
    .then(() => console.log('Runtime artifacts contain only same-origin paths.'))
    .catch((error) => {
      console.error(error.message)
      process.exitCode = 1
    })
}
