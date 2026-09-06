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
function deferred() {
  let resolve
  const promise = new Promise(next => { resolve = next })
  return { promise, resolve }
}
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

  it('cancels only the active export busy state and ignores its late result after reuse', async () => {
    const exports = []
    const exporter = vi.fn(() => {
      const pending = deferred(); exports.push(pending); return pending.promise
    })
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    renderEditor({ exporter })
    fireEvent.change(screen.getByLabelText('Bild auswählen'), { target: { files: [file()] } })
    await screen.findByText('300 × 200 px')
    fireEvent.click(screen.getByRole('button', { name: 'PNG herunterladen' }))
    expect(await screen.findByRole('status')).toHaveTextContent('Bild wird exportiert')
    fireEvent.click(screen.getByRole('button', { name: 'Abbrechen' }))
    await waitFor(() => expect(screen.queryByText('Bild wird exportiert …')).not.toBeInTheDocument())
    const download = screen.getByRole('button', { name: 'PNG herunterladen' })
    expect(download).toBeEnabled()

    fireEvent.click(download)
    exports[0].resolve(new Blob(['late'], { type: 'image/png' }))
    await Promise.resolve()
    expect(screen.getByText('Bild wird exportiert …')).toBeVisible()
    exports[1].resolve(new Blob(['current'], { type: 'image/png' }))
    await waitFor(() => expect(download).toBeEnabled())
    expect(exporter).toHaveBeenCalledTimes(2)
  })

  it('ends an active export when hidden and permits a new export after return', async () => {
    const first = deferred(), exporter = vi.fn().mockReturnValueOnce(first.promise).mockResolvedValueOnce(new Blob(['next'], { type: 'image/png' }))
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    const result = renderEditor({ active: true, exporter })
    fireEvent.change(screen.getByLabelText('Bild auswählen'), { target: { files: [file()] } })
    await screen.findByText('300 × 200 px')
    fireEvent.click(screen.getByRole('button', { name: 'PNG herunterladen' }))
    result.rerender(<I18nContext.Provider value={{ locale: 'de', setLocale: vi.fn(), t: (key, vars) => translate({ studioImage: messagesDe }, key, vars) }}><ImageEditorPage active={false} loadFile={loader} renderPreview={async () => {}} exporter={exporter} /></I18nContext.Provider>)
    await waitFor(() => expect(screen.queryByText('Bild wird exportiert …')).not.toBeInTheDocument())
    result.rerender(<I18nContext.Provider value={{ locale: 'de', setLocale: vi.fn(), t: (key, vars) => translate({ studioImage: messagesDe }, key, vars) }}><ImageEditorPage active loadFile={loader} renderPreview={async () => {}} exporter={exporter} /></I18nContext.Provider>)
    fireEvent.click(screen.getByRole('button', { name: 'PNG herunterladen' }))
    await waitFor(() => expect(exporter).toHaveBeenCalledTimes(2))
    first.resolve(new Blob(['late'], { type: 'image/png' }))
  })

  it('invalidates a delayed watermark on reset and closes an injected decoded bitmap', async () => {
    const pending = deferred(), close = vi.fn()
    const loadFile = vi.fn((input, options) => options.role === 'watermark' ? pending.promise : loader(input))
    renderEditor({ loadFile })
    fireEvent.change(screen.getByLabelText('Bild auswählen'), { target: { files: [file()] } })
    await screen.findByText('300 × 200 px')
    fireEvent.change(screen.getByLabelText('Wasserzeichen hinzufügen'), { target: { files: [file('mark.png')] } })
    fireEvent.click(screen.getByRole('button', { name: 'Zurücksetzen' }))
    pending.resolve({ file: file('mark.png'), kind: 'png', width: 60, height: 30, bitmap: { close } })
    await waitFor(() => expect(close).toHaveBeenCalledOnce())
    expect(screen.queryByRole('button', { name: 'Wasserzeichen: mark.png' })).not.toBeInTheDocument()
  })

  it('adds a delayed watermark to the latest rotated state without losing newer work', async () => {
    const pending = deferred()
    const loadFile = vi.fn((input, options) => options.role === 'watermark' ? pending.promise : loader(input))
    renderEditor({ loadFile })
    fireEvent.change(screen.getByLabelText('Bild auswählen'), { target: { files: [file()] } })
    await screen.findByText('300 × 200 px')
    fireEvent.change(screen.getByLabelText('Wasserzeichen hinzufügen'), { target: { files: [file('mark.png')] } })
    fireEvent.click(screen.getByRole('button', { name: '90° nach rechts drehen' }))
    pending.resolve({ file: file('mark.png'), kind: 'png', width: 60, height: 30 })
    expect(await screen.findByRole('button', { name: 'Wasserzeichen: mark.png' })).toBeVisible()
    expect(screen.getByText('200 × 300 px')).toBeVisible()
  })

  it('commits one opacity or colour gesture and restores cancelled drafts', async () => {
    renderEditor()
    fireEvent.change(screen.getByLabelText('Bild auswählen'), { target: { files: [file()] } })
    await screen.findByText('300 × 200 px')
    fireEvent.change(screen.getByLabelText('Textinhalt'), { target: { value: 'Gesture' } })
    fireEvent.click(screen.getByRole('button', { name: 'Text hinzufügen' }))
    const opacity = screen.getByLabelText('Deckkraft')
    fireEvent.pointerDown(opacity, { pointerId: 1, button: 0, isPrimary: true })
    for (const value of ['90', '60', '39']) fireEvent.change(opacity, { target: { value } })
    fireEvent.pointerUp(opacity, { pointerId: 1 })
    expect(opacity).toHaveValue('39')
    fireEvent.click(screen.getByRole('button', { name: 'Rückgängig' }))
    expect(opacity).toHaveValue('100')

    const colour = screen.getByLabelText('Farbe')
    fireEvent.focus(colour)
    fireEvent.change(colour, { target: { value: '#224466' } })
    fireEvent.keyDown(screen.getByLabelText('Farbe'), { key: 'Escape' })
    fireEvent.click(screen.getByRole('button', { name: 'Text: Gesture' }))
    expect(screen.getByLabelText('Farbe')).toHaveValue('#111111')
    const currentColour = screen.getByLabelText('Farbe')
    fireEvent.focus(currentColour)
    fireEvent.change(currentColour, { target: { value: '#224466' } })
    fireEvent.change(currentColour, { target: { value: '#446688' } })
    fireEvent.blur(currentColour)
    fireEvent.click(screen.getByRole('button', { name: 'Rückgängig' }))
    expect(screen.getByLabelText('Farbe')).toHaveValue('#111111')
  })

  it('does not mark newer edits saved when an older export finishes', async () => {
    const pending = deferred()
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    renderEditor({ exporter: () => pending.promise })
    fireEvent.change(screen.getByLabelText('Bild auswählen'), { target: { files: [file()] } })
    await screen.findByText('300 × 200 px')
    fireEvent.click(screen.getByRole('button', { name: 'PNG herunterladen' }))
    fireEvent.click(screen.getByRole('button', { name: '90° nach rechts drehen' }))
    pending.resolve(new Blob(['old export'], { type: 'image/png' }))
    await waitFor(() => expect(screen.getByRole('button', { name: 'PNG herunterladen' })).toBeEnabled())
    expect(screen.getByText('Ungespeicherte Änderungen')).toBeVisible()
  })

  it('duplicates an existing watermark with the same decoded resource', async () => {
    const result = renderEditor()
    fireEvent.change(screen.getByLabelText('Bild auswählen'), { target: { files: [file()] } })
    await screen.findByText('300 × 200 px')
    fireEvent.change(screen.getByLabelText('Wasserzeichen hinzufügen'), { target: { files: [file('mark.png')] } })
    await screen.findByRole('button', { name: 'Wasserzeichen: mark.png' })
    fireEvent.click(screen.getByRole('button', { name: 'Wasserzeichen erneut einfügen' }))
    expect(result.container.querySelectorAll('.image-element-list button')).toHaveLength(2)
  })
})
