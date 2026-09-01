import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { loadConverter } from '../converters/loadConverter'
import { renderWithProviders } from '../test/renderWithProviders'
import WorkspacePage from './WorkspacePage'

vi.mock('../converters/loadConverter', () => ({ loadConverter: vi.fn() }))

beforeEach(() => {
  history.replaceState(null, '', '/workspace?tool=audio-to-mp3')
  vi.mocked(loadConverter).mockReset()
  Object.defineProperty(navigator, 'onLine', { configurable: true, value: false })
})

afterEach(() => {
  Object.defineProperty(navigator, 'onLine', { configurable: true, value: true })
})

test('names an unavailable offline media module and retries the lazy import', async () => {
  vi.mocked(loadConverter)
    .mockRejectedValueOnce(new TypeError('Failed to fetch dynamically imported module'))
    .mockResolvedValueOnce({ id: 'audio-to-mp3', acceptsFile: true, isMediaConverter: true })

  renderWithProviders(<WorkspacePage />)

  expect(await screen.findByRole('alert')).toHaveTextContent('Das Medienmodul ist offline noch nicht verfügbar.')
  fireEvent.click(screen.getByRole('button', { name: 'Erneut versuchen' }))

  await waitFor(() => expect(loadConverter).toHaveBeenCalledTimes(2))
  expect(await screen.findByRole('button', { name: 'Datei auswählen' })).toBeVisible()
})
