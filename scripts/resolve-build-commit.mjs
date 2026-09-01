import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'

const exactCommitPattern = /^[0-9a-f]{40}$/

export function resolveBuildCommit({ repoRoot = process.cwd(), env = process.env } = {}) {
  const releaseCommit = env.FOLKKIT_RELEASE_COMMIT?.trim()
  if (releaseCommit) {
    if (!exactCommitPattern.test(releaseCommit)) {
      throw new Error('FOLKKIT_RELEASE_COMMIT must be an exact 40-character Git commit.')
    }
    let markerCommit
    try {
      markerCommit = readFileSync(join(repoRoot, '.folkkit-release-commit'), 'utf8').trim()
    } catch (error) {
      throw new Error(`Unable to verify release commit archive marker: ${error.message}`)
    }
    if (markerCommit !== releaseCommit) {
      throw new Error(`Release commit ${releaseCommit} does not match archive marker ${markerCommit}.`)
    }
    return releaseCommit
  }

  const commit = execFileSync('git', ['rev-parse', 'HEAD'], {
    cwd: repoRoot,
    encoding: 'utf8',
  }).trim()
  if (!exactCommitPattern.test(commit)) throw new Error('Unable to resolve an exact Git commit for this build.')
  return commit
}
