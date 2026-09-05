import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { I18nContext } from '../../i18n/context.js'
import { translate } from '../../i18n/index.js'
import { renderWithProviders } from '../../test/renderWithProviders.jsx'
import messagesDe from './messages.de.js'
import QrDesignerPage from './QrDesignerPage.jsx'

function renderDesigner(locale = 'de', messages = messagesDe) {
  const t = (key, vars) => translate(messages, key, vars)
  return renderWithProviders(
    <I18nContext.Provider value={{ locale, setLocale: vi.fn(), t }}>
      <QrDesignerPage generateQr={async request => new Blob([request.data], { type: 'image/svg+xml' })} />
    </I18nContext.Provider>,
    { locale },
  )
}

function deferred() {
  let resolve
  const promise = new Promise(next => { resolve = next })
  return { promise, resolve }
}

function validPngFile() {
  const bytes = new Uint8Array(24)
  bytes.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  new DataView(bytes.buffer).setUint32(16, 128)
  new DataView(bytes.buffer).setUint32(20, 64)
  return new File([bytes], 'touch-logo.png', { type: 'image/png' })
}

describe('QR designer page', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  beforeEach(() => {
    let index = 0
    URL.createObjectURL = vi.fn(() => `blob:preview-${++index}`)
    URL.revokeObjectURL = vi.fn()
  })

  it('keeps the preview visible while switching between content, design and logo controls', async () => {
    renderDesigner()

    expect(screen.getByRole('heading', { name: 'QR-Code gestalten' })).toBeInTheDocument()
    expect(screen.queryByRole('img', { name: 'QR-Code-Vorschau' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'PNG herunterladen' })).toBeDisabled()
    fireEvent.change(screen.getByRole('textbox', { name: 'Inhalt' }), { target: { value: 'Folkkit QR fixture' } })
    expect(await screen.findByRole('img', { name: 'QR-Code-Vorschau' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('tab', { name: 'Design' }))
    expect(screen.getByLabelText('Vordergrund')).toHaveValue('#111111')
    fireEvent.click(screen.getByRole('tab', { name: 'Logo' }))
    expect(screen.getByLabelText('Logo auswählen')).toHaveAttribute('accept', 'image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp')
  })

  it('shows an actionable contrast warning without coupling output colours to the theme', async () => {
    renderDesigner()
    fireEvent.click(screen.getByRole('tab', { name: 'Design' }))
    fireEvent.input(screen.getByLabelText('Vordergrund'), { target: { value: '#777777' } })
    fireEvent.input(screen.getByLabelText('Hintergrund'), { target: { value: '#888888' } })

    expect(await screen.findByText('Der Kontrast ist niedrig. Verwende deutlich unterschiedliche Farben, damit Scanner den Code zuverlässig erkennen.')).toBeInTheDocument()
  })

  it('applies named foreground and background presets with persistent selected states', () => {
    renderDesigner()
    fireEvent.click(screen.getByRole('tab', { name: 'Design' }))

    const graphite = screen.getByRole('button', { name: 'Graphit als Vordergrund wählen' })
    expect(graphite).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(screen.getByRole('button', { name: 'Grün als Vordergrund wählen' }))
    expect(screen.getByLabelText('Vordergrund')).toHaveValue('#166534')
    expect(screen.getByRole('button', { name: 'Grün als Vordergrund wählen' })).toHaveAttribute('aria-pressed', 'true')
    expect(graphite).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(screen.getByRole('button', { name: 'Mint als Hintergrund wählen' }))
    expect(screen.getByLabelText('Hintergrund')).toHaveValue('#ecfdf5')
    expect(screen.getByRole('button', { name: 'Mint als Hintergrund wählen' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('provides explicit English names for every quick colour choice', async () => {
    const { default: messagesEn } = await import('./messages.en.js')
    renderDesigner('en', messagesEn)
    fireEvent.click(screen.getByRole('tab', { name: 'Design' }))

    expect(screen.getByRole('group', { name: 'Foreground colours' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Terracotta as foreground' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Background colours' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Light blue as background' })).toBeInTheDocument()
  })

  it('reports malformed logo files without replacing the current QR preview', async () => {
    renderDesigner()
    fireEvent.change(screen.getByRole('textbox', { name: 'Inhalt' }), { target: { value: 'Folkkit logo fixture' } })
    await screen.findByRole('img', { name: 'QR-Code-Vorschau' })
    fireEvent.click(screen.getByRole('tab', { name: 'Logo' }))
    const input = screen.getByLabelText('Logo auswählen')
    const malformed = new File([Uint8Array.from([1, 2, 3])], 'logo.png', { type: 'image/png' })
    fireEvent.change(input, { target: { files: [malformed] } })

    expect(await screen.findByRole('alert')).toHaveTextContent('Diese Datei ist kein gültiges PNG-, JPEG- oder WebP-Bild.')
    expect(screen.getByRole('img', { name: 'QR-Code-Vorschau' })).toBeInTheDocument()
  })

  it('blocks export when high error correction cannot hold logo content', async () => {
    renderDesigner()
    fireEvent.click(screen.getByRole('tab', { name: 'Inhalt' }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Inhalt' }), { target: { value: 'a'.repeat(1700) } })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'PNG herunterladen' })).toBeDisabled()
      expect(screen.getByRole('alert')).toHaveTextContent('Der Inhalt ist für einen QR-Code mit den aktuellen Einstellungen zu lang.')
    })
  })

  it('moves through the settings tabs with arrow keys', () => {
    renderDesigner()
    const contentTab = screen.getByRole('tab', { name: 'Inhalt' })
    contentTab.focus()
    fireEvent.keyDown(contentTab, { key: 'ArrowRight' })

    expect(screen.getByRole('tab', { name: 'Design' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Design' })).toHaveFocus()
  })

  it('does not download a delayed export after the designer unmounts', async () => {
    const pendingPng = deferred()
    const anchorClick = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    const generateQr = (_request, extension) => extension === 'png'
      ? pendingPng.promise
      : Promise.resolve(new Blob(['preview'], { type: 'image/svg+xml' }))
    const t = (key, vars) => translate(messagesDe, key, vars)
    const result = renderWithProviders(
      <I18nContext.Provider value={{ locale: 'de', setLocale: vi.fn(), t }}>
        <QrDesignerPage generateQr={generateQr} />
      </I18nContext.Provider>,
    )
    fireEvent.change(screen.getByRole('textbox', { name: 'Inhalt' }), { target: { value: 'Verzögerter Export' } })
    fireEvent.click(screen.getByRole('button', { name: 'PNG herunterladen' }))
    const objectUrlCount = URL.createObjectURL.mock.calls.length
    result.unmount()
    pendingPng.resolve(new Blob(['png'], { type: 'image/png' }))
    await Promise.resolve()
    await Promise.resolve()

    expect(anchorClick).not.toHaveBeenCalled()
    expect(URL.createObjectURL).toHaveBeenCalledTimes(objectUrlCount)
  })

  it('invalidates a delayed export when the designer is reset', async () => {
    const pendingPng = deferred()
    const anchorClick = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    const generateQr = (_request, extension) => extension === 'png'
      ? pendingPng.promise
      : Promise.resolve(new Blob(['preview'], { type: 'image/svg+xml' }))
    const t = (key, vars) => translate(messagesDe, key, vars)
    renderWithProviders(
      <I18nContext.Provider value={{ locale: 'de', setLocale: vi.fn(), t }}>
        <QrDesignerPage generateQr={generateQr} />
      </I18nContext.Provider>,
    )
    fireEvent.change(screen.getByRole('textbox', { name: 'Inhalt' }), { target: { value: 'Abgebrochener Export' } })
    fireEvent.click(screen.getByRole('button', { name: 'PNG herunterladen' }))
    const objectUrlCount = URL.createObjectURL.mock.calls.length
    fireEvent.click(screen.getByRole('button', { name: 'Zurücksetzen' }))
    pendingPng.resolve(new Blob(['png'], { type: 'image/png' }))
    await Promise.resolve()
    await Promise.resolve()

    expect(anchorClick).not.toHaveBeenCalled()
    expect(URL.createObjectURL).toHaveBeenCalledTimes(objectUrlCount)
  })

  it('keeps the first touch drag active when a second touch loses capture or cancels', async () => {
    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue({ width: 128, height: 64, close: vi.fn() }))
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ clearRect: vi.fn(), drawImage: vi.fn() })
    renderDesigner()
    fireEvent.click(screen.getByRole('tab', { name: 'Logo' }))
    fireEvent.change(screen.getByLabelText('Logo auswählen'), { target: { files: [validPngFile()] } })
    await screen.findByText('Ausgewählt: touch-logo.png')

    const crop = screen.getByRole('group', { name: 'Logo-Ausschnitt verschieben' })
    crop.getBoundingClientRect = () => ({ width: 200, height: 200, x: 0, y: 0, top: 0, right: 200, bottom: 200, left: 0 })
    crop.setPointerCapture = vi.fn()
    crop.hasPointerCapture = vi.fn(() => true)
    crop.releasePointerCapture = vi.fn()

    fireEvent.pointerDown(crop, { pointerId: 1, pointerType: 'touch', clientX: 100, clientY: 100 })
    fireEvent.pointerMove(crop, { pointerId: 1, pointerType: 'touch', clientX: 120, clientY: 100 })
    expect(screen.getByRole('button', { name: 'Zentrieren' })).toBeEnabled()
    fireEvent.pointerDown(crop, { pointerId: 2, pointerType: 'touch', clientX: 140, clientY: 100 })
    expect(crop.setPointerCapture).toHaveBeenCalledTimes(1)

    fireEvent.lostPointerCapture(crop, { pointerId: 2, pointerType: 'touch' })
    expect(crop).toHaveAttribute('data-dragging', 'true')
    fireEvent.pointerCancel(crop, { pointerId: 2, pointerType: 'touch' })
    expect(crop).toHaveAttribute('data-dragging', 'true')

    fireEvent.pointerCancel(crop, { pointerId: 1, pointerType: 'touch' })
    expect(crop).toHaveAttribute('data-dragging', 'false')
    expect(screen.getByRole('button', { name: 'Zentrieren' })).toBeDisabled()
  })
})
