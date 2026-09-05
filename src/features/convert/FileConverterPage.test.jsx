import { expect, test } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { I18nContext } from '../../i18n/context.js'
import FileConverterPage from './FileConverterPage.jsx'
import messages from './messages.en.js'

test('retains every selected file and waits for an explicit conversion click', async () => {
  const t = key => key.split('.').slice(1).reduce((node, part) => node?.[part], messages) || key
  render(<I18nContext.Provider value={{ t, locale: 'en' }}><FileConverterPage /></I18nContext.Provider>)
  const bytes = Uint8Array.of(137,80,78,71,13,10,26,10)
  fireEvent.change(screen.getByLabelText('Choose files'), { target: { files: [new File([bytes], 'one.png'), new File([bytes], 'two.png')] } })
  await waitFor(() => expect(screen.getAllByText('Ready')).toHaveLength(2))
  expect(screen.getByText('one.png')).toBeVisible()
  expect(screen.getByText('two.png')).toBeVisible()
  expect(screen.getByRole('button', { name: 'Convert files' })).toBeEnabled()
  expect(screen.queryByRole('button', { name: 'Download' })).not.toBeInTheDocument()
  expect(screen.getAllByLabelText('Width (px)')).toHaveLength(2)
  fireEvent.change(screen.getByLabelText('Output format: one.png'), { target: { value: 'pdf' } })
  expect(screen.getByLabelText('PDF page size')).toBeInTheDocument()
})
