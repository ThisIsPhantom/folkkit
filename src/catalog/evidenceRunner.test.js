import { describe, expect, it } from 'vitest'
import { catalogEvidenceRegistry } from './evidenceRegistry'
import { runEvidenceRegistry } from './evidenceRunner'

describe('catalog evidence execution', () => {
  it('runs every registered fixture and records real assertions', async () => {
    const results = await runEvidenceRegistry()

    expect(results).toHaveLength(catalogEvidenceRegistry.length)
    for (const result of results) {
      expect(result.executed, `${result.evidenceId} never ran`).toBe(true)
      expect(result.error, `${result.evidenceId} was not executable`).toBeUndefined()
      expect(result.assertions, `${result.evidenceId} made no assertions`).toBeGreaterThan(0)
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
})
