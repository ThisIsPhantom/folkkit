import { beforeEach, describe, expect, test, vi } from 'vitest'
import { historyStore } from './historyStore'
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
  })

  test('does not rewrite stored content while consent is disabled', () => {
    const staleEntry = [{
      from: 'text',
      to: 'base64',
      input: 'private input',
      output: 'cHJpdmF0ZSBpbnB1dA==',
      timestamp: 100,
    }]
    localStorage.setItem(preferenceKeys.contentHistory, JSON.stringify(staleEntry))

    historyStore.remove(0)

    expect(localStorage.getItem(preferenceKeys.contentHistory)).toBe(JSON.stringify(staleEntry))
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
