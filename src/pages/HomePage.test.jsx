import { beforeEach, expect, test, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useI18n } from '../i18n'
import { renderWithProviders } from '../test/renderWithProviders'
import HomePage from './HomePage'

beforeEach(() => {
  localStorage.clear()
})

test('presents the three German core paths and sends stable selections', async () => {
  const user = userEvent.setup()
  const onOpenCore = vi.fn()
  renderWithProviders(<HomePage onOpenCore={onOpenCore} onOpenCatalog={vi.fn()} />)

  expect(screen.getByRole('heading', { name: 'Dateien bearbeiten, ohne sie hochzuladen.' })).toBeInTheDocument()
  expect(screen.getByText('Deine Dateien bleiben in diesem Browser.')).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: 'PDF bearbeiten' }))
  await user.click(screen.getByRole('button', { name: 'QR-Code erstellen' }))
  await user.click(screen.getByRole('button', { name: 'Datei konvertieren' }))

  expect(onOpenCore).toHaveBeenNthCalledWith(1, 'pdf')
  expect(onOpenCore).toHaveBeenNthCalledWith(2, 'qr')
  expect(onOpenCore).toHaveBeenNthCalledWith(3, 'convert')
})

test('renders English from the requested provider locale without storage setup', () => {
  function LocaleProbe() {
    const { locale } = useI18n()
    return <output>{locale}</output>
  }

  renderWithProviders(
    <>
      <HomePage onOpenCore={vi.fn()} onOpenCatalog={vi.fn()} />
      <LocaleProbe />
    </>,
    { locale: 'en' },
  )

  expect(screen.getByRole('heading', { name: 'Work with files without uploading them.' })).toBeInTheDocument()
  expect(screen.getByText('Your files stay in this browser.')).toBeInTheDocument()
  expect(screen.getByText('en')).toBeInTheDocument()
})
