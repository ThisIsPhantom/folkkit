import { useI18n } from '../../i18n'

export default function Footer() {
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
        <nav aria-label="Footer">
          <ul role="list" className="site-footer__links">
            {links.map(([key, href]) => <li key={key}><a href={href}>{t(`shell.${key}`)}</a></li>)}
            <li><a href="https://github.com/ThisIsPhantom/folkkit">{t('shell.source')}</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
