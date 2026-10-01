import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { I18nProvider } from '../../i18n/I18nProvider'
import PollPage from './PollPage'
import axe from 'axe-core'

afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers() })

test('creates a poll with the selected retention period and explains deletion', async () => {
  const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: 'AbCdEf_123', adminToken: 'test-token' }) })
  vi.stubGlobal('fetch', fetcher)
  render(<I18nProvider><PollPage location={{ pathname: '/poll', hash: '' }} onNavigate={vi.fn()} /></I18nProvider>)
  expect(screen.getByLabelText('Gültigkeitsdauer')).toHaveValue('30')
  fireEvent.change(screen.getByLabelText('Gültigkeitsdauer'), { target: { value: '7' } })
  fireEvent.change(screen.getByLabelText('Titel'), { target: { value: 'Termin' } })
  fireEvent.change(screen.getByLabelText('Zeit oder Text für Option 1'), { target: { value: 'Morgen' } })
  fireEvent.click(screen.getByRole('button', { name: 'Umfrage erstellen' }))
  await waitFor(() => expect(fetcher).toHaveBeenCalledOnce())
  expect(JSON.parse(fetcher.mock.calls[0][1].body).retentionDays).toBe(7)
  expect(screen.getByText(/inklusive aller Antworten automatisch gelöscht/)).toBeInTheDocument()
})

test('shows the expiry date to participants and disables an expired page', async () => {
  vi.useFakeTimers()
  const expiresAt = Math.floor(Date.now() / 1000) + 2
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: 'AbCdEf_123', title: 'Termin', description: '', options: [{ date: '', label: 'Morgen' }], responses: [], expiresAt }) }))
  render(<I18nProvider><PollPage location={{ pathname: '/poll/AbCdEf_123', hash: '' }} onNavigate={vi.fn()} /></I18nProvider>)
  await act(async () => { await vi.advanceTimersByTimeAsync(0) })
  expect(screen.getByText(/Gültig bis/)).toBeInTheDocument()
  await act(async () => { await vi.advanceTimersByTimeAsync(2100) })
  expect(screen.getByRole('alert')).toHaveTextContent('abgelaufen')
  expect(screen.queryByRole('button', { name: 'Antwort senden' })).not.toBeInTheDocument()
  vi.useRealTimers()
})

test('English retention controls have accessible labels and deletion information', async () => {
  const { container } = render(<I18nProvider initialLocale="en"><PollPage location={{ pathname: '/poll', hash: '' }} onNavigate={vi.fn()} /></I18nProvider>)
  expect(screen.getByLabelText('Valid for')).toHaveValue('30')
  expect(screen.getByText(/automatically deleted with all answers/)).toBeVisible()
  const report = await axe.run(container, { rules: { 'color-contrast': { enabled: false }, region: { enabled: false } } })
  expect(report.violations.filter(item => ['serious', 'critical'].includes(item.impact))).toEqual([])
})

test('legacy polls remain open without a fabricated deadline', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: 'AbCdEf_123', title: 'Legacy', description: '', options: [{ date: '', label: 'A' }], responses: [], expiresAt: null }) }))
  render(<I18nProvider><PollPage location={{ pathname: '/poll/AbCdEf_123', hash: '' }} onNavigate={vi.fn()} /></I18nProvider>)
  await screen.findByRole('heading', { name: 'Legacy' })
  expect(screen.queryByText(/Gültig bis/)).not.toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Antwort senden' })).toBeEnabled()
})
