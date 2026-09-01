import { describe, expect, it } from 'vitest'
import { catalogEvidenceRegistry, toolEvidenceRegistry } from './evidenceRegistry'
import { evidenceRunErrors, runEvidenceRegistry } from './evidenceRunner'

describe('catalog evidence execution', () => {
  it('runs every registered fixture and records real assertions', async () => {
    const results = await runEvidenceRegistry()

    expect(results).toHaveLength(catalogEvidenceRegistry.length)
    for (const result of results) {
      expect(result.executed, `${result.evidenceId} never ran`).toBe(true)
      expect(result.error, `${result.evidenceId} was not executable`).toBeUndefined()
      expect(result.assertions, `${result.evidenceId} made no assertions`).toBeGreaterThan(0)
      const evidence = catalogEvidenceRegistry.find(item => item.evidenceId === result.evidenceId)
      if (evidence.executor !== 'browser-e2e') {
        expect(result.behaviorAssertions, `${result.evidenceId} made no behavioral assertions`).toBeGreaterThan(0)
      }
    }
  })

  it('marks an unknown executor as unexecutable rather than passing its name', async () => {
    const [result] = await runEvidenceRegistry([{
      evidenceId: 'tool:fake',
      subjectKind: 'tool',
      subjectId: 'fake',
      executor: 'fabricated-executor',
    }])

    expect(result).toMatchObject({
      evidenceId: 'tool:fake',
      executed: true,
      assertions: 0,
      error: 'Missing evidence executor: fabricated-executor',
    })
  })

  it('does not register mocked successful-decode evidence for the QR reader', () => {
    expect(toolEvidenceRegistry.find(evidence => evidence.subjectId === 'qr-to-text')).toBeUndefined()
  })

  it('rejects empty cases and metadata-only contracts as behavioral evidence', async () => {
    const dependencies = {
      getConvertFn: () => null,
      loadConverter: async id => ({ id, convert: () => ({ kind: 'text', text: 'unused' }) }),
    }
    const fixtures = [
      { evidenceId: 'tool:empty', subjectKind: 'tool', subjectId: 'empty', executor: 'tool-text-cases', cases: [] },
      { evidenceId: 'tool:metadata-only', subjectKind: 'tool', subjectId: 'metadata-only', executor: 'tool-contract', expectedMethod: 'convert' },
    ]
    const results = await runEvidenceRegistry(fixtures, dependencies)

    expect(evidenceRunErrors(fixtures, results)).toEqual([
      'Evidence fixture has no behavioral assertions: tool:empty',
      'Evidence fixture has no behavioral assertions: tool:metadata-only',
    ])
  })
})
