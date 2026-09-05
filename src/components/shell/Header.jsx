import { useEffect, useRef, useState } from 'react'
import { IconMenu2, IconMoon, IconSun, IconX } from '@tabler/icons-react'
import { useI18n } from '../../i18n'

function NavigationLink({ active, children, href, onNavigate }) {
  const handleClick = (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
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
  const menuButton = useRef(null)
  useEffect(() => {
    if (!menuOpen) return undefined
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButton.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [menuOpen])
  const destinations = [
    { href: '/qr', route: 'qr', label: 'shell.qr' },
    { href: '/pdf', route: 'pdf', label: 'shell.pdf' },
    { href: '/convert', route: 'convert', label: 'shell.convert' },
    { href: '/calculate', route: 'calculate', label: 'shell.calculate' },
    { href: '/tools', route: 'catalog', label: 'shell.tools' },
  ]

  const goTo = (href) => {
    setMenuOpen(false)
    onNavigate(href)
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__brand-group">
          <a className="wordmark display" href="/" aria-label={t('shell.home')} onClick={(event) => { event.preventDefault(); goTo('/') }}>
            <span className="wordmark__symbol" aria-hidden="true">f.</span>Folkkit
          </a>
        </div>

        <nav className="site-nav site-nav--desktop" aria-label={t('shell.primaryNavigation')}>
          {destinations.map((item) => <NavigationLink key={item.href} href={item.href} active={route === item.route} onNavigate={goTo}>{t(item.label)}</NavigationLink>)}
        </nav>

        <div className="site-header__actions">
          <div className="locale-switch" role="group" aria-label={t('shell.localeLabel')}>
            <button type="button" aria-label="Deutsch" aria-pressed={locale === 'de'} onClick={() => onLocaleChange('de')}>DE</button>
            <button type="button" aria-label="English" aria-pressed={locale === 'en'} onClick={() => onLocaleChange('en')}>EN</button>
          </div>
          <button className="theme-button" type="button" aria-label={t('shell.themeToggle')} title={t('shell.themeToggle')} aria-pressed={theme === 'dark'} onClick={onThemeToggle}>
            {theme === 'dark' ? <IconSun size={20} aria-hidden="true" /> : <IconMoon size={20} aria-hidden="true" />}
          </button>
          <button
            className="menu-button"
            ref={menuButton}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? t('shell.menuClose') : t('shell.menuOpen')}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <IconX size={22} aria-hidden="true" /> : <IconMenu2 size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-navigation" className="site-nav site-nav--mobile" aria-label={t('shell.mobileNavigation')}>
          {destinations.map((item) => <NavigationLink key={item.href} href={item.href} active={route === item.route} onNavigate={goTo}>{t(item.label)}</NavigationLink>)}
        </nav>
      )}
    </header>
  )
}
