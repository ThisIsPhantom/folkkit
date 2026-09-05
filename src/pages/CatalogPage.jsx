import { useState } from 'react'
import { IconStar } from '@tabler/icons-react'
import { useI18n } from '../i18n'
import { preferenceKeys } from '../privacy/preferences'

const searchable = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase()

function readFavorites(entries) {
  try {
    const text = localStorage.getItem(preferenceKeys.favoriteTools) || '[]'
    if (text.length > 16384) return []
    const values = JSON.parse(text)
    const known = new Set(entries.map(entry => entry.id))
    return Array.isArray(values) ? [...new Set(values.filter(id => typeof id === 'string' && known.has(id)))] : []
  } catch { return [] }
}

export default function CatalogPage({ entries, onSelect }) {
  const { t } = useI18n()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [favorites, setFavorites] = useState(() => readFavorites(entries))
  const [storageError, setStorageError] = useState(false)
  const categories = [...new Map(entries.map(tool => [tool.category, tool.categoryName])).entries()]
  const terms = searchable(query).trim().split(/\s+/).filter(Boolean)
  const visible = entries.filter(tool => (category === 'all' || tool.category === category)
    && (!favoritesOnly || favorites.includes(tool.id))
    && terms.every(term => searchable(`${tool.name} ${tool.description} ${tool.categoryName}`).includes(term)))
  const toggleFavorite = id => {
    const next = favorites.includes(id) ? favorites.filter(value => value !== id) : [...favorites, id]
    setFavorites(next)
    try {
      localStorage.setItem(preferenceKeys.favoriteTools, JSON.stringify(next))
      setStorageError(false)
    } catch { setStorageError(true) }
  }
  const clearFilters = () => { setQuery(''); setCategory('all'); setFavoritesOnly(false) }

  return (
    <div className="catalog-page page-frame">
      <header className="page-heading heading-group">
        <h1 className="display">{t('catalog.title')}</h1>
        <p>{t('catalog.intro')}</p>
      </header>
      <form className="catalog-toolbar" onSubmit={event => event.preventDefault()} role="search">
        <label className="catalog-search" htmlFor="catalog-search"><span>{t('catalog.search')}</span><input id="catalog-search" name="search" type="search" maxLength={128} value={query} onChange={event => setQuery(event.target.value)} placeholder={t('catalog.searchPlaceholder')} autoComplete="off" /></label>
        <label htmlFor="catalog-category"><span>{t('catalog.category')}</span><select id="catalog-category" name="category" value={category} onChange={event => setCategory(event.target.value)}><option value="all">{t('catalog.allCategories')}</option>{categories.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label>
        <button type="button" className="catalog-favorites-filter" aria-pressed={favoritesOnly} onClick={() => setFavoritesOnly(value => !value)}><IconStar size={18} aria-hidden="true" />{t('catalog.favoritesOnly')}</button>
      </form>
      <p className="catalog-count" role="status">{t('catalog.filteredCount', { count: visible.length, total: entries.length })}</p>
      {storageError && <p className="catalog-storage-note">{t('catalog.storageError')}</p>}
      {visible.length === 0 && <div className="catalog-empty"><h2>{t('catalog.empty')}</h2><p>{t('catalog.emptyHint')}</p><button type="button" onClick={clearFilters}>{t('catalog.clearFilters')}</button></div>}
      <ul className="catalog-list" role="list">
        {visible.map((tool) => (
          <li key={tool.id}>
            <button className="catalog-list__open" type="button" onClick={() => onSelect({ kind: 'tool', toolId: tool.id })} aria-label={t('catalog.openTool', { name: tool.name })}>
              <span className="catalog-list__copy">
                <span className="catalog-list__title">{tool.name}</span>
                <span className="catalog-list__description">{tool.description}</span>
              </span>
              <span className="catalog-list__meta">
                <span>{tool.categoryName}</span>
                {tool.tierLabel && <span className="tier-badge">{tool.tierLabel}</span>}
              </span>
            </button>
            <button className="catalog-favorite" type="button" aria-pressed={favorites.includes(tool.id)} aria-label={t(favorites.includes(tool.id) ? 'catalog.removeFavorite' : 'catalog.addFavorite', { name: tool.name })} onClick={() => toggleFavorite(tool.id)}><IconStar size={20} aria-hidden="true" /></button>
          </li>
        ))}
      </ul>
    </div>
  )
}
