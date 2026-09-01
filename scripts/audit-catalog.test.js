import { describe, expect, it } from 'vitest'
import { auditCatalogData } from './audit-catalog.mjs'

const released = {
  id: 'safe-tool',
  module: 'text',
  category: 'encode',
  tier: 'advanced',
  translationKey: 'safeTool',
  runtimeClass: 'main-thread',
  inputLimitClass: 'text-5-mib',
  outputNaming: 'inline-text',
  testName: 'safe tool fixture',
}

const messages = {
  tools: { safeTool: { name: 'Safe tool', description: 'Transforms a fixture.' } },
  categories: { encode: 'Encoding' },
}

function run(overrides = {}) {
  return auditCatalogData({
    rawConverters: [{ id: 'safe-tool', module: 'text', category: 'encode' }],
    rawFormats: [],
    releaseCatalog: [released],
    formatAuditCatalog: [],
    messagesDe: messages,
    messagesEn: messages,
    ...overrides,
  })
}

describe('catalog audit failures', () => {
  it('reports duplicate raw IDs', () => {
    const errors = run({
      rawConverters: [
        { id: 'safe-tool', module: 'text', category: 'encode' },
        { id: 'safe-tool', module: 'data', category: 'data' },
      ],
    })

    expect(errors).toContain('Duplicate raw converter ID: safe-tool')
  })

  it('reports missing German or English translations', () => {
    const errors = run({ messagesEn: { tools: {}, categories: { encode: 'Encoding' } } })

    expect(errors).toContain('Missing en name for released tool: safe-tool')
    expect(errors).toContain('Missing en description for released tool: safe-tool')
  })

  it('reports missing release evidence metadata', () => {
    const errors = run({ releaseCatalog: [{ ...released, testName: '' }] })

    expect(errors).toContain('Missing testName for released tool: safe-tool')
  })

  it('reports an undocumented hidden tool', () => {
    const hidden = { id: 'safe-tool', module: 'text', category: 'encode', tier: 'hidden' }

    expect(run({ releaseCatalog: [hidden] })).toContain('Undocumented hidden tool: safe-tool')
  })
})
