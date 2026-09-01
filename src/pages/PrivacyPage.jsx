import legalDe from '../content/legal.de'
import legalEn from '../content/legal.en'
import publicOperator, { isPublicOperatorConfigured } from '../content/publicOperator'
import { useI18n } from '../i18n'
import LegalArticle from './LegalArticle'

function OperatorDetails({ content }) {
  if (!isPublicOperatorConfigured(publicOperator)) {
    return <p className="legal-page__gate">{content.operatorMissing}</p>
  }

  return (
    <address>
      <strong>{publicOperator.name}</strong>
      {publicOperator.addressLines.map(line => <span key={line}>{line}</span>)}
      <a href={`mailto:${publicOperator.email}`}>{publicOperator.email}</a>
    </address>
  )
}

export default function PrivacyPage() {
  const { locale } = useI18n()
  const content = (locale === 'en' ? legalEn : legalDe).privacy

  return (
    <LegalArticle content={content}>
      <section className="legal-page__operator" aria-labelledby="privacy-operator">
        <h2 id="privacy-operator">{content.operatorTitle}</h2>
        <OperatorDetails content={content} />
      </section>
    </LegalArticle>
  )
}
