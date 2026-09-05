import { expect, test } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { I18nContext } from '../../i18n/context.js'
import FileConverterPage from './FileConverterPage.jsx'
import messages from './messages.en.js'
import germanMessages from './messages.de.js'

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

test('switches to image optimization, keeps selected files and compacts the add action', async () => {
  const t = key => key.split('.').slice(1).reduce((node, part) => node?.[part], messages) || key
  const changes = []
  const { rerender } = render(<I18nContext.Provider value={{ t, locale:'en' }}><FileConverterPage onModeChange={mode => changes.push(mode)} /></I18nContext.Provider>)
  const png = Uint8Array.of(137,80,78,71,13,10,26,10)
  fireEvent.change(screen.getByLabelText('Choose files'), { target:{ files:[new File([png],'tiny.png',{ type:'image/png' })] } })
  await waitFor(() => expect(screen.getByText('Ready')).toBeVisible())
  expect(screen.getByText('8 B')).toBeVisible()
  expect(screen.getByRole('button',{ name:'Convert files' })).toBeEnabled()
  fireEvent.click(screen.getByRole('button',{ name:'Make images smaller' }))
  expect(changes).toEqual(['optimize'])
  rerender(<I18nContext.Provider value={{ t, locale:'en' }}><FileConverterPage initialMode="optimize" onModeChange={mode => changes.push(mode)} /></I18nContext.Provider>)
  expect(screen.getByText('tiny.png')).toBeVisible()
  expect(screen.getByText('Add files')).toBeVisible()
  expect(screen.queryByText('Drop your files here')).not.toBeInTheDocument()
  expect(screen.queryByLabelText('Quality level')).not.toBeInTheDocument()
  fireEvent.click(screen.getByText('Settings'))
  expect(screen.getByLabelText('Maximum width (px)')).toBeVisible()
  rerender(<I18nContext.Provider value={{ t, locale:'en' }}><FileConverterPage initialMode="convert" initialTarget="webp" onModeChange={mode => changes.push(mode)} /></I18nContext.Provider>)
  expect(screen.getByText('tiny.png')).toBeVisible()
  expect(screen.getByLabelText('Output format: tiny.png')).toHaveValue('webp')
})

test('uses a compatible initial target for newly added files', async () => {
  const t = key => key.split('.').slice(1).reduce((node, part) => node?.[part], messages) || key
  render(<I18nContext.Provider value={{ t, locale:'en' }}><FileConverterPage initialTarget="pdf" initialCombine /></I18nContext.Provider>)
  const png = Uint8Array.of(137,80,78,71,13,10,26,10)
  fireEvent.change(screen.getByLabelText('Choose files'), { target:{ files:[new File([png],'one.png'),new File([png],'two.png')] } })
  await waitFor(() => expect(screen.getAllByText('Ready')).toHaveLength(2))
  expect(screen.getAllByRole('combobox',{ name:/Output format:/ }).map(control => control.value)).toEqual(['pdf','pdf'])
  expect(screen.getByLabelText('Combine images into one PDF in this order')).toBeChecked()
})

test('keeps incompatible files visible across local mode changes and preserves state while inactive', async () => {
  const t = key => key.split('.').slice(1).reduce((node,part) => node?.[part],messages) || key
  const { rerender } = render(<I18nContext.Provider value={{ t,locale:'en' }}><FileConverterPage initialMode="optimize" /></I18nContext.Provider>)
  const pdf = new File([new TextEncoder().encode('%PDF-1.7')],'document.pdf',{ type:'application/pdf' })
  fireEvent.change(screen.getByLabelText('Choose files'),{ target:{ files:[pdf] } })
  await waitFor(() => expect(screen.getByText('Not available in this mode')).toBeVisible())
  expect(screen.getByText('document.pdf')).toBeVisible()
  fireEvent.click(screen.getByRole('button',{ name:'Convert' }))
  await waitFor(() => expect(screen.getByText('Ready')).toBeVisible())
  expect(screen.getByText('document.pdf')).toBeVisible()
  rerender(<I18nContext.Provider value={{ t,locale:'en' }}><FileConverterPage initialMode="optimize" active={false} /></I18nContext.Provider>)
  expect(screen.getByRole('region',{ hidden:true })).not.toBeVisible()
  rerender(<I18nContext.Provider value={{ t,locale:'en' }}><FileConverterPage initialMode="optimize" active /></I18nContext.Provider>)
  expect(screen.getByText('document.pdf')).toBeVisible()
})

test('renders the image optimization workflow in German', async () => {
  const t = key => key.split('.').slice(1).reduce((node,part) => node?.[part],germanMessages) || key
  render(<I18nContext.Provider value={{ t,locale:'de' }}><FileConverterPage initialMode="optimize" /></I18nContext.Provider>)
  expect(screen.getByRole('heading',{ name:'Bilder verkleinern' })).toBeVisible()
  const jpeg = Uint8Array.of(255,216,255)
  fireEvent.change(screen.getByLabelText('Dateien auswählen'),{ target:{ files:[new File([jpeg],'bild.jpg',{ type:'image/jpeg' })] } })
  await waitFor(() => expect(screen.getByText('Bereit')).toBeVisible())
  fireEvent.click(screen.getByText('Einstellungen'))
  expect(screen.getByRole('combobox',{ name:'Qualitätsstufe' })).toHaveValue('balanced')
  expect(screen.getByRole('button',{ name:'Optimierung starten' })).toBeEnabled()
})

test('derives the common target from every row and applies it to compatible additions', async () => {
  const t = key => key.split('.').slice(1).reduce((node,part) => node?.[part],messages) || key
  const { rerender } = render(<I18nContext.Provider value={{ t,locale:'en' }}><FileConverterPage /></I18nContext.Provider>)
  const png = Uint8Array.of(137,80,78,71,13,10,26,10)
  fireEvent.change(screen.getByLabelText('Choose files'),{ target:{ files:[new File([png],'one.png')] } })
  await waitFor(() => expect(screen.getByText('Ready')).toBeVisible())
  fireEvent.change(screen.getByLabelText('Output for all files'),{ target:{ value:'pdf' } })
  fireEvent.change(screen.getByLabelText('Add files'),{ target:{ files:[new File([png],'two.png')] } })
  await waitFor(() => expect(screen.getAllByText('Ready')).toHaveLength(2))
  expect(screen.getAllByRole('combobox',{ name:/Output format:/ }).map(control => control.value)).toEqual(['pdf','pdf'])
  expect(screen.getByLabelText('Output for all files')).toHaveValue('pdf')

  rerender(<I18nContext.Provider value={{ t,locale:'en' }}><FileConverterPage initialTarget="webp" /></I18nContext.Provider>)
  await waitFor(() => expect(screen.getAllByRole('combobox',{ name:/Output format:/ }).every(control => control.value === 'webp')).toBe(true))
  expect(screen.getByLabelText('Output for all files')).toHaveValue('webp')
  rerender(<I18nContext.Provider value={{ t,locale:'en' }}><FileConverterPage initialTarget="" /></I18nContext.Provider>)
  await waitFor(() => expect(screen.getAllByRole('combobox',{ name:/Output format:/ }).every(control => control.value === 'jpeg')).toBe(true))
  expect(screen.getByLabelText('Output for all files')).toHaveValue('jpeg')
})
