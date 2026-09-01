import { describe, expect, it } from 'vitest'
import { formats, getConvertFn, getTargets } from '../formats'
import * as catalog from './releaseCatalog'

const requiredReleasedFields = [
  'category',
  'tier',
  'runtimeClass',
  'inputLimitClass',
  'outputNaming',
  'testName',
]

describe('full inherited catalog audit', () => {
  it('accounts for every raw converter and format ID', () => {
    expect(catalog.releaseCatalog).toHaveLength(499)
    expect(catalog.formatAuditCatalog).toHaveLength(223)
    expect(formats).toHaveLength(223)
  })

  it('gives every released entry the complete execution and evidence contract', () => {
    const released = [
      ...catalog.releaseCatalog,
      ...(catalog.formatAuditCatalog || []),
    ].filter((entry) => entry.tier !== 'hidden')

    expect(released.length).toBeGreaterThan(0)
    for (const entry of released) {
      for (const field of requiredReleasedFields) {
        expect(entry[field], `${entry.id} is missing ${field}`).toEqual(expect.any(String))
        expect(entry[field].trim(), `${entry.id} has empty ${field}`).not.toBe('')
      }
    }
  })

  it('documents a reason for every hidden converter', () => {
    for (const entry of catalog.releaseCatalog.filter((tool) => tool.tier === 'hidden')) {
      expect(entry.hiddenReason, `${entry.id} is undocumented`).toEqual(expect.any(String))
      expect(entry.hiddenReason.trim(), `${entry.id} has an empty reason`).not.toBe('')
    }
  })

  const formatFixtures = formats.map((format) => {
    const outgoing = getTargets(format.id)[0]
    if (outgoing) return { id: format.id, from: format.id, to: outgoing, input: format.placeholder || 'Folkkit' }
    const source = formats.find(candidate => getTargets(candidate.id).includes(format.id))
    return { id: format.id, from: source.id, to: format.id, input: source.placeholder || 'Folkkit' }
  })

  it.each(formatFixtures)('format graph fixture: $id', async ({ from, to, input }) => {
    const convert = getConvertFn(from, to)

    expect(convert).toEqual(expect.any(Function))
    const output = await convert(input)
    expect(typeof output === 'string' || typeof output === 'number').toBe(true)
    expect(String(output)).not.toBe('')
  })
})
