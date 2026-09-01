import thirdPartyNotices from '../../THIRD_PARTY_NOTICES.md?raw'
import legalDe from '../content/legal.de'
import legalEn from '../content/legal.en'
import { useI18n } from '../i18n'
import LegalArticle from './LegalArticle'

export default function LicensesPage() {
  const { locale } = useI18n()
  const content = (locale === 'en' ? legalEn : legalDe).licenses

  return (
    <LegalArticle content={content}>
      <section className="legal-page__notices" aria-labelledby="third-party-notices">
        <h2 id="third-party-notices">{content.noticesTitle}</h2>
        <p>{content.noticesIntro}</p>
        <pre tabIndex="0">{thirdPartyNotices}</pre>
      </section>
    </LegalArticle>
  )
}
