import { beforeEach, expect, test, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import History from './History'
import { historyStore } from '../privacy/historyStore'
import { preferenceKeys, setContentHistory } from '../privacy/preferences'
import { renderWithProviders } from '../test/renderWithProviders'

beforeEach(() => {
  localStorage.clear()
})

test('allows keyboard opt-in before any content is persisted locally', async () => {
  const user = userEvent.setup()
  renderWithProviders(<History onSelect={() => {}} />)

  expect(screen.getByText('Local history is stored only in this browser after you enable it.')).toBeInTheDocument()
  const enableButton = screen.getByRole('button', { name: 'Enable local history' })
  enableButton.focus()
  await user.keyboard('{Enter}')

  expect(historyStore.isEnabled()).toBe(true)
  expect(localStorage.getItem(preferenceKeys.contentHistory)).toBeNull()
})

test('deletes persisted content and disables history through the keyboard', async () => {
  historyStore.setEnabled(true)
  historyStore.append({ from: 'text', to: 'base64', input: 'private input', output: 'cHJpdmF0ZSBpbnB1dA==', timestamp: 1 })
  const user = userEvent.setup()
  renderWithProviders(<History onSelect={() => {}} />)

  expect(screen.getByText('private input')).toBeInTheDocument()
  const deleteButton = screen.getByRole('button', { name: 'Delete history and disable' })
  deleteButton.focus()
  await user.keyboard('{Enter}')

  expect(historyStore.isEnabled()).toBe(false)
  expect(localStorage.getItem(preferenceKeys.contentHistory)).toBeNull()
  expect(screen.getByRole('button', { name: 'Enable local history' })).toBeInTheDocument()
})

test('removes hidden and unaudited pairs before history can select or expose them', () => {
  historyStore.setEnabled(true)
  setContentHistory([
    { from: 'petabytes', to: 'terabytes', input: 'private hidden input', output: 'hidden output', timestamp: 2 },
    { from: 'text', to: 'url', input: 'private unaudited input', output: 'unaudited output', timestamp: 1 },
  ])
  const onSelect = vi.fn()

  renderWithProviders(<History onSelect={onSelect} />)

  expect(screen.queryByText('private hidden input')).not.toBeInTheDocument()
  expect(screen.queryByText('private unaudited input')).not.toBeInTheDocument()
  expect(screen.getByText('No local history yet.')).toBeInTheDocument()
  expect(historyStore.list()).toEqual([])
  expect(onSelect).not.toHaveBeenCalled()
})
