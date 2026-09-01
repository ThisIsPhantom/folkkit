import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { getFormatById, releasedFormats } from './formats'
import { useTheme } from './hooks/useTheme'
import { useI18n } from './i18n'
import { getReleasedCategories, getReleasedTools } from './catalog/releaseCatalog'
import ConvertPanel from './components/ConvertPanel'
import History from './components/History'
import KeyboardHelp from './components/KeyboardHelp'
import ErrorBoundary from './components/ErrorBoundary'
import { readUrlState } from './routing/urlState'

// Map MIME types to converter IDs for auto-routing
function getConverterForFile(file) {
  const type = file.type || ''
  const name = file.name.toLowerCase()
  if (type === 'application/pdf' || name.endsWith('.pdf')) return 'pdf-page-count'
  if (type.startsWith('image/svg')) return 'svg-to-png'
  if (type.startsWith('image/')) return 'image-resize'
  if (type.startsWith('video/')) return 'video-to-audio'
  if (type.startsWith('audio/')) return 'audio-to-mp3'
  return null
}

function ensureMeta(selector, attributes = {}) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    Object.entries(attributes).forEach(([k, v]) => el.setAttribute(k, v))
    document.head.appendChild(el)
  }
  return el
}

function ensureCanonical() {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  return el
}

function App() {
  const { theme, toggle } = useTheme()
  const { locale } = useI18n()
  const releasedTools = useMemo(() => getReleasedTools(locale), [locale])
  const releasedCategories = useMemo(() => getReleasedCategories(locale), [locale])

  const [convertFrom, setConvertFrom] = useState(() => readUrlState(window.location.search, window.location.hash).from)
  const [convertTo, setConvertTo] = useState(() => readUrlState(window.location.search, window.location.hash).to)
  const [reuseRequest, setReuseRequest] = useState(null)
  const [activeToolId, setActiveToolId] = useState(() => {
    // Check ?tool= param first, then #tool/ hash for backward compat
    const { toolId } = readUrlState(window.location.search, window.location.hash)
    if (releasedTools.some(tool => tool.id === toolId)) return toolId
    return null
  })
  const activeConverter = useMemo(
    () => releasedTools.find(tool => tool.id === activeToolId) || null,
    [activeToolId, releasedTools],
  )

  const [showHelp, setShowHelp] = useState(false)
  const [pageDragging, setPageDragging] = useState(false)
  const [showTip, setShowTip] = useState(true)
  const [installPrompt, setInstallPrompt] = useState(null)
  const dragCountRef = useRef(0)
  const reuseRequestIdRef = useRef(0)

  const dismissTip = useCallback(() => {
    setShowTip(false)
  }, [])

  // Capture PWA install prompt
  useEffect(() => {
    if (localStorage.getItem('convert-everything-install-dismissed')) return
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = useCallback(async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    await installPrompt.userChoice
    setInstallPrompt(null)
  }, [installPrompt])

  const dismissInstall = useCallback(() => {
    setInstallPrompt(null)
    localStorage.setItem('convert-everything-install-dismissed', '1')
  }, [])

  // Dynamic page title/meta
  useEffect(() => {
    const base = 'Convert Everything'
    const fromName = getFormatById(convertFrom)?.name || convertFrom
    const toName = getFormatById(convertTo)?.name || convertTo
    const thing = activeConverter ? activeConverter.name : `${fromName} to ${toName}`
    const title = `${thing} - ${base}`
    const description = activeConverter
      ? `Use ${activeConverter.name} in your browser. No ads, no tracking, 100% local.`
      : `Convert ${fromName} to ${toName} instantly in your browser. No ads, no tracking, 100% local.`

    document.title = title

    ensureMeta('meta[name="description"]', { name: 'description' }).setAttribute('content', description)
    ensureMeta('meta[property="og:title"]', { property: 'og:title' }).setAttribute('content', title)
    ensureMeta('meta[property="og:description"]', { property: 'og:description' }).setAttribute('content', description)
    ensureMeta('meta[name="twitter:title"]', { name: 'twitter:title' }).setAttribute('content', title)
    ensureMeta('meta[name="twitter:description"]', { name: 'twitter:description' }).setAttribute('content', description)

    const canonical = new URL(window.location.pathname, window.location.origin)
    if (activeConverter) {
      canonical.searchParams.set('tool', activeConverter.id)
    } else {
      canonical.searchParams.set('from', convertFrom)
      canonical.searchParams.set('to', convertTo)
    }
    ensureCanonical().setAttribute('href', canonical.toString())
  }, [activeConverter, convertFrom, convertTo])

  const handleHistorySelect = useCallback((item) => {
    if (activeConverter) setActiveToolId(null)
    setConvertFrom(item.from)
    setConvertTo(item.to)
    setReuseRequest({ id: ++reuseRequestIdRef.current, value: item.input })
  }, [activeConverter])

  const handleReuseConsumed = useCallback((id) => {
    setReuseRequest(current => current?.id === id ? null : current)
  }, [])

  const handleCloseHelp = useCallback(() => setShowHelp(false), [])

  // Sync URL when state changes
  useEffect(() => {
    let url = window.location.pathname
    if (activeConverter) {
      const params = new URLSearchParams()
      params.set('tool', activeConverter.id)
      url += `?${params.toString()}`
    } else {
      const params = new URLSearchParams()
      params.set('from', convertFrom)
      params.set('to', convertTo)
      url += `?${params.toString()}`
    }
    history.replaceState(null, '', url)
  }, [convertFrom, convertTo, activeConverter])

  // Handle browser back/forward
  useEffect(() => {
    const handlePop = () => {
      const { from, to, toolId } = readUrlState(window.location.search, window.location.hash)
      if (toolId) {
        const c = releasedTools.find(tool => tool.id === toolId)
        if (c) {
          setActiveToolId(c.id)
          return
        }
      }
      setActiveToolId(null)
      setConvertFrom(from)
      setConvertTo(to)
    }
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [releasedTools])

  const handleConverterChange = useCallback((converter) => {
    if (converter) {
      const p = new URLSearchParams({ tool: converter.id })
      history.pushState(null, '', '?' + p.toString())
    } else {
      const p = new URLSearchParams({ from: convertFrom, to: convertTo })
      history.pushState(null, '', '?' + p.toString())
    }
    setActiveToolId(converter?.id || null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [convertFrom, convertTo])

  // Page-level drag-and-drop file routing
  useEffect(() => {
    const handleDragEnter = (e) => {
      e.preventDefault()
      dragCountRef.current++
      if (dragCountRef.current === 1) setPageDragging(true)
    }
    const handleDragLeave = (e) => {
      e.preventDefault()
      dragCountRef.current--
      if (dragCountRef.current === 0) setPageDragging(false)
    }
    const handleDragOver = (e) => e.preventDefault()
    const handleDrop = (e) => {
      e.preventDefault()
      dragCountRef.current = 0
      setPageDragging(false)
      if (activeConverter) return
      const file = e.dataTransfer?.files?.[0]
      if (!file) return
      const converterId = getConverterForFile(file)
      if (!converterId) return
      const c = releasedTools.find(tool => tool.id === converterId)
      if (c) handleConverterChange(c)
    }
    document.addEventListener('dragenter', handleDragEnter)
    document.addEventListener('dragleave', handleDragLeave)
    document.addEventListener('dragover', handleDragOver)
    document.addEventListener('drop', handleDrop)
    return () => {
      document.removeEventListener('dragenter', handleDragEnter)
      document.removeEventListener('dragleave', handleDragLeave)
      document.removeEventListener('dragover', handleDragOver)
      document.removeEventListener('drop', handleDrop)
    }
  }, [activeConverter, handleConverterChange, releasedTools])

  // Global paste: route clipboard images to image converter
  useEffect(() => {
    const handlePaste = (e) => {
      if (activeConverter) return
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)
      if (isInput) return
      const items = e.clipboardData?.items
      if (!items) return
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault()
          const c = releasedTools.find(tool => tool.id === 'image-resize')
          if (c) handleConverterChange(c)
          return
        }
      }
    }
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [activeConverter, handleConverterChange, releasedTools])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)

      // Escape to clear converter
      if (e.key === 'Escape' && activeConverter) {
        setActiveToolId(null)
        const p = new URLSearchParams({ from: convertFrom, to: convertTo })
        history.pushState(null, '', '?' + p.toString())
        return
      }

      // Cmd+D / Ctrl+D to toggle theme
      if ((e.metaKey || e.ctrlKey) && e.key === 'd' && !isInput) {
        e.preventDefault()
        toggle()
      }

      // "?" to toggle keyboard help
      if (e.key === '?' && !isInput) {
        e.preventDefault()
        setShowHelp(prev => !prev)
        return
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [activeConverter, toggle, convertFrom, convertTo])

  const isFormatMode = !activeConverter

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <main id="main-content" className={`app${isFormatMode ? ' full-height' : ''}`} role="main">
        <div className="app-topbar">
          <h1 className="app-title">Convert Everything</h1>
          <div className="app-topbar-spacer" />
          <button className="theme-toggle" onClick={toggle} title="Toggle theme (Ctrl+D)">
            {theme === 'light' ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1v1.5M8 13.5V15M15 8h-1.5M2.5 8H1M12.95 3.05l-1.06 1.06M4.11 11.89l-1.06 1.06M12.95 12.95l-1.06-1.06M4.11 4.11L3.05 3.05M11 8a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M14 10.2A6.5 6.5 0 015.8 2 6 6 0 1014 10.2z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>

        {showTip && !activeConverter && (
          <div className="tip-banner">
            <span>Press <kbd>?</kbd> for shortcuts. Drag files or paste images to auto-convert.</span>
            <button className="tip-dismiss" onClick={dismissTip} aria-label="Dismiss">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        )}

        {installPrompt && !activeConverter && (
          <div className="tip-banner">
            <span>Install Convert Everything for offline use</span>
            <button className="pill-btn-sm" onClick={handleInstall}>Install</button>
            <button className="tip-dismiss" onClick={dismissInstall} aria-label="Dismiss">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        )}

        <div className="tab-content">
          <ErrorBoundary key={activeConverter?.id || 'format'}>
            <ConvertPanel
              from={convertFrom}
              to={convertTo}
              onFromChange={setConvertFrom}
              onToChange={setConvertTo}
              reuseRequest={reuseRequest}
              onReuseConsumed={handleReuseConsumed}
              activeConverter={activeConverter}
              onConverterChange={handleConverterChange}
              releasedFormats={releasedFormats}
              releasedTools={releasedTools}
              categories={releasedCategories}
            />
          </ErrorBoundary>
          {!activeConverter && <History onSelect={handleHistorySelect} />}
        </div>
      </main>
      <KeyboardHelp open={showHelp} onClose={handleCloseHelp} />
      {pageDragging && !activeConverter && (
        <div className="drop-overlay">
          <div className="drop-overlay-content">Drop file to convert</div>
        </div>
      )}
    </>
  )
}

export default App
