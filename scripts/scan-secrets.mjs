import { readFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const patterns = Object.freeze([
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
  /\bghp_[A-Za-z0-9]{36,}\b/g,
  /\bgithub_pat_[A-Za-z0-9_]{40,}\b/g,
  /\bAKIA[0-9A-Z]{16}\b/g,
  /\bAIza[0-9A-Za-z_-]{35}\b/g,
  /\b(?:password|secret|token)\s*[:=]\s*['"]?[A-Za-z0-9+/=_-]{32,}['"]?/gi,
])

export function findSecretCandidates(path, contents) {
  if (contents.includes('\0')) return []
  const candidates = []
  for (const pattern of patterns) {
    pattern.lastIndex = 0
    for (const match of contents.matchAll(pattern)) {
      const line = contents.slice(0, match.index).split(/\r?\n/).length
      candidates.push({ path, line, kind: pattern.source.slice(0, 40) })
    }
  }
  return candidates.filter((candidate, index) => candidates.findIndex(item => item.path === candidate.path && item.line === candidate.line) === index)
}

export async function scanTrackedFiles(projectRoot = process.cwd()) {
  const listed = spawnSync('git', ['-C', projectRoot, 'ls-files', '-z'], { encoding: 'utf8' })
  if (listed.status !== 0) throw new Error(listed.stderr || 'Unable to list tracked files for secret scanning.')
  const paths = listed.stdout.split('\0').filter(Boolean)
  const candidates = []
  for (const path of paths) {
    const bytes = await readFile(resolve(projectRoot, path))
    if (bytes.includes(0)) continue
    candidates.push(...findSecretCandidates(path, bytes.toString('utf8')))
  }
  if (candidates.length > 0) {
    throw new Error(`Static secret scan found candidates:\n${candidates.map(item => `${item.path}:${item.line}`).join('\n')}`)
  }
  return { filesScanned: paths.length, candidates: 0 }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  scanTrackedFiles()
    .then(result => console.log(`Static secret scan passed for ${result.filesScanned} tracked files.`))
    .catch(error => {
      console.error(error.message)
      process.exitCode = 1
    })
}
