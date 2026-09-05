// @vitest-environment node
import { mkdtemp, mkdir, readFile, rm, symlink, unlink, writeFile, realpath } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { build } from 'vite'
import { expect, test } from 'vitest'
import { runSiteBuild } from './build-site.mjs'

test('a real Vite build through a filesystem alias emits index.html inside the canonical source tree', async () => {
  const root = await mkdtemp(join(tmpdir(), 'folkkit-build-alias-'))
  const source = join(root, 'source')
  const alias = join(root, 'source-alias')
  const commit = 'a'.repeat(40)
  await mkdir(join(source, 'hosting'), { recursive: true })
  await writeFile(join(source, 'hosting', '.htaccess'), 'fixture\n')
  await writeFile(join(source, '.folkkit-release-commit'), commit)
  await writeFile(join(source, 'index.html'), '<!doctype html><html><head></head><body><script type="module" src="./main.js"></script></body></html>')
  await writeFile(join(source, 'main.js'), 'document.body.textContent = "Local fixture"')
  await symlink(source, alias, 'junction')
  try {
    const noop = async () => {}
    const result = await runSiteBuild({
      repoRoot: alias,
      env: { FOLKKIT_RELEASE_COMMIT: commit },
      auditCatalog: noop, syncAssets: noop, assertRuntimeAssets: noop, checkNotices: noop,
      generateWorker: noop, checkBudget: noop, assertArtifacts: noop,
      viteBuild: async options => {
        await build({ ...options, configFile: false, publicDir: false, logLevel: 'silent' })
        for (const name of ['favicon.svg', 'manifest.json', 'theme-init.js']) await writeFile(join(source, 'dist', name), '')
      },
    })
    expect(result.outputDirectory).toBe(join(await realpath(source), 'dist'))
    expect(await readFile(join(source, 'dist', 'index.html'), 'utf8')).toContain('assets/')
  } finally {
    await unlink(alias)
    await rm(root, { recursive: true, force: true })
  }
}, 15000)
