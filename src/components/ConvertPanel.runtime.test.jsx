import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'
import ConvertPanel from './ConvertPanel'
import { TOOL_LIMITS } from '../runtime/limits'
import { TEXT_LIMIT } from '../runtime/limits'
import { renderWithProviders } from '../test/renderWithProviders'

const noop = () => {}

function panelProps(activeConverter, overrides = {}) {
  return {
    from: 'text',
    to: 'base64',
    onFromChange: noop,
    onToChange: noop,
    onConverterChange: noop,
    activeConverter,
    reuseRequest: null,
    ...overrides,
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
    new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])], 'fixture.png', { type: 'image/png' }),
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
    new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])], 'fixture.png', { type: 'image/png' }),
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
      return { kind: 'text', text: value.toUpperCase() }
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

test('format conversion rejects text above five MiB before calling the converter', async () => {
  let conversionCalls = 0
  const resolveConvertFn = () => () => {
    conversionCalls += 1
    return 'must not run'
  }
  renderWithProviders(<ConvertPanel {...panelProps(null, { resolveConvertFn })} />)

  fireEvent.change(screen.getByRole('textbox', { name: 'Input text' }), {
    target: { value: 'x'.repeat(TEXT_LIMIT + 1) },
  })

  expect(await screen.findByRole('alert')).toHaveTextContent('Die ausgewählte Datei ist für dieses Gerät zu gross.')
  expect(conversionCalls).toBe(0)
  expect(screen.getByRole('textbox', { name: 'Conversion output' })).toHaveValue('')
})

test('format conversion maps thrown payloads to a stable localized error', async () => {
  const resolveConvertFn = () => () => {
    throw new Error('Alice private payload')
  }
  renderWithProviders(<ConvertPanel {...panelProps(null, { resolveConvertFn })} />)

  fireEvent.change(screen.getByRole('textbox', { name: 'Input text' }), {
    target: { value: 'private marker' },
  })

  const alert = await screen.findByRole('alert')
  expect(alert).toHaveTextContent('Die Verarbeitung ist fehlgeschlagen.')
  expect(document.body).not.toHaveTextContent('Alice private payload')
  expect(screen.getByRole('textbox', { name: 'Conversion output' })).toHaveValue('')
})

test('batch format conversion uses the same content-free runtime error boundary', async () => {
  const user = userEvent.setup()
  const resolveConvertFn = () => async (value) => {
    if (value === 'private marker') throw new Error('Alice batch payload')
    return value.toUpperCase()
  }
  renderWithProviders(<ConvertPanel {...panelProps(null, { resolveConvertFn })} />)
  await user.click(screen.getByTitle('Enable batch mode'))

  fireEvent.change(screen.getByRole('textbox', { name: 'Input text' }), {
    target: { value: 'safe\nprivate marker' },
  })

  expect(await screen.findByRole('alert')).toHaveTextContent('Die Verarbeitung ist fehlgeschlagen.')
  expect(document.body).not.toHaveTextContent('Alice batch payload')
  expect(screen.getByRole('textbox', { name: 'Conversion output' })).toHaveValue('')
})

test('a new format run aborts a slow prior run and its late result cannot overwrite output', async () => {
  let resolveSlow
  let slowSignal
  const slow = new Promise((resolve) => { resolveSlow = resolve })
  const resolveConvertFn = (_from, to) => {
    if (to === 'base64') {
      return async (_value, context) => {
        slowSignal = context.signal
        await slow
        return 'stale-output'
      }
    }
    return async () => 'fresh-output'
  }
  const view = renderWithProviders(<ConvertPanel {...panelProps(null, { resolveConvertFn })} />)
  fireEvent.change(screen.getByRole('textbox', { name: 'Input text' }), { target: { value: 'input' } })
  await waitFor(() => expect(slowSignal).toBeDefined())

  view.rerender(<ConvertPanel {...panelProps(null, { to: 'base32', resolveConvertFn })} />)

  await waitFor(() => expect(screen.getByRole('textbox', { name: 'Conversion output' })).toHaveValue('fresh-output'))
  expect(slowSignal.aborted).toBe(true)
  resolveSlow('stale-output')
  await Promise.resolve()
  expect(screen.getByRole('textbox', { name: 'Conversion output' })).toHaveValue('fresh-output')
})

test('emptying a text tool aborts active work and revokes its visible result', async () => {
  const user = userEvent.setup()
  const revoked = []
  let slowSignal
  let resolveSlow
  const slow = new Promise((resolve) => { resolveSlow = resolve })
  vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:text-tool-result')
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation((url) => revoked.push(url))
  const tool = {
    id: 'text-download-fixture',
    name: 'Text download fixture',
    description: 'test fixture',
    convert: async (value, context) => {
      if (value === 'slow') {
        slowSignal = context.signal
        await slow
      }
      return { kind: 'download', blob: new Blob([value]), filename: 'result.txt' }
    },
  }
  renderWithProviders(<ConvertPanel {...panelProps(tool)} />)
  const input = screen.getByRole('textbox', { name: 'Tool input text' })

  await user.type(input, 'ready')
  expect(await screen.findByRole('link', { name: 'Herunterladen' })).toHaveAttribute('href', 'blob:text-tool-result')
  const revokeCountBeforeClear = revoked.length
  await user.clear(input)
  expect(screen.queryByRole('link', { name: 'Herunterladen' })).not.toBeInTheDocument()
  expect(revoked.slice(revokeCountBeforeClear)).toEqual(['blob:text-tool-result'])

  await user.type(input, 'slow')
  await waitFor(() => expect(slowSignal).toBeDefined())
  await user.clear(input)
  expect(slowSignal.aborted).toBe(true)
  resolveSlow()
  await Promise.resolve()
  expect(screen.queryByRole('link', { name: 'Herunterladen' })).not.toBeInTheDocument()
})

test('Cancel clears native file selection so the same file starts a second run', async () => {
  const user = userEvent.setup()
  let executionCount = 0
  const tool = {
    id: 'same-file-fixture',
    name: 'Same file fixture',
    description: 'test fixture',
    acceptsFile: true,
    acceptTypes: 'image/*',
    isMediaConverter: true,
    limits: TOOL_LIMITS.images,
    fileConvert: async () => {
      executionCount += 1
      return new Promise(() => {})
    },
  }
  renderWithProviders(<ConvertPanel {...panelProps(tool)} />)
  const input = screen.getByLabelText('Datei auswählen')
  const file = new File([
    new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  ], 'same.png', { type: 'image/png' })

  await user.upload(input, file)
  await waitFor(() => expect(executionCount).toBe(1))
  await user.click(await screen.findByRole('button', { name: 'Abbrechen' }))
  expect(input).toHaveValue('')
  expect(screen.queryByText('same.png')).not.toBeInTheDocument()

  await user.upload(input, file)
  await waitFor(() => expect(executionCount).toBe(2))
  expect(await screen.findByRole('button', { name: 'Abbrechen' })).toBeVisible()
})
