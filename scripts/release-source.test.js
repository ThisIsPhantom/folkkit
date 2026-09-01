import { access, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { execFileSync, spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { afterEach, expect, test } from 'vitest'
import { generateBrowserThirdPartyNotices, generateThirdPartyNotices } from './generate-third-party-notices.mjs'
import { validateReleaseSource } from './validate-release-source.mjs'
import * as releaseBuilder from './build-release.mjs'

const temporaryDirectories = []
const scriptsDirectory = dirname(fileURLToPath(import.meta.url))
const releaseBuildScript = join(scriptsDirectory, 'build-release.mjs')
const validOperatorEnv = Object.freeze({
  VITE_PUBLIC_OPERATOR_NAME: 'Approved Fixture Cooperative',
  VITE_PUBLIC_OPERATOR_ADDRESS: 'Marktgasse 12|8001 Zürich|Schweiz',
  VITE_PUBLIC_CONTACT_EMAIL: 'contact@operator.fixture',
})

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map(directory => rm(directory, { recursive: true, force: true })))
})

function git(repoRoot, args) {
  return execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8' }).trim()
}

async function pathExists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function readEnvExample() {
  const source = await readFile(join(scriptsDirectory, '..', '.env.example'), 'utf8')
  return Object.fromEntries(source
    .split(/\r?\n/)
    .filter(Boolean)
    .map(line => {
      const separator = line.indexOf('=')
      return [line.slice(0, separator), line.slice(separator + 1)]
    }))
}

async function createReleaseRepository() {
  const repoRoot = await mkdtemp(join(tmpdir(), 'folkkit-release-source-'))
  temporaryDirectories.push(repoRoot)
  await mkdir(join(repoRoot, 'scripts', 'license-texts'), { recursive: true })
  await mkdir(join(repoRoot, 'src', 'content'), { recursive: true })
  await mkdir(join(repoRoot, 'node_modules', 'runtime-a'), { recursive: true })

  const lockfile = {
    lockfileVersion: 1,
    workspaces: { '': { dependencies: { 'runtime-a': '1.0.0' } } },
    packages: { 'runtime-a': ['runtime-a@1.0.0', '', {}, 'sha512-runtime-a'] },
  }
  const runtimeAssets = {
    schemaVersion: 1,
    fonts: { distributedFiles: [], note: 'No font files in the release fixture.' },
    assets: [{
      id: 'fixture-asset',
      component: 'Fixture runtime asset',
      version: '1',
      paths: ['public/fixture.svg'],
      license: 'MIT',
      sourceUrl: 'https://example.test/fixture-asset',
      licenseTextFiles: ['scripts/license-texts/MIT.txt'],
    }],
  }
  const packageMetadata = {
    name: 'runtime-a',
    version: '1.0.0',
    license: 'MIT',
    repository: { type: 'git', url: 'https://example.test/runtime-a.git' },
  }

  await writeFile(join(repoRoot, '.gitignore'), 'node_modules/\npublic/vendor/\nrelease-dist/\nbuild-marker.txt\n')
  await writeFile(join(repoRoot, 'README.md'), 'release fixture\n')
  await writeFile(join(repoRoot, 'bun.lock'), `${JSON.stringify(lockfile, null, 2)}\n`)
  await writeFile(join(repoRoot, 'scripts', 'runtime-assets.json'), `${JSON.stringify(runtimeAssets, null, 2)}\n`)
  await writeFile(join(repoRoot, 'scripts', 'license-texts', 'index.json'), '{}\n')
  await writeFile(join(repoRoot, 'scripts', 'license-texts', 'package-overrides.json'), '{}\n')
  await writeFile(join(repoRoot, 'scripts', 'license-texts', 'MIT.txt'), 'MIT License fixture body.\n')
  await writeFile(join(repoRoot, 'node_modules', 'runtime-a', 'package.json'), `${JSON.stringify(packageMetadata, null, 2)}\n`)
  await writeFile(join(repoRoot, 'node_modules', 'runtime-a', 'LICENSE'), 'Runtime A exact license notice.\n')
  await writeFile(join(repoRoot, 'build-marker.mjs'), "import { writeFileSync } from 'node:fs'; writeFileSync('build-marker.txt', 'invoked\\n')\n")
  await writeFile(join(repoRoot, 'package.json'), `${JSON.stringify({
    private: true,
    type: 'module',
    scripts: { build: 'node build-marker.mjs' },
  }, null, 2)}\n`)

  const noticeOptions = {
    projectRoot: repoRoot,
    lockfilePath: join(repoRoot, 'bun.lock'),
    runtimeAssetsPath: join(repoRoot, 'scripts', 'runtime-assets.json'),
    nodeModulesPath: join(repoRoot, 'node_modules'),
  }
  const notices = await generateThirdPartyNotices(noticeOptions)
  await writeFile(join(repoRoot, 'THIRD_PARTY_NOTICES.md'), notices)
  await writeFile(join(repoRoot, 'src', 'content', 'third-party-notices.txt'), generateBrowserThirdPartyNotices(notices))

  git(repoRoot, ['init', '-b', 'main'])
  git(repoRoot, ['config', 'user.name', 'Folkkit Test'])
  git(repoRoot, ['config', 'user.email', 'folkkit-test@example.invalid'])
  git(repoRoot, ['config', 'core.autocrlf', 'false'])
  git(repoRoot, ['add', '--all'])
  git(repoRoot, ['commit', '-m', 'fixture'])

  return {
    repoRoot,
    markerPath: join(repoRoot, 'build-marker.txt'),
  }
}

