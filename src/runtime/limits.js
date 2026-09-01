export const MIB = 1024 * 1024
export const TEXT_LIMIT = 5 * MIB

function tiers(lowMemory, standard) {
  return Object.freeze({
    lowMemory: Object.freeze(lowMemory),
    standard: Object.freeze(standard),
  })
}

export const TOOL_LIMITS = Object.freeze({
  pdf: tiers(
    { perFile: 25 * MIB, total: 60 * MIB },
    { perFile: 100 * MIB, total: 250 * MIB },
  ),
  images: tiers(
    { perFile: 25 * MIB, total: 100 * MIB },
    { perFile: 80 * MIB, total: 300 * MIB },
  ),
  media: tiers(
    { perFile: 75 * MIB, total: null },
    { perFile: 250 * MIB, total: null },
  ),
})

const validationErrors = Object.freeze({
  unsupported_type: Object.freeze({ ok: false, code: 'unsupported_type', messageKey: 'errors.unsupportedType' }),
  too_large: Object.freeze({ ok: false, code: 'too_large', messageKey: 'errors.tooLarge' }),
})

export function isLowMemoryEnvironment(environment = globalThis) {
  const memory = Number(environment?.deviceMemory ?? environment?.navigator?.deviceMemory)
  const viewportWidth = Number(
    environment?.viewportWidth
      ?? environment?.innerWidth
      ?? environment?.document?.documentElement?.clientWidth,
  )
  return (Number.isFinite(memory) && memory <= 4)
    || (Number.isFinite(viewportWidth) && viewportWidth < 768)
}

export function getEnvironmentLimits(limits, environment = globalThis) {
  if (!limits) return null
  return isLowMemoryEnvironment(environment) ? limits.lowMemory : limits.standard
}

function acceptsFile(file, acceptTypes) {
  if (!acceptTypes || acceptTypes === '*') return true
  const mime = String(file.type || '').toLowerCase()
  const name = String(file.name || '').toLowerCase()
  return acceptTypes.split(',').some((rawToken) => {
    const token = rawToken.trim().toLowerCase()
    if (!token) return false
    if (token.startsWith('.')) return name.endsWith(token)
    if (token.endsWith('/*')) return mime.startsWith(token.slice(0, -1))
    return mime === token
  })
}

export function validateFiles(tool, files, environment = globalThis) {
  const selected = Array.from(files || [])
  if (selected.some((file) => !acceptsFile(file, tool?.acceptTypes))) {
    return validationErrors.unsupported_type
  }

  const limits = getEnvironmentLimits(tool?.limits, environment)
  if (!limits) return { ok: true }
  if (selected.some((file) => Number(file.size) > limits.perFile)) {
    return validationErrors.too_large
  }
  const total = selected.reduce((sum, file) => sum + Number(file.size || 0), 0)
  if (limits.total != null && total > limits.total) {
    return validationErrors.too_large
  }
  return { ok: true }
}
