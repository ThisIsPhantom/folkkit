import { releasedFormatPairs } from './evidenceRegistry'

export const FORMAT_PAIR_COMPATIBILITY = Object.freeze({
  compatible: 'compatible',
  incompatibleImplemented: 'incompatible-but-implemented',
  unsupported: 'unsupported',
})

export function classifyFormatPairEntry(entry, { implementationExists = false, evidenceExists = false } = {}) {
  const pairKey = entry && typeof entry.from === 'string' && typeof entry.to === 'string'
    ? `${entry.from}→${entry.to}`
    : null
  if (!pairKey || !implementationExists || !evidenceExists) {
    return { status: FORMAT_PAIR_COMPATIBILITY.unsupported, pairKey }
  }
  if (entry.compatibility === FORMAT_PAIR_COMPATIBILITY.compatible) {
    return { status: FORMAT_PAIR_COMPATIBILITY.compatible, pairKey }
  }
  if (entry.compatibility === FORMAT_PAIR_COMPATIBILITY.incompatibleImplemented) {
    return { status: FORMAT_PAIR_COMPATIBILITY.incompatibleImplemented, pairKey }
  }
  return { status: FORMAT_PAIR_COMPATIBILITY.unsupported, pairKey }
}

export function getFormatPairPolicy(from, to) {
  const entry = releasedFormatPairs.find(pair => pair.from === from && pair.to === to) || null
  return classifyFormatPairEntry(entry, {
    implementationExists: typeof entry?.implementationEvidenceId === 'string' && entry.implementationEvidenceId.length > 0,
    evidenceExists: typeof entry?.evidenceId === 'string' && entry.evidenceId.length > 0,
  })
}

export function canExecuteFormatPair(policy, confirmedPairKey) {
  if (policy?.status === FORMAT_PAIR_COMPATIBILITY.compatible) return true
  return policy?.status === FORMAT_PAIR_COMPATIBILITY.incompatibleImplemented
    && typeof policy.pairKey === 'string'
    && confirmedPairKey === policy.pairKey
}
