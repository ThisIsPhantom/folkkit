import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { runPublicConfigValidation } from './validate-public-config.mjs'
import { validateReleaseSource } from './validate-release-source.mjs'

function runBuild({ repoRoot, env }) {
  const bunExecutable = process.versions.bun ? process.execPath : env.FOLKKIT_BUN_EXECUTABLE || 'bun'
  const result = spawnSync(bunExecutable, ['run', 'build'], {
    cwd: repoRoot,
    env,
    stdio: 'inherit',
  })
  if (result.error) throw new Error(`Unable to start release build: ${result.error.message}`)
  if (result.status !== 0) throw new Error(`Release build failed with exit code ${result.status}.`)
}

export async function runReleaseBuild({
  repoRoot = process.cwd(),
  env = process.env,
  build = runBuild,
} = {}) {
  runPublicConfigValidation(env)
  const { commit } = await validateReleaseSource({
    repoRoot,
    expectedCommit: env.FOLKKIT_RELEASE_COMMIT,
  })
  build({
    repoRoot,
    env: { ...env, FOLKKIT_RELEASE_COMMIT: commit },
  })
  return { commit }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runReleaseBuild()
    .then(({ commit }) => console.log(`Release build completed from ${commit}.`))
    .catch((error) => {
      console.error(error.message)
      process.exitCode = 1
    })
}
