import {lazy,Suspense} from 'react'
import legalDe from '../content/legal.de'
import legalEn from '../content/legal.en'
import { useI18n } from '../i18n'
import LegalArticle from './LegalArticle'
const ThirdPartyNotices=lazy(()=>import('./ThirdPartyNotices.jsx'))

export default function LicensesPage() {
  const { locale,t } = useI18n()
  const content = (locale === 'en' ? legalEn : legalDe).licenses

  return (
    <LegalArticle content={content}>
      <section className="legal-page__notices" aria-labelledby="third-party-notices">
        <h2 id="third-party-notices">{content.noticesTitle}</h2>
        <p>{content.noticesIntro}</p>
        <Suspense fallback={<p role="status">{t('shell.loading')}</p>}><ThirdPartyNotices/></Suspense>
      </section>
    </LegalArticle>
  )
}