function createFakeReleaseRunner({ expectedCommit, unexpectedVendor = false, observations }) {
  return async ({ label, args, cwd, env }) => {
    observations.labels.push(label)
    if (label === 'install') {
      expect(args).toEqual(['install', '--frozen-lockfile', '--ignore-scripts', '--force'])
      await mkdir(join(cwd, 'node_modules', 'runtime-a'), { recursive: true })
      await writeFile(join(cwd, 'node_modules', 'runtime-a', 'package.json'), `${JSON.stringify({
        name: 'runtime-a',
        version: '1.0.0',
        license: 'MIT',
        repository: { type: 'git', url: 'https://example.test/runtime-a.git' },
      }, null, 2)}\n`)
      await writeFile(join(cwd, 'node_modules', 'runtime-a', 'LICENSE'), 'Runtime A exact license notice.\n')
      return
    }
    if (label === 'sync-runtime-assets') {
      const vendorDirectory = join(cwd, 'public', 'vendor')
      await mkdir(join(vendorDirectory, 'ffmpeg'), { recursive: true })
      await writeFile(join(vendorDirectory, 'ffmpeg', 'ffmpeg-core.js'), 'fresh core JavaScript')
      await writeFile(join(vendorDirectory, 'ffmpeg', 'ffmpeg-core.wasm'), 'fresh core WASM')
      if (unexpectedVendor) await writeFile(join(vendorDirectory, 'unexpected.js'), 'unexpected')
      return
    }
    if (label === 'build') {
      observations.buildInvoked = true
      observations.buildCommit = env.FOLKKIT_RELEASE_COMMIT
      observations.archivedReadme = await readFile(join(cwd, 'README.md'), 'utf8')
      observations.releaseMarker = (await readFile(join(cwd, '.folkkit-release-commit'), 'utf8')).trim()
      observations.hasCurrentVendorPoison = await pathExists(join(cwd, 'public', 'vendor', 'poison.js'))
      observations.hasCurrentNodeModulesPoison = await pathExists(join(cwd, 'node_modules', 'current-poison.txt'))
      expect(env.FOLKKIT_RELEASE_COMMIT).toBe(expectedCommit)
      await mkdir(join(cwd, 'dist'), { recursive: true })
      await writeFile(join(cwd, 'dist', 'index.html'), `<p>${expectedCommit}</p>\n`)
      await writeFile(join(cwd, 'outside-dist.txt'), 'must not be copied\n')
      return
    }
    throw new Error(`Unexpected fake release command: ${label}`)
  }
}

function runReleaseCli(repoRoot, envOverrides = {}) {
  const env = { ...process.env, ...validOperatorEnv, ...envOverrides }
  for (const name of envOverrides.remove || []) delete env[name]
  delete env.remove
  return spawnSync(process.execPath, [releaseBuildScript], {
    cwd: repoRoot,
    env,
    encoding: 'utf8',
  })
}

async function makeStaleCommittedNotice(repoRoot) {
  const runtimeAssetsPath = join(repoRoot, 'scripts', 'runtime-assets.json')
  const runtimeAssets = JSON.parse(await readFile(runtimeAssetsPath, 'utf8'))
  runtimeAssets.assets[0].component = 'Changed asset without regenerated notices'
  await writeFile(runtimeAssetsPath, `${JSON.stringify(runtimeAssets, null, 2)}\n`)
  git(repoRoot, ['add', 'scripts/runtime-assets.json'])
  git(repoRoot, ['commit', '-m', 'stale notice fixture'])
}

test('a clean repository with byte-current notices accepts the exact HEAD revision', async () => {
  const { repoRoot } = await createReleaseRepository()
  const head = git(repoRoot, ['rev-parse', 'HEAD'])

  await expect(validateReleaseSource({ repoRoot, expectedCommit: head })).resolves.toEqual({ commit: head })
})

