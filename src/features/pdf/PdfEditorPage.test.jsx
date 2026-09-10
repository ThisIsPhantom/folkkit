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


import { fireEvent } from '@testing-library/react'
vi.mock('./PdfCanvas.jsx', () => ({ default: () => null }))
vi.mock('./PdfThumbnail.jsx', () => ({ default: () => null }))

test('page navigation leaves the batch selection unchanged and range errors preserve it', async () => {
  const pages = Array.from({ length: 5 }, () => ({ width: 300, height: 220, rotation: 0 }))
  const worker = { open: vi.fn(async () => ({ pages, dirty: false })), checkpoint: vi.fn(async () => ({})), render: vi.fn(async () => null), objects: vi.fn(async () => []), dispose: vi.fn() }
  PdfWorkerClient.mockImplementation(function () { return worker })
  readPdfFile.mockResolvedValueOnce(new Uint8Array([1, 2, 3]))
  render(<PdfEditorPage fileRequest={{ id: 'navigation', file: new File(['pdf'], 'test.pdf') }} />)
  const number = await screen.findByRole('textbox', { name: 'studioPdf.pageNumber' })
  const range = screen.getByRole('textbox', { name: 'studioPdf.pageRange' })
  expect(number).toHaveValue('1')
  expect(range).toHaveValue('1')
  fireEvent.change(number, { target: { value: '4' } })
  fireEvent.submit(number.closest('form'))
  await waitFor(() => expect(worker.render).toHaveBeenLastCalledWith(3, expect.any(Object)))
  expect(range).toHaveValue('1')
  fireEvent.change(range, { target: { value: '5, 1–2' } })
  fireEvent.submit(range.closest('form'))
  expect(range).toHaveValue('1–2, 5')
  expect(screen.getAllByRole('checkbox').map(input => input.checked)).toEqual([true, true, false, false, true])
  fireEvent.change(range, { target: { value: '1-6' } })
  fireEvent.submit(range.closest('form'))
  expect(range).toHaveAttribute('aria-invalid', 'true')
  expect(screen.getAllByRole('checkbox').map(input => input.checked)).toEqual([true, true, false, false, true])
  fireEvent.click(screen.getAllByRole('checkbox')[2])
  expect(range).toHaveValue('1–3, 5')
  expect(range).not.toHaveAttribute('aria-invalid', 'true')
  fireEvent.click(screen.getAllByRole('checkbox')[2])
  expect(range).toHaveValue('1–2, 5')
  expect(range).not.toHaveAttribute('aria-invalid', 'true')
  fireEvent.change(number, { target: { value: '6' } })
  fireEvent.submit(number.closest('form'))
  expect(number).toHaveAttribute('aria-invalid', 'true')
  expect(worker.render).toHaveBeenLastCalledWith(3, expect.any(Object))
  fireEvent.click(screen.getByRole('button', { name: 'studioPdf.nextPage' }))
  expect(number).toHaveValue('5')
  expect(screen.getByRole('button', { name: 'studioPdf.nextPage' })).toBeDisabled()
})
