import { expect, test, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../test/renderWithProviders'
import Header from './Header'

test('core tools have direct navigation and current-page feedback', () => {
  renderWithProviders(<Header route="pdf" locale="de" onNavigate={vi.fn()} onLocaleChange={vi.fn()} theme="light" onThemeToggle={vi.fn()} />)
  const nav = within(screen.getByRole('navigation', { name: 'Hauptnavigation' }))
  expect(nav.getByRole('link', { name: 'QR-Codes' })).toHaveAttribute('href', '/qr')
  expect(nav.getByRole('link', { name: 'PDF' })).toHaveAttribute('aria-current', 'page')
  expect(nav.getByRole('link', { name: 'Konvertieren' })).toHaveAttribute('href', '/convert')
  expect(nav.getByRole('link', { name: 'Rechner' })).toHaveAttribute('href', '/calculate')
})

test('mobile navigation closes after selecting a tool and Escape', async () => {
  const user = userEvent.setup()
  const navigate = vi.fn()
  renderWithProviders(<Header route="home" locale="de" onNavigate={navigate} onLocaleChange={vi.fn()} theme="light" onThemeToggle={vi.fn()} />)
  await user.click(screen.getByRole('button', { name: 'Menü öffnen' }))
  const nav = within(screen.getByRole('navigation', { name: 'Mobile Navigation' }))
  await user.click(nav.getByRole('link', { name: 'PDF' }))
  expect(navigate).toHaveBeenCalledWith('/pdf')
  expect(screen.queryByRole('navigation', { name: 'Mobile Navigation' })).not.toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Menü öffnen' }))
  await user.keyboard('{Escape}')
  expect(screen.queryByRole('navigation', { name: 'Mobile Navigation' })).not.toBeInTheDocument()
})
