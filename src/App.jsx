import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import { getNavigationScrollBehavior } from './utils/motion'
import { calculatorSelection, coreDestinations, legacyCalculatorIds, legacyCalculatorTool, resolveAppRoute } from './routing/studioRoutes'
import ErrorBoundary from './components/ErrorBoundary'

const QrDesignerPage = lazy(() => import('./features/qr/QrDesignerPage.jsx'))
const FileConverterPage = lazy(() => import('./features/convert/FileConverterPage.jsx'))
const PdfEditorPage = lazy(() => import('./features/pdf/PdfEditorPage.jsx'))
const WorkspacePage = lazy(() => import('./pages/WorkspacePage.jsx'))
const CalculatorPage = lazy(() => import('./features/calculate/CalculatorPage.jsx'))

const legalPages = Object.freeze({
  privacy: PrivacyPage,
  openSource: SourcePage,
  licenses: LicensesPage,
  terms: TermsPage,
  contact: ContactPage,
})

function readRoute() {
  return resolveAppRoute(window.location)
}

function focusMainContent() {
  requestAnimationFrame(() => {
    document.getElementById('main-content')?.focus({ preventScroll: true })
  })
}

export default function App() {
  const { locale, setLocale, t } = useI18n()
  const [route, setRoute] = useState(readRoute)
  const [calculator, setCalculator] = useState(() => calculatorSelection(window.location))
  const pdfDirty = useRef(false)
  const acceptedHref = useRef(`${window.location.pathname}${window.location.search}${window.location.hash}`)
  const onPdfDirtyChange = useCallback((dirty) => { pdfDirty.current = dirty }, [])
  const releasedTools = useMemo(() => getReleasedTools(locale), [locale])
  const shellRoute = route.startsWith('legal:') ? 'legal' : route
  const LegalPage = route.startsWith('legal:') ? legalPages[route.slice('legal:'.length)] : null

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  useEffect(() => {
    if (route === 'calculate' && legacyCalculatorTool(window.location)) {
      const canonical = `/calculate?calculator=${calculatorSelection(window.location)}`
      history.replaceState(null, '', canonical)
      acceptedHref.current = canonical
    }
  }, [route, calculator])

  useEffect(() => {
    if (route === 'workspace') return
    const label = route.startsWith('legal:') ? route.slice(6) : route === 'catalog' ? 'tools' : route
    document.title = route === 'home' ? 'Folkkit' : `${t(`shell.${label}`)} · Folkkit`
  }, [route, t])

  useEffect(() => {
    const handlePopState = () => {
      const nextRoute = readRoute()
      if (pdfDirty.current && nextRoute !== 'pdf' && !window.confirm(t('shell.unsaved'))) {
        history.pushState(null, '', acceptedHref.current)
        return
      }
      if (nextRoute !== 'pdf') pdfDirty.current = false
      acceptedHref.current = `${window.location.pathname}${window.location.search}${window.location.hash}`
      setRoute(readRoute())
      setCalculator(calculatorSelection(window.location))
      focusMainContent()
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [t])

  const navigate = useCallback((href) => {
    const target = new URL(href, window.location.origin)
    if (pdfDirty.current && target.pathname !== '/pdf' && !window.confirm(t('shell.unsaved'))) return
    if (target.pathname !== '/pdf') pdfDirty.current = false
    history.pushState(null, '', `${target.pathname}${target.search}${target.hash}`)
    acceptedHref.current = `${target.pathname}${target.search}${target.hash}`
    setRoute(readRoute())
    setCalculator(calculatorSelection(window.location))
    focusMainContent()
    window.scrollTo({ top: 0, behavior: getNavigationScrollBehavior() })
  }, [t])

  const openCore = (kind) => {
    navigate(coreDestinations[kind])
  }

  const selectCatalogEntry = ({ kind, toolId, from, to }) => {
    if (kind === 'tool') navigate(`/workspace?tool=${encodeURIComponent(toolId)}`)
    else navigate(`/workspace?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
  }

  return (
    <AppShell locale={locale} onLocaleChange={setLocale} route={shellRoute} onNavigate={navigate}>
      {route === 'home' && <HomePage onOpenCore={openCore} onOpenCatalog={() => navigate('/tools')} />}
      {route === 'catalog' && <CatalogPage entries={releasedTools.filter(tool => !legacyCalculatorIds.includes(tool.id))} onSelect={selectCatalogEntry} />}
      {['qr', 'pdf', 'convert', 'calculate', 'workspace'].includes(route) && <ErrorBoundary key={route} onRetry={() => window.location.reload()}>
        <Suspense fallback={<div className="studio-page studio-loading"><h1>{route === 'workspace' ? t('workspace.title') : t(`shell.${route}`)}</h1><p role="status"><span className="studio-spinner" aria-hidden="true" />{t('shell.loading')}</p></div>}>
          {route === 'qr' && <QrDesignerPage />}
          {route === 'convert' && <FileConverterPage />}
          {route === 'pdf' && <PdfEditorPage onDirtyChange={onPdfDirtyChange} />}
          {route === 'calculate' && <CalculatorPage initialCalculator={calculator} onSelectCalculator={id => { if (id !== calculator) navigate(`/calculate?calculator=${id}`) }} />}
          {route === 'workspace' && <WorkspacePage />}
        </Suspense>
      </ErrorBoundary>}
      {LegalPage && <LegalPage />}
    </AppShell>
  )
}
