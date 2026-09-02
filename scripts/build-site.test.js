import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'
import { afterEach, expect, test } from 'vitest'
import { runSiteBuild } from './build-site.mjs'
import { runCatalogAudit } from './audit-catalog.mjs'
import { releaseCatalog } from '../src/catalog/releaseCatalog.js'

const temporaryDirectories = []
const exactCommit = 'a'.repeat(40)
const approvedOperator = Object.freeze({
  VITE_PUBLIC_OPERATOR_NAME: 'Approved Fixture Cooperative',
  VITE_PUBLIC_CONTACT_EMAIL: 'contact@operator.fixture',
  FOLKKIT_RELEASE_COMMIT: exactCommit,
})

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map(path => rm(path, { recursive: true, force: true })))
})

async function createProjectFixture() {
  const root = await mkdtemp(join(tmpdir(), 'folkkit-site-build-'))
  temporaryDirectories.push(root)
  await mkdir(join(root, 'hosting'), { recursive: true })
  await writeFile(join(root, 'hosting', '.htaccess'), 'fixture-hosting-contract\r\n')
  await writeFile(join(root, '.folkkit-release-commit'), `${exactCommit}\n`)
  return root
}

function createPipelineDoubles(root, calls) {
  return {
    auditCatalog: async () => calls.push('catalog'),
    syncAssets: async () => calls.push('sync'),
    assertRuntimeAssets: async ({ vendorDirectory }) => {
      calls.push(vendorDirectory.includes(`${join('dist', 'vendor')}`) ? 'assert:dist' : 'assert:public')
    },
    checkNotices: async () => calls.push('notices'),
    viteBuild: async () => {
      calls.push('vite')
      await mkdir(join(root, 'dist', '.vite'), { recursive: true })
      await writeFile(join(root, 'dist', 'index.html'), '<!doctype html>\r\n')
      await writeFile(join(root, 'dist', 'manifest.json'), '{}\r\n')
      await writeFile(join(root, 'dist', 'favicon.svg'), '<svg />\r\n')
      await writeFile(join(root, 'dist', 'theme-init.js'), 'void 0\r\n')
      await writeFile(join(root, 'dist', 'sw.template.js'), 'template must not ship')
      await writeFile(join(root, 'dist', '.vite', 'manifest.json'), '{}')
    },
    generateWorker: async () => calls.push('service-worker'),
    checkBudget: async () => calls.push('budget'),
    assertArtifacts: async ({ distDirectory }) => {
      expect(await readFile(join(distDirectory, '.htaccess'), 'utf8')).toBe('fixture-hosting-contract\n')
      calls.push('artifact-gate')
    },
  }
}

test('validation build runs the complete site pipeline and keeps only hosting runtime inputs', async () => {
  const root = await createProjectFixture()
  const calls = []

  const result = await runSiteBuild({
    repoRoot: root,
    env: { FOLKKIT_RELEASE_COMMIT: exactCommit },
    mode: 'validation',
    ...createPipelineDoubles(root, calls),
  })

  expect(calls).toEqual(['catalog', 'sync', 'assert:public', 'notices', 'vite', 'service-worker', 'budget', 'assert:dist', 'artifact-gate'])
  expect(await readFile(join(root, 'dist', '.htaccess'), 'utf8')).toBe('fixture-hosting-contract\n')
  expect(await readFile(join(root, 'dist', 'index.html'), 'utf8')).toBe('<!doctype html>\n')
  expect(await readFile(join(root, 'dist', 'manifest.json'), 'utf8')).toBe('{}\n')
  expect(await readFile(join(root, 'dist', 'favicon.svg'), 'utf8')).toBe('<svg />\n')
  expect(await readFile(join(root, 'dist', 'theme-init.js'), 'utf8')).toBe('void 0\n')
  await expect(readFile(join(root, 'dist', 'sw.template.js'))).rejects.toMatchObject({ code: 'ENOENT' })
  await expect(readFile(join(root, 'dist', '.vite', 'manifest.json'))).rejects.toMatchObject({ code: 'ENOENT' })
  expect(result).toMatchObject({ commit: exactCommit, mode: 'validation' })
})

test('a 49-entry browser manifest with one hidden substitution fails before Vite', async () => {
  const root = await createProjectFixture()
  const calls = []
  const manifest = JSON.parse(await readFile(join(process.cwd(), 'scripts', 'released-browser-converters.json'), 'utf8'))
  const hiddenText = releaseCatalog.find(entry => entry.module === 'text' && entry.tier === 'hidden')
  expect(hiddenText).toBeDefined()
  manifest.text[0] = hiddenText.id
  expect(Object.values(manifest).flat()).toHaveLength(49)
  const manifestPath = join(root, 'released-browser-converters.json')
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)

  await expect(runSiteBuild({
    repoRoot: root,
    env: { FOLKKIT_RELEASE_COMMIT: exactCommit },
    mode: 'validation',
    ...createPipelineDoubles(root, calls),
    auditCatalog: async () => {
      calls.push('catalog')
      const result = await runCatalogAudit({ browserManifestPath: manifestPath })
      if (!result.ok) throw new Error(result.errors.join('\n'))
    },
  })).rejects.toThrow(/browser converter manifest.*canonical released catalog/i)

  expect(calls).toEqual(['catalog'])
})

test('public release artifact rejects missing operator values before any build step', async () => {
  const root = await createProjectFixture()
  const calls = []

  await expect(runSiteBuild({
    repoRoot: root,
    env: { FOLKKIT_RELEASE_COMMIT: exactCommit },
    mode: 'release',
    ...createPipelineDoubles(root, calls),
  })).rejects.toThrow('Public release configuration is incomplete')

  expect(calls).toEqual([])
})

test('public release artifact requires the archive marker for the exact requested commit', async () => {
  const root = await createProjectFixture()
  const calls = []
  await writeFile(join(root, '.folkkit-release-commit'), `${'b'.repeat(40)}\n`)

  await expect(runSiteBuild({
    repoRoot: root,
    env: approvedOperator,
    mode: 'release',
    ...createPipelineDoubles(root, calls),
  })).rejects.toThrow('does not match archive marker')

  expect(calls).toEqual([])
})
