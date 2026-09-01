import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { checkThirdPartyNotices } from './generate-third-party-notices.mjs'

function git(repoRoot, args) {
  try {
    return execFileSync('git', args, {
      cwd: repoRoot,
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
    }).trimEnd()
  } catch (error) {
    throw new Error(`Release source Git check failed: ${error.stderr?.toString().trim() || error.message}`)
  }
}

export async function validateReleaseSource({
  repoRoot = process.cwd(),
  expectedCommit,
} = {}) {
  const commit = git(repoRoot, ['rev-parse', 'HEAD']).trim()
  if (!/^[0-9a-f]{40}$/.test(commit)) {
    throw new Error('Release source HEAD is not an exact 40-character Git commit.')
  }
  if (expectedCommit && expectedCommit !== commit) {
    throw new Error(`Release source revision ${expectedCommit} does not match HEAD ${commit}.`)
  }

  const committedNotices = `${git(repoRoot, ['show', 'HEAD:THIRD_PARTY_NOTICES.md'])}\n`
  await checkThirdPartyNotices({ projectRoot: repoRoot, expectedContent: committedNotices })

  const status = git(repoRoot, ['status', '--porcelain=v1', '--untracked-files=all'])
  if (status) {
    throw new Error(`Release source working tree is not clean:\n${status}`)
  }

  return { commit }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  validateReleaseSource({ expectedCommit: process.env.FOLKKIT_RELEASE_COMMIT })
    .then(({ commit }) => console.log(`Release source is clean at ${commit}.`))
    .catch((error) => {
      console.error(error.message)
      process.exitCode = 1
    })
}
