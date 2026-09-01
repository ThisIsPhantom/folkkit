import { execFileSync, spawnSync } from 'node:child_process'
import { access, cp, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { checkThirdPartyNotices } from './generate-third-party-notices.mjs'
import { assertExactRuntimeAssets } from './sync-runtime-assets.mjs'
import { runPublicConfigValidation } from './validate-public-config.mjs'
import { validateReleaseSource } from './validate-release-source.mjs'
export { resolveBuildCommit } from './resolve-build-commit.mjs'

async function runReleaseCommand({ executable, args, cwd, env }) {
  const result = spawnSync(executable, args, { cwd, env, stdio: 'inherit' })
  if (result.error) throw new Error(`Unable to start release command: ${result.error.message}`)
  if (result.status !== 0) throw new Error(`Release command failed with exit code ${result.status}: ${args.join(' ')}`)
}

export async function archiveValidatedCommit({ repoRoot, commit, destinationDirectory }) {
  const archivePath = join(dirname(destinationDirectory), 'source.tar')
  await mkdir(destinationDirectory, { recursive: true })
  execFileSync('git', ['archive', '--format=tar', '--output', archivePath, commit], { cwd: repoRoot })
  execFileSync('tar', ['-xf', archivePath, '-C', destinationDirectory])
}

async function copyBuiltDist(sourceDirectory, outputDirectory) {
  try {
    await access(sourceDirectory)
  } catch {
    throw new Error('Release build did not produce dist.')
  }
  await mkdir(dirname(outputDirectory), { recursive: true })
  await rm(outputDirectory, { recursive: true, force: true })
  await cp(sourceDirectory, outputDirectory, { recursive: true })
}

export async function runReleaseBuild({
  repoRoot = process.cwd(),
  env = process.env,
  runCommand = runReleaseCommand,
  archive = archiveValidatedCommit,
  outputDirectory = join(repoRoot, 'dist'),
} = {}) {
  runPublicConfigValidation(env)
  const { commit } = await validateReleaseSource({
    repoRoot,
    expectedCommit: env.FOLKKIT_RELEASE_COMMIT,
  })
  const temporaryRoot = await mkdtemp(join(tmpdir(), 'folkkit-release-'))
  const sourceDirectory = join(temporaryRoot, 'source')
  const bunExecutable = process.versions.bun ? process.execPath : env.FOLKKIT_BUN_EXECUTABLE || 'bun'
  const releaseEnv = { ...env, FOLKKIT_RELEASE_COMMIT: commit }

  try {
    await archive({ repoRoot, commit, destinationDirectory: sourceDirectory })
    await writeFile(join(sourceDirectory, '.folkkit-release-commit'), `${commit}\n`)
    await runCommand({
      executable: bunExecutable,
      args: ['install', '--frozen-lockfile', '--ignore-scripts', '--force'],
      cwd: sourceDirectory,
      env: releaseEnv,
      label: 'install',
    })
    await checkThirdPartyNotices({ projectRoot: sourceDirectory })
    await runCommand({
      executable: bunExecutable,
      args: ['run', 'scripts/sync-runtime-assets.mjs'],
      cwd: sourceDirectory,
      env: releaseEnv,
      label: 'sync-runtime-assets',
    })
    await assertExactRuntimeAssets({ vendorDirectory: join(sourceDirectory, 'public', 'vendor') })
    await runCommand({
      executable: bunExecutable,
      args: ['run', 'scripts/build-site.mjs', '--release-artifact'],
      cwd: sourceDirectory,
      env: releaseEnv,
      label: 'build',
    })
    await assertExactRuntimeAssets({ vendorDirectory: join(sourceDirectory, 'public', 'vendor') })
    await copyBuiltDist(join(sourceDirectory, 'dist'), outputDirectory)
    return { commit, outputDirectory }
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true })
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runReleaseBuild()
    .then(({ commit }) => console.log(`Release build completed from ${commit}.`))
    .catch((error) => {
      console.error(error.message)
      process.exitCode = 1
    })
}
