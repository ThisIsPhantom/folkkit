import { expect, test, vi } from 'vitest'
import { formatOption, parsePollLocation, pollRequest, tallyResponses } from './pollModel'

test('reads the poll id and an admin token from the link', () => {
  expect(parsePollLocation({ pathname: '/poll', hash: '' })).toEqual({ id: null, adminToken: null })
  expect(parsePollLocation({ pathname: '/poll/AbCdEf_123', hash: '' })).toEqual({ id: 'AbCdEf_123', adminToken: null })
  expect(parsePollLocation({ pathname: '/poll/AbCdEf_123', hash: '#admin=abcdefghijklmnopqrstuvwxyz012345' }))
    .toEqual({ id: 'AbCdEf_123', adminToken: 'abcdefghijklmnopqrstuvwxyz012345' })
  expect(parsePollLocation({ pathname: '/poll/short', hash: '' }).id).toBeNull()
  expect(parsePollLocation({ pathname: '/poll/AbCdEf_123', hash: '#admin=<x>' }).adminToken).toBeNull()
})

test('tallies answers and marks the best options', () => {
  const options = [{ date: '2026-10-10', label: '' }, { date: '', label: 'B' }, { date: '', label: 'C' }]
  const responses = [
    { answers: ['yes', 'maybe', 'no'] },
    { answers: ['yes', 'yes', 'no'] },
    { answers: ['no', 'yes', 'maybe'] },
  ]
  const { totals, best } = tallyResponses(options, responses)
  expect(totals).toEqual([{ yes: 2, maybe: 0, no: 1 }, { yes: 2, maybe: 1, no: 0 }, { yes: 0, maybe: 1, no: 2 }])
  expect(best).toEqual([1])
  expect(tallyResponses(options, []).best).toEqual([])
})

test('formats dates and labels together', () => {
  expect(formatOption({ date: '', label: '19:00' }, 'de')).toBe('19:00')
  expect(formatOption({ date: '2026-10-10', label: '19:00' }, 'en')).toMatch(/10 Oct 2026 · 19:00$/)
})

test('maps server and network errors to known codes', async () => {
  const offline = vi.fn().mockRejectedValue(new TypeError('offline'))
  await expect(pollRequest({ action: 'get' }, offline)).rejects.toMatchObject({ code: 'network' })
  const denied = vi.fn().mockResolvedValue({ ok: false, status: 401, json: async () => ({ error: 'passwordWrong' }) })
  await expect(pollRequest({ action: 'get' }, denied)).rejects.toMatchObject({ code: 'passwordWrong' })
  const odd = vi.fn().mockResolvedValue({ ok: false, status: 400, json: async () => ({ error: 'whatever' }) })
  await expect(pollRequest({ action: 'get' }, odd)).rejects.toMatchObject({ code: 'unknown' })
  const ok = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ id: 'x' }) })
  await expect(pollRequest({ action: 'get' }, ok)).resolves.toEqual({ id: 'x' })
  expect(ok.mock.calls[0][0]).toBe('/api/poll.php')
})
