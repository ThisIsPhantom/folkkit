import { formats, getTargets } from '../formats'

const DEFAULT_FROM = 'text'
const DEFAULT_TO = 'base64'

function readHashTool(hash) {
  const value = hash.replace(/^#/, '')
  return value.startsWith('tool/') ? value.slice(5) || null : null
}

export function readUrlState(search, hash) {
  const params = new URLSearchParams(search)
  const availableFromIds = formats
    .filter(format => getTargets(format.id).length > 0)
    .map(format => format.id)
  const requestedFrom = params.get('from')
  const from = availableFromIds.includes(requestedFrom) ? requestedFrom : DEFAULT_FROM
  const targets = getTargets(from)
  const requestedTo = params.get('to')
  const to = targets.includes(requestedTo) ? requestedTo : (targets[0] || DEFAULT_TO)
  const toolId = params.get('tool') || readHashTool(hash || '')

  return { from, to, toolId }
}
