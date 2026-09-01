import { useI18n } from '../i18n'

const titleKeys = Object.freeze({
  privacy: 'shell.privacy',
  openSource: 'shell.openSource',
  licenses: 'shell.licenses',
  terms: 'shell.terms',
  contact: 'shell.contact',
})

export default function PendingLegalPage({ pageKey, path }) {
  const { t } = useI18n()

  return (
    <section className="pending-legal-page page-frame" aria-labelledby="pending-legal-title">
      <div className="heading-group">
        <p className="eyebrow">{t('legalPending.eyebrow')}</p>
        <h1 id="pending-legal-title" className="display">{t(titleKeys[pageKey])}</h1>
        <p className="pending-legal-page__message">{t('legalPending.message')}</p>
        <p>{t('legalPending.detail')}</p>
        <p className="pending-legal-page__path"><span>{t('legalPending.pathLabel')}:</span> <code>{path}</code></p>
      </div>
    </section>
  )
}
