import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { renderWithProviders } from '../test/renderWithProviders'
import KeyboardHelp from './KeyboardHelp'

test('renders the complete keyboard help in German with dialog semantics', async () => {
  const user = userEvent.setup()
  const onClose = vi.fn()
  renderWithProviders(<KeyboardHelp open onClose={onClose} />, { locale: 'de' })

  const dialog = screen.getByRole('dialog', { name: 'Tastaturkürzel' })
  expect(dialog).toHaveAttribute('aria-modal', 'true')
  expect(screen.getByText('Konvertierungsbereich')).toBeInTheDocument()
  expect(screen.getByText('Eingabefeld fokussieren')).toBeInTheDocument()
  expect(screen.getByText('Konvertierung zurücksetzen')).toBeInTheDocument()
  expect(screen.getByText('Zwischen hellem und dunklem Design wechseln')).toBeInTheDocument()
  expect(screen.queryByText('Keyboard Shortcuts')).not.toBeInTheDocument()

  const close = screen.getByRole('button', { name: 'Tastaturhilfe schliessen' })
  expect(close).toHaveFocus()
  await user.click(close)
  expect(onClose).toHaveBeenCalledTimes(1)
})

test('preserves the English keyboard help and closes it with Escape', () => {
  const onClose = vi.fn()
  renderWithProviders(<KeyboardHelp open onClose={onClose} />, { locale: 'en' })

  expect(screen.getByRole('dialog', { name: 'Keyboard Shortcuts' })).toBeInTheDocument()
  expect(screen.getByText('Convert Panel')).toBeInTheDocument()
  expect(screen.getByText('Reset conversion')).toBeInTheDocument()
  expect(screen.getByText('Toggle dark/light theme')).toBeInTheDocument()

  fireEvent.keyDown(window, { key: 'Escape' })
  expect(onClose).toHaveBeenCalledTimes(1)
})
