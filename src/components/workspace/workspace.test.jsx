import { useState } from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
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
