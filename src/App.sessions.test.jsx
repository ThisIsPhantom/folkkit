import { useState } from 'react'
import { act, fireEvent, screen } from '@testing-library/react'
import { beforeEach, expect, test, vi } from 'vitest'
import App from './App'
import { renderWithProviders } from './test/renderWithProviders'

vi.mock('./features/qr/QrDesignerPage.jsx', () => ({ default: function QrSession({ active }) {
  const [value, setValue] = useState('')
  return <section><h1>QR-Codes</h1><label>QR content<input value={value} onChange={e => setValue(e.target.value)} /></label><span data-testid="qr-active">{String(active)}</span></section>
} }))
vi.mock('./features/convert/FileConverterPage.jsx', () => ({ default: function ConverterSession() {
  const [value, setValue] = useState('')
  return <section><h1>Konvertieren</h1><label>Queue entry<input value={value} onChange={e => setValue(e.target.value)} /></label></section>
} }))

beforeEach(() => { localStorage.clear(); history.replaceState(null, '', '/qr'); window.scrollTo = vi.fn() })

test('keeps QR, converter and calculator inputs in memory across navigation and hides inactive controls', async () => {
  renderWithProviders(<App />)
  fireEvent.change(await screen.findByLabelText('QR content'), { target: { value: 'private QR payload' } })
  fireEvent.click(screen.getByRole('link', { name: 'Konvertieren', exact: true }))
  fireEvent.change(await screen.findByLabelText('Queue entry'), { target: { value: 'private queue file' } })
  expect(screen.queryByRole('textbox', { name: 'QR content' })).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('link', { name: 'Rechner', exact: true }))
  fireEvent.change(await screen.findByLabelText('Grundwert'), { target: { value: '480' } })
  fireEvent.click(screen.getByRole('link', { name: 'QR-Codes', exact: true }))
  expect(await screen.findByRole('textbox', { name: 'QR content' })).toHaveValue('private QR payload')
  expect(screen.getByTestId('qr-active')).toHaveTextContent('true')
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  fireEvent.click(screen.getByRole('link', { name: 'Konvertieren', exact: true }))
  expect(await screen.findByRole('textbox', { name: 'Queue entry' })).toHaveValue('private queue file')
  expect(screen.getByTestId('qr-active')).toHaveTextContent('false')
  act(() => { history.replaceState(null, '', '/calculate'); window.dispatchEvent(new PopStateEvent('popstate')) })
  expect(await screen.findByRole('textbox', { name: 'Grundwert' })).toHaveValue('480')
  expect(JSON.stringify({ ...localStorage })).not.toMatch(/private|480/)
})
