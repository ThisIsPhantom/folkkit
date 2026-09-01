const identityClaims = new Set(['evidenceId', 'subjectId', 'runnerId'])

export const browserEvidenceRegistry = Object.freeze([
  Object.freeze({
    evidenceId: 'tool:images-to-pdf',
    subjectId: 'images-to-pdf',
    runnerId: 'download',
    expectedFilename: 'combined.pdf',
    minimumBytes: 100,
    expectedSignature: 'pdf',
  }),
  Object.freeze({
    evidenceId: 'tool:png-to-jpg',
    subjectId: 'png-to-jpg',
    runnerId: 'download',
    expectedFilename: 'catalog-private.jpg',
    minimumBytes: 100,
    expectedSignature: 'jpeg',
  }),
  Object.freeze({
    evidenceId: 'tool:jpg-to-png',
    subjectId: 'jpg-to-png',
    runnerId: 'download',
    expectedFilename: 'catalog-private.png',
    minimumBytes: 60,
    expectedSignature: 'png',
  }),
  Object.freeze({
    evidenceId: 'tool:audio-to-mp3',
    subjectId: 'audio-to-mp3',
    runnerId: 'download',
    expectedFilename: 'network-private.mp3',
    minimumBytes: 100,
    expectedSignature: 'mp3',
    requireSameOrigin: true,
    requireNoLeak: true,
  }),
])

function startsWith(bytes, signature) {
  return signature.every((value, index) => bytes[index] === value)
}

function hasMpegFrame(bytes) {
  return bytes.some((byte, index) => (
    byte === 0xff
    && index + 1 < bytes.length
    && (bytes[index + 1] & 0xe0) === 0xe0
  ))
}

function hasSignature(bytes, signature) {
  if (signature === 'pdf') return startsWith(bytes, [0x25, 0x50, 0x44, 0x46])
  if (signature === 'jpeg') return startsWith(bytes, [0xff, 0xd8, 0xff])
  if (signature === 'png') return startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  if (signature === 'mp3') {
    return startsWith(bytes, [0x49, 0x44, 0x33]) || hasMpegFrame(bytes)
  }
  return false
}

function runDownloadEvidence(claim, observation) {
  const result = {
    evidenceId: claim.evidenceId,
    called: true,
    behaviorAssertions: 0,
    consumedClaims: [],
  }
  const behavior = (claimName, condition, message) => {
    result.consumedClaims.push(claimName)
    result.behaviorAssertions += 1
    if (!condition) throw new Error(message)
  }
  const bytes = observation?.bytes instanceof Uint8Array
    ? observation.bytes
    : new Uint8Array(observation?.bytes || [])

  behavior('expectedFilename', observation?.filename === claim.expectedFilename, `${claim.evidenceId} filename mismatch`)
  behavior('minimumBytes', bytes.length > claim.minimumBytes, `${claim.evidenceId} output is too small`)
  behavior('expectedSignature', hasSignature(bytes, claim.expectedSignature), `${claim.evidenceId} signature mismatch`)
  if (claim.requireSameOrigin) {
    behavior('requireSameOrigin', observation?.sameOriginOnly === true, `${claim.evidenceId} made a cross-origin request`)
  }
  if (claim.requireNoLeak) {
    behavior('requireNoLeak', observation?.leakFree === true, `${claim.evidenceId} leaked input data`)
  }
  return result
}
runDownloadEvidence.consumes = Object.freeze([
  'expectedFilename',
  'minimumBytes',
  'expectedSignature',
  'requireSameOrigin',
  'requireNoLeak',
])

export const browserEvidenceRunners = Object.freeze({
  download: runDownloadEvidence,
})

export function runBrowserEvidence(evidenceId, observation) {
  const claim = browserEvidenceRegistry.find(item => item.evidenceId === evidenceId)
  if (!claim) throw new Error(`Missing browser evidence claim: ${evidenceId}`)
  const runner = browserEvidenceRunners[claim.runnerId]
  if (typeof runner !== 'function') throw new Error(`Missing browser evidence runner: ${evidenceId}`)
  return runner(claim, observation)
}

export function browserEvidenceLinkErrors(evidenceEntries, claims = browserEvidenceRegistry, runners = browserEvidenceRunners) {
  const errors = []
  const claimById = new Map(claims.map(claim => [claim.evidenceId, claim]))
  for (const evidence of evidenceEntries.filter(entry => entry.executor === 'browser-e2e')) {
    const claim = claimById.get(evidence.evidenceId)
    if (!claim || claim.subjectId !== evidence.subjectId) {
      errors.push(`Missing browser evidence runner: ${evidence.evidenceId}`)
      continue
    }
    const runner = runners[claim.runnerId]
    if (typeof runner !== 'function') {
      errors.push(`Missing browser evidence runner: ${evidence.evidenceId}`)
      continue
    }
    const consumes = new Set(runner.consumes || [])
    for (const claimName of Object.keys(claim).filter(key => !identityClaims.has(key))) {
      if (!consumes.has(claimName)) {
        errors.push(`Browser evidence claim has no runner assertion: ${evidence.evidenceId} (${claimName})`)
      }
    }
  }
  return errors
}

export function browserEvidenceRunErrors(claims, results) {
  const errors = []
  const resultById = new Map(results.map(result => [result.evidenceId, result]))
  for (const claim of claims) {
    const result = resultById.get(claim.evidenceId)
    if (!result?.called) {
      errors.push(`Browser evidence runner was not called: ${claim.evidenceId}`)
      continue
    }
    if (!Number.isInteger(result.behaviorAssertions) || result.behaviorAssertions < 1) {
      errors.push(`Browser evidence runner made no behavioral assertions: ${claim.evidenceId}`)
      continue
    }
    const consumedClaims = new Set(result.consumedClaims || [])
    for (const claimName of Object.keys(claim).filter(key => !identityClaims.has(key))) {
      if (!consumedClaims.has(claimName)) {
        errors.push(`Browser evidence claim was not consumed: ${claim.evidenceId} (${claimName})`)
      }
    }
  }
  return errors
}
