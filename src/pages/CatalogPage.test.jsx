import { fireEvent, screen } from '@testing-library/react'
import { beforeEach, expect, test, vi } from 'vitest'
import CatalogPage from './CatalogPage.jsx'
import { renderWithProviders } from '../test/renderWithProviders.jsx'
import { preferenceKeys } from '../privacy/preferences.js'

const entries = [
  { id: 'text-to-qr', name: 'QR-Code erstellen', description: 'Text und Links', category: 'encode', categoryName: 'Kodierung' },
  { id: 'images-to-pdf', name: 'Bilder in PDF', description: 'Fotos zusammenstellen', category: 'document', categoryName: 'Dokumente' },
  { id: 'color-convert', name: 'Farben umwandeln', description: 'Farbtöne auswählen', category: 'color', categoryName: 'Farben' },
]

beforeEach(() => localStorage.clear())

test('searches names and descriptions, combines a category filter and recovers from no results', () => {
  const onSelect = vi.fn()
  renderWithProviders(<CatalogPage entries={entries} onSelect={onSelect} />)
  fireEvent.change(screen.getByRole('searchbox', { name: 'Werkzeuge suchen' }), { target: { value: 'FARBToNE' } })
  expect(screen.getByRole('button', { name: 'Farben umwandeln öffnen' })).toBeVisible()
  expect(screen.queryByRole('button', { name: 'QR-Code erstellen öffnen' })).not.toBeInTheDocument()
  fireEvent.change(screen.getByRole('combobox', { name: 'Kategorie' }), { target: { value: 'document' } })
  expect(screen.getByText('Keine passenden Werkzeuge')).toBeVisible()
  fireEvent.click(screen.getByRole('button', { name: 'Filter zurücksetzen' }))
  expect(screen.getByRole('status')).toHaveTextContent('3 von 3 Werkzeugen')
  fireEvent.click(screen.getByRole('button', { name: 'Bilder in PDF öffnen' }))
  expect(onSelect).toHaveBeenCalledWith({ kind: 'tool', toolId: 'images-to-pdf' })
})

test('persists known tool IDs separately from legacy conversion favorites', () => {
  localStorage.setItem(preferenceKeys.favorites, '["text:base64"]')
  const view = renderWithProviders(<CatalogPage entries={entries} onSelect={vi.fn()} />)
  fireEvent.click(screen.getByRole('button', { name: 'Bilder in PDF zu Favoriten hinzufügen' }))
  expect(localStorage.getItem(preferenceKeys.favoriteTools)).toBe('["images-to-pdf"]')
  expect(localStorage.getItem(preferenceKeys.favorites)).toBe('["text:base64"]')
  fireEvent.click(screen.getByRole('button', { name: 'Nur Favoriten' }))
  expect(screen.queryByRole('button', { name: 'QR-Code erstellen öffnen' })).not.toBeInTheDocument()
  view.unmount()
  renderWithProviders(<CatalogPage entries={entries} onSelect={vi.fn()} />)
  expect(screen.getByRole('button', { name: 'Bilder in PDF aus Favoriten entfernen' })).toHaveAttribute('aria-pressed', 'true')
})

test('ignores unknown or malformed stored favorites', () => {
  localStorage.setItem(preferenceKeys.favoriteTools, '["images-to-pdf","not-a-tool",{},"images-to-pdf"]')
  renderWithProviders(<CatalogPage entries={entries} onSelect={vi.fn()} />)
  fireEvent.click(screen.getByRole('button', { name: 'Nur Favoriten' }))
  expect(screen.getByRole('status')).toHaveTextContent('1 von 3 Werkzeugen')
  fireEvent.click(screen.getByRole('button', { name: 'Bilder in PDF aus Favoriten entfernen' }))
  expect(localStorage.getItem(preferenceKeys.favoriteTools)).toBe('[]')
})


test('clears active filters even with matching results and returns focus to search', () => {
  renderWithProviders(<CatalogPage entries={entries} onSelect={vi.fn()} />)
  const search = screen.getByRole('searchbox', { name: 'Werkzeuge suchen' })
  fireEvent.change(search, { target: { value: 'PDF' } })
  expect(screen.getByRole('status')).toHaveTextContent('1 von 3 Werkzeugen')
  fireEvent.click(screen.getByRole('button', { name: 'Filter zurücksetzen' }))
  expect(search).toHaveValue('')
  expect(search).toHaveFocus()
  expect(screen.getByRole('status')).toHaveTextContent('3 von 3 Werkzeugen')
})

test('removing a favorite from the filtered list keeps keyboard focus on a useful control', async () => {
  localStorage.setItem(preferenceKeys.favoriteTools, JSON.stringify(entries.map(entry => entry.id)))
  renderWithProviders(<CatalogPage entries={entries} onSelect={vi.fn()} />)
  const filter = screen.getByRole('button', { name: 'Nur Favoriten' })
  fireEvent.click(filter)
  const pdf = screen.getByRole('button', { name: 'Bilder in PDF aus Favoriten entfernen' })
  pdf.focus(); fireEvent.click(pdf)
  const color = screen.getByRole('button', { name: 'Farben umwandeln aus Favoriten entfernen' })
  await vi.waitFor(() => expect(color).toHaveFocus())
  fireEvent.click(color)
  const qr = screen.getByRole('button', { name: 'QR-Code erstellen aus Favoriten entfernen' })
  await vi.waitFor(() => expect(qr).toHaveFocus())
  fireEvent.click(qr)
  await vi.waitFor(() => expect(filter).toHaveFocus())
})
