import { useState } from 'react'
import { useI18n } from '../../i18n'
import PrivacyStatus from './PrivacyStatus'

function NavigationLink({ active, children, href, onNavigate }) {
  const handleClick = (event) => {
    event.preventDefault()
    onNavigate(href)
  }

  return (
    <a className="site-nav__link" href={href} aria-current={active ? 'page' : undefined} onClick={handleClick}>
      {children}
    </a>
  )
}

export default function Header({ route, onNavigate, locale, onLocaleChange, theme, onThemeToggle }) {
  const { t } = useI18n()
  const [menuOpen, setMenuOpen] = useState(false)

  const goTo = (href) => {
    setMenuOpen(false)
    onNavigate(href)
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__brand-group">
          <a className="wordmark display" href="/" aria-label={t('shell.home')} onClick={(event) => { event.preventDefault(); goTo('/') }}>
            Folkkit
          </a>
          <PrivacyStatus compact />
        </div>

        <nav className="site-nav site-nav--desktop" aria-label={t('shell.primaryNavigation')}>
          <NavigationLink href="/" active={route === 'home'} onNavigate={goTo}>{t('shell.home')}</NavigationLink>
          <NavigationLink href="/tools" active={route === 'catalog'} onNavigate={goTo}>{t('shell.tools')}</NavigationLink>
        </nav>

        <div className="site-header__actions">
          <div className="locale-switch" role="group" aria-label={t('shell.localeLabel')}>
            <button type="button" aria-pressed={locale === 'de'} onClick={() => onLocaleChange('de')}>Deutsch</button>
            <button type="button" aria-pressed={locale === 'en'} onClick={() => onLocaleChange('en')}>English</button>
          </div>
          <button className="theme-button" type="button" aria-pressed={theme === 'dark'} onClick={onThemeToggle}>
            {theme === 'light' ? t('shell.themeDark') : t('shell.themeLight')}
          </button>
          <button
            className="menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? t('shell.menuClose') : t('shell.menuOpen')}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? t('shell.menuClose') : t('shell.menuOpen')}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-navigation" className="site-nav site-nav--mobile" aria-label={t('shell.mobileNavigation')}>
          <NavigationLink href="/" active={route === 'home'} onNavigate={goTo}>{t('shell.home')}</NavigationLink>
          <NavigationLink href="/tools" active={route === 'catalog'} onNavigate={goTo}>{t('shell.tools')}</NavigationLink>
          <PrivacyStatus />
        </nav>
      )}
    </header>
  )
}
