export const WORKER_COMMANDS = Object.freeze(['convert', 'cancel', 'status'])
export const WORKER_EVENTS = Object.freeze(['progress', 'result', 'error', 'cancelled'])

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export function isWorkerRequest(value) {
  return isRecord(value)
    && typeof value.id === 'string'
    && WORKER_COMMANDS.includes(value.command)
    && (value.payload === undefined || isRecord(value.payload))
}

export function isWorkerEvent(value) {
  return isRecord(value)
    && typeof value.id === 'string'
    && WORKER_EVENTS.includes(value.event)
}

export function createWorkerRequest(id, command, payload) {
  const request = { id, command, ...(payload === undefined ? {} : { payload }) }
  if (!isWorkerRequest(request)) throw new TypeError('invalid_worker_request')
  return Object.freeze(request)
}
