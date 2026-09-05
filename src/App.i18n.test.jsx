import { useI18n } from './i18n'
import { beforeEach, expect, test, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { renderWithProviders } from './test/renderWithProviders'
import { findReleasedTool } from './catalog/releaseCatalog'

function EnglishSwitcher() {
  const { setLocale } = useI18n()
  return <button type="button" onClick={() => setLocale('en')}>Switch to English</button>
}

beforeEach(() => {
  localStorage.clear()
  localStorage.setItem('folkkit:locale', 'de')
  history.replaceState(null, '', '/?tool=char-count')
  window.scrollTo = vi.fn()
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  })
})

test('keeps a selected text tool session and route stable while locale metadata changes', async () => {
  const user = userEvent.setup()
  renderWithProviders(<><App /><EnglishSwitcher /></>)

  const input = await screen.findByLabelText('Werkzeugeingabe')
  await user.type(input, 'https://folkkit.example')

  expect(screen.getByRole('heading', { name: findReleasedTool('char-count', 'de').name })).toBeInTheDocument()
  expect(screen.getByText(findReleasedTool('char-count', 'de').description)).toBeInTheDocument()
  expect(window.location.search).toBe('?tool=char-count')

  await user.click(screen.getByRole('button', { name: 'Switch to English' }))

  expect(screen.getByRole('heading', { name: findReleasedTool('char-count', 'en').name })).toBeInTheDocument()
  expect(screen.getByText(findReleasedTool('char-count', 'en').description)).toBeInTheDocument()
  expect(screen.getByRole('textbox', { name: 'Tool input' })).toBe(input)
  expect(input).toHaveValue('https://folkkit.example')
  expect(window.location.search).toBe('?tool=char-count')
})
