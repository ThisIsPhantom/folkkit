import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import process from 'node:process'
import { afterEach, expect, test } from 'vitest'
import { preparePleskArtifact, pushPreparedPleskArtifact, verifyPreparedPleskArtifact } from './prepared-plesk-artifact.mjs'
import * as preparedArtifactModule from './prepared-plesk-artifact.mjs'

const temporaryDirectories = []

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map(path => rm(path, { recursive: true, force: true })))
})

async function fixtureRoot(label) {
  const root = await mkdtemp(join(tmpdir(), `folkkit-${label}-`))
  temporaryDirectories.push(root)
  return root
}

async function createDist(root) {
  const dist = join(root, 'dist')
  await mkdir(join(dist, 'assets'), { recursive: true })
  await writeFile(join(dist, 'index.html'), '<!doctype html>')
  await writeFile(join(dist, 'assets', 'app.js'), 'void 0')
  return dist
}

function git(cwd, ...args) {
  const result = spawnSync('git', ['-C', cwd, ...args], { encoding: 'utf8' })
  if (result.status !== 0) throw new Error(result.stderr || result.stdout)
  return result.stdout.trim()
}

test('GitHub authentication is expressed as reusable config for every remote Git command', () => {
  expect(preparedArtifactModule.githubRemoteAuthArgs).toBeTypeOf('function')
  expect(preparedArtifactModule.githubRemoteAuthArgs(
    'https://github.com/example/folkkit.git',
    'test-token',
  )).toEqual([
    '-c',
    'http.extraheader=AUTHORIZATION: basic eC1hY2Nlc3MtdG9rZW46dGVzdC10b2tlbg==',
  ])
  expect(preparedArtifactModule.githubRemoteAuthArgs('https://example.test/folkkit.git', 'test-token')).toEqual([])
  expect(preparedArtifactModule.githubRemoteAuthArgs('https://github.com/example/folkkit.git', '')).toEqual([])
})

test('prepared artifact binds source commit, tree hash, and archive bytes with SHA-256', async () => {
  const root = await fixtureRoot('prepared-artifact')
  const dist = await createDist(root)
  const output = join(root, 'artifact')
  const sourceCommit = 'a'.repeat(40)

  const manifest = await preparePleskArtifact({ distDirectory: dist, outputDirectory: output, sourceCommit })
  const verified = await verifyPreparedPleskArtifact({ artifactDirectory: output, expectedDigest: manifest.preparedDigest })

  expect(manifest).toMatchObject({ version: 1, sourceCommit, fileCount: 2 })
  expect(manifest.sourceCommitSha256).toMatch(/^[0-9a-f]{64}$/)
  expect(manifest.treeHash).toMatch(/^[0-9a-f]{64}$/)
  expect(manifest.archiveSha256).toMatch(/^[0-9a-f]{64}$/)
  expect(manifest.preparedDigest).toMatch(/^[0-9a-f]{64}$/)
  expect(verified.manifest).toEqual(manifest)
})

test('prepared artifact substitution is rejected before extraction or push', async () => {
  const root = await fixtureRoot('substituted-artifact')
  const output = join(root, 'artifact')
  await preparePleskArtifact({
    distDirectory: await createDist(root),
    outputDirectory: output,
    sourceCommit: 'b'.repeat(40),
  })
  await writeFile(join(output, 'hosting.tar'), 'substituted bytes')

  await expect(verifyPreparedPleskArtifact({ artifactDirectory: output, expectedDigest: '0'.repeat(64) })).rejects.toThrow(/prepared digest/i)
})

test('joint archive and manifest substitution fails without the independently supplied prepare digest', async () => {
  const root = await fixtureRoot('joint-substitution')
  const original = join(root, 'original')
  const substituted = join(root, 'substituted')
  const dist = await createDist(root)
  const originalResult = await preparePleskArtifact({ distDirectory: dist, outputDirectory: original, sourceCommit: 'c'.repeat(40) })
  await writeFile(join(dist, 'index.html'), '<!doctype html><title>substituted</title>')
  const substitutedResult = await preparePleskArtifact({ distDirectory: dist, outputDirectory: substituted, sourceCommit: 'c'.repeat(40) })

  expect(substitutedResult.preparedDigest).not.toBe(originalResult.preparedDigest)
  await expect(verifyPreparedPleskArtifact({
    artifactDirectory: substituted,
    expectedDigest: originalResult.preparedDigest,
  })).rejects.toThrow(/prepared digest/i)
})

test('write-authorized bare-remote push never invokes dependency or build tooling', async () => {
  const root = await fixtureRoot('bare-push')
  const repo = join(root, 'repo')
  const origin = join(root, 'origin.git')
  await mkdir(repo)
  spawnSync('git', ['init', '--bare', origin])
  git(repo, 'init', '-b', 'main')
  git(repo, 'config', 'user.name', 'Folkkit Test')
  git(repo, 'config', 'user.email', 'folkkit@example.invalid')
  await writeFile(join(repo, 'README.md'), 'source')
  git(repo, 'add', 'README.md')
  git(repo, 'commit', '-m', 'source')
  git(repo, 'remote', 'add', 'origin', origin)
  git(repo, 'push', '-u', 'origin', 'main')
  const sourceCommit = git(repo, 'rev-parse', 'HEAD')

  const output = join(root, 'artifact')
  const prepared = await preparePleskArtifact({ distDirectory: await createDist(root), outputDirectory: output, sourceCommit })
  const marker = join(root, 'build-observed-write-credential.txt')
  const fakeBin = join(root, 'fake-bin')
  await mkdir(fakeBin)
  await writeFile(join(fakeBin, 'bun.cmd'), `@echo %GITHUB_TOKEN%>${marker}\r\nexit /b 91\r\n`)

  await pushPreparedPleskArtifact({
    artifactDirectory: output,
    repoRoot: repo,
    remote: 'origin',
    targetBranch: 'plesk',
    env: { ...process.env, PATH: `${fakeBin};${process.env.PATH}`, GITHUB_TOKEN: 'write-secret-marker' },
    validateHostingTree: async () => {},
    expectedDigest: prepared.preparedDigest,
  })

  await expect(readFile(marker, 'utf8')).rejects.toMatchObject({ code: 'ENOENT' })
  expect(git(repo, 'ls-remote', '--heads', 'origin', 'refs/heads/plesk')).toMatch(/refs\/heads\/plesk$/)
}, 15000)
