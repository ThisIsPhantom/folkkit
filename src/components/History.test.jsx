import { beforeEach, expect, test } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import History from './History'
import { historyStore } from '../privacy/historyStore'
import { preferenceKeys } from '../privacy/preferences'
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
