import { createHash } from 'node:crypto'
import { appendFile, mkdtemp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, relative, resolve } from 'node:path'
import { spawn } from 'node:child_process'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const scriptPath = fileURLToPath(import.meta.url)

function sha256(value) {
  return createHash('sha256').update(value).digest('hex')
}

async function listFiles(root, directory = root) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(entries.map(async entry => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return listFiles(root, path)
    if (!entry.isFile()) throw new Error('Prepared artifact may contain regular files only.')
    return [path]
  }))
  return nested.flat().sort((a, b) => relative(root, a).localeCompare(relative(root, b), 'en'))
}

async function hashHostingTree(root) {
  const lines = []
  for (const path of await listFiles(root)) {
    const bytes = await readFile(path)
    lines.push(`${relative(root, path).replaceAll('\\', '/')}\0${bytes.byteLength}\0${sha256(bytes)}`)
  }
  return { treeHash: sha256(Buffer.from(lines.join('\n'), 'utf8')), fileCount: lines.length }
}

function run(command, args, { cwd, env = process.env } = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, { cwd, env, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
    let stdout = ''
    let stderr = ''
    child.stdout.on('data', chunk => { stdout += chunk })
    child.stderr.on('data', chunk => { stderr += chunk })
    child.on('error', reject)
    child.on('close', code => {
      if (code === 0) resolvePromise(stdout.trim())
      else reject(new Error(`${command} failed (${code}): ${stderr || stdout}`.trim()))
    })
  })
}

function assertSourceCommit(sourceCommit) {
  if (!/^[0-9a-f]{40}$/.test(sourceCommit)) throw new Error('Prepared artifact requires an exact lowercase source commit.')
}

function computePreparedDigest(manifestBytes, archiveBytes) {
  return sha256(Buffer.concat([
    Buffer.from('folkkit-prepared-manifest\0', 'utf8'), manifestBytes,
    Buffer.from('\0folkkit-prepared-archive\0', 'utf8'), archiveBytes,
  ]))
}

