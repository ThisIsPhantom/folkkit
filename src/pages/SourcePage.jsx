import buildInfo from '../buildInfo'
import legalDe from '../content/legal.de'
import legalEn from '../content/legal.en'
import { useI18n } from '../i18n'
import LegalArticle from './LegalArticle'

export default function SourcePage() {
  const { locale } = useI18n()
  const content = (locale === 'en' ? legalEn : legalDe).source

  return (
    <LegalArticle content={content}>
      <section className="legal-page__revision" aria-labelledby="source-revision">
        <h2 id="source-revision">{content.revisionLabel}</h2>
        <code>{buildInfo.commit}</code>
        <a href={buildInfo.sourceUrl}>{content.revisionLink}</a>
        <p>{content.availabilityNote}</p>
      </section>
    </LegalArticle>
  )
}
