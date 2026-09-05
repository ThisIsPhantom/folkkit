import { expect, test } from 'vitest'
import { resolveAppRoute, coreDestinations, calculatorSelection, legacyCalculatorTool } from './studioRoutes'

test.each(['qr', 'pdf', 'convert', 'calculate'])('opens the dedicated %s workspace directly even with query state', (kind) => {
  expect(resolveAppRoute({ pathname: `/${kind}`, search: '?mode=edit', hash: '' })).toBe(kind)
  expect(coreDestinations[kind]).toBe(`/${kind}`)
})

test.each([
  ['/workspace', '?tool=merge-pdf', '', 'workspace'],
  ['/workspace', '?tool=percentage-calc', '', 'calculate'],
  ['/workspace', '?tool=aspect-ratio', '', 'calculate'],
  ['/workspace', '?tool=loan-calc', '', 'calculate'],
  ['/', '', '#tool/bmi-calc', 'calculate'],
  ['/', '', '#tool/percentage-calc', 'calculate'],
  ['/', '?from=text&to=base64', '', 'workspace'],
  ['/', '', '#tool/text-to-qr', 'workspace'],
  ['/tools', '', '', 'catalog'],
  ['/privacy', '', '', 'legal:privacy'],
  ['/open-source', '', '', 'legal:openSource'],
  ['/', '', '', 'home'],
])('preserves existing route %s%s%s', (pathname, search, hash, expected) => {
  expect(resolveAppRoute({ pathname, search, hash })).toBe(expected)
})

test('calculator selection preserves specific links and bounds unknown identifiers', () => {
  expect(calculatorSelection({ search: '?calculator=pythagoras' })).toBe('pythagoras')
  expect(calculatorSelection({ search: '?tool=loan-calc' })).toBe('loan')
  expect(calculatorSelection({ hash: '#tool/bmi-calc' })).toBe('bmi')
  expect(calculatorSelection({ search: '?calculator=unknown' })).toBe('percent')
  expect(legacyCalculatorTool({ search: '?tool=loan-calc' })).toBe('loan-calc')
  expect(legacyCalculatorTool({ search: '?tool=reverse-text' })).toBeNull()
})
