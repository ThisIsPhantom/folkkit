import { expect, test } from 'vitest'
import { pruneReleasedConverters } from './prune-released-converters.mjs'

test('browser build pruning removes hidden converter objects and their external literals', () => {
  const source = `
    const helper = 'kept helper'
    export const textConverters = [
      { id: 'released', convert: () => helper },
      { id: 'hidden', convert: () => 'https://attacker.example/output' },
    ]
    const imageExtras = [{ id: 'image-rotate', convert: () => 'hidden rotate implementation' }]
    const imageExtras2 = [{ id: 'image-sepia', convert: () => 'hidden sepia implementation' }]
    textConverters.push(...imageExtras, ...imageExtras2)
  `

  const result = pruneReleasedConverters(source, new Set(['released']), 'text')

  expect(result).toContain("id: 'released'")
  expect(result).not.toContain("id: 'hidden'")
  expect(result).not.toContain('attacker.example')
  expect(result).not.toContain('image-rotate')
  expect(result).not.toContain('hidden sepia implementation')
})
