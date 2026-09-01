import legalDe from '../content/legal.de'
import legalEn from '../content/legal.en'
import publicOperator, { isPublicOperatorConfigured } from '../content/publicOperator'
import { useI18n } from '../i18n'
import LegalArticle from './LegalArticle'

export default function ContactPage() {
  const { locale } = useI18n()
  const content = (locale === 'en' ? legalEn : legalDe).contact
  const configured = isPublicOperatorConfigured(publicOperator)

  return (
    <LegalArticle content={content}>
      <section className="legal-page__operator" aria-labelledby="contact-operator">
        <h2 id="contact-operator">{content.operatorTitle}</h2>
        {configured ? (
          <address>
            <strong>{publicOperator.name}</strong>
            {publicOperator.addressLines.map(line => <span key={line}>{line}</span>)}
            <a href={`mailto:${publicOperator.email}`}>{content.emailLabel}: {publicOperator.email}</a>
          </address>
        ) : (
          <p className="legal-page__gate">{content.operatorMissing}</p>
        )}
      </section>
    </LegalArticle>
  )
}
