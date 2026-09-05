import { useI18n } from '../i18n'
import { IconArrowRight, IconArrowsExchange, IconCalculator, IconFileTypePdf, IconPhoto, IconQrcode } from '@tabler/icons-react'
import qrPreviewUrl from '../assets/qr-preview.svg?url&no-inline'

const entries = [
  { kind: 'qr', title: 'home.qrTitle', body: 'home.qrBody', icon: IconQrcode },
  { kind: 'pdf', title: 'home.pdfTitle', body: 'home.pdfBody', icon: IconFileTypePdf },
  { kind: 'convert', title: 'home.convertTitle', body: 'home.convertBody', icon: IconArrowsExchange },
]

function ToolPreview({ kind, t }) {
  if (kind === 'qr') return <div className="tool-preview tool-preview--qr" aria-hidden="true">
    <div className="qr-sample"><img src={qrPreviewUrl} alt="" width="156" height="156" /><span className="qr-sample__mark">f.</span></div>
    <div className="preview-swatches"><span /><span /><span /></div>
  </div>
  if (kind === 'pdf') return <div className="tool-preview tool-preview--pdf" aria-hidden="true">
    <div className="pdf-sample"><span className="pdf-sample__tag">PDF</span><strong>{t('home.sampleTitle')}</strong><p>{t('home.sampleLine1')}</p><mark>{t('home.sampleLine2')}</mark><p>{t('home.sampleLine3')}</p><span className="pdf-sample__cursor" /></div>
    <div className="pdf-sample__toolbar"><span>T</span><span>↗</span><span>✓</span></div>
  </div>
  return <div className="tool-preview tool-preview--convert" aria-hidden="true">
    <div className="convert-sample"><IconPhoto size={26} stroke={1.5} /><span>PNG</span><IconArrowRight size={22} /><strong>WEBP</strong></div>
    <div className="convert-sample convert-sample--secondary"><IconFileTypePdf size={26} stroke={1.5} /><span>PDF</span><IconArrowRight size={22} /><strong>JPG</strong></div>
  </div>
}

export default function HomePage({ onOpenCore, onOpenCatalog }) {
  const { t } = useI18n()

  return (
    <div className="home-page page-frame studio-home">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="heading-group">
          <h1 id="home-title" className="display">{t('home.title')}</h1>
          <p className="home-hero__intro">{t('home.intro')}</p>
        </div>
      </section>

      <section className="core-entry-section" aria-label={t('home.eyebrow')}>
        <div className="core-entry-grid">
          {entries.map((entry) => (
            <button
              key={entry.kind}
              className={`core-entry core-entry--${entry.kind}`}
              type="button"
              aria-label={t(entry.title)}
              onClick={() => onOpenCore(entry.kind)}
            >
              <ToolPreview kind={entry.kind} t={t} />
              <span className="core-entry__content"><span className="core-entry__title"><entry.icon size={22} stroke={1.7} aria-hidden="true" />{t(entry.title)}</span><span className="core-entry__body">{t(entry.body)}</span></span>
              <span className="core-entry__go" aria-hidden="true"><IconArrowRight size={22} /></span>
            </button>
          ))}
        </div>
        <button className="calculator-entry" type="button" onClick={() => onOpenCore('calculate')}>
          <span className="calculator-entry__icon" aria-hidden="true"><IconCalculator size={26} stroke={1.6} /></span>
          <span><strong>{t('home.calculateTitle')}</strong><span>{t('home.calculateBody')}</span></span>
          <IconArrowRight size={22} aria-hidden="true" />
        </button>
        <button className="catalog-link" type="button" onClick={onOpenCatalog}>{t('home.catalogLink')}<IconArrowRight size={18} aria-hidden="true" /></button>
      </section>
    </div>
  )
}
