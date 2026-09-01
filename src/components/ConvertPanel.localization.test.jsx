import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'
import { findReleasedTool } from '../catalog/releaseCatalog'
import { renderWithProviders } from '../test/renderWithProviders'
import ConvertPanel from './ConvertPanel'

const noop = () => {}

function pairProps() {
  return {
    from: 'text',
    to: 'base64',
    onFromChange: noop,
    onToChange: noop,
    onConverterChange: noop,
    activeConverter: null,
    reuseRequest: null,
  }
}

afterEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

test.each([
  ['de', 'Eingabetext', 'Konvertierungsergebnis', 'Wert eingeben oder einfügen', 'Ergebnis erscheint hier', 'Formate tauschen', 'Stapelmodus aktivieren', 'Formatpaar zu Favoriten hinzufügen', 'Ergebnis kopieren', 'In Zwischenablage kopiert'],
  ['en', 'Input text', 'Conversion result', 'Enter or paste a value', 'The result will appear here', 'Swap formats', 'Enable batch mode', 'Add format pair to favourites', 'Copy result', 'Copied to clipboard'],
])('localizes released pair controls and copy feedback in %s', async (locale, inputLabel, outputLabel, inputPlaceholder, outputPlaceholder, swapLabel, batchLabel, favouriteLabel, copyLabel, toastText) => {
  const user = userEvent.setup()
  vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
  renderWithProviders(<ConvertPanel {...pairProps()} />, { locale })

  const input = screen.getByRole('textbox', { name: inputLabel })
  const output = screen.getByRole('textbox', { name: outputLabel })
  expect(input).toHaveAttribute('placeholder', inputPlaceholder)
  expect(output).toHaveAttribute('placeholder', outputPlaceholder)
  expect(screen.getByRole('button', { name: swapLabel })).toBeVisible()
  expect(screen.getByRole('button', { name: batchLabel })).toBeVisible()
  expect(screen.getByRole('button', { name: favouriteLabel })).toBeVisible()

  await user.type(input, 'Folkkit')
  await waitFor(() => expect(output).toHaveValue('Rm9sa2tpdA=='))
  await user.click(screen.getByRole('button', { name: copyLabel }))
  expect(await screen.findByText(toastText)).toBeVisible()
})

test.each([
  ['de', 'Werkzeugparameter', 'Seitennummer, zum Beispiel 1'],
  ['en', 'Tool parameters', 'Page number, for example 1'],
])('renders a released parameter placeholder in %s', (locale, label, placeholder) => {
  renderWithProviders(<ConvertPanel
    {...pairProps()}
    activeConverter={findReleasedTool('pdf-split', locale)}
  />, { locale })

  expect(screen.getByRole('textbox', { name: label })).toHaveAttribute('placeholder', placeholder)
})
