import { useState } from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test } from 'vitest'
import ConvertPanel from './ConvertPanel'
import { renderWithProviders } from '../test/renderWithProviders'

const noop = () => {}
const LEGACY_FAV_PAIRS_KEY = 'convert-everything-fav-pairs'
const FAV_PAIRS_KEY = 'folkkit:favorites'
const uppercaseTool = {
  id: 'test-uppercase',
  name: 'Uppercase',
  description: 'Converts text to uppercase.',
  convert: (value) => ({ kind: 'text', text: value.toUpperCase() }),
}
const lowercaseTool = {
  id: 'test-lowercase',
  name: 'Lowercase',
  description: 'Converts text to lowercase.',
  convert: (value) => ({ kind: 'text', text: value.toLowerCase() }),
}

function panelProps(overrides = {}) {
  return {
    from: 'text',
    to: 'base64',
    onFromChange: noop,
    onToChange: noop,
    onConverterChange: noop,
    activeConverter: null,
    reuseRequest: null,
    ...overrides,
  }
}

beforeEach(() => {
  localStorage.clear()
})

function ReuseRoundTripHarness() {
  const [activeConverter, setActiveConverter] = useState(null)
  const [reuseRequest, setReuseRequest] = useState({ id: 1, value: 'from history' })

  return (
    <>
      <button onClick={() => setActiveConverter(uppercaseTool)}>Select tool</button>
      <button onClick={() => setActiveConverter(null)}>Return to formats</button>
      <ConvertPanel
        {...panelProps({ activeConverter, reuseRequest })}
        onReuseConsumed={(id) => {
          setReuseRequest(current => current?.id === id ? null : current)
        }}
      />
    </>
  )
}

test('does not reapply a consumed reuse request after returning from a tool', async () => {
  const user = userEvent.setup()
  renderWithProviders(<ReuseRoundTripHarness />)

  expect(screen.getByRole('textbox', { name: 'Eingabetext' })).toHaveValue('from history')
  await user.click(screen.getByRole('button', { name: 'Select tool' }))
  await user.click(screen.getByRole('button', { name: 'Return to formats' }))

  expect(screen.getByRole('textbox', { name: 'Eingabetext' })).toHaveValue('')
})

test('changing the selected tool clears the previous tool session input', async () => {
  const user = userEvent.setup()
  const view = renderWithProviders(<ConvertPanel {...panelProps({ activeConverter: uppercaseTool })} />)

  await user.type(screen.getByRole('textbox', { name: 'Werkzeugeingabe' }), 'Folkkit')
  view.rerender(<ConvertPanel {...panelProps({ activeConverter: lowercaseTool })} />)

  expect(screen.getByRole('textbox', { name: 'Werkzeugeingabe' })).toHaveValue('')
})

test('changing a format pair retains the current input', async () => {
  const user = userEvent.setup()
  const view = renderWithProviders(<ConvertPanel {...panelProps()} />)

  await user.type(screen.getByRole('textbox', { name: 'Eingabetext' }), 'Folkkit')
  view.rerender(<ConvertPanel {...panelProps({ to: 'base32' })} />)

  expect(screen.getByRole('textbox', { name: 'Eingabetext' })).toHaveValue('Folkkit')
})

test('keeps released HEX to RGB text while normalizing the native color preview to HEX', async () => {
  const user = userEvent.setup()
  renderWithProviders(<ConvertPanel {...panelProps({ from: 'color-hex', to: 'color-rgb' })} />)

  await user.type(screen.getByRole('textbox', { name: 'Eingabetext' }), '#ff0000')

  expect(await screen.findByRole('textbox', { name: 'Konvertierungsergebnis' })).toHaveValue('rgb(255, 0, 0)')
  expect(screen.getByLabelText('Farbvorschau')).toHaveValue('#ff0000')
})

test('a new reuse request applies its value once', async () => {
  const user = userEvent.setup()
  const view = renderWithProviders(<ConvertPanel {...panelProps()} />)
  const reuseRequest = { id: 1, value: 'from history' }

  view.rerender(<ConvertPanel {...panelProps({ reuseRequest })} />)
  expect(screen.getByRole('textbox', { name: 'Eingabetext' })).toHaveValue('from history')

  await user.type(screen.getByRole('textbox', { name: 'Eingabetext' }), '!')
  view.rerender(<ConvertPanel {...panelProps({ reuseRequest: { id: 1, value: 'ignored' } })} />)
  expect(screen.getByRole('textbox', { name: 'Eingabetext' })).toHaveValue('from history!')

  view.rerender(<ConvertPanel {...panelProps({ reuseRequest: { id: 2, value: 'second request' } })} />)
  expect(screen.getByRole('textbox', { name: 'Eingabetext' })).toHaveValue('second request')
})

test('removes hidden and unaudited persisted favourites before they can be selected', () => {
  localStorage.setItem(LEGACY_FAV_PAIRS_KEY, JSON.stringify([
    'petabytes→terabytes',
    'text→url',
    'text→base64',
  ]))

  renderWithProviders(<ConvertPanel {...panelProps()} />)

  expect(screen.queryByRole('button', { name: /Petabytes/ })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: /URL Encoded/ })).not.toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Text → Base64' })).toBeInTheDocument()
  expect(JSON.parse(localStorage.getItem(FAV_PAIRS_KEY))).toEqual(['text→base64'])
  expect(localStorage.getItem(LEGACY_FAV_PAIRS_KEY)).toBeNull()
})
