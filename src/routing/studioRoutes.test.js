import { expect, test } from 'vitest'
import { resolveAppRoute, coreDestinations, calculatorSelection, legacyCalculatorTool, legacyStudioHref, studioOptions, toolStudioHref } from './studioRoutes'

test.each(['qr', 'pdf', 'convert', 'calculate'])('opens the dedicated %s workspace directly even with query state', (kind) => {
  expect(resolveAppRoute({ pathname: `/${kind}`, search: '?mode=edit', hash: '' })).toBe(kind)
  expect(coreDestinations[kind]).toBe(`/${kind}`)
})

test.each([
  ['/workspace', '?tool=merge-pdf', '', 'pdf'],
  ['/workspace', '?tool=percentage-calc', '', 'calculate'],
  ['/workspace', '?tool=aspect-ratio', '', 'calculate'],
  ['/workspace', '?tool=loan-calc', '', 'calculate'],
  ['/', '', '#tool/bmi-calc', 'calculate'],
  ['/', '', '#tool/percentage-calc', 'calculate'],
  ['/', '?from=text&to=base64', '', 'workspace'],
  ['/', '', '#tool/text-to-qr', 'qr'],
  ['/tools', '', '', 'catalog'],
  ['/privacy', '', '', 'legal:privacy'],
  ['/open-source', '', '', 'legal:openSource'],
  ['/', '', '', 'home'],
])('preserves existing route %s%s%s', (pathname, search, hash, expected) => {
  expect(resolveAppRoute({ pathname, search, hash })).toBe(expected)
})

test.each([
  ['text-to-qr', '/qr'], ['qr-to-text', '/qr?mode=read'], ['merge-pdf', '/pdf?action=merge'], ['pdf-split', '/pdf?action=extract'],
  ['pdf-extract-range', '/pdf?action=extract'], ['pdf-rotate', '/pdf?action=rotate'], ['pdf-page-count', '/pdf?action=count'],
  ['images-to-pdf', '/convert?target=pdf&combine=1'], ['png-to-jpg', '/convert?target=jpeg'], ['jpg-to-png', '/convert?target=png'],
  ['audio-to-mp3', '/convert?target=mp3'],
])('routes old %s tools into the existing studio', (id, href) => {
  expect(toolStudioHref(id)).toBe(href)
  expect(legacyStudioHref({ pathname: '/workspace', search: `?tool=${id}` })).toBe(href)
  expect(legacyStudioHref({ pathname: '/', hash: `#tool/${id}` })).toBe(href)
})

test('retains specialist operations and ignores tool queries on explicit routes', () => {
  expect(toolStudioHref('text-to-pdf')).toBeNull()
  expect(toolStudioHref('pdf-metadata')).toBeNull()
  expect(legacyStudioHref({ pathname: '/privacy', search: '?tool=text-to-qr' })).toBeNull()
  expect(studioOptions('qr', { search: '?mode=read' })).toEqual({ mode: 'read' })
  expect(studioOptions('convert', { search: '?mode=optimize&target=php&combine=1' })).toEqual({ mode: 'optimize', target: undefined, combine: false })
  expect(studioOptions('pdf', { search: '?action=unknown' })).toEqual({ action: 'edit' })
  expect(calculatorSelection({ search: '?calculator=date' })).toBe('date')
  expect(calculatorSelection({ search: '?calculator=duration' })).toBe('duration')
})

test('calculator selection preserves specific links and bounds unknown identifiers', () => {
  expect(calculatorSelection({ search: '?calculator=pythagoras' })).toBe('pythagoras')
  expect(calculatorSelection({ search: '?tool=loan-calc' })).toBe('loan')
  expect(calculatorSelection({ hash: '#tool/bmi-calc' })).toBe('bmi')
  expect(calculatorSelection({ search: '?calculator=unknown' })).toBe('percent')
  expect(legacyCalculatorTool({ search: '?tool=loan-calc' })).toBe('loan-calc')
  expect(legacyCalculatorTool({ search: '?tool=reverse-text' })).toBeNull()
})
