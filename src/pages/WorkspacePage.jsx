import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getFormatById, releasedFormats } from '../formats'
import { useI18n } from '../i18n'
import { getReleasedCategories, getReleasedTools } from '../catalog/releaseCatalog'
import { loadConverter } from '../converters/loadConverter'
import { isReleasedFormatPair } from '../catalog/evidenceRegistry'
import ConvertPanel from '../components/ConvertPanel'
import ErrorBoundary from '../components/ErrorBoundary'
import History from '../components/History'
import KeyboardHelp from '../components/KeyboardHelp'
import { readUrlState } from '../routing/urlState'
import { getNavigationScrollBehavior } from '../utils/motion'

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
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value))
    document.head.appendChild(element)
  }
  return element
}

function ensureCanonical() {
  let element = document.head.querySelector('link[rel="canonical"]')
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', 'canonical')
    document.head.appendChild(element)
  }
  return element
}

export default function WorkspacePage() {
  const { locale, t } = useI18n()
  const releasedTools = useMemo(() => getReleasedTools(locale), [locale])
  const releasedCategories = useMemo(() => getReleasedCategories(locale), [locale])
  const initialUrlState = useMemo(() => readUrlState(window.location.search, window.location.hash), [])
  const [convertFrom, setConvertFrom] = useState(initialUrlState.from)
  const [convertTo, setConvertTo] = useState(initialUrlState.to)
  const [reuseRequest, setReuseRequest] = useState(null)
  const [activeToolId, setActiveToolId] = useState(() => releasedTools.some((tool) => tool.id === initialUrlState.toolId) ? initialUrlState.toolId : null)
  const [loadedConverter, setLoadedConverter] = useState(null)
  const [toolLoadError, setToolLoadError] = useState(null)
  const [toolLoadAttempt, setToolLoadAttempt] = useState(0)
  const [showHelp, setShowHelp] = useState(false)
  const [pageDragging, setPageDragging] = useState(false)
  const dragCountRef = useRef(0)
  const reuseRequestIdRef = useRef(0)
  const activeToolMetadata = useMemo(() => releasedTools.find((tool) => tool.id === activeToolId) || null, [activeToolId, releasedTools])
  const activeConverter = useMemo(() => {
    if (!activeToolMetadata || loadedConverter?.id !== activeToolMetadata.id) return null
    return { ...loadedConverter.converter, ...activeToolMetadata }
  }, [activeToolMetadata, loadedConverter])

  useEffect(() => {
    if (!activeToolId) return undefined
    let current = true
    loadConverter(activeToolId).then((converter) => {
      if (current && converter) setLoadedConverter({ id: activeToolId, converter })
    }).catch(() => {
      if (current) {
        setToolLoadError({ id: activeToolId, attempt: toolLoadAttempt })
      }
    })
    return () => { current = false }
  }, [activeToolId, toolLoadAttempt])

  useEffect(() => {
    const fromName = getFormatById(convertFrom)?.name || convertFrom
    const toName = getFormatById(convertTo)?.name || convertTo
    const thing = activeToolMetadata ? activeToolMetadata.name : `${fromName} to ${toName}`
    const title = `${thing} · Folkkit`
    const description = locale === 'de'
      ? `${thing} lokal im Browser verwenden. Dateiinhalte werden nicht hochgeladen.`
      : `Use ${thing} locally in your browser. File contents are not uploaded.`
    document.title = title
    ensureMeta('meta[name="description"]', { name: 'description' }).setAttribute('content', description)
    ensureMeta('meta[property="og:title"]', { property: 'og:title' }).setAttribute('content', title)
    ensureMeta('meta[property="og:description"]', { property: 'og:description' }).setAttribute('content', description)
    const canonical = new URL(window.location.pathname, window.location.origin)
    if (activeToolMetadata) canonical.searchParams.set('tool', activeToolMetadata.id)
    else {
      canonical.searchParams.set('from', convertFrom)
      canonical.searchParams.set('to', convertTo)
    }
    ensureCanonical().setAttribute('href', canonical.toString())
  }, [activeToolMetadata, convertFrom, convertTo, locale])

  useEffect(() => {
    const handlePop = () => {
      const { from, to, toolId } = readUrlState(window.location.search, window.location.hash)
      const tool = releasedTools.find((entry) => entry.id === toolId)
      setActiveToolId(tool?.id || null)
      if (!tool) {
        setConvertFrom(from)
        setConvertTo(to)
      }
    }
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [releasedTools])

  const handleConverterChange = useCallback((converter) => {
    const params = converter
      ? new URLSearchParams({ tool: converter.id })
      : new URLSearchParams({ from: convertFrom, to: convertTo })
    history.pushState(null, '', `${window.location.pathname}?${params}`)
    setActiveToolId(converter?.id || null)
    window.scrollTo({ top: 0, behavior: getNavigationScrollBehavior() })
  }, [convertFrom, convertTo])

  const handleHistorySelect = useCallback((item) => {
    if (!isReleasedFormatPair(item?.from, item?.to)) return
    setActiveToolId(null)
    setConvertFrom(item.from)
    setConvertTo(item.to)
    setReuseRequest({ id: ++reuseRequestIdRef.current, value: item.input })
  }, [])

  const handleReuseConsumed = useCallback((id) => {
    setReuseRequest((current) => current?.id === id ? null : current)
  }, [])

  const retryToolLoad = useCallback(() => {
    if (navigator.onLine) {
      window.location.reload()
      return
    }
    setToolLoadAttempt(attempt => attempt + 1)
  }, [])

  useEffect(() => {
    const handleDragEnter = (event) => {
      event.preventDefault()
      dragCountRef.current += 1
      if (dragCountRef.current === 1) setPageDragging(true)
    }
    const handleDragLeave = (event) => {
      event.preventDefault()
      dragCountRef.current -= 1
      if (dragCountRef.current === 0) setPageDragging(false)
    }
    const handleDragOver = (event) => event.preventDefault()
    const handleDrop = (event) => {
      event.preventDefault()
      dragCountRef.current = 0
      setPageDragging(false)
      if (activeToolMetadata) return
      const file = event.dataTransfer?.files?.[0]
      const converterId = file ? getConverterForFile(file) : null
      const converter = releasedTools.find((tool) => tool.id === converterId)
      if (converter) handleConverterChange(converter)
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
  }, [activeToolMetadata, handleConverterChange, releasedTools])

  useEffect(() => {
    const handlePaste = (event) => {
      if (activeToolMetadata || ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return
      const imageItem = Array.from(event.clipboardData?.items || []).find((item) => item.type.startsWith('image/'))
      if (!imageItem) return
      const converter = releasedTools.find((tool) => tool.id === 'image-resize')
      if (converter) {
        event.preventDefault()
        handleConverterChange(converter)
      }
    }
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [activeToolMetadata, handleConverterChange, releasedTools])

  useEffect(() => {
    const handleKey = (event) => {
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)
      if (event.key === 'Escape' && activeToolMetadata) {
        const params = new URLSearchParams({ from: convertFrom, to: convertTo })
        history.pushState(null, '', `${window.location.pathname}?${params}`)
        setActiveToolId(null)
      } else if (event.key === '?' && !isInput) {
        event.preventDefault()
        setShowHelp((open) => !open)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [activeToolMetadata, convertFrom, convertTo])

  return (
    <div className="workspace-page">
      <header className="workspace-heading heading-group">
        <p className="eyebrow">{t('workspace.eyebrow')}</p>
        <h1 className="display">{activeToolMetadata?.name || t('workspace.title')}</h1>
        <p>{t('workspace.intro')}</p>
      </header>
      <div className="workspace-surface">
        <ErrorBoundary key={activeToolMetadata?.id || 'format'}>
          {activeToolMetadata && toolLoadError?.id === activeToolId && toolLoadError.attempt === toolLoadAttempt ? (
            <div className="error-msg" role="alert">
              <p>{t(activeToolMetadata.module === 'media' ? 'workspaceTools.mediaModuleUnavailable' : 'workspaceTools.toolModuleUnavailable')}</p>
              <button type="button" onClick={retryToolLoad}>
                {t('workspaceTools.retryModule')}
              </button>
            </div>
          ) : activeToolMetadata && !activeConverter ? (
            <p role="status">{t('workspaceTools.loadingTool')}</p>
          ) : <ConvertPanel
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
          />}
        </ErrorBoundary>
        {!activeToolMetadata && <History onSelect={handleHistorySelect} />}
      </div>
      <KeyboardHelp open={showHelp} onClose={() => setShowHelp(false)} />
      {pageDragging && !activeToolMetadata && <div className="drop-overlay"><div className="drop-overlay-content">{t('workspace.dropOverlay')}</div></div>}
    </div>
  )
}
