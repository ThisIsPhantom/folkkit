import legalDe from '../content/legal.de'
import legalEn from '../content/legal.en'
import { useI18n } from '../i18n'
import LegalArticle from './LegalArticle'

export default function TermsPage() {
  const { locale } = useI18n()
  const content = (locale === 'en' ? legalEn : legalDe).terms

  return <LegalArticle content={content} />
}
