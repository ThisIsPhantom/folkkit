import { useI18n } from '../i18n'
import PrivacyStatus from '../components/shell/PrivacyStatus'

const entries = [
  { kind: 'pdf', title: 'home.pdfTitle', body: 'home.pdfBody' },
  { kind: 'qr', title: 'home.qrTitle', body: 'home.qrBody' },
  { kind: 'convert', title: 'home.convertTitle', body: 'home.convertBody', primary: true },
]

export default function HomePage({ onOpenCore, onOpenCatalog }) {
  const { t } = useI18n()

  return (
    <div className="home-page page-frame">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="heading-group">
          <p className="eyebrow">{t('home.eyebrow')}</p>
          <h1 id="home-title" className="display">{t('home.title')}</h1>
          <p className="home-hero__intro">{t('home.intro')}</p>
        </div>
        <div className="privacy-promise">
          <PrivacyStatus />
          <h2>{t('home.privacyTitle')}</h2>
          <p>{t('home.privacyBody')}</p>
        </div>
      </section>

      <section className="core-entry-section" aria-label={t('home.eyebrow')}>
        <div className="core-entry-grid">
          {entries.map((entry) => (
            <button
              key={entry.kind}
              className={`core-entry${entry.primary ? ' core-entry--primary' : ''}`}
              type="button"
              aria-label={t(entry.title)}
              onClick={() => onOpenCore(entry.kind)}
            >
              <span className="core-entry__title">{t(entry.title)}</span>
              <span className="core-entry__body">{t(entry.body)}</span>
            </button>
          ))}
        </div>
        <button className="catalog-link" type="button" onClick={onOpenCatalog}>{t('home.catalogLink')}</button>
      </section>
    </div>
  )
}
