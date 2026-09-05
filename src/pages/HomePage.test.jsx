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

  expect(screen.getByRole('heading', { name: 'Was möchtest du machen?' })).toBeInTheDocument()
  expect(screen.queryByText('Lokal verarbeitet')).not.toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: 'PDF bearbeiten' }))
  await user.click(screen.getByRole('button', { name: 'QR-Code erstellen' }))
  await user.click(screen.getByRole('button', { name: 'Datei konvertieren' }))
  await user.click(screen.getByRole('button', { name: /Rechner & Einheiten/ }))

  expect(onOpenCore).toHaveBeenNthCalledWith(1, 'pdf')
  expect(onOpenCore).toHaveBeenNthCalledWith(2, 'qr')
  expect(onOpenCore).toHaveBeenNthCalledWith(3, 'convert')
  expect(onOpenCore).toHaveBeenNthCalledWith(4, 'calculate')
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

  expect(screen.getByRole('heading', { name: 'What would you like to do?' })).toBeInTheDocument()
  expect(screen.queryByText('Processed locally')).not.toBeInTheDocument()
  expect(screen.getByText('en')).toBeInTheDocument()
})
