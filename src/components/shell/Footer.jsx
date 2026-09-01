import { useI18n } from '../../i18n'
import buildInfo from '../../buildInfo'

export default function Footer({ onNavigate }) {
  const { t } = useI18n()
  const links = [
    ['privacy', '/privacy'],
    ['openSource', '/open-source'],
    ['licenses', '/licenses'],
    ['terms', '/terms'],
    ['contact', '/contact'],
  ]

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p>{t('shell.footerNote')}</p>
        <nav aria-label={t('shell.footerNavigation')}>
          <ul role="list" className="site-footer__links">
            {links.map(([key, href]) => (
              <li key={key}>
                <a href={href} onClick={(event) => { event.preventDefault(); onNavigate(href) }}>{t(`shell.${key}`)}</a>
              </li>
            ))}
            <li><a href={buildInfo.sourceUrl}>{t('shell.source')}</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
