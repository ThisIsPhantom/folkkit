import { mkdtemp, mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, expect, test } from 'vitest'
import { rm } from 'node:fs/promises'
import legalDe from './legal.de'
import legalEn from './legal.en'
import { createBuildInfo } from '../buildInfo'
import { createPublicOperator, getPublicOperatorErrors } from './publicOperator'
import { generateThirdPartyNotices } from '../../scripts/generate-third-party-notices.mjs'

const temporaryDirectories = []

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map(directory => rm(directory, { recursive: true, force: true })))
})

function contentShape(value) {
  if (Array.isArray(value)) return value.map(contentShape)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, contentShape(child)]))
  }
  return typeof value
}

function allCopy(content) {
  return JSON.stringify(content)
}

async function createNoticeFixture({ missingLicense = false } = {}) {
  const root = await mkdtemp(join(tmpdir(), 'folkkit-notices-'))
  temporaryDirectories.push(root)
  const nodeModulesPath = join(root, 'node_modules')
  await mkdir(join(nodeModulesPath, 'runtime-a'), { recursive: true })
  await mkdir(join(nodeModulesPath, 'runtime-b'), { recursive: true })

  const lockfile = {
    lockfileVersion: 1,
    workspaces: { '': { dependencies: { 'runtime-a': '1.0.0' } } },
    packages: {
      'runtime-a': ['runtime-a@1.0.0', '', { dependencies: { 'runtime-b': '^2.0.0' } }, 'sha512-a'],
      'runtime-b': ['runtime-b@2.0.0', '', {}, 'sha512-b'],
    },
  }
  const runtimeAssets = {
    schemaVersion: 1,
    fonts: {
      distributedFiles: [],
      note: 'Folkkit distributes no font files and uses system font stacks.',
    },
    assets: [
      {
        id: 'folkkit-favicon',
        component: 'Folkkit favicon',
        version: '1',
        paths: ['public/favicon.svg'],
        license: 'AGPL-3.0-only',
        sourceUrl: 'https://github.com/ThisIsPhantom/folkkit',
      },
      {
        id: 'ffmpeg-core-wasm',
        component: 'FFmpeg / ffmpeg.wasm runtime assets',
        version: '0.12.10',
        paths: ['public/vendor/ffmpeg/ffmpeg-core.js', 'public/vendor/ffmpeg/ffmpeg-core.wasm'],
        license: 'GPL-2.0-or-later',
        sourceUrl: 'https://github.com/ffmpegwasm/ffmpeg.wasm',
        notices: [
          { label: 'FFmpeg licensing', url: 'https://ffmpeg.org/legal.html' },
          { label: 'GNU LGPL 2.1', url: 'https://www.gnu.org/licenses/old-licenses/lgpl-2.1.html' },
        ],
      },
    ],
  }

  await writeFile(join(root, 'bun.lock'), `${JSON.stringify(lockfile, null, 2)}\n`)
  await writeFile(join(root, 'runtime-assets.json'), `${JSON.stringify(runtimeAssets, null, 2)}\n`)
  await writeFile(join(nodeModulesPath, 'runtime-a', 'package.json'), `${JSON.stringify({
    name: 'runtime-a',
    version: '1.0.0',
    license: 'MIT',
    repository: { type: 'git', url: 'git+https://example.test/runtime-a.git' },
  }, null, 2)}\n`)
  await writeFile(join(nodeModulesPath, 'runtime-a', 'LICENSE'), 'Runtime A license text.\n')
  await writeFile(join(nodeModulesPath, 'runtime-a', 'NOTICE'), 'Runtime A copyright notice.\n')
  await writeFile(join(nodeModulesPath, 'runtime-b', 'package.json'), `${JSON.stringify({
    name: 'runtime-b',
    version: '2.0.0',
    ...(missingLicense ? {} : { license: 'BSD-2-Clause' }),
    repository: { type: 'git', url: 'git+ssh://git@github.com/example/runtime-b.git' },
  }, null, 2)}\n`)

  return {
    lockfilePath: join(root, 'bun.lock'),
    runtimeAssetsPath: join(root, 'runtime-assets.json'),
    nodeModulesPath,
  }
}

test('German and English legal content keep the same complete information structure', () => {
  expect(contentShape(legalEn)).toEqual(contentShape(legalDe))
  expect(legalDe.privacy.sections.map(section => section.id)).toEqual(legalEn.privacy.sections.map(section => section.id))
})

