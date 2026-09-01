import { expect, test } from 'vitest'
import { getConvertFn } from '../formats'
import { releasedFormatPairs } from './evidenceRegistry'
import { canExecuteFormatPair, classifyFormatPairEntry, getFormatPairPolicy } from './formatCompatibility'

test('every currently released format pair is explicitly compatible and has an evidenced implementation', () => {
  expect(releasedFormatPairs.length).toBeGreaterThan(0)
  for (const pair of releasedFormatPairs) {
    expect(pair.compatibility, `${pair.from} to ${pair.to}`).toBe('compatible')
    expect(getConvertFn(pair.from, pair.to), `${pair.from} to ${pair.to}`).toEqual(expect.any(Function))
    expect(getFormatPairPolicy(pair.from, pair.to)).toEqual({
      status: 'compatible',
      pairKey: `${pair.from}→${pair.to}`,
    })
  }
  expect(releasedFormatPairs.filter(pair => pair.compatibility === 'incompatible-but-implemented')).toEqual([])
})

test('a future incompatible pair is executable only with evidence, implementation and current-session pair confirmation', () => {
  const pair = { from: 'alpha', to: 'beta', compatibility: 'incompatible-but-implemented', evidenceId: 'future:alpha-beta' }
  const policy = classifyFormatPairEntry(pair, { implementationExists: true, evidenceExists: true })

  expect(policy).toEqual({ status: 'incompatible-but-implemented', pairKey: 'alpha→beta' })
  expect(canExecuteFormatPair(policy, null)).toBe(false)
  expect(canExecuteFormatPair(policy, 'alpha→gamma')).toBe(false)
  expect(canExecuteFormatPair(policy, 'alpha→beta')).toBe(true)
})

test.each([
  [null, true, true],
  [{ from: 'alpha', to: 'beta', compatibility: 'unsupported' }, true, true],
  [{ from: 'alpha', to: 'beta', compatibility: 'incompatible-but-implemented' }, false, true],
  [{ from: 'alpha', to: 'beta', compatibility: 'incompatible-but-implemented' }, true, false],
])('unsupported or unevidenced pair stays blocked even after confirmation', (entry, implementationExists, evidenceExists) => {
  const policy = classifyFormatPairEntry(entry, { implementationExists, evidenceExists })
  expect(policy.status).toBe('unsupported')
  expect(canExecuteFormatPair(policy, 'alpha→beta')).toBe(false)
})
