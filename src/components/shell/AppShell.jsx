import { useCallback, useEffect } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { useI18n } from '../../i18n'
import Footer from './Footer'
import Header from './Header'

export default function AppShell({ locale, onLocaleChange, route, onNavigate, children }) {
  const { theme, toggle } = useTheme()
  const { t } = useI18n()
  const toggleTheme = useCallback(() => toggle(), [toggle])

  useEffect(() => {
    const handleShortcut = (event) => {
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'd' && !isInput) {
        event.preventDefault()
        toggleTheme()
      }
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [toggleTheme])

  return (
    <div className="shell">
      <a className="skip-link" href="#main-content">{t('shell.skip')}</a>
      <Header
        route={route}
        onNavigate={onNavigate}
        locale={locale}
        onLocaleChange={onLocaleChange}
        theme={theme}
        onThemeToggle={toggleTheme}
      />
      <main id="main-content" className={`shell__main shell__main--${route}`} tabIndex="-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
