import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { I18nContext } from '../../i18n/context.js'
import { translate } from '../../i18n/index.js'
import { renderWithProviders } from '../../test/renderWithProviders.jsx'
import ImageEditorPage from './ImageEditorPage.jsx'
import messagesDe from './messages.de.js'
import messagesEn from './messages.en.js'

function file(name = 'source.png') { return new File(['pixels'], name, { type: 'image/png' }) }
function loader(input) { return Promise.resolve({ file: input, kind: 'png', width: 300, height: 200, bitmap: { width: 300, height: 200, close: vi.fn() } }) }
function renderEditor(options = {}, locale = 'de', messages = messagesDe) {
  const t = (key, vars) => translate({ studioImage: messages }, key, vars)
  return renderWithProviders(
    <I18nContext.Provider value={{ locale, setLocale: vi.fn(), t }}>
      <ImageEditorPage loadFile={loader} renderPreview={async () => {}} exporter={async () => new Blob(['image'], { type: 'image/png' })} {...options} />
    </I18nContext.Provider>, { locale },
  )
}

describe('image editor page', () => {
  afterEach(() => vi.restoreAllMocks())

  it('offers a useful empty state and strict raster accept list in German and English', () => {
    renderEditor()
    expect(screen.getByRole('heading', { name: 'Bild bearbeiten' })).toBeVisible()
    expect(screen.getByLabelText('Bild auswählen')).toHaveAttribute('accept', 'image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp')
    expect(screen.getByText(/32 MiB/)).toBeVisible()
    renderEditor({}, 'en', messagesEn)
    expect(screen.getByRole('heading', { name: 'Edit image' })).toBeVisible()
  })

  it('loads a file, applies rotation, and exposes metadata-only undo and redo', async () => {
    renderEditor()
    fireEvent.change(screen.getByLabelText('Bild auswählen'), { target: { files: [file()] } })
    await screen.findByText('300 × 200 px')
    fireEvent.click(screen.getByRole('button', { name: '90° nach rechts drehen' }))
    expect(screen.getByText('200 × 300 px')).toBeVisible()
    fireEvent.click(screen.getByRole('button', { name: 'Rückgängig' }))
    expect(screen.getByText('300 × 200 px')).toBeVisible()
    fireEvent.click(screen.getByRole('button', { name: 'Wiederholen' }))
    expect(screen.getByText('200 × 300 px')).toBeVisible()
  })

  it('protects edited work from a fileRequest replacement and always consumes the handoff once', async () => {
    const consumed = vi.fn(), confirmDiscard = vi.fn(() => false)
    const result = renderEditor({ fileRequest: { id: 'first', file: file('first.png') }, onFileRequestConsumed: consumed, confirmDiscard })
    await screen.findByText('300 × 200 px')
    await waitFor(() => expect(consumed).toHaveBeenCalledWith('first'))
    fireEvent.click(screen.getByRole('button', { name: 'Horizontal spiegeln' }))
    result.rerender(
      <I18nContext.Provider value={{ locale: 'de', setLocale: vi.fn(), t: (key, vars) => translate({ studioImage: messagesDe }, key, vars) }}>
        <ImageEditorPage fileRequest={{ id: 'second', file: file('second.png') }} onFileRequestConsumed={consumed} confirmDiscard={confirmDiscard} loadFile={loader} renderPreview={async () => {}} exporter={async () => new Blob()} />
      </I18nContext.Provider>,
    )
    await waitFor(() => expect(consumed).toHaveBeenCalledWith('second'))
    expect(confirmDiscard).toHaveBeenCalledOnce()
    expect(screen.getByText('first.png')).toBeVisible()
  })

  it('adds and edits text with keyboard controls and applies a numeric crop explicitly', async () => {
    renderEditor()
    fireEvent.change(screen.getByLabelText('Bild auswählen'), { target: { files: [file()] } })
    await screen.findByText('300 × 200 px')
    fireEvent.change(screen.getByLabelText('Textinhalt'), { target: { value: 'Grüsse für Jörg' } })
    fireEvent.click(screen.getByRole('button', { name: 'Text hinzufügen' }))
    expect(screen.getByRole('button', { name: 'Text: Grüsse für Jörg' })).toBeVisible()
    fireEvent.change(screen.getByLabelText('Breite des Ausschnitts'), { target: { value: '120' } })
    fireEvent.change(screen.getByLabelText('Höhe des Ausschnitts'), { target: { value: '80' } })
    fireEvent.click(screen.getByRole('button', { name: 'Ausschnitt anwenden' }))
    expect(screen.getByText('120 × 80 px')).toBeVisible()
  })
})
