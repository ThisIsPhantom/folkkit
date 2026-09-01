import { useCallback, useEffect, useMemo, useState } from 'react'
import { getReleasedTools } from './catalog/releaseCatalog'
import AppShell from './components/shell/AppShell'
import { useI18n } from './i18n'
import CatalogPage from './pages/CatalogPage'
import ContactPage from './pages/ContactPage'
import HomePage from './pages/HomePage'
import LicensesPage from './pages/LicensesPage'
import PrivacyPage from './pages/PrivacyPage'
import SourcePage from './pages/SourcePage'
import TermsPage from './pages/TermsPage'
import WorkspacePage from './pages/WorkspacePage'
import { getNavigationScrollBehavior } from './utils/motion'

const legalRoutes = Object.freeze({
  '/privacy': 'privacy',
  '/open-source': 'openSource',
  '/licenses': 'licenses',
  '/terms': 'terms',
  '/contact': 'contact',
})

const legalPages = Object.freeze({
  privacy: PrivacyPage,
  openSource: SourcePage,
  licenses: LicensesPage,
  terms: TermsPage,
  contact: ContactPage,
})

function readRoute() {
  const legalPageKey = legalRoutes[window.location.pathname]
  if (legalPageKey) return `legal:${legalPageKey}`
  if (window.location.pathname === '/tools') return 'catalog'
  if (window.location.pathname === '/workspace' || window.location.search || window.location.hash.startsWith('#tool/')) return 'workspace'
  return 'home'
}

function focusMainContent() {
  requestAnimationFrame(() => {
    document.getElementById('main-content')?.focus({ preventScroll: true })
  })
}

export default function App() {
  const { locale, setLocale } = useI18n()
  const [route, setRoute] = useState(readRoute)
  const releasedTools = useMemo(() => getReleasedTools(locale), [locale])
  const shellRoute = route.startsWith('legal:') ? 'legal' : route
  const LegalPage = route.startsWith('legal:') ? legalPages[route.slice('legal:'.length)] : null

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  useEffect(() => {
    const handlePopState = () => {
      setRoute(readRoute())
      focusMainContent()
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = useCallback((href) => {
    const target = new URL(href, window.location.origin)
    history.pushState(null, '', `${target.pathname}${target.search}${target.hash}`)
    setRoute(readRoute())
    focusMainContent()
    window.scrollTo({ top: 0, behavior: getNavigationScrollBehavior() })
  }, [])

  const openCore = (kind) => {
    const destinations = {
      pdf: '/workspace?tool=merge-pdf',
      qr: '/workspace?tool=text-to-qr',
      convert: '/workspace?from=text&to=base64',
    }
    navigate(destinations[kind])
  }

  const selectCatalogEntry = ({ kind, toolId, from, to }) => {
    if (kind === 'tool') navigate(`/workspace?tool=${encodeURIComponent(toolId)}`)
    else navigate(`/workspace?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
  }

  return (
    <AppShell locale={locale} onLocaleChange={setLocale} route={shellRoute} onNavigate={navigate}>
      {route === 'home' && <HomePage onOpenCore={openCore} onOpenCatalog={() => navigate('/tools')} />}
      {route === 'catalog' && <CatalogPage entries={releasedTools} onSelect={selectCatalogEntry} />}
      {route === 'workspace' && <WorkspacePage />}
      {LegalPage && <LegalPage />}
    </AppShell>
  )
}
