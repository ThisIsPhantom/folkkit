import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'
import ConvertPanel from './ConvertPanel'
import { TOOL_LIMITS } from '../runtime/limits'
import { renderWithProviders } from '../test/renderWithProviders'

const noop = () => {}

function panelProps(activeConverter) {
  return {
    from: 'text',
    to: 'base64',
    onFromChange: noop,
    onToChange: noop,
    onConverterChange: noop,
    activeConverter,
    reuseRequest: null,
  }
}

afterEach(() => {
  vi.restoreAllMocks()
})

test('Cancel aborts active file work, terminates the converter, and keeps the input reusable', async () => {
  const user = userEvent.setup()
  let terminated = 0
  const tool = {
    id: 'slow-image',
    name: 'Slow image',
    description: 'test fixture',
    acceptsFile: true,
    acceptTypes: 'image/*',
    isMediaConverter: true,
    limits: TOOL_LIMITS.images,
    terminate: () => { terminated += 1 },
    fileConvert: () => new Promise(() => {}),
  }
  renderWithProviders(<ConvertPanel {...panelProps(tool)} />)

  await user.upload(
    screen.getByLabelText('Datei auswählen'),
    new File(['image'], 'fixture.png', { type: 'image/png' }),
  )
  await user.click(await screen.findByRole('button', { name: 'Abbrechen' }))

  expect(terminated).toBe(1)
  expect(screen.getByRole('alert')).toHaveTextContent('Der Vorgang wurde abgebrochen.')
  expect(screen.getByLabelText('Datei auswählen')).toBeEnabled()
})

test('the panel revokes its runtime-owned result URL on unmount', async () => {
  const user = userEvent.setup()
  const revokeObjectURL = vi.fn()
  vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:folkkit-download')
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(revokeObjectURL)
  const tool = {
    id: 'image-export',
    name: 'Image export',
    description: 'test fixture',
    acceptsFile: true,
    acceptTypes: 'image/*',
    isMediaConverter: true,
    limits: TOOL_LIMITS.images,
    fileConvert: async () => ({
      kind: 'download',
      blob: new Blob(['result'], { type: 'text/plain' }),
      filename: 'result.txt',
    }),
  }
  const view = renderWithProviders(<ConvertPanel {...panelProps(tool)} />)

  await user.upload(
    screen.getByLabelText('Datei auswählen'),
    new File(['image'], 'fixture.png', { type: 'image/png' }),
  )
  expect(await screen.findByRole('link', { name: 'Herunterladen' })).toHaveAttribute('href', 'blob:folkkit-download')
  view.unmount()

  await waitFor(() => expect(revokeObjectURL).toHaveBeenCalledWith('blob:folkkit-download'))
})

test('text-tool failures use the stable localized notice and a new input clears it', async () => {
  const user = userEvent.setup()
  const tool = {
    id: 'private-text-fixture',
    name: 'Private text fixture',
    description: 'test fixture',
    convert: async (value) => {
      if (value === 'bad') throw new Error('Alice private payload')
      return value.toUpperCase()
    },
  }
  renderWithProviders(<ConvertPanel {...panelProps(tool)} />)
  const input = screen.getByRole('textbox', { name: 'Tool input text' })

  await user.type(input, 'bad')
  expect(await screen.findByRole('alert')).toHaveTextContent('Die Verarbeitung ist fehlgeschlagen.')
  expect(screen.getByRole('alert')).not.toHaveTextContent('Alice private payload')

  await user.clear(input)
  await user.type(input, 'good')
  await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())
  expect(screen.getByRole('textbox', { name: 'Tool output text' })).toHaveValue('GOOD')
})
