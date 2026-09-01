import { readFile, readdir } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'acorn'

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
  svg: [
    new RegExp(String.raw`<(?:image|script|use)\b[^>]*(?:href|xlink:href)\s*=\s*['"]${externalOrigin}`, 'i'),
    new RegExp(String.raw`url\(\s*['"]?${externalOrigin}`, 'i'),
  ],
})

const reviewedLegalNavigation = new Set(JSON.parse(readFileSync(join(projectRoot, 'scripts', 'reviewed-browser-navigation.json'), 'utf8')))

function externalUrls(value) {
  return [...String(value || '').matchAll(/(?:^|[\s'"`(<\[=:,])((?:https?:)?\/\/[^\s'"`<>\])}]+)/gi)].map(match => match[1])
}

function isReviewedLegalNavigation(value) {
  return reviewedLegalNavigation.has(value)
    || /^https:\/\/github\.com\/ThisIsPhantom\/folkkit\/tree\/[0-9a-f]{40}$/.test(value)
}

function staticString(node, declarations = new Map(), seen = new Set()) {
  if (node?.type === 'Literal' && typeof node.value === 'string') return node.value
  if (node?.type === 'Identifier') {
    if (seen.has(node.name) || !declarations.has(node.name)) return null
    const declaration = declarations.get(node.name)
    if (!declaration) return null
    return staticString(declaration, declarations, new Set([...seen, node.name]))
  }
  if (node?.type === 'TemplateLiteral') {
    let result = ''
    for (let index = 0; index < node.quasis.length; index += 1) {
      result += node.quasis[index].value.cooked || ''
      if (index < node.expressions.length) {
        const expression = staticString(node.expressions[index], declarations, seen)
        if (expression === null) return null
        result += expression
      }
    }
    return result
  }
  if (node?.type === 'BinaryExpression' && node.operator === '+') {
    const left = staticString(node.left, declarations, seen)
    const right = staticString(node.right, declarations, seen)
    return left !== null && right !== null ? left + right : null
  }
  if (node?.type === 'NewExpression' && node.callee?.type === 'Identifier' && node.callee.name === 'URL') {
    return staticString(node.arguments[0], declarations, seen)
  }
  return null
}

function externalValue(node, declarations) {
  const value = staticString(node, declarations)
  return typeof value === 'string' && /^(?:https?:)?\/\//i.test(value) ? value : null
}

function propertyName(node) {
  if (!node || node.type !== 'MemberExpression') return null
  if (!node.computed && node.property.type === 'Identifier') return node.property.name
  return staticString(node.property)
}

function hasExternalJavaScriptSink(contents) {
  let ast
  try {
    ast = parse(contents, { ecmaVersion: 'latest', sourceType: 'module', allowHashBang: true })
  } catch (error) {
    throw new Error(`JavaScript runtime artifact could not be parsed: ${error.message}`)
  }
  const declarations = new Map()
  const collect = node => {
    if (!node || typeof node !== 'object') return
    if (node.type === 'VariableDeclarator' && node.id?.type === 'Identifier' && node.init) {
      declarations.set(node.id.name, declarations.has(node.id.name) ? null : node.init)
    }
    for (const [key, value] of Object.entries(node)) {
      if (key === 'start' || key === 'end' || key === 'loc') continue
      if (Array.isArray(value)) value.forEach(collect)
      else if (value && typeof value === 'object') collect(value)
    }
  }
  collect(ast)

  let found = null
  const visit = node => {
    if (found || !node || typeof node !== 'object') return
    if (['Literal', 'TemplateLiteral', 'BinaryExpression'].includes(node.type)) {
      const value = staticString(node, declarations)
      const unreviewed = value === null ? null : externalUrls(value).find(url => !isReviewedLegalNavigation(url))
      if (unreviewed) found = unreviewed
    }
    if (node.type === 'ImportExpression' && externalValue(node.source, declarations)) found = externalValue(node.source, declarations)
    if (node.type === 'CallExpression') {
      const name = node.callee?.type === 'Identifier' ? node.callee.name : propertyName(node.callee)
      if (['fetch', 'importScripts', 'sendBeacon'].includes(name) && externalValue(node.arguments[0], declarations)) found = externalValue(node.arguments[0], declarations)
      if (name === 'open' && externalValue(node.arguments[1], declarations)) found = externalValue(node.arguments[1], declarations)
      if (name === 'setAttribute') {
        const attribute = staticString(node.arguments[0], declarations)
        const value = externalValue(node.arguments[1], declarations)
        if (value && (attribute === 'src' || (attribute === 'href' && !isReviewedLegalNavigation(value)))) found = value
      }
      if (['jsx', 'jsxs'].includes(name) && staticString(node.arguments[0], declarations) === 'a' && node.arguments[1]?.type === 'ObjectExpression') {
        const href = node.arguments[1].properties.find(property => (
          (!property.computed && property.key?.type === 'Identifier' ? property.key.name : staticString(property.key, declarations)) === 'href'
        ))
        const value = externalValue(href?.value, declarations)
        if (value && !isReviewedLegalNavigation(value)) found = value
      }
    }
    if (node.type === 'NewExpression' && node.callee?.type === 'Identifier' && ['Worker', 'SharedWorker'].includes(node.callee.name) && externalValue(node.arguments[0], declarations)) found = externalValue(node.arguments[0], declarations)
    if (node.type === 'AssignmentExpression' && ['src', 'href'].includes(propertyName(node.left))) {
      const value = externalValue(node.right, declarations)
      if (value && (propertyName(node.left) === 'src' || !isReviewedLegalNavigation(value))) found = value
    }
    for (const [key, value] of Object.entries(node)) {
      if (key === 'start' || key === 'end' || key === 'loc') continue
      if (Array.isArray(value)) value.forEach(visit)
      else if (value && typeof value === 'object') visit(value)
    }
  }
  visit(ast)
  return found
}

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

function hasUnreviewedHtmlNavigation(contents) {
  for (const match of contents.matchAll(/<a\b[^>]*\bhref\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))/gi)) {
    const value = match[1] || match[2] || match[3] || ''
    if (/^(?:https?:)?\/\//i.test(value) && !isReviewedLegalNavigation(value)) return true
  }
  return false
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
          : []
  const javascriptSink = (lowerName.endsWith('.js') || lowerName.endsWith('.mjs')) ? hasExternalJavaScriptSink(contents) : null
  if (
    patterns.some(pattern => pattern.test(contents))
    || javascriptSink
    || (lowerName.endsWith('.html') && hasUnreviewedHtmlNavigation(contents))
    || (lowerName.endsWith('.json') && hasExternalManifestSink(contents))
  ) {
    throw new Error(`${artifactName} contains an external runtime origin in an automatic sink${javascriptSink ? `: ${javascriptSink}` : ''}.`)
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
