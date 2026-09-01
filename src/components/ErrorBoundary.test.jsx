import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'
import { renderWithProviders } from '../test/renderWithProviders'
import ErrorBoundary from './ErrorBoundary'

function Crash() {
  throw new Error('private crash details')
}

afterEach(() => {
  vi.restoreAllMocks()
})

test.each([
  ['de', 'Bei diesem Werkzeug ist ein Fehler aufgetreten.', 'Erneut versuchen'],
  ['en', 'Something went wrong with this tool.', 'Try again'],
])('localizes the content-free error fallback in %s', async (locale, message, retryLabel) => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
  const user = userEvent.setup()
  renderWithProviders(
    <ErrorBoundary><Crash /></ErrorBoundary>,
    { locale },
  )

  const alert = screen.getByRole('alert')
  expect(alert).toHaveTextContent(message)
  expect(alert).not.toHaveTextContent('private crash details')
  await user.click(screen.getByRole('button', { name: retryLabel }))
})
