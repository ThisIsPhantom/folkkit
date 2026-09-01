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
  evidenceId: 'tool:safe-tool',
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
    evidenceRegistry: [{
      evidenceId: 'tool:safe-tool',
      subjectKind: 'tool',
      subjectId: 'safe-tool',
      executor: 'tool-contract',
    }],
    evidenceRunResults: [{
      evidenceId: 'tool:safe-tool',
      executed: true,
      assertions: 1,
    }],
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

  it('reports a fabricated non-empty evidence ID', () => {
    const errors = run({ releaseCatalog: [{ ...released, evidenceId: 'tool:fabricated' }] })

    expect(errors).toContain('Missing evidence registry entry for released tool: safe-tool (tool:fabricated)')
  })

  it('reports duplicate and missing evidence registry entries', () => {
    const duplicate = {
      evidenceId: 'tool:safe-tool',
      subjectKind: 'tool',
      subjectId: 'safe-tool',
      executor: 'tool-contract',
    }

    expect(run({ evidenceRegistry: [duplicate, duplicate] })).toContain('Duplicate evidence registry ID: tool:safe-tool')
    expect(run({ evidenceRegistry: [] })).toContain('Missing evidence registry entry for released tool: safe-tool (tool:safe-tool)')
  })

  it('reports evidence fixtures that never run or make no assertions', () => {
    expect(run({
      evidenceRunResults: [{ evidenceId: 'tool:safe-tool', executed: false, assertions: 0 }],
    })).toContain('Evidence fixture did not run: tool:safe-tool')
    expect(run({
      evidenceRunResults: [{ evidenceId: 'tool:safe-tool', executed: true, assertions: 0 }],
    })).toContain('Evidence fixture has no assertions: tool:safe-tool')
  })

  it('reports an unexecutable evidence fixture', () => {
    expect(run({
      evidenceRunResults: [{ evidenceId: 'tool:safe-tool', executed: true, assertions: 0, error: 'missing executor' }],
    })).toContain('Unexecutable evidence fixture: tool:safe-tool')
  })

  it('reports an undocumented hidden tool', () => {
    const hidden = { id: 'safe-tool', module: 'text', category: 'encode', tier: 'hidden' }

    expect(run({ releaseCatalog: [hidden] })).toContain('Undocumented hidden tool: safe-tool')
  })
})
