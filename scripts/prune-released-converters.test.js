import { expect, test } from 'vitest'
import { pruneReleasedConverters } from './prune-released-converters.mjs'

test('browser build pruning removes hidden converter objects and their external literals', () => {
  const source = `
    const helper = 'kept helper'
    export const textConverters = [
      { id: 'released', convert: () => helper },
      { id: 'hidden', convert: () => 'https://attacker.example/output' },
    ]
  `

  const result = pruneReleasedConverters(source, new Set(['released']), 'text')

  expect(result).toContain("id: 'released'")
  expect(result).not.toContain("id: 'hidden'")
  expect(result).not.toContain('attacker.example')
})
