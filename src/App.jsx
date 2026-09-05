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
import { coreDestinations, legacyCalculatorIds, legacyStudioHref, resolveAppRoute, studioOptions, toolStudioHref } from './routing/studioRoutes'
import ErrorBoundary from './components/ErrorBoundary'

const QrDesignerPage = lazy(() => import('./features/qr/QrDesignerPage.jsx'))
const FileConverterPage = lazy(() => import('./features/convert/FileConverterPage.jsx'))
const PdfEditorPage = lazy(() => import('./features/pdf/PdfEditorPage.jsx'))
const WorkspacePage = lazy(() => import('./pages/WorkspacePage.jsx'))
const CalculatorPage = lazy(() => import('./features/calculate/CalculatorPage.jsx'))
const retainedStudios = ['qr', 'convert', 'calculate']

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
  const [studios, setStudios] = useState(() => retainedStudios.includes(route) ? { [route]: studioOptions(route, window.location) } : {})
  const [pdfOptions, setPdfOptions] = useState(() => studioOptions('pdf', window.location))
  const visitedHrefs = useRef({})
  const [fileRequest, setFileRequest] = useState(null)
  const fileRequestId = useRef(0)
  const consumeFileRequest = useCallback(id => setFileRequest(current => current?.id === id ? null : current), [])
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
    const canonical = legacyStudioHref(window.location)
    if (canonical) {
      history.replaceState(null, '', canonical)
      acceptedHref.current = canonical
    }
    if (retainedStudios.includes(route)) visitedHrefs.current[route] = `${window.location.pathname}${window.location.search}`
  }, [route, studios])

  const acceptLocation = useCallback((shouldFocus = true) => {
    const nextRoute = readRoute()
    const canonical = legacyStudioHref(window.location)
    if (canonical) history.replaceState(null, '', canonical)
    acceptedHref.current = `${window.location.pathname}${window.location.search}${window.location.hash}`
    setRoute(nextRoute)
    if (retainedStudios.includes(nextRoute)) {
      const options = studioOptions(nextRoute, window.location)
      setStudios(previous => ({ ...previous, [nextRoute]: options }))
    }
    if (nextRoute === 'pdf') setPdfOptions(studioOptions('pdf', window.location))
    else setFileRequest(current => current?.route === 'pdf' ? null : current)
    if (shouldFocus) focusMainContent()
  }, [])

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
      acceptLocation()
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [t, acceptLocation])

  const navigate = useCallback((href) => {
    const studio = retainedStudios.find(kind => href === coreDestinations[kind])
    const target = new URL(studio && visitedHrefs.current[studio] ? visitedHrefs.current[studio] : href, window.location.origin)
    const nextRoute = resolveAppRoute(target)
    const sameStudio = nextRoute === readRoute() && retainedStudios.includes(nextRoute)
    if (pdfDirty.current && nextRoute !== 'pdf' && !window.confirm(t('shell.unsaved'))) return false
    if (nextRoute !== 'pdf') pdfDirty.current = false
    history.pushState(null, '', `${target.pathname}${target.search}${target.hash}`)
    acceptLocation(!sameStudio)
    if (!sameStudio) window.scrollTo({ top: 0, behavior: getNavigationScrollBehavior() })
    return true
  }, [t, acceptLocation])

  const openStudioTool = useCallback((toolId, file) => {
    const href = toolId === 'text-to-qr' ? '/qr?mode=create' : toolStudioHref(toolId)
    if (!href) return false
    if (navigate(href) && file) setFileRequest({ id: ++fileRequestId.current, file, route: href.slice(1).split('?')[0] })
    return true
  }, [navigate])

  const openCore = (kind) => {
    navigate(coreDestinations[kind])
  }

  const selectCatalogEntry = ({ kind, toolId, from, to }) => {
    if (kind === 'tool') {
      if (!openStudioTool(toolId)) navigate(`/workspace?tool=${encodeURIComponent(toolId)}`)
    } else navigate(`/workspace?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
  }

  return (
    <AppShell locale={locale} onLocaleChange={setLocale} route={shellRoute} onNavigate={navigate}>
      {route === 'home' && <HomePage onOpenCore={openCore} onOpenCatalog={() => navigate('/tools')} />}
      {route === 'catalog' && <CatalogPage entries={[
        { id: 'qr-reader', name: t('catalog.qrReader'), description: t('catalog.qrReaderDescription'), category: 'studio', categoryName: t('catalog.studioCategory') },
        { id: 'image-optimize', name: t('catalog.imageOptimize'), description: t('catalog.imageOptimizeDescription'), category: 'studio', categoryName: t('catalog.studioCategory') },
        ...releasedTools.filter(tool => !legacyCalculatorIds.includes(tool.id)),
      ]} onSelect={selectCatalogEntry} />}
      {retainedStudios.filter(kind => studios[kind]).map(kind => <div key={kind} hidden={route !== kind} inert={route !== kind} className="studio-session">
        <ErrorBoundary onRetry={() => window.location.reload()}><Suspense fallback={<div className="studio-page studio-loading"><h1>{t(`shell.${kind}`)}</h1><p role="status">{t('shell.loading')}</p></div>}>
          {kind === 'qr' && <QrDesignerPage initialMode={studios.qr.mode} onModeChange={mode => navigate(`/qr?mode=${mode}`)} active={route === kind} />}
          {kind === 'convert' && <FileConverterPage initialMode={studios.convert.mode} initialTarget={studios.convert.target} initialCombine={studios.convert.combine} fileRequest={fileRequest?.route === 'convert' ? fileRequest : undefined} onFileRequestConsumed={consumeFileRequest} onModeChange={mode => navigate(`/convert?mode=${mode}`)} active={route === kind} />}
          {kind === 'calculate' && <CalculatorPage initialCalculator={studios.calculate.calculator} onSelectCalculator={id => { if (id !== studios.calculate.calculator) navigate(`/calculate?calculator=${id}`) }} />}
        </Suspense></ErrorBoundary>
      </div>)}
      {['pdf', 'workspace'].includes(route) && <ErrorBoundary key={route} onRetry={() => window.location.reload()}>
        <Suspense fallback={<div className="studio-page studio-loading"><h1>{route === 'workspace' ? t('workspace.title') : t(`shell.${route}`)}</h1><p role="status"><span className="studio-spinner" aria-hidden="true" />{t('shell.loading')}</p></div>}>
          {route === 'pdf' && <PdfEditorPage initialAction={pdfOptions.action} fileRequest={fileRequest?.route === 'pdf' ? fileRequest : undefined} onFileRequestConsumed={consumeFileRequest} onDirtyChange={onPdfDirtyChange} />}
          {route === 'workspace' && <WorkspacePage onOpenTool={openStudioTool} />}
        </Suspense>
      </ErrorBoundary>}
      {LegalPage && <LegalPage />}
    </AppShell>
  )
}
