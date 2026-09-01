import { useState } from 'react'
import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { renderWithProviders } from '../../test/renderWithProviders'
import FileDropZone from './FileDropZone'
import ProgressStatus from './ProgressStatus'
import ResultActions from './ResultActions'
import ErrorNotice from './ErrorNotice'

function DropZoneHarness() {
  const [files, setFiles] = useState([])
  return <FileDropZone accept="application/pdf,.pdf" multiple files={files} onFilesChange={setFiles} />
}

test('the drop zone owns selection state and exposes localized multi-file guidance', async () => {
  const user = userEvent.setup()
  renderWithProviders(<DropZoneHarness />)
  const first = new File(['%PDF-1.7'], 'eins.pdf', { type: 'application/pdf' })
  const second = new File(['%PDF-1.7'], 'zwei.pdf', { type: 'application/pdf' })

  await user.upload(screen.getByLabelText('PDF-Dateien auswählen'), [first, second])

  expect(screen.getByText('eins.pdf')).toBeVisible()
  expect(screen.getByText('zwei.pdf')).toBeVisible()
})

test('the visible file chooser is the keyboard focus target and opens the native input', async () => {
  const user = userEvent.setup()
  const inputClick = vi.spyOn(HTMLInputElement.prototype, 'click')
  renderWithProviders(<DropZoneHarness />)

  const chooseButton = screen.getByRole('button', { name: 'PDF-Dateien auswählen' })
  chooseButton.focus()
  expect(chooseButton).toHaveFocus()
  await user.keyboard('{Enter}')

  expect(inputClick).toHaveBeenCalledTimes(1)
  expect(document.querySelector('.drop-zone')).not.toHaveAttribute('role')
  inputClick.mockRestore()
})

test('renders only a bounded filename preview for excessive selections', () => {
  const files = Array.from({ length: 20 }, (_, index) => new File(['x'], `private-${index}.pdf`, { type: 'application/pdf' }))
  renderWithProviders(<DropZoneHarness />)
  fireEvent.change(screen.getByLabelText('PDF-Dateien auswählen'), { target: { files } })

  expect(screen.getAllByText(/private-\d+\.pdf/)).toHaveLength(8)
  expect(screen.getByText('12 weitere Dateien')).toBeVisible()
})

test('progress is announced and Cancel remains an actual action', async () => {
  const user = userEvent.setup()
  function Harness() {
    const [cancelled, setCancelled] = useState(false)
    return cancelled
      ? <p>cancelled</p>
      : <ProgressStatus progress={37} onCancel={() => setCancelled(true)} />
  }
  renderWithProviders(<Harness />)

  expect(screen.getByRole('status')).toHaveTextContent('37 %')
  await user.click(screen.getByRole('button', { name: 'Abbrechen' }))
  expect(screen.getByText('cancelled')).toBeVisible()
})

test('a stable error code is localized without rendering attached private details', () => {
  renderWithProviders(<ErrorNotice error={{
    code: 'invalid_file',
    messageKey: 'errors.invalidFile',
    filename: 'private-tax-return.pdf',
    payload: 'Alice private contents',
  }} />)

  const alert = screen.getByRole('alert')
  expect(alert).toHaveTextContent('Die Datei ist beschädigt oder ungültig.')
  expect(alert).not.toHaveTextContent('private-tax-return.pdf')
  expect(alert).not.toHaveTextContent('Alice private contents')
})

test('an unavailable FFmpeg core is named and exposes its retry action', async () => {
  const user = userEvent.setup()
  let retries = 0
  renderWithProviders(<ErrorNotice error={{ code: 'media_runtime_unavailable' }} onRetry={() => { retries += 1 }} />)

  expect(screen.getByRole('alert')).toHaveTextContent('FFmpeg-Core und WASM sind offline nicht verfügbar.')
  await user.click(screen.getByRole('button', { name: 'Erneut versuchen' }))
  expect(retries).toBe(1)
})

test('result actions expose the runtime-owned download and discard it through the owner', async () => {
  const user = userEvent.setup()
  function Harness() {
    const [record, setRecord] = useState({
      result: { kind: 'download', blob: new Blob(['result']), filename: 'result.txt' },
      url: 'blob:folkkit-result',
    })
    return record ? <ResultActions record={record} onDiscard={() => setRecord(null)} /> : <p>discarded</p>
  }
  renderWithProviders(<Harness />)

  expect(screen.getByRole('link', { name: 'Herunterladen' })).toHaveAttribute('download', 'result.txt')
  await user.click(screen.getByRole('button', { name: 'Verwerfen' }))
  expect(screen.getByText('discarded')).toBeVisible()
})