export function githubRemoteAuthArgs(remoteUrl, token) {
  if (!token || !/^https:\/\/github\.com\//i.test(remoteUrl)) return []
  const auth = Buffer.from(`x-access-token:${token}`).toString('base64')
  return ['-c', `http.extraheader=AUTHORIZATION: basic ${auth}`]
}

export async function preparePleskArtifact({ distDirectory, outputDirectory, sourceCommit }) {
  assertSourceCommit(sourceCommit)
  const resolvedDist = resolve(distDirectory)
  const resolvedOutput = resolve(outputDirectory)
  await rm(resolvedOutput, { recursive: true, force: true })
  await mkdir(resolvedOutput, { recursive: true })
  const { treeHash, fileCount } = await hashHostingTree(resolvedDist)
  const archivePath = join(resolvedOutput, 'hosting.tar')
  await run('tar', ['-cf', archivePath, '-C', resolvedDist, '.'])
  const archiveBytes = await readFile(archivePath)
  const archiveSha256 = sha256(archiveBytes)
  const manifest = Object.freeze({
    version: 1,
    sourceCommit,
    sourceCommitSha256: sha256(Buffer.from(sourceCommit, 'ascii')),
    treeHash,
    fileCount,
    archiveSha256,
  })
  const manifestBytes = Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
  await writeFile(join(resolvedOutput, 'manifest.json'), manifestBytes)
  return Object.freeze({ ...manifest, preparedDigest: computePreparedDigest(manifestBytes, archiveBytes) })
}

export async function verifyPreparedPleskArtifact({ artifactDirectory, expectedDigest }) {
  const root = resolve(artifactDirectory)
  if (!/^[0-9a-f]{64}$/.test(String(expectedDigest || ''))) throw new Error('Prepared digest is missing or invalid.')
  const manifestBytes = await readFile(join(root, 'manifest.json'))
  const archivePath = join(root, 'hosting.tar')
  const archiveBytes = await readFile(archivePath)
  const preparedDigest = computePreparedDigest(manifestBytes, archiveBytes)
  if (preparedDigest !== expectedDigest) throw new Error('Prepared digest does not match the independently supplied prepare output.')
  const manifest = JSON.parse(manifestBytes.toString('utf8'))
  const exactKeys = ['version', 'sourceCommit', 'sourceCommitSha256', 'treeHash', 'fileCount', 'archiveSha256']
  if (Reflect.ownKeys(manifest).sort().join('\0') !== [...exactKeys].sort().join('\0')) {
    throw new Error('Prepared artifact manifest has an invalid shape.')
  }
  if (manifest.version !== 1) throw new Error('Prepared artifact manifest version is unsupported.')
  assertSourceCommit(manifest.sourceCommit)
  if (manifest.sourceCommitSha256 !== sha256(Buffer.from(manifest.sourceCommit, 'ascii'))) {
    throw new Error('Prepared artifact source commit SHA-256 does not match.')
  }
  if (!/^[0-9a-f]{64}$/.test(manifest.treeHash) || !/^[0-9a-f]{64}$/.test(manifest.archiveSha256)) {
    throw new Error('Prepared artifact SHA-256 values are invalid.')
  }
  if (manifest.archiveSha256 !== sha256(archiveBytes)) {
    throw new Error('Prepared artifact archive SHA-256 does not match.')
  }
  const temporaryRoot = await mkdtemp(join(tmpdir(), 'folkkit-prepared-'))
  const hostingDirectory = join(temporaryRoot, 'hosting')
  await mkdir(hostingDirectory)
  try {
    await run('tar', ['-xf', archivePath, '-C', hostingDirectory])
    const tree = await hashHostingTree(hostingDirectory)
    if (tree.treeHash !== manifest.treeHash || tree.fileCount !== manifest.fileCount) {
      throw new Error('Prepared artifact hosting tree does not match its manifest.')
    }
    return {
      manifest: Object.freeze({ ...manifest, preparedDigest }),
      hostingDirectory,
      cleanup: () => rm(temporaryRoot, { recursive: true, force: true }),
    }
  } catch (error) {
    await rm(temporaryRoot, { recursive: true, force: true })
    throw error
  }
}

async function defaultValidateHostingTree(hostingDirectory, repoRoot, env) {
  const validator = join(repoRoot, 'scripts', 'Test-PleskTree.ps1')
  try {
    await stat(validator)
  } catch {
    throw new Error('Prepared artifact push requires scripts/Test-PleskTree.ps1.')
  }
  await run('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', validator, '-SourcePath', hostingDirectory], { cwd: repoRoot, env })
}

