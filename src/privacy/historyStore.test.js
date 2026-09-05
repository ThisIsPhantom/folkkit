import { beforeEach, describe, expect, test, vi } from 'vitest'
import { historyStore, initializeHistoryPrivacy } from './historyStore'
import { preferenceKeys } from './preferences'

beforeEach(() => {
  localStorage.clear()
})

describe('historyStore', () => {
  test('starts disabled without any persisted content', () => {
    expect(historyStore.isEnabled()).toBe(false)
    expect(historyStore.list()).toEqual([])
    expect(localStorage.getItem(preferenceKeys.contentHistory)).toBeNull()
  })

  test('does not persist a conversion while consent is disabled', () => {
    historyStore.append({
      from: 'text',
      to: 'base64',
      input: 'private input',
      output: 'cHJpdmF0ZSBpbnB1dA==',
      timestamp: 100,
    })

    expect(historyStore.list()).toEqual([])
    expect(localStorage.getItem(preferenceKeys.contentHistory)).toBeNull()
  })

  test('does not expose stale content without consent', () => {
    localStorage.setItem(preferenceKeys.contentHistory, JSON.stringify([{
      from: 'text',
      to: 'base64',
      input: 'private input',
      output: 'cHJpdmF0ZSBpbnB1dA==',
      timestamp: 100,
    }]))

    expect(historyStore.list()).toEqual([])
    expect(localStorage.getItem(preferenceKeys.contentHistory)).toBeNull()
  })

  test('purges current and legacy content during disabled startup access', () => {
    const staleEntry = [{
      from: 'text',
      to: 'base64',
      input: 'private input',
      output: 'cHJpdmF0ZSBpbnB1dA==',
      timestamp: 100,
    }]
    localStorage.setItem(preferenceKeys.contentHistory, JSON.stringify(staleEntry))
    localStorage.setItem('convert-everything-history', JSON.stringify([{ input: 'legacy secret' }]))

    historyStore.remove(0)

    expect(localStorage.getItem(preferenceKeys.contentHistory)).toBeNull()
    expect(localStorage.getItem('convert-everything-history')).toBeNull()
  })

  test.each(['false', 'corrupted', '{"enabled":true}'])('purges stale content for invalid consent value %s', (consent) => {
    localStorage.setItem(preferenceKeys.historyEnabled, consent)
    localStorage.setItem(preferenceKeys.contentHistory, JSON.stringify([{ input: 'private input' }]))
    localStorage.setItem('convert-everything-history', JSON.stringify([{ input: 'legacy secret' }]))

    expect(historyStore.isEnabled()).toBe(false)
    expect(localStorage.getItem(preferenceKeys.historyEnabled)).toBeNull()
    expect(localStorage.getItem(preferenceKeys.contentHistory)).toBeNull()
    expect(localStorage.getItem('convert-everything-history')).toBeNull()
  })

  test('enabling history starts empty after stale content was found', () => {
    localStorage.setItem(preferenceKeys.contentHistory, JSON.stringify([{
      from: 'text', to: 'base64', input: 'private input', output: 'cHJpdmF0ZQ==', timestamp: 100,
    }]))
    localStorage.setItem('convert-everything-history', JSON.stringify([{ input: 'legacy secret' }]))

    historyStore.setEnabled(true)

    expect(historyStore.isEnabled()).toBe(true)
    expect(historyStore.list()).toEqual([])
    expect(localStorage.getItem(preferenceKeys.contentHistory)).toBeNull()
    expect(localStorage.getItem('convert-everything-history')).toBeNull()
  })

  test('persists a sanitized bounded preview only after explicit consent', () => {
    historyStore.setEnabled(true)
    const longInput = 'a'.repeat(121)
    const longOutput = 'b'.repeat(121)

    historyStore.append({
      from: 'text',
      to: 'base64',
      input: longInput,
      output: longOutput,
      timestamp: 123,
      privateMetadata: 'must not persist',
    })

    expect(historyStore.isEnabled()).toBe(true)
    expect(historyStore.list()).toEqual([{
      from: 'text',
      to: 'base64',
      input: 'a'.repeat(120),
      output: 'b'.repeat(120),
      timestamp: 123,
    }])
  })

  test('keeps the 30 most recent entries', () => {
    historyStore.setEnabled(true)
    for (let index = 0; index < 31; index += 1) {
      historyStore.append({
        from: 'text',
        to: 'base64',
        input: `input-${index}`,
        output: `output-${index}`,
        timestamp: index,
      })
    }

    const entries = historyStore.list()
    expect(entries).toHaveLength(30)
    expect(entries[0].input).toBe('input-30')
    expect(entries.at(-1).input).toBe('input-1')
  })

  test('removes one entry without exposing a mutable stored list', () => {
    historyStore.setEnabled(true)
    historyStore.append({ from: 'text', to: 'base64', input: 'first', output: 'Zmlyc3Q=', timestamp: 1 })
    historyStore.append({ from: 'text', to: 'base64', input: 'second', output: 'c2Vjb25k', timestamp: 2 })

    const listedEntries = historyStore.list()
    listedEntries.pop()
    historyStore.remove(0)

    expect(historyStore.list()).toEqual([{
      from: 'text',
      to: 'base64',
      input: 'first',
      output: 'Zmlyc3Q=',
      timestamp: 1,
    }])
  })

  test('recovers safely from malformed stored JSON', () => {
    localStorage.setItem(preferenceKeys.historyEnabled, 'true')
    localStorage.setItem(preferenceKeys.contentHistory, '{not-json')

    expect(historyStore.isEnabled()).toBe(true)
    expect(historyStore.list()).toEqual([])
    expect(localStorage.getItem(preferenceKeys.contentHistory)).toBe('[]')
  })

  test('rewrites non-canonical history once with bounded fields only', () => {
    localStorage.setItem(preferenceKeys.historyEnabled, 'true')
    localStorage.setItem(preferenceKeys.contentHistory, JSON.stringify([
      {
        from: 'text',
        to: 'base64',
        input: 'a'.repeat(140),
        output: 'b'.repeat(140),
        timestamp: 123,
        privateMetadata: 'must be removed',
      },
      { from: 'hidden', to: 'hidden', input: 'private', output: 'private', timestamp: 122 },
    ]))
    const setItem = vi.spyOn(Storage.prototype, 'setItem')

    expect(historyStore.list()).toEqual([{
      from: 'text',
      to: 'base64',
      input: 'a'.repeat(120),
      output: 'b'.repeat(120),
      timestamp: 123,
    }])
    expect(localStorage.getItem(preferenceKeys.contentHistory)).toBe(JSON.stringify([{
      from: 'text',
      to: 'base64',
      input: 'a'.repeat(120),
      output: 'b'.repeat(120),
      timestamp: 123,
    }]))
    const firstWriteCount = setItem.mock.calls.filter(([key]) => key === preferenceKeys.contentHistory).length
    expect(firstWriteCount).toBe(1)

    historyStore.list()
    expect(setItem.mock.calls.filter(([key]) => key === preferenceKeys.contentHistory)).toHaveLength(firstWriteCount)
    setItem.mockRestore()
  })

  test('clears content and revokes consent when requested', () => {
    const listener = vi.fn()
    window.addEventListener('folkkit:history-change', listener)
    historyStore.setEnabled(true)
    historyStore.append({ from: 'text', to: 'base64', input: 'secret', output: 'c2VjcmV0', timestamp: 1 })
    localStorage.setItem('convert-everything-history', JSON.stringify([{ input: 'legacy secret' }]))

    historyStore.clear({ revokeConsent: true })

    expect(historyStore.isEnabled()).toBe(false)
    expect(historyStore.list()).toEqual([])
    expect(localStorage.getItem(preferenceKeys.historyEnabled)).toBeNull()
    expect(localStorage.getItem(preferenceKeys.contentHistory)).toBeNull()
    expect(localStorage.getItem('convert-everything-history')).toBeNull()
    expect(listener).toHaveBeenCalled()
    window.removeEventListener('folkkit:history-change', listener)
  })

  test('deleting consent immediately removes previously stored content', () => {
    historyStore.setEnabled(true)
    historyStore.append({ from: 'text', to: 'base64', input: 'secret', output: 'c2VjcmV0', timestamp: 1 })
    localStorage.setItem('convert-everything-history', JSON.stringify([{ input: 'legacy secret' }]))

    historyStore.setEnabled(false)

    expect(historyStore.isEnabled()).toBe(false)
    expect(historyStore.list()).toEqual([])
    expect(localStorage.getItem(preferenceKeys.contentHistory)).toBeNull()
    expect(localStorage.getItem('convert-everything-history')).toBeNull()
  })
})


test('startup privacy cleanup preserves an explicitly enabled history', () => {
  localStorage.clear()
  localStorage.setItem(preferenceKeys.historyEnabled, 'true')
  localStorage.setItem(preferenceKeys.contentHistory, '[{"input":"approved fixture"}]')
  expect(initializeHistoryPrivacy()).toBe(true)
  expect(localStorage.getItem(preferenceKeys.contentHistory)).toBe('[{"input":"approved fixture"}]')
})

test('startup reports unavailable browser storage without crashing the file studios', () => {
  const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new DOMException('Blocked', 'SecurityError') })
  try { expect(initializeHistoryPrivacy()).toBe(false) }
  finally { getItem.mockRestore() }
})
