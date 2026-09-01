import { beforeEach, expect, test, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { renderWithProviders } from './test/renderWithProviders'

const legalRoutes = [
  ['/privacy', 'Datenschutz'],
  ['/open-source', 'Open Source'],
  ['/licenses', 'Lizenzen'],
  ['/terms', 'Nutzungsbedingungen'],
  ['/contact', 'Kontakt'],
]

function setReducedMotion(matches) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn(() => ({ matches, addEventListener() {}, removeEventListener() {} })),
  })
}

beforeEach(() => {
  localStorage.clear()
  history.replaceState(null, '', '/')
  window.scrollTo = vi.fn()
  setReducedMotion(false)
})

test.each(legalRoutes)('%s renders its own pending legal surface instead of Home', (path, title) => {
  history.replaceState(null, '', path)
  renderWithProviders(<App />)

  expect(window.location.pathname).toBe(path)
  expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
  expect(screen.getByText('Diese Seite ist in diesem privaten Build noch nicht enthalten.')).toBeInTheDocument()
  expect(screen.queryByRole('heading', { name: 'Dateien bearbeiten, ohne sie hochzuladen.' })).not.toBeInTheDocument()
})

test.each([
  [true, 'auto'],
  [false, 'smooth'],
])('navigation uses %s reduced motion preference to select %s scrolling', async (reducedMotion, behavior) => {
  setReducedMotion(reducedMotion)
  const user = userEvent.setup()
  renderWithProviders(<App />)

  await user.click(screen.getByRole('link', { name: 'Werkzeuge' }))

  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior })
})

test('theme toggle keeps one German and English accessible name across light and dark states', async () => {
  const user = userEvent.setup()
  renderWithProviders(<App />)

  const germanToggle = screen.getByRole('button', { name: 'Dunkles Design' })
  expect(germanToggle).toHaveAttribute('aria-pressed', 'false')
  await user.click(germanToggle)
  expect(germanToggle).toHaveAttribute('aria-pressed', 'true')
  expect(germanToggle).toHaveAccessibleName('Dunkles Design')

  await user.click(screen.getByRole('button', { name: 'English' }))
  const englishToggle = screen.getByRole('button', { name: 'Dark theme' })
  expect(englishToggle).toHaveAttribute('aria-pressed', 'true')
  await user.click(englishToggle)
  expect(englishToggle).toHaveAttribute('aria-pressed', 'false')
  expect(englishToggle).toHaveAccessibleName('Dark theme')
})
