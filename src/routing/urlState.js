import { getReleasedTargets, releasedFormats } from '../formats'

const DEFAULT_FROM = 'text'
const DEFAULT_TO = 'base64'

function readHashTool(hash) {
  const value = hash.replace(/^#/, '')
  return value.startsWith('tool/') ? value.slice(5) || null : null
}

export function readUrlState(search, hash) {
  const params = new URLSearchParams(search)
  const availableFromIds = releasedFormats
    .filter(format => getReleasedTargets(format.id).length > 0)
    .map(format => format.id)
  const requestedFrom = params.get('from')
  const from = availableFromIds.includes(requestedFrom) ? requestedFrom : DEFAULT_FROM
  const targets = getReleasedTargets(from)
  const requestedTo = params.get('to')
  const to = targets.includes(requestedTo) ? requestedTo : (targets[0] || DEFAULT_TO)
  const toolId = params.get('tool') || readHashTool(hash || '')

  return { from, to, toolId }
}

export function createWorkspaceHref({ from, to, toolId }, pathname = '/workspace') {
  const params = new URLSearchParams()
  if (typeof toolId === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(toolId)) {
    params.set('tool', toolId)
  } else if (getReleasedTargets(from).includes(to)) {
    params.set('from', from)
    params.set('to', to)
  } else {
    params.set('from', DEFAULT_FROM)
    params.set('to', DEFAULT_TO)
  }
  return `${pathname}?${params.toString()}`
}
