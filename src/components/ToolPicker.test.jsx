import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
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
    render(
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

    await user.type(screen.getByRole('textbox'), 'verbinden')

    expect(screen.getByText('PDFs verbinden')).toBeInTheDocument()
    expect(screen.getByText('PDF und Dokumente')).toBeInTheDocument()
  })

  it('stores a selected released tool as its stable ID under the Folkkit key', async () => {
    const user = userEvent.setup()
    const onSelectConverter = vi.fn()
    render(
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

    await user.type(screen.getByRole('textbox'), 'merge-pdf')
    await user.click(screen.getByText('PDFs verbinden'))

    expect(onSelectConverter).toHaveBeenCalledWith(releasedTools[0])
    expect(localStorage.getItem('folkkit:recent-tools')).toBe('["merge-pdf"]')
  })
})
