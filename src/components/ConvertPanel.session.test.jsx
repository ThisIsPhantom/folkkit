import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import ConvertPanel from './ConvertPanel'
import { renderWithProviders } from '../test/renderWithProviders'

const noop = () => {}
const uppercaseTool = {
  id: 'test-uppercase',
  name: 'Uppercase',
  description: 'Converts text to uppercase.',
  convert: (value) => value.toUpperCase(),
}
const lowercaseTool = {
  id: 'test-lowercase',
  name: 'Lowercase',
  description: 'Converts text to lowercase.',
  convert: (value) => value.toLowerCase(),
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

test('changing the selected tool clears the previous tool session input', async () => {
  const user = userEvent.setup()
  const view = renderWithProviders(<ConvertPanel {...panelProps({ activeConverter: uppercaseTool })} />)

  await user.type(screen.getByRole('textbox', { name: 'Tool input text' }), 'Folkkit')
  view.rerender(<ConvertPanel {...panelProps({ activeConverter: lowercaseTool })} />)

  expect(screen.getByRole('textbox', { name: 'Tool input text' })).toHaveValue('')
})

test('changing a format pair retains the current input', async () => {
  const user = userEvent.setup()
  const view = renderWithProviders(<ConvertPanel {...panelProps()} />)

  await user.type(screen.getByRole('textbox', { name: 'Input text' }), 'Folkkit')
  view.rerender(<ConvertPanel {...panelProps({ to: 'base32' })} />)

  expect(screen.getByRole('textbox', { name: 'Input text' })).toHaveValue('Folkkit')
})

test('a new reuse request applies its value once', async () => {
  const user = userEvent.setup()
  const view = renderWithProviders(<ConvertPanel {...panelProps()} />)
  const reuseRequest = { id: 1, value: 'from history' }

  view.rerender(<ConvertPanel {...panelProps({ reuseRequest })} />)
  expect(screen.getByRole('textbox', { name: 'Input text' })).toHaveValue('from history')

  await user.type(screen.getByRole('textbox', { name: 'Input text' }), '!')
  view.rerender(<ConvertPanel {...panelProps({ reuseRequest: { id: 1, value: 'ignored' } })} />)
  expect(screen.getByRole('textbox', { name: 'Input text' })).toHaveValue('from history!')

  view.rerender(<ConvertPanel {...panelProps({ reuseRequest: { id: 2, value: 'second request' } })} />)
  expect(screen.getByRole('textbox', { name: 'Input text' })).toHaveValue('second request')
})
