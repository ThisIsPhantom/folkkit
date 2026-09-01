import { Buffer } from 'node:buffer'
import { describe, expect, it } from 'vitest'
import {
  browserEvidenceLinkErrors,
  browserEvidenceRegistry,
  browserEvidenceRunErrors,
  runBrowserEvidence,
} from './browserEvidence'

describe('shared browser evidence runners', () => {
  it('rejects a fabricated browser evidence ID', () => {
    expect(browserEvidenceLinkErrors([
      { evidenceId: 'tool:fabricated', executor: 'browser-e2e' },
    ])).toContain('Missing browser evidence runner: tool:fabricated')
  })

  it('rejects an uncalled or no-op browser runner', () => {
    const [claim] = browserEvidenceRegistry
    expect(browserEvidenceRunErrors([claim], [])).toContain(`Browser evidence runner was not called: ${claim.evidenceId}`)
    expect(browserEvidenceRunErrors([claim], [{
      evidenceId: claim.evidenceId,
      called: true,
      behaviorAssertions: 0,
      consumedClaims: [],
    }])).toContain(`Browser evidence runner made no behavioral assertions: ${claim.evidenceId}`)
  })

  it('rejects a configured claim that the runner did not consume', () => {
    const claim = browserEvidenceRegistry.find(item => item.evidenceId === 'tool:audio-to-mp3')
    expect(browserEvidenceRunErrors([claim], [{
      evidenceId: claim.evidenceId,
      called: true,
      behaviorAssertions: 1,
      consumedClaims: ['expectedFilename'],
    }])).toContain('Browser evidence claim was not consumed: tool:audio-to-mp3 (minimumBytes)')
  })

  it('uses the shared MP3 runner to consume minimum bytes and signature claims', () => {
    const result = runBrowserEvidence('tool:audio-to-mp3', {
      filename: 'network-private.mp3',
      bytes: Buffer.concat([Buffer.from('ID3'), Buffer.alloc(200)]),
      sameOriginOnly: true,
      leakFree: true,
    })

    expect(result.behaviorAssertions).toBeGreaterThanOrEqual(4)
    expect(result.consumedClaims).toEqual(expect.arrayContaining([
      'expectedFilename',
      'minimumBytes',
      'expectedSignature',
      'requireSameOrigin',
      'requireNoLeak',
    ]))
  })
})