test('privacy copy discloses local processing, offline cache, optional history, and possible Hosttech logs without a universal zero-data claim', () => {
  const german = allCopy(legalDe.privacy)
  const english = allCopy(legalEn.privacy)

  expect(german).toMatch(/lokal|Browser/i)
  expect(german).toMatch(/Cache|offline/i)
  expect(german).toMatch(/Einwilligung|Opt-in|aktiv/i)
  expect(german).toMatch(/Hosttech/i)
  expect(german).toMatch(/IP-Adresse.*Zeitpunkt.*Pfad.*Referrer.*User-Agent/i)
  expect(german).toMatch(/keine Analytik|keine Analyse/i)
  expect(german).toMatch(/AdSense/i)
  expect(german).not.toMatch(/erheben keine Daten|sammeln keine Daten|null Daten/i)

  expect(english).toMatch(/locally|browser/i)
  expect(english).toMatch(/cache|offline/i)
  expect(english).toMatch(/opt-in|enable/i)
  expect(english).toMatch(/Hosttech/i)
  expect(english).toMatch(/IP address.*timestamp.*path.*referrer.*user agent/i)
  expect(english).toMatch(/no analytics/i)
  expect(english).toMatch(/AdSense/i)
  expect(english).not.toMatch(/collect no data|no data is collected|zero data/i)
})

test('terms keep health and finance tools scoped as non-advice in both languages', () => {
  expect(allCopy(legalDe.terms)).toMatch(/keine medizinische Beratung/i)
  expect(allCopy(legalDe.terms)).toMatch(/keine Finanzberatung/i)
  expect(allCopy(legalDe.terms)).toMatch(/keine Gewähr.*recht/i)
  expect(allCopy(legalEn.terms)).toMatch(/not medical advice/i)
  expect(allCopy(legalEn.terms)).toMatch(/not financial advice/i)
  expect(allCopy(legalEn.terms)).toMatch(/no guarantee.*legal/i)
})

test('public operator normalization accepts an explicit fixture and reports every missing or example value', () => {
  const fixture = createPublicOperator({
    VITE_PUBLIC_OPERATOR_NAME: 'Approved Fixture Cooperative',
    VITE_PUBLIC_OPERATOR_ADDRESS: 'Marktgasse 12|8001 Zürich|Schweiz',
    VITE_PUBLIC_CONTACT_EMAIL: 'contact@operator.fixture',
  })

  expect(fixture).toEqual({
    name: 'Approved Fixture Cooperative',
    addressLines: ['Marktgasse 12', '8001 Zürich', 'Schweiz'],
    email: 'contact@operator.fixture',
  })
  expect(getPublicOperatorErrors(fixture)).toEqual([])
  expect(getPublicOperatorErrors(createPublicOperator({}))).toEqual([
    'VITE_PUBLIC_OPERATOR_NAME is required.',
    'VITE_PUBLIC_OPERATOR_ADDRESS is required.',
    'VITE_PUBLIC_CONTACT_EMAIL is required.',
  ])
  expect(getPublicOperatorErrors(createPublicOperator({
    VITE_PUBLIC_OPERATOR_NAME: 'Example Operator',
    VITE_PUBLIC_OPERATOR_ADDRESS: 'Example Street 1|8000 Example City',
    VITE_PUBLIC_CONTACT_EMAIL: 'operator@example.com',
  }))).toHaveLength(3)
})

test('build information creates an immutable exact-revision source link', () => {
  const commit = 'a'.repeat(40)
  expect(createBuildInfo(commit)).toEqual({
    commit,
    sourceUrl: `https://github.com/ThisIsPhantom/folkkit/tree/${commit}`,
  })
  expect(Object.isFrozen(createBuildInfo(commit))).toBe(true)
  expect(() => createBuildInfo('development')).toThrow(/exact 40-character Git commit/i)
})

test('third-party notices are deterministic and cover locked transitive packages plus manual assets', async () => {
  const fixture = await createNoticeFixture()
  const first = await generateThirdPartyNotices(fixture)
  const second = await generateThirdPartyNotices(fixture)

  expect(second).toBe(first)
  expect(first).toContain('runtime-a 1.0.0')
  expect(first).toContain('Runtime A license text.')
  expect(first).toContain('Runtime A copyright notice.')
  expect(first).toContain('runtime-b 2.0.0')
  expect(first).toContain('https://github.com/example/runtime-b')
  expect(first).not.toContain('ssh://git@github.com')
  expect(first).toContain('Folkkit favicon')
  expect(first).toContain('FFmpeg / ffmpeg.wasm runtime assets')
  expect(first).toContain('GPL-2.0-or-later')
  expect(first).toContain('LGPL 2.1')
  expect(first).toContain('No font files are distributed')
})

test('third-party notice generation fails when a locked runtime package lacks license metadata', async () => {
  const fixture = await createNoticeFixture({ missingLicense: true })
  await expect(generateThirdPartyNotices(fixture)).rejects.toThrow(/runtime-b.*license metadata/i)
})
