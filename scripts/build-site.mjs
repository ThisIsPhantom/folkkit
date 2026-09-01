import { copyFile, rm } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { checkBundleBudget } from './check-bundle-budget.mjs'
import { generateServiceWorker } from './generate-service-worker.mjs'
import { checkThirdPartyNotices } from './generate-third-party-notices.mjs'
import { resolveBuildCommit } from './resolve-build-commit.mjs'
import { assertExactRuntimeAssets, syncRuntimeAssets } from './sync-runtime-assets.mjs'
import { runPublicConfigValidation } from './validate-public-config.mjs'

const supportedModes = new Set(['validation', 'release'])

export async function runSiteBuild({
  repoRoot = process.cwd(),
  env = process.env,
  mode = 'validation',
  syncAssets = options => syncRuntimeAssets(options),
  assertRuntimeAssets = options => assertExactRuntimeAssets(options),
  checkNotices = options => checkThirdPartyNotices(options),
  viteBuild = async options => {
    const { build } = await import('vite')
    return build(options)
  },
  generateWorker = options => generateServiceWorker(options),
  checkBudget = options => checkBundleBudget(options),
} = {}) {
  if (!supportedModes.has(mode)) throw new Error(`Unsupported site build mode: ${mode}`)
  if (mode === 'release') runPublicConfigValidation(env)

  const commit = resolveBuildCommit({ repoRoot, env })
  const publicVendorDirectory = join(repoRoot, 'public', 'vendor')
  const distDirectory = join(repoRoot, 'dist')

  await syncAssets({
    sourceDirectory: join(repoRoot, 'node_modules', '@ffmpeg', 'core', 'dist', 'esm'),
    destinationDirectory: join(publicVendorDirectory, 'ffmpeg'),
  })
  await assertRuntimeAssets({ vendorDirectory: publicVendorDirectory })
  await checkNotices({ projectRoot: repoRoot })
  await viteBuild({ root: repoRoot })
  await generateWorker({
    distDir: distDirectory,
    templatePath: join(repoRoot, 'public', 'sw.template.js'),
  })
  await checkBudget({ distDir: distDirectory })
  await assertRuntimeAssets({ vendorDirectory: join(distDirectory, 'vendor') })

  await rm(join(distDirectory, '.vite'), { recursive: true, force: true })
  await rm(join(distDirectory, 'sw.template.js'), { force: true })
  await copyFile(join(repoRoot, 'hosting', '.htaccess'), join(distDirectory, '.htaccess'))

  return { commit, mode, outputDirectory: distDirectory }
}

function parseCliMode(args) {
  if (args.length === 0) return 'validation'
  if (args.length === 1 && args[0] === '--release-artifact') return 'release'
  throw new Error(`Unsupported build-site argument: ${args.join(' ')}`)
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const mode = parseCliMode(process.argv.slice(2))
  runSiteBuild({ mode })
    .then(({ commit }) => {
      const label = mode === 'release' ? 'Public release artifact' : 'Non-public validation artifact'
      console.log(`${label} built from ${commit}.`)
    })
    .catch((error) => {
      console.error(error.message)
      process.exitCode = 1
    })
}
