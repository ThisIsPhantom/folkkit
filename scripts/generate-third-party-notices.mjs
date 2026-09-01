import { readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')

function parseJsonWithTrailingCommas(source, label) {
  let output = ''
  let inString = false
  let escaped = false

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index]
    if (inString) {
      output += character
      if (escaped) escaped = false
      else if (character === '\\') escaped = true
      else if (character === '"') inString = false
      continue
    }

    if (character === '"') {
      inString = true
      output += character
      continue
    }

    if (character === ',') {
      let nextIndex = index + 1
      while (/\s/.test(source[nextIndex] || '')) nextIndex += 1
      if (source[nextIndex] === '}' || source[nextIndex] === ']') continue
    }
    output += character
  }

  try {
    return JSON.parse(output)
  } catch (error) {
    throw new Error(`Unable to parse ${label}: ${error.message}`)
  }
}

function compareNames(left, right) {
  if (left < right) return -1
  if (left > right) return 1
  return 0
}

function normalizeRepository(repository, homepage) {
  let value = typeof repository === 'string' ? repository : repository?.url
  if (!value) value = homepage
  if (!value) return ''

  return value
    .replace(/^git\+ssh:\/\/git@github\.com\//, 'https://github.com/')
    .replace(/^git\+/, '')
    .replace(/^git:\/\//, 'https://')
    .replace(/^git@github\.com:/, 'https://github.com/')
    .replace(/^http:\/\/github\.com\//, 'https://github.com/')
    .replace(/^([^/:]+\/[^/]+)$/, 'https://github.com/$1')
    .replace(/\.git$/, '')
}

function collectRuntimePackageNames(lockfile) {
  const directDependencies = lockfile.workspaces?.['']?.dependencies
  if (!directDependencies || !lockfile.packages) {
    throw new Error('bun.lock does not contain a root runtime dependency graph.')
  }

  const discovered = new Set()
  const pending = Object.keys(directDependencies).sort(compareNames)
  while (pending.length > 0) {
    const packageName = pending.shift()
    if (discovered.has(packageName)) continue

    const entry = lockfile.packages[packageName]
    if (!Array.isArray(entry)) throw new Error(`Locked runtime package is missing: ${packageName}`)
    discovered.add(packageName)

    const dependencyMetadata = entry[2] || {}
    const children = [
      ...Object.keys(dependencyMetadata.dependencies || {}),
      ...Object.keys(dependencyMetadata.optionalDependencies || {}),
    ].sort(compareNames)
    pending.push(...children)
  }

  return [...discovered].sort(compareNames)
}

async function readRuntimePackages(lockfile, nodeModulesPath) {
  const packageNames = collectRuntimePackageNames(lockfile)
  return Promise.all(packageNames.map(async (packageName) => {
    const packageDirectory = join(nodeModulesPath, packageName)
    const packagePath = join(packageDirectory, 'package.json')
    let metadata
    try {
      metadata = JSON.parse(await readFile(packagePath, 'utf8'))
    } catch (error) {
      throw new Error(`Unable to read metadata for locked runtime package ${packageName}: ${error.message}`)
    }

    if (!metadata.license || typeof metadata.license !== 'string') {
      throw new Error(`Locked runtime package ${packageName} is missing license metadata.`)
    }
    if (!metadata.version || typeof metadata.version !== 'string') {
      throw new Error(`Locked runtime package ${packageName} is missing version metadata.`)
    }

    const sourceUrl = normalizeRepository(metadata.repository, metadata.homepage)
    if (!sourceUrl) throw new Error(`Locked runtime package ${packageName} is missing source metadata.`)

    const packageEntries = await readdir(packageDirectory, { withFileTypes: true })
    const noticeFilenames = packageEntries
      .filter(entry => entry.isFile() && /^(?:LICENSE|LICENCE|COPYING|NOTICE)(?:[._-].*)?$/i.test(entry.name))
      .map(entry => entry.name)
      .sort(compareNames)
    const noticeFiles = await Promise.all(noticeFilenames.map(async (filename) => ({
      filename,
      content: (await readFile(join(packageDirectory, filename), 'utf8')).replace(/\r\n/g, '\n').trimEnd(),
    })))

    return {
      name: packageName,
      version: metadata.version,
      license: metadata.license,
      sourceUrl,
      noticeFiles,
    }
  }))
}

function validateRuntimeAssets(runtimeAssets) {
  if (runtimeAssets.schemaVersion !== 1 || !Array.isArray(runtimeAssets.assets)) {
    throw new Error('scripts/runtime-assets.json must use schemaVersion 1 and contain an assets array.')
  }
  if (!runtimeAssets.fonts || !Array.isArray(runtimeAssets.fonts.distributedFiles) || !runtimeAssets.fonts.note) {
    throw new Error('scripts/runtime-assets.json must explicitly register distributed font files or their absence.')
  }

  const ids = new Set()
  for (const asset of runtimeAssets.assets) {
    if (!asset.id || ids.has(asset.id)) throw new Error(`Runtime asset has a missing or duplicate id: ${asset.id || '(missing)'}`)
    ids.add(asset.id)
    for (const field of ['component', 'version', 'license', 'sourceUrl']) {
      if (!asset[field]) throw new Error(`Runtime asset ${asset.id} is missing ${field} metadata.`)
    }
    if (!Array.isArray(asset.paths) || asset.paths.length === 0) {
      throw new Error(`Runtime asset ${asset.id} must register at least one deployed path.`)
    }
  }
}

function packageSection(pkg) {
  const lines = [
    `### ${pkg.name} ${pkg.version}`,
    '',
    `- License: \`${pkg.license}\``,
    `- Source: [${pkg.sourceUrl}](${pkg.sourceUrl})`,
    '',
  ]
  for (const notice of pkg.noticeFiles) {
    let fence = '```'
    while (notice.content.includes(fence)) fence += '`'
    lines.push(
      '<details>',
      `<summary>${notice.filename}</summary>`,
      '',
      `${fence}text`,
      notice.content,
      fence,
      '',
      '</details>',
      '',
    )
  }
  return lines
}

function assetSection(asset) {
  const lines = [
    `### ${asset.component} ${asset.version}`,
    '',
    `- License: \`${asset.license}\``,
    `- Source: [${asset.sourceUrl}](${asset.sourceUrl})`,
    `- Deployed paths: ${[...asset.paths].sort(compareNames).map(path => `\`${path}\``).join(', ')}`,
  ]
  for (const notice of [...(asset.notices || [])].sort((left, right) => compareNames(left.label, right.label))) {
    lines.push(`- ${notice.label}: [${notice.url}](${notice.url})`)
  }
  lines.push('')
  return lines
}

export async function generateThirdPartyNotices({
  lockfilePath = join(projectRoot, 'bun.lock'),
  runtimeAssetsPath = join(projectRoot, 'scripts', 'runtime-assets.json'),
  nodeModulesPath = join(projectRoot, 'node_modules'),
} = {}) {
  const [lockfileSource, runtimeAssetsSource] = await Promise.all([
    readFile(lockfilePath, 'utf8'),
    readFile(runtimeAssetsPath, 'utf8'),
  ])
  const lockfile = parseJsonWithTrailingCommas(lockfileSource, 'bun.lock')
  const runtimeAssets = JSON.parse(runtimeAssetsSource)
  validateRuntimeAssets(runtimeAssets)
  const packages = await readRuntimePackages(lockfile, nodeModulesPath)
  const assets = [...runtimeAssets.assets].sort((left, right) => compareNames(left.id, right.id))

  const lines = [
    '# Folkkit Third-Party Notices',
    '',
    'This file is generated deterministically from `bun.lock` and `scripts/runtime-assets.json`. Do not edit it manually.',
    '',
    '## Application license and upstream attribution',
    '',
    '- Folkkit is licensed under `AGPL-3.0-only`.',
    '- License text: [GNU Affero General Public License 3.0](https://www.gnu.org/licenses/agpl-3.0.html)',
    '- Upstream project: [MercuriusDream/convert-everything](https://github.com/MercuriusDream/convert-everything)',
    '',
    '## Bundled runtime packages',
    '',
    `The locked runtime graph contains ${packages.length} direct and transitive packages. License identifiers and source links come from the installed package metadata for the exact locked versions. Available license, licence, copying, and notice files are preserved below.`,
    '',
  ]

  for (const pkg of packages) lines.push(...packageSection(pkg))

  lines.push(
    '## Manually registered runtime assets',
    '',
    'These assets require an explicit record because a JavaScript lockfile alone does not prove coverage of copied files or WebAssembly.',
    '',
  )
  for (const asset of assets) lines.push(...assetSection(asset))

  lines.push(
    '## Fonts',
    '',
    runtimeAssets.fonts.distributedFiles.length === 0
      ? `No font files are distributed. ${runtimeAssets.fonts.note}`
      : `Distributed font files: ${runtimeAssets.fonts.distributedFiles.map(path => `\`${path}\``).join(', ')}`,
    '',
  )

  return `${lines.join('\n').trimEnd()}\n`
}

export async function writeThirdPartyNotices(options = {}) {
  const outputPath = options.outputPath || join(projectRoot, 'THIRD_PARTY_NOTICES.md')
  const output = await generateThirdPartyNotices(options)
  await writeFile(outputPath, output, 'utf8')
  return output
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  writeThirdPartyNotices()
    .then(() => console.log('Generated THIRD_PARTY_NOTICES.md.'))
    .catch((error) => {
      console.error(error.message)
      process.exitCode = 1
    })
}
