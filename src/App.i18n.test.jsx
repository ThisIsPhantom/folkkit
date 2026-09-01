import { useI18n } from './i18n'
import { beforeEach, expect, test, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { renderWithProviders } from './test/renderWithProviders'

function EnglishSwitcher() {
  const { setLocale } = useI18n()
  return <button type="button" onClick={() => setLocale('en')}>Switch to English</button>
}

beforeEach(() => {
  localStorage.clear()
  localStorage.setItem('folkkit:locale', 'de')
  history.replaceState(null, '', '/?tool=text-to-qr')
  window.scrollTo = vi.fn()
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  })
})

test('keeps a selected core tool session and route stable while locale metadata changes', async () => {
  const user = userEvent.setup()
  renderWithProviders(<><App /><EnglishSwitcher /></>)

  const input = await screen.findByLabelText('Werkzeugeingabe')
  await user.type(input, 'https://folkkit.example')

  expect(screen.getByRole('heading', { name: 'Text in QR-Code' })).toBeInTheDocument()
  expect(screen.getByText('QR-Code aus Text oder einem Link erstellen')).toBeInTheDocument()
  expect(window.location.search).toBe('?tool=text-to-qr')

  await user.click(screen.getByRole('button', { name: 'Switch to English' }))

  expect(screen.getByRole('heading', { name: 'Text to QR code' })).toBeInTheDocument()
  expect(screen.getByText('Create a QR code from text or a link')).toBeInTheDocument()
  expect(screen.getByRole('textbox', { name: 'Tool input' })).toBe(input)
  expect(input).toHaveValue('https://folkkit.example')
  expect(window.location.search).toBe('?tool=text-to-qr')
})
