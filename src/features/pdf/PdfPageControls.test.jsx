import { expect, test, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { PdfPageNavigation, PdfPageSelection } from './PdfPageControls.jsx'

const t = key => key

test('revision and document changes discard drafts while retaining field focus', () => {
  const props = { pageCount: 8, pageIndex: 0, revision: 1, onNavigate: vi.fn(), t }
  const result = render(<PdfPageNavigation {...props} />)
  const input = screen.getByRole('textbox', { name: 'pageNumber' })
  input.focus()
  fireEvent.change(input, { target: { value: '9' } })
  fireEvent.submit(input.closest('form'))
  expect(input).toHaveAttribute('aria-invalid', 'true')
  result.rerender(<PdfPageNavigation {...props} revision={2} />)
  expect(input).toHaveValue('1')
  expect(input).toHaveFocus()
  expect(input).not.toHaveAttribute('aria-invalid', 'true')
  result.rerender(<PdfPageNavigation {...props} revision={3} pageIndex={7} />)
  fireEvent.change(input, { target: { value: '7' } })
  result.rerender(<PdfPageNavigation {...props} revision={4} pageCount={2} />)
  expect(input).toHaveValue('1')
  expect(input).toHaveFocus()
})

test('range controls reject empty and invalid input and ignore submissions while busy', () => {
  const props = { selectedPages: [0, 2], pageCount: 8, revision: 1, onSelect: vi.fn(), t }
  const result = render(<PdfPageSelection {...props} />)
  const input = screen.getByRole('textbox', { name: 'pageRange' })
  input.focus()
  fireEvent.change(input, { target: { value: '' } })
  expect(screen.getByRole('button', { name: 'applyPageRange' })).toBeDisabled()
  fireEvent.submit(input.closest('form'))
  expect(props.onSelect).not.toHaveBeenCalled()
  fireEvent.change(input, { target: { value: '1-8' } })
  result.rerender(<PdfPageSelection {...props} disabled />)
  expect(input).toBeDisabled()
  fireEvent.submit(input.closest('form'))
  expect(props.onSelect).not.toHaveBeenCalled()
  result.rerender(<PdfPageSelection {...props} revision={2} />)
  expect(input).toHaveValue('1, 3')
  expect(input).not.toHaveAttribute('aria-invalid', 'true')
  expect(input).toHaveFocus()
})

test('busy navigation cannot submit or step outside the document', () => {
  const onNavigate = vi.fn()
  render(<PdfPageNavigation pageIndex={0} pageCount={1} revision={1} disabled onNavigate={onNavigate} t={t} />)
  const input = screen.getByRole('textbox', { name: 'pageNumber' })
  for (const button of screen.getAllByRole('button')) expect(button).toBeDisabled()
  fireEvent.submit(input.closest('form'))
  expect(onNavigate).not.toHaveBeenCalled()
})
