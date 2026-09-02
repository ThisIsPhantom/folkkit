import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import process from 'node:process'
import { afterEach, expect, test } from 'vitest'
import playwrightConfig from '../playwright.config.js'

const node = process.execPath
const validator = join(process.cwd(), 'scripts', 'validate-workflow-security.mjs')
const temporaryDirectories = []

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map(path => rm(path, { recursive: true, force: true })))
})

function runValidator(paths = []) {
  return spawnSync(node, [validator, ...paths], { encoding: 'utf8' })
}

test('repository workflows use immutable action SHAs and separate preparation from write-authorized push', () => {
  const result = runValidator()
  expect(result.status, result.stderr || result.stdout).toBe(0)
})

test('official Playwright install contract provisions Chromium, Firefox and WebKit for the configured matrix', async () => {
  const packageJson = JSON.parse(await readFile(join(process.cwd(), 'package.json'), 'utf8'))
  expect(packageJson.scripts['test:e2e:install']).toMatch(/playwright\/cli\.js install chromium firefox webkit$/)
  const workflow = await readFile(join(process.cwd(), '.github', 'workflows', 'verify.yml'), 'utf8')
  expect(workflow).toContain('bun run test:e2e:install')
})

test('normal production build enforces the final runtime artifact policy', async () => {
  const packageJson = JSON.parse(await readFile(join(process.cwd(), 'package.json'), 'utf8'))
  expect(packageJson.scripts.build).toMatch(/^bun scripts\/audit-catalog\.mjs && vite build/)
  expect(packageJson.scripts.build).toMatch(/node scripts\/assert-runtime-artifacts\.mjs$/)
})

test('Playwright quotes the runtime executable used to start the preview server', () => {
  expect(playwrightConfig.webServer.command.startsWith(`"${process.execPath}" `)).toBe(true)
})

test('hosting publisher rejects a detached checkout in the write-authorized job', async () => {
  const root = await mkdtemp(join(tmpdir(), 'folkkit-workflow-policy-'))
  temporaryDirectories.push(root)
  const path = join(root, 'publish-plesk.yml')
  await writeFile(path, `jobs:
  prepare-hosting:
    steps: []
  publish-hosting:
    needs: prepare-hosting
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@${'1'.repeat(40)} # v4
        with:
          ref: deadbeef
          persist-credentials: false
      - run: node scripts/prepared-plesk-artifact.mjs push artifact
`)

  const result = runValidator([path])

  expect(result.status).not.toBe(0)
  expect(result.stderr).toMatch(/publish-hosting.*check out main/i)
})

test.each([
  ['mutable action tag', 'uses: actions/checkout@v4\n'],
  ['checkout credential persistence', `uses: actions/checkout@${'1'.repeat(40)} # v4\nwith:\n  persist-credentials: true\n`],
  ['build command with a write credential', `jobs:\n  publish:\n    permissions:\n      contents: write\n    steps:\n      - run: bun run build\n`],
])('rejects %s', async (_label, workflow) => {
  const root = await mkdtemp(join(tmpdir(), 'folkkit-workflow-policy-'))
  temporaryDirectories.push(root)
  const path = join(root, 'fixture.yml')
  await writeFile(path, workflow)

  const result = runValidator([path])

  expect(result.status).not.toBe(0)
  expect(result.stderr).toMatch(/workflow security/i)
})