export async function pushPreparedPleskArtifact({
  artifactDirectory,
  repoRoot = process.cwd(),
  remote = 'origin',
  targetBranch = 'plesk',
  env = process.env,
  validateHostingTree = defaultValidateHostingTree,
  expectedDigest,
}) {
  const verified = await verifyPreparedPleskArtifact({ artifactDirectory, expectedDigest })
  const root = resolve(repoRoot)
  const git = (...args) => run('git', ['-C', root, ...args], { env })
  try {
    const remoteUrl = await git('remote', 'get-url', remote)
    const remoteAuthArgs = githubRemoteAuthArgs(remoteUrl, env.GITHUB_TOKEN)
    const remoteGit = (...args) => run('git', ['-C', root, ...remoteAuthArgs, ...args], { env })
    const head = await git('rev-parse', 'HEAD')
    if (head !== verified.manifest.sourceCommit) throw new Error('Prepared artifact source commit does not match HEAD.')
    if (await git('branch', '--show-current') !== 'main') throw new Error('Prepared artifact push requires main.')
    if (await git('status', '--porcelain=v1', '--untracked-files=normal')) throw new Error('Prepared artifact push requires a clean worktree.')
    await remoteGit('fetch', '--no-tags', remote, 'main')
    const counts = (await git('rev-list', '--left-right', '--count', `HEAD...${remote}/main`)).split(/\s+/)
    if (counts[0] !== '0' || counts[1] !== '0') throw new Error('Prepared artifact push requires synchronized main.')
    await validateHostingTree(verified.hostingDirectory, root, env)

    const temporaryIndexRoot = await mkdtemp(join(tmpdir(), 'folkkit-hosting-index-'))
    try {
      const indexPath = join(temporaryIndexRoot, 'index')
      const gitEnv = { ...env, GIT_INDEX_FILE: indexPath }
      const indexedGit = (...args) => run('git', ['-C', root, ...args], { env: gitEnv })
      await indexedGit('read-tree', '--empty')
      await indexedGit('-c', 'core.autocrlf=false', `--work-tree=${verified.hostingDirectory}`, 'add', '--all', '--force', '--', '.')
      const tree = await indexedGit('write-tree')
      const remoteLine = await remoteGit('ls-remote', '--heads', remote, `refs/heads/${targetBranch}`)
      let parent = ''
      if (remoteLine) {
        parent = remoteLine.split(/\s+/)[0]
        if (!/^[0-9a-f]{40}$/.test(parent)) throw new Error('Remote hosting branch returned an invalid commit.')
        await remoteGit('fetch', '--no-tags', remote, `+refs/heads/${targetBranch}:refs/remotes/${remote}/${targetBranch}`)
      }
      const sourceDate = await git('show', '-s', '--format=%cI', head)
      const commitEnv = {
        ...gitEnv,
        GIT_AUTHOR_NAME: 'Folkkit Publisher',
        GIT_AUTHOR_EMAIL: 'folkkit-publisher@users.noreply.github.com',
        GIT_AUTHOR_DATE: sourceDate,
        GIT_COMMITTER_NAME: 'Folkkit Publisher',
        GIT_COMMITTER_EMAIL: 'folkkit-publisher@users.noreply.github.com',
        GIT_COMMITTER_DATE: sourceDate,
      }
      const commitArgs = ['-C', root, 'commit-tree', tree, '-m', `Hosting build from ${head}`]
      if (parent) commitArgs.push('-p', parent)
      const hostingCommit = await run('git', commitArgs, { env: commitEnv })
      const latestParent = (await remoteGit('ls-remote', '--heads', remote, `refs/heads/${targetBranch}`)).split(/\s+/)[0] || ''
      if (latestParent !== parent) throw new Error('Remote hosting branch changed while the prepared artifact was verified.')
      await remoteGit('push', remote, `${hostingCommit}:refs/heads/${targetBranch}`)
      return { hostingCommit, sourceCommit: head, treeHash: verified.manifest.treeHash }
    } finally {
      await rm(temporaryIndexRoot, { recursive: true, force: true })
    }
  } finally {
    await verified.cleanup()
  }
}

async function main(args) {
  const [mode, artifactDirectory, sourceCommit] = args
  if (mode === 'prepare' && artifactDirectory && sourceCommit) {
    const manifest = await preparePleskArtifact({ distDirectory: join(process.cwd(), 'dist'), outputDirectory: artifactDirectory, sourceCommit })
    if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, `prepared-digest=${manifest.preparedDigest}\n`)
    console.log(`Prepared ${manifest.fileCount} hosting files with tree SHA-256 ${manifest.treeHash}.`)
    return
  }
  if (mode === 'push' && artifactDirectory && !sourceCommit) {
    const result = await pushPreparedPleskArtifact({ artifactDirectory, expectedDigest: process.env.FOLKKIT_PREPARED_DIGEST })
    console.log(`Updated hosting branch from ${result.sourceCommit}; tree SHA-256 ${result.treeHash}. No Hosttech deployment was performed.`)
    return
  }
  throw new Error('Usage: prepared-plesk-artifact.mjs prepare <artifact-directory> <source-commit> | push <artifact-directory>')
}

if (process.argv[1] && resolve(process.argv[1]) === scriptPath) {
  main(process.argv.slice(2)).catch(error => {
    console.error(error.message)
    process.exitCode = 1
  })
}
