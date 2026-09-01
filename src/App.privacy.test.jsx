import { beforeEach, expect, test } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { renderWithProviders } from './test/renderWithProviders'

beforeEach(() => {
  localStorage.clear()
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  })
})

test('ignores and does not rewrite the legacy tip preference', async () => {
  localStorage.setItem('convert-everything-tip-seen', 'legacy-value')
  const user = userEvent.setup()
  renderWithProviders(<App />)

  await user.click(screen.getByRole('button', { name: 'Dunkles Design' }))

  expect(localStorage.getItem('convert-everything-tip-seen')).toBe('legacy-value')
})
