import { describe, expect, it } from 'vitest'
import { formats, getConvertFn, releasedFormats } from '../formats'
import { formatEvidenceRegistry } from './evidenceRegistry'
import * as catalog from './releaseCatalog'

const requiredReleasedFields = [
  'category',
  'tier',
  'runtimeClass',
  'inputLimitClass',
  'outputNaming',
  'evidenceId',
]

describe('full inherited catalog audit', () => {
  it('accounts for every raw converter and only independently evidenced formats', () => {
    expect(catalog.releaseCatalog).toHaveLength(499)
    expect(formats).toHaveLength(223)
    expect(catalog.formatAuditCatalog).toHaveLength(223)
    expect(catalog.formatAuditCatalog.filter(entry => entry.tier !== 'hidden')).toHaveLength(18)
    expect(releasedFormats).toHaveLength(18)
  })

  it('gives every released entry the complete execution and evidence contract', () => {
    const released = [
      ...catalog.releaseCatalog,
      ...catalog.formatAuditCatalog,
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

  it('maps every exposed format to one explicit independent evidence fixture', () => {
    const evidenceById = new Map(formatEvidenceRegistry.map(evidence => [evidence.evidenceId, evidence]))
    expect(evidenceById.size).toBe(formatEvidenceRegistry.length)

    for (const entry of catalog.formatAuditCatalog.filter(item => item.tier !== 'hidden')) {
      const evidence = evidenceById.get(entry.evidenceId)
      expect(evidence, `missing evidence for ${entry.id}`).toMatchObject({
        formatId: entry.id,
        from: expect.any(String),
        to: expect.any(String),
        input: expect.any(String),
        expected: expect.any(String),
        inputLimitClass: entry.inputLimitClass,
      })
    }
  })

  it.each(formatEvidenceRegistry)('$evidenceId executes the literal real edge', async (evidence) => {
    const convert = getConvertFn(evidence.from, evidence.to)

    expect(convert).toEqual(expect.any(Function))
    const output = String(await convert(evidence.input))
    expect(output).toBe(evidence.expected)
    expect(output).not.toMatch(/^\([^\n]*\)$/)
  })
})
