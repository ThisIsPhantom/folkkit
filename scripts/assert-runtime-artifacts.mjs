import { readFile, readdir } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse as parseJavaScript } from 'acorn'
import { parse as parseHtml } from 'parse5'
import { converterModuleIds } from '../src/converters/index.js'

const forbiddenTestServiceWorker = /(?:__folkkit-test__|folkkit-app-test-old)/i
const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const runtimeArtifactExtensions = new Set(['.css', '.html', '.js', '.json', '.mjs', '.svg'])
const releasedBrowserConverters = JSON.parse(readFileSync(join(projectRoot, 'scripts', 'released-browser-converters.json'), 'utf8'))
const htmlUrlAttributeNames = new Set(['action', 'data', 'formaction', 'href', 'poster', 'src', 'srcset'])

const reviewedLegalNavigation = new Set(JSON.parse(readFileSync(join(projectRoot, 'scripts', 'reviewed-browser-navigation.json'), 'utf8')))

function externalUrlMatches(value) {
  return [...String(value || '').matchAll(/(?:^|[\s'"`(<\[=:,])((?:https?:)?\/\/[^\s'"`<>\])}]+)/gi)].map(match => ({
    value: match[1],
    index: match.index + match[0].lastIndexOf(match[1]),
  }))
}

function externalUrls(value) {
  return externalUrlMatches(value).map(match => match.value)
}

function isReviewedLegalNavigation(value) {
  return reviewedLegalNavigation.has(value)
    || /^https:\/\/github\.com\/ThisIsPhantom\/folkkit\/tree\/[0-9a-f]{40}$/.test(value)
}

function normalizedCssCodePoint(codePoint) {
  if (codePoint === 0 || codePoint > 0x10ffff || (codePoint >= 0xd800 && codePoint <= 0xdfff)) return '\ufffd'
  return String.fromCodePoint(codePoint)
}

function decodeCssEscapes(contents) {
  const input = String(contents)
    .replaceAll('\r\n', '\n')
    .replaceAll('\r', '\n')
    .replaceAll('\f', '\n')
  let decoded = ''
  let index = 0
  while (index < input.length) {
    const codePoint = input.codePointAt(index)
    const character = String.fromCodePoint(codePoint)
    if (character !== '\\') {
      decoded += normalizedCssCodePoint(codePoint)
      index += character.length
      continue
    }
    if (index + 1 >= input.length) throw new Error('Trailing CSS escape.')
    if (input[index + 1] === '\n') {
      index += 2
      continue
    }
    if (/[0-9a-f]/i.test(input[index + 1])) {
      let end = index + 1
      while (end < input.length && end < index + 7 && /[0-9a-f]/i.test(input[end])) end += 1
      const escapedCodePoint = Number.parseInt(input.slice(index + 1, end), 16)
      decoded += normalizedCssCodePoint(escapedCodePoint)
      if (/[\t\n ]/.test(input[end] || '')) end += 1
      index = end
      continue
    }
    const escapedCodePoint = input.codePointAt(index + 1)
    const escapedCharacter = String.fromCodePoint(escapedCodePoint)
    decoded += normalizedCssCodePoint(escapedCodePoint)
    index += 1 + escapedCharacter.length
  }
  return decoded
}

function skipCssIgnorable(contents, startIndex) {
  let index = startIndex
  while (index < contents.length) {
    if (/\s/.test(contents[index])) {
      index += 1
      continue
    }
    if (contents[index] === '/' && contents[index + 1] === '*') {
      const end = contents.indexOf('*/', index + 2)
      if (end === -1) throw new Error('Unterminated CSS comment.')
      index = end + 2
      continue
    }
    break
  }
  return index
}

function readCssString(contents, startIndex) {
  const quote = contents[startIndex]
  let value = ''
  let index = startIndex + 1
  while (index < contents.length) {
    const character = contents[index]
    if (character === quote) return { value, end: index + 1 }
    if (character === '\n') throw new Error('Unterminated CSS string.')
    value += character
    index += 1
  }
  throw new Error('Unterminated CSS string.')
}

function readCssFunctionBody(contents, openIndex) {
  let depth = 1
  let index = openIndex + 1
  while (index < contents.length) {
    if (contents[index] === '"' || contents[index] === "'") {
      index = readCssString(contents, index).end
      continue
    }
    if (contents[index] === '/' && contents[index + 1] === '*') {
      index = skipCssIgnorable(contents, index)
      continue
    }
    if (contents[index] === '(') depth += 1
    if (contents[index] === ')') {
      depth -= 1
      if (depth === 0) return { body: contents.slice(openIndex + 1, index), end: index + 1 }
    }
    index += 1
  }
  throw new Error('Unterminated CSS function.')
}

function stripCssComments(contents) {
  let result = ''
  let index = 0
  while (index < contents.length) {
    if (contents[index] === '/' && contents[index + 1] === '*') {
      index = skipCssIgnorable(contents, index)
      continue
    }
    result += contents[index]
    index += 1
  }
  return result
}

function cssUrlFunctionValue(body) {
  const start = skipCssIgnorable(body, 0)
  if (body[start] === '"' || body[start] === "'") {
    const token = readCssString(body, start)
    if (skipCssIgnorable(body, token.end) !== body.length) throw new Error('Malformed CSS url().')
    return token.value
  }
  return stripCssComments(body).trim()
}

function cssUrlCandidates(contents, { stringsAreUrls = false } = {}) {
  const candidates = []
  let index = 0
  while (index < contents.length) {
    index = skipCssIgnorable(contents, index)
    if (index >= contents.length) break

    if (contents[index] === '"' || contents[index] === "'") {
      const token = readCssString(contents, index)
      if (stringsAreUrls) candidates.push(token.value)
      index = token.end
      continue
    }

    if (contents[index] === '@') {
      let end = index + 1
      while (end < contents.length && /[-_a-z0-9]/i.test(contents[end])) end += 1
      if (contents.slice(index + 1, end).toLowerCase() === 'import') {
        const valueStart = skipCssIgnorable(contents, end)
        if (contents[valueStart] === '"' || contents[valueStart] === "'") {
          const token = readCssString(contents, valueStart)
          candidates.push(token.value)
          index = token.end
          continue
        }
      }
      index = end
      continue
    }

    if (/[-_a-z]/i.test(contents[index])) {
      let end = index + 1
      while (end < contents.length && /[-_a-z0-9]/i.test(contents[end])) end += 1
      const name = contents.slice(index, end).toLowerCase()
      const openIndex = skipCssIgnorable(contents, end)
      if (contents[openIndex] === '(') {
        const fn = readCssFunctionBody(contents, openIndex)
        if (name === 'url') candidates.push(cssUrlFunctionValue(fn.body))
        if (name === 'image-set' || name === '-webkit-image-set') {
          candidates.push(...cssUrlCandidates(fn.body, { stringsAreUrls: true }))
        }
        index = fn.end
        continue
      }
      index = end
      continue
    }

    index += 1
  }
  return candidates
}

function hasExternalCssSink(contents) {
  const decoded = decodeCssEscapes(contents)
  return cssUrlCandidates(decoded).some((candidate) => {
    const normalized = candidate.trim().replaceAll('\\', '/')
    return /^(?:https?:|\/\/)/i.test(normalized)
  })
}

function hasExternalJavaScriptSink(contents) {
  let ast
  try {
    ast = parseJavaScript(contents, { ecmaVersion: 'latest', sourceType: 'module', allowHashBang: true })
  } catch (error) {
    throw new Error(`JavaScript runtime artifact could not be parsed: ${error.message}`)
  }
  const DYNAMIC = Symbol('dynamic')
  const AMBIGUOUS = Symbol('ambiguous')
  const nodeScopes = new WeakMap()
  const rootScope = { parent: null, bindings: new Map() }
  const childEntries = node => Object.entries(node).filter(([key]) => !['start', 'end', 'loc'].includes(key))
  const bind = (scope, name, value) => {
    scope.bindings.set(name, scope.bindings.has(name) ? AMBIGUOUS : value)
  }
  const bindPattern = (scope, pattern) => {
    if (!pattern) return
    if (pattern.type === 'Identifier') { bind(scope, pattern.name, DYNAMIC); return }
    if (pattern.type === 'AssignmentPattern') { bindPattern(scope, pattern.left); return }
    if (pattern.type === 'RestElement') { bindPattern(scope, pattern.argument); return }
    if (pattern.type === 'ObjectPattern') {
      for (const property of pattern.properties) bindPattern(scope, property.value || property.argument)
      return
    }
    if (pattern.type === 'ArrayPattern') for (const element of pattern.elements) bindPattern(scope, element)
  }
  const buildScopes = (node, inheritedScope) => {
    if (!node || typeof node !== 'object') return
    let scope = inheritedScope
    if (node.type === 'Program') scope = rootScope
    else if (node.type === 'BlockStatement' || /Function(?:Declaration|Expression)$/.test(node.type) || node.type === 'ArrowFunctionExpression') {
      scope = { parent: inheritedScope, bindings: new Map() }
    }
    nodeScopes.set(node, scope)
    if (node.type === 'VariableDeclarator' && node.id?.type === 'Identifier') bind(scope, node.id.name, node.init || DYNAMIC)
    if (/Function(?:Declaration|Expression)$/.test(node.type) || node.type === 'ArrowFunctionExpression') {
      for (const parameter of node.params || []) bindPattern(scope, parameter)
    }
    for (const [, value] of childEntries(node)) {
      if (Array.isArray(value)) value.forEach(child => buildScopes(child, scope))
      else if (value && typeof value === 'object') buildScopes(value, scope)
    }
  }
  buildScopes(ast, rootScope)

  const resolveIdentifier = (name, scope, seen) => {
    for (let current = scope; current; current = current.parent) {
      if (!current.bindings.has(name)) continue
      const binding = current.bindings.get(name)
      if (binding === AMBIGUOUS) return { value: null, ambiguous: true }
      if (binding === DYNAMIC || seen.has(binding)) return { value: null, ambiguous: false }
      return resolveStatic(binding, nodeScopes.get(binding) || current, new Set([...seen, binding]))
    }
    return { value: null, ambiguous: false }
  }
  const resolveStatic = (node, scope = nodeScopes.get(node), seen = new Set()) => {
    if (node?.type === 'Literal' && typeof node.value === 'string') return { value: node.value, ambiguous: false }
    if (node?.type === 'Identifier') return resolveIdentifier(node.name, scope, seen)
    if (node?.type === 'TemplateLiteral') {
      let result = ''
      for (let index = 0; index < node.quasis.length; index += 1) {
        result += node.quasis[index].value.cooked || ''
        if (index < node.expressions.length) {
          const resolved = resolveStatic(node.expressions[index], nodeScopes.get(node.expressions[index]) || scope, seen)
          if (resolved.value === null) return resolved
          result += resolved.value
        }
      }
      return { value: result, ambiguous: false }
    }
    if (node?.type === 'BinaryExpression' && node.operator === '+') {
      const left = resolveStatic(node.left, nodeScopes.get(node.left) || scope, seen)
      const right = resolveStatic(node.right, nodeScopes.get(node.right) || scope, seen)
      if (left.value === null || right.value === null) return { value: null, ambiguous: left.ambiguous || right.ambiguous }
      return { value: left.value + right.value, ambiguous: false }
    }
    if (node?.type === 'NewExpression' && node.callee?.type === 'Identifier' && node.callee.name === 'URL') {
      const path = resolveStatic(node.arguments[0], nodeScopes.get(node.arguments[0]) || scope, seen)
      const base = node.arguments[1]
        ? resolveStatic(node.arguments[1], nodeScopes.get(node.arguments[1]) || scope, seen)
        : { value: null, ambiguous: false }
      if (path.value === null || (node.arguments[1] && base.value === null)) return { value: null, ambiguous: path.ambiguous || base.ambiguous }
      try { return { value: base.value === null ? path.value : new URL(path.value, base.value).href, ambiguous: false } } catch { return { value: null, ambiguous: false } }
    }
    return { value: null, ambiguous: false }
  }
  const resolvedExternal = node => {
    const resolved = resolveStatic(node)
    const value = resolved.value
    return {
      value: typeof value === 'string' && /^(?:https?:)?\/\//i.test(value) ? value : null,
      ambiguous: resolved.ambiguous,
    }
  }
  const localPropertyName = node => {
    if (!node || node.type !== 'MemberExpression') return null
    if (!node.computed && node.property.type === 'Identifier') return node.property.name
    return resolveStatic(node.property).value
  }

  let found = null
  const visit = node => {
    if (found || !node || typeof node !== 'object') return
    if (['Literal', 'TemplateLiteral', 'BinaryExpression'].includes(node.type)) {
      const value = resolveStatic(node).value
      const unreviewed = value === null ? null : externalUrls(value).find(url => !isReviewedLegalNavigation(url))
      if (unreviewed) found = unreviewed
    }
    if (node.type === 'ImportExpression' && resolvedExternal(node.source).value) found = resolvedExternal(node.source).value
    if (node.type === 'CallExpression') {
      const name = node.callee?.type === 'Identifier' ? node.callee.name : localPropertyName(node.callee)
      if (['fetch', 'importScripts', 'sendBeacon'].includes(name)) {
        const resolved = resolvedExternal(node.arguments[0])
        if (resolved.value || resolved.ambiguous) found = resolved.value || `ambiguous static URL in ${name} at ${node.start}`
      }
      if (name === 'open') {
        const first = resolveStatic(node.arguments[0]).value
        const urlArgument = typeof first === 'string' && /^(?:GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)$/i.test(first)
          ? node.arguments[1]
          : node.arguments[0]
        const resolved = resolvedExternal(urlArgument)
        if (resolved.value && !isReviewedLegalNavigation(resolved.value)) found = resolved.value
        else if (resolved.ambiguous) found = `ambiguous static URL in open at ${node.start}`
      }
      if (name === 'setAttribute') {
        const attribute = resolveStatic(node.arguments[0]).value
        const resolved = resolvedExternal(node.arguments[1])
        if (resolved.value && (attribute === 'src' || (attribute === 'href' && !isReviewedLegalNavigation(resolved.value)))) found = resolved.value
        else if (resolved.ambiguous) found = `ambiguous static URL in setAttribute at ${node.start}`
      }
      if (['jsx', 'jsxs'].includes(name) && resolveStatic(node.arguments[0]).value === 'a' && node.arguments[1]?.type === 'ObjectExpression') {
        const href = node.arguments[1].properties.find(property => (
          (!property.computed && property.key?.type === 'Identifier' ? property.key.name : resolveStatic(property.key).value) === 'href'
        ))
        const resolved = resolvedExternal(href?.value)
        if (resolved.value && !isReviewedLegalNavigation(resolved.value)) found = resolved.value
        else if (resolved.ambiguous) found = `ambiguous static URL in JSX href at ${node.start}`
      }
    }
    if (node.type === 'NewExpression' && node.callee?.type === 'Identifier' && node.callee.name === 'URL') {
      const resolved = resolvedExternal(node)
      if (resolved.value && !isReviewedLegalNavigation(resolved.value)) found = resolved.value
      else if (resolved.ambiguous) found = `ambiguous static URL constructor at ${node.start}`
    }
    if (node.type === 'NewExpression' && node.callee?.type === 'Identifier' && ['Worker', 'SharedWorker'].includes(node.callee.name)) {
      const resolved = resolvedExternal(node.arguments[0])
      if (resolved.value || resolved.ambiguous) found = resolved.value || `ambiguous static URL in Worker at ${node.start}`
    }
    if (node.type === 'AssignmentExpression' && ['src', 'href'].includes(localPropertyName(node.left))) {
      const resolved = resolvedExternal(node.right)
      if (resolved.value && (localPropertyName(node.left) === 'src' || !isReviewedLegalNavigation(resolved.value))) found = resolved.value
      else if (resolved.ambiguous) found = `ambiguous static URL in ${localPropertyName(node.left)} assignment at ${node.start}`
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

function hasDuplicateUrlAttribute(startTag) {
  let index = 1
  while (index < startTag.length && !/[\s/>]/.test(startTag[index])) index += 1
  const seen = new Set()
  while (index < startTag.length) {
    while (/\s/.test(startTag[index] || '')) index += 1
    if (startTag[index] === '>' || (startTag[index] === '/' && startTag[index + 1] === '>')) return false
    const nameStart = index
    while (index < startTag.length && !/[\s=/>]/.test(startTag[index])) index += 1
    const name = startTag.slice(nameStart, index).toLowerCase()
    if (!name) { index += 1; continue }
    if (htmlUrlAttributeNames.has(name)) {
      if (seen.has(name)) return true
      seen.add(name)
    }
    while (/\s/.test(startTag[index] || '')) index += 1
    if (startTag[index] !== '=') continue
    index += 1
    while (/\s/.test(startTag[index] || '')) index += 1
    const quote = startTag[index] === '"' || startTag[index] === "'" ? startTag[index] : null
    if (quote) {
      index += 1
      while (index < startTag.length && startTag[index] !== quote) index += 1
      if (startTag[index] === quote) index += 1
    } else {
      while (index < startTag.length && !/[\s>]/.test(startTag[index])) index += 1
    }
  }
  return false
}

function hasExternalMarkupViolation(contents, { allowReviewedSvgNamespaces = false } = {}) {
  let document
  try {
    document = parseHtml(contents, { sourceCodeLocationInfo: true })
  } catch {
    return true
  }
  const reviewedLiteralRanges = []
  let automaticViolation = false
  const visit = node => {
    if (automaticViolation || !node) return
    if (node.tagName) {
      const attributes = new Map((node.attrs || []).map(attribute => [attribute.name.toLowerCase(), attribute.value]))
      const startTagLocation = node.sourceCodeLocation?.startTag
      if (startTagLocation && hasDuplicateUrlAttribute(contents.slice(startTagLocation.startOffset, startTagLocation.endOffset))) {
        automaticViolation = true
        return
      }
      for (const [name, value] of attributes) {
        if (allowReviewedSvgNamespaces && ['xmlns', 'xmlns:xlink'].includes(name) && isReviewedLegalNavigation(value)) {
          const range = node.sourceCodeLocation?.attrs?.[name]
          if (range) reviewedLiteralRanges.push([range.startOffset, range.endOffset])
          continue
        }
        if (!htmlUrlAttributeNames.has(name) || externalUrls(value).length === 0) continue
        if (node.tagName === 'a' && name === 'href' && isReviewedLegalNavigation(value)) {
          const range = node.sourceCodeLocation?.attrs?.[name]
          if (range) reviewedLiteralRanges.push([range.startOffset, range.endOffset])
          continue
        }
        automaticViolation = true
        return
      }
      if (node.tagName === 'meta' && attributes.get('http-equiv')?.trim().toLowerCase() === 'refresh' && externalUrls(attributes.get('content')).length > 0) {
        automaticViolation = true
        return
      }
    }
    for (const child of node.childNodes || []) visit(child)
    if (node.content) visit(node.content)
  }
  visit(document)
  if (automaticViolation) return true
  return externalUrlMatches(contents).some(match => {
    if (!isReviewedLegalNavigation(match.value)) return true
    return !reviewedLiteralRanges.some(([start, end]) => match.index >= start && match.index < end)
  })
}

export function assertNoExternalRuntimeOrigins(artifactName, contents) {
  const lowerName = artifactName.toLowerCase()
  const javascriptSink = (lowerName.endsWith('.js') || lowerName.endsWith('.mjs')) ? hasExternalJavaScriptSink(contents) : null
  let cssSink = false
  if (lowerName.endsWith('.css')) {
    try {
      cssSink = hasExternalCssSink(contents)
    } catch {
      cssSink = true
    }
  }
  if (
    javascriptSink
    || (lowerName.endsWith('.html') && hasExternalMarkupViolation(contents))
    || (lowerName.endsWith('.svg') && hasExternalMarkupViolation(contents, { allowReviewedSvgNamespaces: true }))
    || cssSink
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

function quotedLiteralPattern(value) {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(["'])${escaped}\\1`)
}

export async function assertReleasedConverterArtifacts({ distDirectory = join(projectRoot, 'dist') } = {}) {
  const assetDirectory = join(distDirectory, 'assets')
  const assetNames = await readdir(assetDirectory)
  const rawIds = Object.values(converterModuleIds).flat()
  const releasedIds = new Set(Object.values(releasedBrowserConverters).flat())
  if (releasedIds.size !== 49) throw new Error(`Expected 49 released browser converters, found ${releasedIds.size}.`)
  const chunkContents = []
  for (const moduleId of Object.keys(converterModuleIds)) {
    const moduleChunkPattern = new RegExp(`^${moduleId}-[A-Za-z0-9_-]{8}\\.js$`)
    const matches = assetNames.filter(name => moduleChunkPattern.test(name))
    if (matches.length !== 1) throw new Error(`Expected one browser converter chunk for ${moduleId}, found ${matches.length}.`)
    const contents = await readFile(join(assetDirectory, matches[0]), 'utf8')
    chunkContents.push(contents)
    for (const id of releasedBrowserConverters[moduleId] || []) {
      if (!quotedLiteralPattern(id).test(contents)) throw new Error(`Released browser converter implementation is missing: ${id}.`)
    }
  }
  const combined = chunkContents.join('\n')
  for (const id of rawIds) {
    if (releasedIds.has(id)) continue
    if (quotedLiteralPattern(id).test(combined)) throw new Error(`Hidden browser converter implementation shipped: ${id}.`)
  }
  return { releasedCount: releasedIds.size, hiddenCount: rawIds.length - releasedIds.size }
}

export async function assertBuiltRuntimeArtifacts({
  distDirectory = join(projectRoot, 'dist'),
} = {}) {
  const artifactPaths = await listRuntimeArtifacts(distDirectory)
  await Promise.all(artifactPaths.map(async (artifactPath) => {
    const contents = await readFile(artifactPath, 'utf8')
    assertNoExternalRuntimeOrigins(relative(distDirectory, artifactPath), contents)
  }))
  try {
    await readFile(join(distDirectory, 'index.html'))
    await assertReleasedConverterArtifacts({ distDirectory })
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  assertBuiltRuntimeArtifacts()
    .then(() => console.log('Runtime artifacts contain only same-origin paths.'))
    .catch((error) => {
      console.error(error.message)
      process.exitCode = 1
    })
}
