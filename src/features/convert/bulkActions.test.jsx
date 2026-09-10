import { expect, test, vi } from 'vitest'
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react'
import { I18nContext } from '../../i18n/context.js'
import FileConverterPage from './FileConverterPage.jsx'
import messages from './messages.en.js'

vi.mock('./engine.js', () => ({ convertFileItem: vi.fn(async item => [{ name: `${item.file.name}.jpg`, blob: new Blob(['converted'], { type:'image/jpeg' }) }]), createZip: vi.fn() }))
const png = name => new File([Uint8Array.of(137,80,78,71,13,10,26,10)], name, { type:'image/png' })
function mount() {
  const t = (key, vars = {}) => {
    const message = key.split('.').slice(1).reduce((node,part) => node?.[part], messages) || key
    return String(message).replace(/\{(\w+)\}/g, (match,key) => vars[key] ?? match)
  }
  render(<I18nContext.Provider value={{ t,locale:'en' }}><FileConverterPage /></I18nContext.Provider>)
}

test('copies row settings on explicit request, preserves other formats and keeps the action focused', async () => {
  mount()
  fireEvent.change(screen.getByLabelText('Choose files'), { target:{ files:[png('one.png'),png('two.png'),png('other.png')] } })
  await waitFor(() => expect(screen.getAllByText('Ready')).toHaveLength(3))
  fireEvent.change(screen.getByLabelText('Output format: other.png'), { target:{ value:'webp' } })
  const first = screen.getByText('one.png').closest('li'), second = screen.getByText('two.png').closest('li'), other = screen.getByText('other.png').closest('li')
  fireEvent.click(within(first).getByText('Settings'))
  fireEvent.change(within(first).getByLabelText('Width (px)'), { target:{ value:'640' } })
  expect(within(second).getByLabelText('Width (px)')).toHaveValue(null)
  const apply = within(first).getByRole('button',{ name:'Apply to 1 other file' })
  apply.focus(); fireEvent.click(apply)
  expect(within(second).getByLabelText('Width (px)')).toHaveValue(640)
  expect(within(other).getByLabelText('Width (px)')).toHaveValue(null)
  expect(within(first).getByRole('status')).toHaveTextContent('Settings applied.')
  expect(apply).toHaveFocus()
  fireEvent.click(apply)
  expect(within(first).getByRole('status')).toHaveTextContent('The matching files already use these settings.')
  fireEvent.change(within(second).getByLabelText('Width (px)'), { target:{ value:'320' } })
  expect(within(first).queryByRole('status')).not.toBeInTheDocument()
  expect(screen.getAllByText('Ready')).toHaveLength(3)
})

test('removes only completed rows and focuses the remaining queue', async () => {
  mount()
  fireEvent.change(screen.getByLabelText('Choose files'), { target:{ files:[png('one.png'),png('two.png')] } })
  await waitFor(() => expect(screen.getAllByText('Ready')).toHaveLength(2))
  fireEvent.click(screen.getByRole('button',{ name:'Convert files' }))
  await waitFor(() => expect(screen.getAllByText('Done')).toHaveLength(2))
  fireEvent.change(screen.getByLabelText('Add files'), { target:{ files:[png('pending.png'),new File(['bad'],'unknown.txt')] } })
  await waitFor(() => expect(screen.getByText('Failed')).toBeVisible())
  fireEvent.click(screen.getByRole('button',{ name:'Remove completed' }))
  expect(screen.queryByText('one.png')).not.toBeInTheDocument(); expect(screen.queryByText('two.png')).not.toBeInTheDocument()
  expect(screen.getByText('pending.png')).toBeVisible(); expect(screen.getByText('unknown.txt')).toBeVisible()
  expect(screen.getByRole('heading',{ name:'Files 2' })).toHaveFocus()
  expect(screen.getByRole('button',{ name:'Remove completed' })).toBeDisabled()
})

test('removing the last completed row returns focus to the file picker', async () => {
  mount(); fireEvent.change(screen.getByLabelText('Choose files'),{ target:{ files:[png('one.png')] } })
  await waitFor(() => expect(screen.getByText('Ready')).toBeVisible())
  fireEvent.click(screen.getByRole('button',{ name:'Convert files' }))
  await waitFor(() => expect(screen.getByText('Done')).toBeVisible())
  fireEvent.click(screen.getByRole('button',{ name:'Remove completed' }))
  expect(screen.getByLabelText('Choose files')).toHaveFocus()
})
