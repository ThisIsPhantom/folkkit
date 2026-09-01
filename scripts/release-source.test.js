import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { execFileSync, spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { afterEach, expect, test } from 'vitest'
import { generateThirdPartyNotices } from './generate-third-party-notices.mjs'
import { validateReleaseSource } from './validate-release-source.mjs'

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

  await writeFile(join(repoRoot, '.gitignore'), 'node_modules/\nbuild-marker.txt\n')
  await writeFile(join(repoRoot, 'README.md'), 'release fixture\n')
  await writeFile(join(repoRoot, 'bun.lock'), `${JSON.stringify(lockfile, null, 2)}\n`)
  await writeFile(join(repoRoot, 'scripts', 'runtime-assets.json'), `${JSON.stringify(runtimeAssets, null, 2)}\n`)
  await writeFile(join(repoRoot, 'scripts', 'license-texts', 'index.json'), `${JSON.stringify({ MIT: ['scripts/license-texts/MIT.txt'] }, null, 2)}\n`)
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
  await writeFile(join(repoRoot, 'THIRD_PARTY_NOTICES.md'), await generateThirdPartyNotices(noticeOptions))

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

  const result = runReleaseCli(repoRoot)

  expect(result.status).toBe(1)
  expect(`${result.stdout}\n${result.stderr}`).toMatch(/THIRD_PARTY_NOTICES\.md.*stale/i)
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
