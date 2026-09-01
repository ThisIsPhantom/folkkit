import { expect, test } from 'vitest'
import { createWorkerRequest, isWorkerEvent, isWorkerRequest } from './workerProtocol'

test('accepts only the explicit worker command and event protocol', () => {
  expect(createWorkerRequest('run-1', 'convert', { toolId: 'merge-pdf' })).toEqual({
    id: 'run-1',
    command: 'convert',
    payload: { toolId: 'merge-pdf' },
  })
  expect(isWorkerRequest({ id: 'run-2', command: 'cancel' })).toBe(true)
  expect(isWorkerRequest({ id: 'run-3', command: 'eval', payload: {} })).toBe(false)
  expect(isWorkerRequest({ id: 'run-4', command: 'convert', payload: [] })).toBe(false)
  expect(isWorkerEvent({ id: 'run-1', event: 'progress', progress: 50 })).toBe(true)
  expect(isWorkerEvent({ id: 'run-1', event: 'console', payload: 'private' })).toBe(false)
})
