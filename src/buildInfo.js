const SOURCE_REPOSITORY_URL = 'https://github.com/ThisIsPhantom/folkkit'

export function createBuildInfo(commit) {
  if (!/^[0-9a-f]{40}$/.test(commit)) {
    throw new Error('Build information requires an exact 40-character Git commit.')
  }

  return Object.freeze({
    commit,
    sourceUrl: `${SOURCE_REPOSITORY_URL}/tree/${commit}`,
  })
}

const injectedCommit = globalThis.__FOLKKIT_COMMIT__

export const buildInfo = /^[0-9a-f]{40}$/.test(injectedCommit || '')
  ? createBuildInfo(injectedCommit)
  : Object.freeze({ commit: 'development', sourceUrl: SOURCE_REPOSITORY_URL })

export default buildInfo