test.each([
  ['dirty tracked source', async repoRoot => writeFile(join(repoRoot, 'README.md'), 'dirty\n')],
  ['staged source', async repoRoot => {
    await writeFile(join(repoRoot, 'README.md'), 'staged\n')
    git(repoRoot, ['add', 'README.md'])
  }],
  ['untracked non-ignored source', async repoRoot => writeFile(join(repoRoot, 'untracked.txt'), 'untracked\n')],
  ['dirty generated tracked notice', async repoRoot => writeFile(join(repoRoot, 'THIRD_PARTY_NOTICES.md'), 'dirty notice\n')],
])('%s fails the real release CLI before the build marker', async (_label, mutate) => {
  const { repoRoot, markerPath } = await createReleaseRepository()
  await mutate(repoRoot)

  const result = runReleaseCli(repoRoot)

  expect(result.status).toBe(1)
  expect(`${result.stdout}\n${result.stderr}`).toMatch(/release source|working tree|third-party notices/i)
  await expect(pathExists(markerPath)).resolves.toBe(false)
})

test('a clean commit with stale generated notices fails before the build marker', async () => {
  const { repoRoot, markerPath } = await createReleaseRepository()
  await makeStaleCommittedNotice(repoRoot)
  const expectedCommit = git(repoRoot, ['rev-parse', 'HEAD'])
  const observations = { labels: [], buildInvoked: false }

  await expect(releaseBuilder.runReleaseBuild({
    repoRoot,
    env: { ...process.env, ...validOperatorEnv },
    runCommand: createFakeReleaseRunner({ expectedCommit, observations }),
    outputDirectory: join(repoRoot, 'release-dist'),
  })).rejects.toThrow(/THIRD_PARTY_NOTICES\.md.*stale/i)

  expect(observations.labels).toEqual(['install'])
  expect(observations.buildInvoked).toBe(false)
  await expect(pathExists(markerPath)).resolves.toBe(false)
})

test('a requested source revision that differs from HEAD fails before the build marker', async () => {
  const { repoRoot, markerPath } = await createReleaseRepository()

  const result = runReleaseCli(repoRoot, { FOLKKIT_RELEASE_COMMIT: '0'.repeat(40) })

  expect(result.status).toBe(1)
  expect(`${result.stdout}\n${result.stderr}`).toMatch(/source revision.*HEAD/i)
  await expect(pathExists(markerPath)).resolves.toBe(false)
})

test('missing operator values fail through the real CLI before source validation or build', async () => {
  const { repoRoot, markerPath } = await createReleaseRepository()

  const result = runReleaseCli(repoRoot, {
    remove: ['VITE_PUBLIC_OPERATOR_NAME', 'VITE_PUBLIC_OPERATOR_ADDRESS', 'VITE_PUBLIC_CONTACT_EMAIL'],
  })

  expect(result.status).toBe(1)
  expect(`${result.stdout}\n${result.stderr}`).toMatch(/VITE_PUBLIC_OPERATOR_NAME is required/)
  expect(`${result.stdout}\n${result.stderr}`).toMatch(/VITE_PUBLIC_OPERATOR_ADDRESS is required/)
  expect(`${result.stdout}\n${result.stderr}`).toMatch(/VITE_PUBLIC_CONTACT_EMAIL is required/)
  await expect(pathExists(markerPath)).resolves.toBe(false)
})

test('the exact example operator values fail through the real CLI before source validation or build', async () => {
  const { repoRoot, markerPath } = await createReleaseRepository()
  const exampleEnv = await readEnvExample()

  const result = runReleaseCli(repoRoot, exampleEnv)

  expect(result.status).toBe(1)
  expect(`${result.stdout}\n${result.stderr}`).toMatch(/VITE_PUBLIC_OPERATOR_NAME still contains the example value/)
  expect(`${result.stdout}\n${result.stderr}`).toMatch(/VITE_PUBLIC_OPERATOR_ADDRESS still contains the example value/)
  expect(`${result.stdout}\n${result.stderr}`).toMatch(/VITE_PUBLIC_CONTACT_EMAIL still contains the example value/)
  await expect(pathExists(markerPath)).resolves.toBe(false)
})

