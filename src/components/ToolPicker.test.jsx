import { useState } from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getReleasedCategories, getReleasedTools } from '../catalog/releaseCatalog'
import { renderWithProviders } from '../test/renderWithProviders'
import ToolPicker from './ToolPicker'

const releasedTools = [{
  id: 'merge-pdf',
  name: 'PDFs verbinden',
  description: 'Mehrere PDFs zu einer Datei verbinden',
  category: 'document',
  categoryName: 'PDF und Dokumente',
  tier: 'core',
}]

const categories = [{ id: 'document', name: 'PDF und Dokumente' }]

afterEach(() => {
  localStorage.clear()
})

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn()
})

describe('ToolPicker', () => {
  it('searches the localized released tools supplied by its parent', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <ToolPicker
        open
        onClose={vi.fn()}
        onSelectFormat={vi.fn()}
        onSelectConverter={vi.fn()}
        mode="from"
        releasedFormats={[]}
        releasedTools={releasedTools}
        categories={categories}
      />,
    )

    const search = screen.getByRole('combobox', { name: 'Konvertierungen durchsuchen' })
    expect(search).toHaveAttribute('aria-expanded', 'true')
    expect(search).toHaveAttribute('aria-controls')
    expect(screen.getByRole('listbox')).toHaveAttribute('id', search.getAttribute('aria-controls'))

    await user.type(search, 'verbinden')

    const option = screen.getByRole('option', { name: /PDFs verbinden/ })
    expect(option).toBeInTheDocument()
    expect(option).toHaveAttribute('aria-selected', 'false')
    expect(search).toHaveAttribute('aria-activedescendant', option.id)
    expect(screen.getByText('PDF und Dokumente')).toBeInTheDocument()
  })

  it('stores a selected released tool as its stable ID under the Folkkit key', async () => {
    const user = userEvent.setup()
    const onSelectConverter = vi.fn()
    renderWithProviders(
      <ToolPicker
        open
        onClose={vi.fn()}
        onSelectFormat={vi.fn()}
        onSelectConverter={onSelectConverter}
        mode="from"
        releasedFormats={[]}
        releasedTools={releasedTools}
        categories={categories}
      />,
    )

    await user.type(screen.getByRole('combobox', { name: 'Konvertierungen durchsuchen' }), 'merge-pdf')
    await user.click(screen.getByRole('option', { name: /PDFs verbinden/ }))

    expect(onSelectConverter).toHaveBeenCalledWith(releasedTools[0])
    expect(localStorage.getItem('folkkit:recent-tools')).toBe('["merge-pdf"]')
  })

  it.each([
    ['de', 'Audio in MP3', 'Experimentell'],
    ['en', 'Audio to MP3', 'Experimental'],
  ])('labels experimental search results in %s', async (locale, toolName, tierLabel) => {
    const user = userEvent.setup()
    renderWithProviders(
      <ToolPicker
        open
        onClose={vi.fn()}
        onSelectFormat={vi.fn()}
        onSelectConverter={vi.fn()}
        mode="from"
        releasedFormats={[]}
        releasedTools={getReleasedTools(locale)}
        categories={getReleasedCategories(locale)}
      />,
      { locale },
    )

    await user.type(screen.getByRole('combobox'), toolName)

    expect(screen.getByText(toolName)).toBeInTheDocument()
    expect(screen.getByText(tierLabel)).toBeInTheDocument()
  })

  it('labels an experimental tool in its localized category tab', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <ToolPicker
        open
        onClose={vi.fn()}
        onSelectFormat={vi.fn()}
        onSelectConverter={vi.fn()}
        mode="from"
        releasedFormats={[]}
        releasedTools={getReleasedTools('de')}
        categories={getReleasedCategories('de')}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Audio und Video' }))

    expect(screen.getByText('Audio in MP3')).toBeInTheDocument()
    expect(screen.getByText('Experimentell')).toBeInTheDocument()
  })

  it.each([
    ['de', 'Konvertierungen durchsuchen', 'Alle Konvertierungen durchsuchen …'],
    ['en', 'Search conversions', 'Search all conversions…'],
  ])('localizes search semantics in %s', (locale, label, placeholder) => {
    renderWithProviders(
      <ToolPicker
        open
        onClose={vi.fn()}
        onSelectFormat={vi.fn()}
        onSelectConverter={vi.fn()}
        mode="from"
        releasedFormats={[]}
        releasedTools={getReleasedTools(locale)}
        categories={getReleasedCategories(locale)}
      />,
      { locale },
    )

    expect(screen.getByRole('combobox', { name: label })).toHaveAttribute('placeholder', placeholder)
  })

  it('selects the active option with the keyboard and restores focus to its trigger on Escape', async () => {
    const user = userEvent.setup()
    const onSelectConverter = vi.fn()

    function Harness() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>Werkzeugauswahl öffnen</button>
          <ToolPicker
            open={open}
            onClose={() => setOpen(false)}
            onSelectFormat={vi.fn()}
            onSelectConverter={onSelectConverter}
            mode="from"
            releasedFormats={[]}
            releasedTools={releasedTools}
            categories={categories}
          />
        </>
      )
    }

    renderWithProviders(<Harness />)
    const trigger = screen.getByRole('button', { name: 'Werkzeugauswahl öffnen' })
    await user.click(trigger)
    const search = screen.getByRole('combobox', { name: 'Konvertierungen durchsuchen' })
    await user.type(search, 'merge-pdf')
    await user.keyboard('{Enter}')
    expect(onSelectConverter).toHaveBeenCalledWith(releasedTools[0])
    await waitFor(() => expect(trigger).toHaveFocus())

    await user.click(trigger)
    await user.keyboard('{Escape}')
    await waitFor(() => expect(trigger).toHaveFocus())
  })
})
