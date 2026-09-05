import { expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import PdfEditorPage from './PdfEditorPage.jsx'
vi.mock('../../i18n/index.js', () => ({ useI18n: () => ({ t: key => key }) }))
test.each(['edit', 'merge', 'extract', 'rotate', 'count', 'organize'])('initialAction %s explains the chosen action before import', initialAction => {
  render(<PdfEditorPage initialAction={initialAction} />)
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(`studioPdf.actions.${initialAction}.title`)
  expect(screen.getByText(`studioPdf.actions.${initialAction}.before`)).toBeVisible()
})
import { StrictMode } from 'react'
import { waitFor } from '@testing-library/react'
import { readPdfFile } from './pdfFiles.js'
vi.mock('./pdfFiles.js', () => ({ readPdfFile: vi.fn(() => new Promise(() => {})), readPdfImage: vi.fn(), downloadPdf: vi.fn() }))
test('file handoff is read and consumed once under StrictMode', async () => {
  const consumed = vi.fn(), request = { id: 'drop-1', file: new File(['%PDF-'], 'dropped.pdf', { type: 'application/pdf' }) }
  const result = render(<StrictMode><PdfEditorPage fileRequest={request} onFileRequestConsumed={consumed} /></StrictMode>)
  await waitFor(() => expect(consumed).toHaveBeenCalledExactlyOnceWith('drop-1'))
  expect(readPdfFile).toHaveBeenCalledExactlyOnceWith(request.file)
  result.rerender(<StrictMode><PdfEditorPage fileRequest={request} onFileRequestConsumed={consumed} /></StrictMode>)
  expect(consumed).toHaveBeenCalledTimes(1)
})
import { act } from '@testing-library/react'
import { PdfWorkerClient } from './pdfClient.js'
vi.mock('./pdfClient.js', () => ({ PdfWorkerClient: vi.fn() }))
test('unmount during a handed-off file read prevents a late worker', async () => {
  let release
  readPdfFile.mockImplementationOnce(() => new Promise(resolve => { release = resolve }))
  const consumed = vi.fn(), request = { id: 'drop-unmount', file: new File(['%PDF-'], 'dropped.pdf') }
  const result = render(<PdfEditorPage fileRequest={request} onFileRequestConsumed={consumed} />)
  await waitFor(() => expect(consumed).toHaveBeenCalledWith('drop-unmount'))
  result.unmount()
  await act(async () => release(new Uint8Array([1, 2, 3])))
  expect(PdfWorkerClient).not.toHaveBeenCalled()
})
