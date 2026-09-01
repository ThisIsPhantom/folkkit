import { useCallback, useEffect, useMemo, useState } from 'react'
import { getReleasedTools } from './catalog/releaseCatalog'
import AppShell from './components/shell/AppShell'
import { useI18n } from './i18n'
import CatalogPage from './pages/CatalogPage'
import HomePage from './pages/HomePage'
import WorkspacePage from './pages/WorkspacePage'

function readRoute() {
  if (window.location.pathname === '/tools') return 'catalog'
  if (window.location.pathname === '/workspace' || window.location.search || window.location.hash.startsWith('#tool/')) return 'workspace'
  return 'home'
}

export default function App() {
  const { locale, setLocale } = useI18n()
  const [route, setRoute] = useState(readRoute)
  const releasedTools = useMemo(() => getReleasedTools(locale), [locale])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  useEffect(() => {
    const handlePopState = () => setRoute(readRoute())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = useCallback((href) => {
    const target = new URL(href, window.location.origin)
    history.pushState(null, '', `${target.pathname}${target.search}${target.hash}`)
    setRoute(readRoute())
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
    <AppShell locale={locale} onLocaleChange={setLocale} route={route} onNavigate={navigate}>
      {route === 'home' && <HomePage onOpenCore={openCore} onOpenCatalog={() => navigate('/tools')} />}
      {route === 'catalog' && <CatalogPage entries={releasedTools} onSelect={selectCatalogEntry} />}
      {route === 'workspace' && <WorkspacePage />}
    </AppShell>
  )
}
