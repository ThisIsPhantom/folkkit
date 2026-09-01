import { useI18n } from '../i18n'

export default function CatalogPage({ entries, onSelect }) {
  const { t } = useI18n()

  return (
    <div className="catalog-page page-frame">
      <header className="page-heading heading-group">
        <p className="eyebrow">{t('catalog.eyebrow')}</p>
        <h1 className="display">{t('catalog.title')}</h1>
        <p>{t('catalog.intro')}</p>
        <p className="catalog-count">{t('catalog.toolCount', { count: entries.length })}</p>
      </header>
      <ul className="catalog-list" role="list">
        {entries.map((tool) => (
          <li key={tool.id}>
            <button type="button" onClick={() => onSelect({ kind: 'tool', toolId: tool.id })} aria-label={t('catalog.openTool', { name: tool.name })}>
              <span className="catalog-list__copy">
                <span className="catalog-list__title">{tool.name}</span>
                <span className="catalog-list__description">{tool.description}</span>
              </span>
              <span className="catalog-list__meta">
                <span>{tool.categoryName}</span>
                {tool.tierLabel && <span className="tier-badge">{tool.tierLabel}</span>}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
