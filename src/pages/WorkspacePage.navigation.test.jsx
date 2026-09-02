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

test.each([
  ['de', 'Text in Base64 · Folkkit', 'Text lokal in Base64 umwandeln. Dateiinhalte werden nicht hochgeladen.'],
  ['en', 'Text to Base64 · Folkkit', 'Convert Text to Base64 locally in your browser. File contents are not uploaded.'],
])('localizes format-pair document metadata in %s', (locale, title, description) => {
  renderWithProviders(<WorkspacePage />, { locale })

  expect(document.title).toBe(title)
  expect(document.querySelector('meta[name="description"]')).toHaveAttribute('content', description)
  expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute('content', title)
  expect(document.querySelector('meta[property="og:description"]')).toHaveAttribute('content', description)
})

test('Escape closes keyboard help without leaving the active tool route', async () => {
  vi.mocked(loadConverter).mockResolvedValue({ id: 'text-to-qr', name: 'Text in QR-Code' })
  history.replaceState(null, '', '/workspace?tool=text-to-qr')
  renderWithProviders(<WorkspacePage />)

  document.activeElement?.blur()
  fireEvent.keyDown(window, { key: '?' })
  expect(screen.getByRole('dialog', { name: 'Tastaturkürzel' })).toBeInTheDocument()
  fireEvent.keyDown(window, { key: 'Escape' })

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(window.location.search).toBe('?tool=text-to-qr')
})

test('a format selection writes one authoritative pair URL with a valid target', async () => {
  const user = userEvent.setup()
  renderWithProviders(<WorkspacePage />)

  await user.click(screen.getByRole('button', { name: 'Eingabe auswählen: Text' }))
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

  await user.click(screen.getByRole('button', { name: 'Wiederverwenden' }))

  expect(window.location.search).toBe('?from=base64&to=text')
  expect(window.location.href).not.toContain('UFJJVkFURQ')
  expect(screen.getByRole('textbox', { name: 'Eingabetext' })).toHaveValue('UFJJVkFURQ==')
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
