import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test, vi } from 'vitest'
import { loadConverter } from '../converters/loadConverter'
import { renderWithProviders } from '../test/renderWithProviders'
import WorkspacePage from './WorkspacePage'

vi.mock('../converters/loadConverter', () => ({ loadConverter: vi.fn() }))

beforeEach(() => {
  localStorage.clear()
  history.replaceState(null, '', '/workspace?from=text&to=base64')
  vi.mocked(loadConverter).mockReset()
  Element.prototype.scrollIntoView = vi.fn()
  window.scrollTo = vi.fn()
})

test('normalizes the initial workspace URL to content-free identifiers', () => {
  history.replaceState(null, '', '/workspace?from=text&to=base64&input=PRIVATE&output=PRIVATE-RESULT')

  renderWithProviders(<WorkspacePage />)

  expect(window.location.pathname + window.location.search).toBe('/workspace?from=text&to=base64')
  expect(window.location.href).not.toContain('PRIVATE')
})

test('a format selection writes one authoritative pair URL with a valid target', async () => {
  const user = userEvent.setup()
  renderWithProviders(<WorkspacePage />)

  await user.click(screen.getByRole('button', { name: 'Text' }))
  const picker = document.querySelector('.tool-picker')
  await user.click(within(picker).getByText('Base64'))

  expect(window.location.search).toBe('?from=base64&to=text')
})

test('history reuse updates the pair URL without placing reused content in it', async () => {
  localStorage.setItem('folkkit:history-enabled', 'true')
  localStorage.setItem('folkkit:content-history', JSON.stringify([{
    from: 'base64',
    to: 'text',
    input: 'UFJJVkFURQ==',
    output: 'PRIVATE',
    timestamp: Date.now(),
  }]))
  const user = userEvent.setup()
  renderWithProviders(<WorkspacePage />)

  await user.click(screen.getByRole('button', { name: 'Reuse' }))

  expect(window.location.search).toBe('?from=base64&to=text')
  expect(window.location.href).not.toContain('UFJJVkFURQ')
  expect(screen.getByRole('textbox', { name: 'Input text' })).toHaveValue('UFJJVkFURQ==')
})

test.each([
  ['image/png', 'photo.png', 'png-to-jpg'],
  ['image/jpeg', 'photo.jpg', 'jpg-to-png'],
])('routes a global %s drop to its released opposite-format converter', async (type, name, toolId) => {
  vi.mocked(loadConverter).mockResolvedValue({ id: toolId, acceptsFile: true })
  renderWithProviders(<WorkspacePage />)

  fireEvent.drop(document, { dataTransfer: { files: [new File(['fixture'], name, { type })] } })

  await waitFor(() => expect(window.location.search).toBe(`?tool=${toolId}`))
  expect(loadConverter).toHaveBeenCalledWith(toolId)
})

test.each([
  ['de', 'image/svg+xml', 'graphic.svg', 'Dieser Dateityp kann hier nicht automatisch geöffnet werden. Wähle ein freigegebenes Werkzeug.'],
  ['en', 'video/mp4', 'clip.mp4', 'This file type cannot be opened automatically here. Choose a released tool.'],
])('shows an honest localized unsupported state for a global %s drop', async (locale, type, name, message) => {
  renderWithProviders(<WorkspacePage />, { locale })

  fireEvent.drop(document, { dataTransfer: { files: [new File(['fixture'], name, { type })] } })

  expect(await screen.findByRole('alert')).toHaveTextContent(message)
  expect(window.location.search).toBe('?from=text&to=base64')
  expect(loadConverter).not.toHaveBeenCalled()
})
