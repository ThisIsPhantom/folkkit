import { StrictMode } from 'react'
import { expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { I18nContext } from './i18n/context.js'
import { translate } from './i18n/index.js'
import ImageEditorPage from './features/image/ImageEditorPage.jsx'
import imageMessages from './features/image/messages.en.js'

it('accepts an initial image handoff once through the application StrictMode lifecycle', async () => {
  const consumed = vi.fn()
  const file = new File(['fixture'], 'handoff.png', { type: 'image/png' })
  const loadFile = vi.fn(async () => ({ file, kind: 'png', width: 300, height: 200, bitmap: { width: 300, height: 200, close: vi.fn() } }))
  render(<StrictMode><I18nContext.Provider value={{ locale: 'en', t: (key, values) => translate({ studioImage: imageMessages }, key, values) }}>
    <ImageEditorPage fileRequest={{ id: 1, file }} onFileRequestConsumed={consumed} loadFile={loadFile} renderPreview={async () => {}} />
  </I18nContext.Provider></StrictMode>)
  await screen.findByText('300 × 200 px')
  await waitFor(() => expect(consumed).toHaveBeenCalledExactlyOnceWith(1))
  expect(screen.getByText('handoff.png')).toBeVisible()
})
