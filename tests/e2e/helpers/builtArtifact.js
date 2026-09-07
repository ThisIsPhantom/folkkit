import process from 'node:process'
import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export function builtArtifactPath(relativePath) {
  const directory = process.env.FOLKKIT_E2E_DIST || fileURLToPath(new URL('../../../dist/', import.meta.url))
  return resolve(directory, relativePath)
}


// Hosting artifacts deliberately omit Vite's development manifest.
// Resolve only an unambiguous, fixed test module from the generated assets.
export function builtModulePath(name) {
  if (!/^[A-Za-z][A-Za-z0-9]*$/.test(name)) throw new Error('Invalid test module name.')
  const matches = readdirSync(builtArtifactPath('assets')).filter(file => new RegExp(`^${name}-[A-Za-z0-9_-]+\\.js$`).test(file))
  if (matches.length !== 1) throw new Error(`Expected one built ${name} module, found ${matches.length}.`)
  return `/assets/${matches[0]}`
}