test('release build archives the validated commit and excludes ignored current dependency and vendor tampering', async () => {
  const { repoRoot } = await createReleaseRepository()
  const validatedCommit = git(repoRoot, ['rev-parse', 'HEAD'])
  const outputDirectory = join(repoRoot, 'release-dist')
  const observations = { labels: [], buildInvoked: false }
  await writeFile(join(repoRoot, 'node_modules', 'runtime-a', 'package.json'), `${JSON.stringify({
    name: 'runtime-a',
    version: '9.9.9',
    license: 'MIT',
    repository: 'tampered/current-node-modules',
  })}\n`)
  await writeFile(join(repoRoot, 'node_modules', 'current-poison.txt'), 'poison\n')
  await mkdir(join(repoRoot, 'public', 'vendor'), { recursive: true })
  await writeFile(join(repoRoot, 'public', 'vendor', 'poison.js'), 'poison\n')

  const archive = async (options) => {
    await writeFile(join(repoRoot, 'README.md'), 'new HEAD created after source validation\n')
    git(repoRoot, ['add', 'README.md'])
    git(repoRoot, ['commit', '-m', 'simulated release race'])
    observations.racedHead = git(repoRoot, ['rev-parse', 'HEAD'])
    return releaseBuilder.archiveValidatedCommit(options)
  }

  const result = await releaseBuilder.runReleaseBuild({
    repoRoot,
    env: { ...process.env, ...validOperatorEnv },
    runCommand: createFakeReleaseRunner({ expectedCommit: validatedCommit, observations }),
    archive,
    outputDirectory,
    build: () => { throw new Error('legacy worktree build must not run') },
  })

  expect(result).toEqual({ commit: validatedCommit, outputDirectory })
  expect(observations.racedHead).not.toBe(validatedCommit)
  expect(observations.labels).toEqual(['install', 'sync-runtime-assets', 'build'])
  expect(observations.buildInvoked).toBe(true)
  expect(observations.buildCommit).toBe(validatedCommit)
  expect(observations.releaseMarker).toBe(validatedCommit)
  expect(observations.archivedReadme).toBe('release fixture\n')
  expect(observations.hasCurrentVendorPoison).toBe(false)
  expect(observations.hasCurrentNodeModulesPoison).toBe(false)
  expect(await readdir(outputDirectory)).toEqual(['index.html'])
})

test('unexpected files in the isolated vendor destination stop the release before build', async () => {
  const { repoRoot } = await createReleaseRepository()
  const validatedCommit = git(repoRoot, ['rev-parse', 'HEAD'])
  const observations = { labels: [], buildInvoked: false }

  await expect(releaseBuilder.runReleaseBuild({
    repoRoot,
    env: { ...process.env, ...validOperatorEnv },
    runCommand: createFakeReleaseRunner({ expectedCommit: validatedCommit, unexpectedVendor: true, observations }),
    outputDirectory: join(repoRoot, 'release-dist'),
    build: () => { observations.buildInvoked = true },
  })).rejects.toThrow(/unexpected runtime vendor file/i)

  expect(observations.labels).toEqual(['install', 'sync-runtime-assets'])
  expect(observations.buildInvoked).toBe(false)
})

test('release commit resolution requires the validated environment commit to match the archive marker', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'folkkit-release-commit-'))
  temporaryDirectories.push(repoRoot)
  const commit = 'a'.repeat(40)
  await writeFile(join(repoRoot, '.folkkit-release-commit'), `${commit}\n`)

  expect(releaseBuilder.resolveBuildCommit({
    repoRoot,
    env: { FOLKKIT_RELEASE_COMMIT: commit },
  })).toBe(commit)
  expect(() => releaseBuilder.resolveBuildCommit({
    repoRoot,
    env: { FOLKKIT_RELEASE_COMMIT: 'b'.repeat(40) },
  })).toThrow(/release commit.*archive marker/i)
})

test('release archives preserve committed LF bytes when Git autocrlf is enabled', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'folkkit-release-autocrlf-'))
  const destinationDirectory = await mkdtemp(join(tmpdir(), 'folkkit-release-autocrlf-output-'))
  temporaryDirectories.push(repoRoot, destinationDirectory)
  git(repoRoot, ['init'])
  git(repoRoot, ['config', 'user.name', 'Folkkit Test'])
  git(repoRoot, ['config', 'user.email', 'folkkit-test@example.invalid'])
  git(repoRoot, ['config', 'core.autocrlf', 'true'])
  await writeFile(join(repoRoot, 'notice.txt'), 'first\nsecond\n')
  git(repoRoot, ['add', 'notice.txt'])
  git(repoRoot, ['commit', '-m', 'line ending fixture'])
  const commit = git(repoRoot, ['rev-parse', 'HEAD'])

  await releaseBuilder.archiveValidatedCommit({ repoRoot, commit, destinationDirectory })

  await expect(readFile(join(destinationDirectory, 'notice.txt'), 'utf8')).resolves.toBe('first\nsecond\n')
})
