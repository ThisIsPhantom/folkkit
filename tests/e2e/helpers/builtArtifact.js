import process from 'node:process'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export function builtArtifactPath(relativePath) {
  const directory = process.env.FOLKKIT_E2E_DIST || fileURLToPath(new URL('../../../dist/', import.meta.url))
  return resolve(directory, relativePath)
}
