import { useRef, useState } from 'react'
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
  const searchRef = useRef(null), favoritesFilterRef = useRef(null), favoriteRefs = useRef(new Map())
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
  const hasFilters = Boolean(query || category !== 'all' || favoritesOnly)
  const toggleFavorite = id => {
    if (favoritesOnly && favorites.includes(id)) {
      const remaining = visible.filter(tool => tool.id !== id)
      const index = visible.findIndex(tool => tool.id === id)
      const nextId = remaining[Math.min(index, remaining.length - 1)]?.id
      requestAnimationFrame(() => {
        if (document.activeElement !== document.body) return
        const target = favoriteRefs.current.get(nextId) || favoritesFilterRef.current
        target?.focus({ preventScroll: true })
        target?.scrollIntoView?.({ block: 'center', inline: 'nearest', behavior: 'instant' })
      })
    }
    const next = favorites.includes(id) ? favorites.filter(value => value !== id) : [...favorites, id]
    setFavorites(next)
    try {
      localStorage.setItem(preferenceKeys.favoriteTools, JSON.stringify(next))
      setStorageError(false)
    } catch { setStorageError(true) }
  }
  const clearFilters = () => {
    setQuery(''); setCategory('all'); setFavoritesOnly(false)
    searchRef.current?.focus({ preventScroll: true })
    searchRef.current?.scrollIntoView?.({ block: 'center', inline: 'nearest', behavior: 'instant' })
  }

  return (
    <div className="catalog-page page-frame">
      <header className="page-heading heading-group">
        <h1 className="display">{t('catalog.title')}</h1>
        <p>{t('catalog.intro')}</p>
      </header>
      <form className="catalog-toolbar" onSubmit={event => event.preventDefault()} role="search">
        <label className="catalog-search" htmlFor="catalog-search"><span>{t('catalog.search')}</span><input ref={searchRef} id="catalog-search" name="search" type="search" maxLength={128} value={query} onChange={event => setQuery(event.target.value)} placeholder={t('catalog.searchPlaceholder')} autoComplete="off" /></label>
        <label htmlFor="catalog-category"><span>{t('catalog.category')}</span><select id="catalog-category" name="category" value={category} onChange={event => setCategory(event.target.value)}><option value="all">{t('catalog.allCategories')}</option>{categories.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label>
        <button ref={favoritesFilterRef} type="button" className="catalog-favorites-filter" aria-pressed={favoritesOnly} onClick={() => setFavoritesOnly(value => !value)}><IconStar size={18} aria-hidden="true" />{t('catalog.favoritesOnly')}</button>
      </form>
      <div className="catalog-results-bar"><p className="catalog-count" role="status">{t('catalog.filteredCount', { count: visible.length, total: entries.length })}</p>{hasFilters && <button type="button" onClick={clearFilters}>{t('catalog.clearFilters')}</button>}</div>
      {storageError && <p className="catalog-storage-note">{t('catalog.storageError')}</p>}
      {visible.length === 0 && <div className="catalog-empty"><h2>{t('catalog.empty')}</h2><p>{t('catalog.emptyHint')}</p></div>}
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
            <button ref={element => { if (element) favoriteRefs.current.set(tool.id, element); else favoriteRefs.current.delete(tool.id) }} className="catalog-favorite" type="button" aria-pressed={favorites.includes(tool.id)} aria-label={t(favorites.includes(tool.id) ? 'catalog.removeFavorite' : 'catalog.addFavorite', { name: tool.name })} onClick={() => toggleFavorite(tool.id)}><IconStar size={20} aria-hidden="true" /></button>
          </li>
        ))}
      </ul>
    </div>
  )
}
