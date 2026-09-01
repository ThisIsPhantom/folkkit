import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import ToolPicker from './ToolPicker'
import { useToast } from '../hooks/useToast'
import { formats, getTargets, getConvertFn, getFormatById } from '../formats'
import { useI18n } from '../i18n'
import { historyStore } from '../privacy/historyStore'
import { onFFmpegLoad } from '../converters/media'
import { createToolRuntime } from '../runtime/toolRuntime'
import { rgbToHex, parseRgb, parseHsl, hslToRgb, hsvToRgb, parseHsv } from '../utils/color'
import FileDropZone from './workspace/FileDropZone'
import ProgressStatus from './workspace/ProgressStatus'
import ResultActions from './workspace/ResultActions'
import ErrorNotice from './workspace/ErrorNotice'
import './ConvertPanel.css'
import './workspace/workspace.css'

// Detect format from content
function detectFormat(text) {
  const t = text.trim()
  if (!t) return null

  // JSON
  if ((t.startsWith('{') && t.endsWith('}')) || (t.startsWith('[') && t.endsWith(']'))) {
    try { JSON.parse(t); return 'json' } catch { /* not JSON */ }
  }

  // Base64
  if (/^[A-Za-z0-9+/=]{8,}$/.test(t) && t.length % 4 === 0) {
    try { atob(t); return 'base64' } catch { /* not base64 */ }
  }

  // Hex (space-separated)
  if (/^([0-9a-fA-F]{2}\s)+[0-9a-fA-F]{2}$/.test(t)) return 'hex'

  // Color hex
  if (/^#[0-9a-fA-F]{3,8}$/.test(t)) return 'color-hex'
  // Color rgb
  if (/^rgba?\(\s*\d+/.test(t)) return 'color-rgb'
  // Color hsl
  if (/^hsla?\(\s*\d+/.test(t)) return 'color-hsl'
  // Color hsv
  if (/^hsv\(\s*\d+/.test(t)) return 'color-hsv'

  // Binary
  if (/^([01]{8}\s)+[01]{8}$/.test(t)) return 'binary'

  // UUID-like
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(t)) return 'text'

  // Unix timestamp (all digits, 10 or 13 length)
  if (/^\d{10,13}$/.test(t)) return 'timestamp'

  // URL encoded
  if (/%[0-9a-fA-F]{2}/.test(t) && t.includes('%')) return 'url'

  // XML
  if (t.startsWith('<?xml') || (t.startsWith('<') && t.endsWith('>') && t.includes('</'))) return 'xml'

  // TOML (has "key = value" on lines)
  if (/^\[[\w.]+\]/m.test(t) && /^\w+\s*=\s*.+/m.test(t)) return 'toml'

  // YAML (has ": " on lines)
  if (/^[a-zA-Z_][a-zA-Z0-9_]*:\s/m.test(t) && !t.includes('{')) return 'yaml'

  // TSV (has tabs and newlines)
  if (t.includes('\t') && t.includes('\n') && t.split('\n')[0].split('\t').length > 1) return 'tsv'

  // CSV (has commas and newlines)
  if (t.includes(',') && t.includes('\n') && t.split('\n')[0].split(',').length > 1) return 'csv'

  // Query string
  if (/^[a-zA-Z0-9_]+=/.test(t) && t.includes('&')) return 'querystring'

  // Morse
  if (/^[.\-/ ]+$/.test(t) && t.includes('.')) return 'morse'

  // Roman numeral (e.g., XLII, MCMLIV)
  if (/^[IVXLCDM]{2,15}$/i.test(t)) return 'roman'

  // Octal number
  if (/^0o[0-7]+$/i.test(t)) return 'numoct'

  // Number (dec)
  if (/^-?\d+(\.\d+)?$/.test(t)) return 'decimal'
  // Hex number
  if (/^0x[0-9a-fA-F]+$/i.test(t)) return 'numhex'
  // Binary number
  if (/^0b[01]+$/i.test(t)) return 'numbin'

  // Temperature (e.g., "100°C", "212°F", "373.15K")
  if (/^-?\d+(\.\d+)?\s*°?[Cc]$/.test(t)) return 'celsius'
  if (/^-?\d+(\.\d+)?\s*°?[Ff]$/.test(t)) return 'fahrenheit'
  if (/^-?\d+(\.\d+)?\s*[Kk]$/.test(t)) return 'kelvin'

  // ISO date
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(t)) return 'iso-date'

  // HTML
  if (/<[a-z][^>]*>/i.test(t) && t.includes('</')) return 'html-markup'

  // Markdown
  if (/^#{1,6}\s/m.test(t) || /\*\*.+\*\*/m.test(t)) return 'markdown'

  return null
}

function autoResize(el) {
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.max(120, el.scrollHeight) + 'px'
}

const FAV_PAIRS_KEY = 'convert-everything-fav-pairs'
function getFavPairs() { try { return JSON.parse(localStorage.getItem(FAV_PAIRS_KEY)) || [] } catch { return [] } }
function saveFavPairs(pairs) { localStorage.setItem(FAV_PAIRS_KEY, JSON.stringify(pairs)) }

function ConvertPanelSession({ from, to, onFromChange, onToChange, activeConverter, onConverterChange, initialInput = '', reuseRequestId, onReuseConsumed, releasedFormats = formats, releasedTools = [], categories = [] }) {
  const { t } = useI18n()
  const [input, setInput] = useState(initialInput)
  const [output, setOutput] = useState('')
  const [batchMode, setBatchMode] = useState(false)
  const [wrapOutput, setWrapOutput] = useState(true)
  const [lineNumbers, setLineNumbers] = useState(false)
  const [favPairs, setFavPairs] = useState(getFavPairs)
  const toast = useToast()
  const inputRef = useRef(null)
  const outputRef = useRef(null)
  const gutterRef = useRef(null)
  const fromWrapperRef = useRef(null)
  const toWrapperRef = useRef(null)

  // ToolPicker state
  const [fromPickerOpen, setFromPickerOpen] = useState(false)
  const [toPickerOpen, setToPickerOpen] = useState(false)

  // Tool mode state (absorbed from ConverterView)
  const [mediaResult, setMediaResult] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [textParam, setTextParam] = useState('')
  const [ffmpegStatus, setFfmpegStatus] = useState(null)
  const toolInputRef = useRef(null)
  const toolOutputRef = useRef(null)
  const formatRunIdRef = useRef(0)
  const toolRunIdRef = useRef(0)
  const fileRunIdRef = useRef(0)
  const activeConverterIdRef = useRef(activeConverter?.id || null)
  const runtimeRef = useRef(null)
  if (!runtimeRef.current) runtimeRef.current = createToolRuntime()
  const swappedTimeoutRef = useRef(null)
  const autoDetectTimeoutRef = useRef(null)

  const setFrom = onFromChange
  const setTo = onToChange

  const targets = getTargets(from)

  // Determine mode
  const isToolMode = !!activeConverter
  const isGenerator = isToolMode && !!activeConverter.isGenerator
  const acceptsFile = isToolMode && !!activeConverter.acceptsFile
  const isMedia = isToolMode && !!activeConverter.isMediaConverter
  const hasTextInput = isToolMode && !!activeConverter.hasTextInput
  const multipleFiles = isToolMode && !!activeConverter.multipleFiles
  // Text-to-text tool: has convert function, no file input, not generator
  const isTextTool = isToolMode && !acceptsFile && !isGenerator

  useEffect(() => {
    if (reuseRequestId == null) return
    let cancelled = false
    Promise.resolve().then(() => {
      if (cancelled) return
      inputRef.current?.focus()
      onReuseConsumed?.(reuseRequestId)
    })
    return () => { cancelled = true }
  }, [reuseRequestId, onReuseConsumed])

  useEffect(() => {
    activeConverterIdRef.current = activeConverter?.id || null
    toolRunIdRef.current += 1
    fileRunIdRef.current += 1
  }, [activeConverter])

  useEffect(() => {
    formatRunIdRef.current += 1
  }, [isToolMode])

  useEffect(() => {
    return () => {
      if (swappedTimeoutRef.current) clearTimeout(swappedTimeoutRef.current)
      if (autoDetectTimeoutRef.current) clearTimeout(autoDetectTimeoutRef.current)
      runtimeRef.current?.dispose()
    }
  }, [])

  // When "from" changes, auto-select first available "to" and focus input
  useEffect(() => {
    if (isToolMode) return
    let cancelled = false
    Promise.resolve().then(() => {
      if (cancelled) return
      const newTargets = getTargets(from)
      if (!newTargets.includes(to) && newTargets.length > 0) {
        setTo(newTargets[0])
      }
      inputRef.current?.focus()
    })
    return () => { cancelled = true }
  }, [from, to, isToolMode, setTo])

  // Format-pair conversion
  const runFormatConvert = useCallback(async () => {
    const runId = ++formatRunIdRef.current
    if (isToolMode) return
    if (!input.trim()) {
      if (runId === formatRunIdRef.current) setOutput('')
      return
    }
    const fn = getConvertFn(from, to)
    if (!fn) {
      if (runId === formatRunIdRef.current) setOutput('')
      return
    }
    try {
      let result
      if (batchMode) {
        const lines = input.split('\n')
        const results = await Promise.all(lines.map(async (line) => {
          if (!line.trim()) return ''
          try { return await fn(line) } catch (err) { return `(error: ${err.message || 'unknown'})` }
        }))
        result = results.join('\n')
      } else {
        result = await fn(input)
      }
      if (runId !== formatRunIdRef.current || isToolMode) return
      setOutput(result)
      if (result && result !== '(conversion error)') {
        historyStore.append({ from, to, input, output: result, timestamp: Date.now() })
      }
    } catch {
      if (runId === formatRunIdRef.current && !isToolMode) {
        setOutput('(conversion error)')
      }
    }
  }, [input, from, to, batchMode, isToolMode])

  useEffect(() => {
    if (isToolMode) return
    let cancelled = false
    Promise.resolve().then(() => {
      if (!cancelled) runFormatConvert()
    })
    return () => { cancelled = true }
  }, [runFormatConvert, isToolMode])

  // Tool text conversion
  const runToolConvert = useCallback(async (value) => {
    if (!activeConverter) return
    const converter = activeConverter
    const converterId = converter.id
    const runId = ++toolRunIdRef.current
    if (!value && !isGenerator) {
      if (runId === toolRunIdRef.current && activeConverterIdRef.current === converterId) setOutput('')
      return
    }
    setError(null)
    try {
      const record = await runtimeRef.current.run({ tool: converter, text: value })
      if (runId !== toolRunIdRef.current || activeConverterIdRef.current !== converterId) return
      if (!record) return
      if (record.result.kind === 'text') {
        setOutput(record.result.text)
        setMediaResult(null)
      } else {
        setOutput('')
        setMediaResult(record)
      }
    } catch (runtimeFailure) {
      if (runId === toolRunIdRef.current && activeConverterIdRef.current === converterId) {
        setOutput('')
        setError(runtimeFailure)
      }
    }
  }, [activeConverter, isGenerator])

  useEffect(() => {
    if (!isTextTool || isMedia) return
    let cancelled = false
    Promise.resolve().then(() => {
      if (!cancelled) runToolConvert(input)
    })
    return () => { cancelled = true }
  }, [input, runToolConvert, isTextTool, isMedia])

  useEffect(() => {
    if (!isGenerator) return
    let cancelled = false
    Promise.resolve().then(() => {
      if (!cancelled) runToolConvert('')
    })
    return () => { cancelled = true }
  }, [isGenerator, runToolConvert])

  // FFmpeg status
  useEffect(() => {
    if (!isMedia) return
    return onFFmpegLoad((status) => {
      setFfmpegStatus(status === 'ready' ? null : status)
    })
  }, [isMedia])

  // Auto-resize textareas
  useEffect(() => {
    if (isToolMode) {
      autoResize(toolInputRef.current)
    } else {
      if (inputRef.current) {
        inputRef.current.style.height = 'auto'
        inputRef.current.style.height = Math.max(120, inputRef.current.scrollHeight) + 'px'
      }
    }
  }, [input, isToolMode])

  useEffect(() => {
    if (isToolMode) {
      autoResize(toolOutputRef.current)
    } else {
      if (outputRef.current) {
        outputRef.current.style.height = 'auto'
        outputRef.current.style.height = Math.max(120, outputRef.current.scrollHeight) + 'px'
      }
    }
  }, [output, isToolMode])

  const [swapped, setSwapped] = useState(false)
  const handleSwap = useCallback(() => {
    const reverseFn = getConvertFn(to, from)
    if (!reverseFn) return
    setFrom(to)
    setTo(from)
    setInput(output)
    setSwapped(true)
    if (swappedTimeoutRef.current) clearTimeout(swappedTimeoutRef.current)
    swappedTimeoutRef.current = setTimeout(() => {
      setSwapped(false)
      swappedTimeoutRef.current = null
    }, 300)
  }, [from, to, output, setFrom, setTo])

  const handleCopy = async () => {
    const text = output || (mediaResult?.result?.kind === 'text' ? mediaResult.result.text : '')
    if (!text) return
    await navigator.clipboard.writeText(text)
    toast('Copied to clipboard')
  }

  const handleClear = useCallback(() => {
    runtimeRef.current.reset()
    toolRunIdRef.current += 1
    fileRunIdRef.current += 1
    setInput('')
    setOutput('')
    setMediaResult(null)
    setError(null)
    setSelectedFiles([])
    setTextParam('')
    setProgress(0)
    setProcessing(false)
    const ref = isToolMode ? toolInputRef : inputRef
    ref.current?.focus()
  }, [isToolMode])

  const handleSelectOutput = useCallback(() => {
    const ref = isToolMode ? toolOutputRef : outputRef
    ref.current?.select()
  }, [isToolMode])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.shiftKey && e.key === 'c') {
        if (output && output !== '(conversion error)') {
          e.preventDefault()
          navigator.clipboard.writeText(output).then(() => toast('Copied output'))
        }
      }
      if (mod && e.key === 'b' && !e.shiftKey && !isToolMode) {
        e.preventDefault()
        setBatchMode(b => !b)
      }
      if (mod && e.shiftKey && (e.key === 's' || e.key === 'S') && !isToolMode) {
        e.preventDefault()
        handleSwap()
      }
      if (mod && e.shiftKey && (e.key === 'x' || e.key === 'X')) {
        e.preventDefault()
        handleClear()
      }
      if (mod && e.key === 'l' && !e.shiftKey) {
        e.preventDefault()
        const ref = isToolMode ? toolInputRef : inputRef
        ref.current?.focus()
        ref.current?.select()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [output, toast, handleSwap, isToolMode, handleClear])

  const canSwap = !isToolMode && !!getConvertFn(to, from)

  const handleDownload = () => {
    if (isToolMode && mediaResult?.url) {
      const a = document.createElement('a')
      a.href = mediaResult.url
      a.download = mediaResult.result?.filename || 'output'
      a.click()
      return
    }
    if (!output) return
    const record = runtimeRef.current.present({
      kind: 'download',
      blob: new Blob([output], { type: 'text/plain' }),
      filename: isToolMode ? `${activeConverter.id}-output.txt` : `${from}-to-${to}.txt`,
    })
    const a = document.createElement('a')
    a.href = record.url
    a.download = record.result.filename
    a.click()
  }

  const handleShare = async () => {
    if (isToolMode) {
      const toolParams = new URLSearchParams({ tool: activeConverter.id })
      const url = window.location.origin + window.location.pathname + '?' + toolParams.toString()
      const shareData = {
        title: activeConverter.name,
        text: output ? output.slice(0, 500) : activeConverter.description,
        url,
      }
      if (navigator.share) {
        try { await navigator.share(shareData) } catch { /* cancelled */ }
      } else {
        await navigator.clipboard.writeText(url)
        toast('Link copied')
      }
      return
    }
    const params = new URLSearchParams({ from, to })
    const url = window.location.origin + window.location.pathname + '?' + params.toString()
    if (navigator.share) {
      try { await navigator.share({ title: `${getFormatById(from)?.name} → ${getFormatById(to)?.name}`, url }) } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(url)
      toast('Share link copied')
    }
  }

  const handleUseAsInput = () => {
    if (!output || output === '(conversion error)') return
    const detected = detectFormat(output)
    if (detected && detected !== from && getTargets(detected).length > 0) {
      setFrom(detected)
    }
    setInput(output)
    setOutput('')
  }

  const handleSaveFile = () => {
    if (!output) return
    const record = runtimeRef.current.present({
      kind: 'download',
      blob: new Blob([output], { type: 'text/plain' }),
      filename: isToolMode ? `${activeConverter.id}-output.txt` : `${from}-to-${to}.txt`,
    })
    const a = document.createElement('a')
    a.href = record.url
    a.download = record.result.filename
    a.click()
  }

  // Smart paste detection (format-pair mode only)
  const [autoDetected, setAutoDetected] = useState(false)
  const handlePaste = (e) => {
    if (isToolMode) return
    const text = e.clipboardData?.getData('text')
    if (!text || input.trim()) return
    const detected = detectFormat(text)
    if (detected && detected !== from && getTargets(detected).length > 0) {
      setFrom(detected)
      setAutoDetected(true)
      if (autoDetectTimeoutRef.current) clearTimeout(autoDetectTimeoutRef.current)
      autoDetectTimeoutRef.current = setTimeout(() => {
        setAutoDetected(false)
        autoDetectTimeoutRef.current = null
      }, 1500)
    }
  }

  const pairKey = `${from}→${to}`
  const isPairFav = favPairs.includes(pairKey)
  const toggleFavPair = useCallback(() => {
    setFavPairs(prev => {
      const next = prev.includes(pairKey) ? prev.filter(p => p !== pairKey) : [...prev, pairKey].slice(-8)
      saveFavPairs(next)
      return next
    })
  }, [pairKey])

  const allFromIds = useMemo(() => {
    return formats.filter(f => getTargets(f.id).length > 0).map(f => f.id)
  }, [])
  const toIds = targets.length > 0 ? targets : []

  const fromFmt = getFormatById(from)
  const toFmt = getFormatById(to)
  const inputPlaceholder = isToolMode ? (activeConverter.placeholder || 'Type or paste here...') : (fromFmt?.placeholder || 'Type or paste...')
  const outputPlaceholder = isToolMode ? 'Result will appear here...' : (toFmt?.placeholder || 'Result...')

  // Color input picker
  const isColorInput = !isToolMode && ['color-hex', 'color-rgb', 'color-hsl', 'color-hsv'].includes(from)
  const colorInputRef = useRef(null)

  const colorPickerValue = useMemo(() => {
    if (!isColorInput || !input.trim()) return '#000000'
    try {
      if (from === 'color-hex') {
        const hex = input.trim()
        return hex.length === 4 ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}` : hex.slice(0, 7)
      }
      if (from === 'color-rgb') {
        const rgb = parseRgb(input.trim())
        return rgb ? rgbToHex(rgb) : '#000000'
      }
      if (from === 'color-hsl') {
        const hsl = parseHsl(input.trim())
        return hsl ? rgbToHex(hslToRgb(hsl)) : '#000000'
      }
      if (from === 'color-hsv') {
        const hsv = parseHsv(input.trim())
        return hsv ? rgbToHex(hsvToRgb(hsv)) : '#000000'
      }
    } catch { /* fallback */ }
    return '#000000'
  }, [isColorInput, from, input])

  const handleColorPick = (e) => {
    const hex = e.target.value
    if (from === 'color-hex') setInput(hex)
    else if (from === 'color-rgb') {
      const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16)
      setInput(`rgb(${r}, ${g}, ${b})`)
    } else if (from === 'color-hsl') {
      const r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255
      const max = Math.max(r, g, b), min = Math.min(r, g, b)
      const l = (max + min) / 2
      if (max === min) { setInput(`hsl(0, 0%, ${Math.round(l * 100)}%)`); return }
      const d = max - min, s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      let h; if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6; else if (max === g) h = ((b - r) / d + 2) / 6; else h = ((r - g) / d + 4) / 6
      setInput(`hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`)
    } else if (from === 'color-hsv') {
      const rr = parseInt(hex.slice(1, 3), 16) / 255, gg = parseInt(hex.slice(3, 5), 16) / 255, bb = parseInt(hex.slice(5, 7), 16) / 255
      const max = Math.max(rr, gg, bb), min = Math.min(rr, gg, bb), d = max - min
      let h = 0
      if (d !== 0) {
        if (max === rr) h = ((gg - bb) / d + (gg < bb ? 6 : 0)) / 6
        else if (max === gg) h = ((bb - rr) / d + 2) / 6
        else h = ((rr - gg) / d + 4) / 6
      }
      setInput(`hsv(${Math.round(h * 360)}, ${Math.round((max === 0 ? 0 : d / max) * 100)}%, ${Math.round(max * 100)}%)`)
    }
  }

  // Chain hints
  const chainTargets = useMemo(() => {
    if (isToolMode) return []
    const next = getTargets(to).filter(t => t !== from)
    return next.slice(0, 4).map(t => getFormatById(t)).filter(Boolean)
  }, [to, from, isToolMode])

  // Scroll sync for line number gutter
  const handleOutputScroll = useCallback(() => {
    if (gutterRef.current && outputRef.current) {
      gutterRef.current.scrollTop = outputRef.current.scrollTop
    }
  }, [])

  const outputLineCount = useMemo(() => {
    if (!output) return 0
    return output.split('\n').length
  }, [output])

  // Color preview for color conversions
  const isColorOutput = !isToolMode && ['color-hex', 'color-rgb', 'color-hsl', 'color-hsv'].includes(to)
  const colorPreview = useMemo(() => {
    if (!isColorOutput || !output || output.startsWith('(')) return null
    if (to === 'color-hsv') {
      const hsv = parseHsv(output)
      return hsv ? rgbToHex(hsvToRgb(hsv)) : null
    }
    return output
  }, [isColorOutput, to, output])

  // File handling for non-media file converters
  const handleSimpleFile = async (file) => {
    if (!file || !activeConverter?.fileConvert) return
    const converter = activeConverter
    const converterId = converter.id
    const runId = ++fileRunIdRef.current
    try {
      const record = await runtimeRef.current.run({ tool: converter, files: [file] })
      if (runId !== fileRunIdRef.current || activeConverterIdRef.current !== converterId) return
      if (!record) return
      if (record.result.kind === 'text') setOutput(record.result.text)
      else setMediaResult(record)
      setInput(file.name)
    } catch (runtimeFailure) {
      if (runId === fileRunIdRef.current && activeConverterIdRef.current === converterId) {
        setError(runtimeFailure)
      }
    }
  }

  // File handling for media converters
  const handleMediaFiles = async (files) => {
    if (!files.length || !activeConverter?.fileConvert) return
    const converter = activeConverter
    const converterId = converter.id
    const runId = ++fileRunIdRef.current
    const filesList = Array.from(files)
    const updateProgress = (p) => {
      if (runId === fileRunIdRef.current && activeConverterIdRef.current === converterId) {
        setProgress(p)
      }
    }
    setSelectedFiles(Array.from(files))
    setProcessing(true)
    setProgress(0)
    setError(null)
    setMediaResult(null)

    try {
      const record = await runtimeRef.current.run({
        tool: converter,
        files: filesList,
        text: hasTextInput ? textParam : '',
        onProgress: updateProgress,
      })
      if (runId !== fileRunIdRef.current || activeConverterIdRef.current !== converterId) return
      if (record) setMediaResult(record)
    } catch (runtimeFailure) {
      if (runId === fileRunIdRef.current && activeConverterIdRef.current === converterId) {
        setError(runtimeFailure)
      }
    } finally {
      if (runId === fileRunIdRef.current && activeConverterIdRef.current === converterId) {
        setProcessing(false)
      }
    }
  }

  const handleFilesChange = (files) => {
    setSelectedFiles(files)
    if (isMedia) {
      handleMediaFiles(files)
    } else if (files[0]) {
      handleSimpleFile(files[0])
    }
  }

  const handleCancel = () => {
    fileRunIdRef.current += 1
    runtimeRef.current.cancel()
    setProcessing(false)
    setProgress(0)
    setMediaResult(null)
    setError({ code: 'cancelled', messageKey: 'errors.cancelled' })
  }

  const handleDiscardResult = () => {
    runtimeRef.current.reset()
    setMediaResult(null)
    setError(null)
  }

  const handleRegenerate = () => {
    runToolConvert('')
  }

  // Tool picker display label
  const fromLabel = isToolMode ? activeConverter.name : (fromFmt?.name || from)
  const toLabel = toFmt?.name || to

  // ToolPicker handlers
  const handleFromSelectFormat = useCallback((id) => {
    setFromPickerOpen(false)
    if (activeConverter) onConverterChange(null)
    setFrom(id)
  }, [activeConverter, onConverterChange, setFrom, setFromPickerOpen])

  const handleFromSelectConverter = useCallback((converter) => {
    setFromPickerOpen(false)
    onConverterChange(converter)
  }, [onConverterChange, setFromPickerOpen])

  const handleToSelectFormat = useCallback((id) => {
    setToPickerOpen(false)
    setTo(id)
  }, [setTo, setToPickerOpen])

  const toggleFromPicker = useCallback(() => {
    setFromPickerOpen(open => {
      const next = !open
      if (next) setToPickerOpen(false)
      return next
    })
  }, [])

  const toggleToPicker = useCallback(() => {
    setToPickerOpen(open => {
      const next = !open
      if (next) setFromPickerOpen(false)
      return next
    })
  }, [])

  return (
    <div className="convert-panel">
      <div className={`convert-selectors${isToolMode ? ' tool-mode' : ''}`}>
        <div className={`convert-selector-side convert-selector-from${autoDetected ? ' auto-detected' : ''}`} ref={fromWrapperRef}>
          <button
            className="picker-trigger"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={toggleFromPicker}
            aria-expanded={fromPickerOpen}
          >
            <span className="picker-trigger-label">{fromLabel}</span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2.5 4l2.5 2 2.5-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {autoDetected && <span className="detect-badge">detected</span>}
          <ToolPicker
            open={fromPickerOpen}
            onClose={() => setFromPickerOpen(false)}
            onSelectFormat={handleFromSelectFormat}
            onSelectConverter={handleFromSelectConverter}
            mode="from"
            align="left"
            availableFormatIds={allFromIds}
            currentFormatValue={isToolMode ? null : from}
            currentConverterValue={isToolMode ? activeConverter.id : null}
            releasedFormats={releasedFormats}
            releasedTools={releasedTools}
            categories={categories}
          />
        </div>

        {!isToolMode && (
          <>
            <button
              className={`swap-btn${canSwap ? '' : ' disabled'}${swapped ? ' swapped' : ''}`}
              onClick={handleSwap}
              disabled={!canSwap}
              title={canSwap ? 'Swap' : 'No reverse conversion'}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M5 4l6 0M11 4l-2.5 2.5M11 4l-2.5-2.5M11 12l-6 0M5 12l2.5-2.5M5 12l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="convert-selector-side convert-selector-to" ref={toWrapperRef}>
              <button
                className="picker-trigger"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={toggleToPicker}
                aria-expanded={toPickerOpen}
              >
                <span className="picker-trigger-label">{toLabel}</span>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2.5 4l2.5 2 2.5-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <ToolPicker
                open={toPickerOpen}
                onClose={() => setToPickerOpen(false)}
                onSelectFormat={handleToSelectFormat}
                onSelectConverter={() => {}}
                mode="to"
                align="right"
                availableFormatIds={toIds}
                currentFormatValue={to}
                currentConverterValue={null}
                releasedFormats={releasedFormats}
                releasedTools={releasedTools}
                categories={categories}
              />
            </div>
            <div className="selector-extra-actions">
              <button
                className={`batch-toggle${batchMode ? ' active' : ''}`}
                onClick={() => setBatchMode(b => !b)}
                title={batchMode ? 'Batch mode: each line converted separately' : 'Enable batch mode'}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 4h8M3 7h8M3 10h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </button>
              <button
                className={`batch-toggle${isPairFav ? ' active' : ''}`}
                onClick={toggleFavPair}
                title={isPairFav ? 'Remove from favorites' : 'Save this pair'}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1.5l1.76 3.57 3.94.57-2.85 2.78.67 3.93L7 10.57l-3.52 1.78.67-3.93L1.3 5.64l3.94-.57L7 1.5z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" fill={isPairFav ? 'currentColor' : 'none'}/>
                </svg>
              </button>
            </div>
          </>
        )}

        {isToolMode && (
          <div className="tool-mode-actions">
            <button className="pill-btn-sm" onClick={handleShare} title="Share this tool" aria-label="Share this tool">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M4.5 8.5l5-3M4.5 5.5l5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <circle cx="3.5" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
                <circle cx="10.5" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
                <circle cx="10.5" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {isToolMode && (
        <p className="tool-description">{activeConverter.description}</p>
      )}

      {!isToolMode && favPairs.length > 0 && (
        <div className="fav-pairs">
          {favPairs.map(pair => {
            const [f, t] = pair.split('→')
            const fName = getFormatById(f)?.name || f
            const tName = getFormatById(t)?.name || t
            return (
              <button
                key={pair}
                className={`fav-pair-btn${pair === pairKey ? ' active' : ''}`}
                onClick={() => { setFrom(f); setTo(t) }}
              >
                {fName} → {tName}
              </button>
            )
          })}
        </div>
      )}

      {/* === FORMAT-PAIR MODE: dual textareas === */}
      {!isToolMode && (
        <>
          <div className="convert-textareas">
            <div className="convert-side">
              <div className="textarea-area">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  aria-label="Input text"
                  onPaste={handlePaste}
                  placeholder={inputPlaceholder}
                  spellCheck={false}
                  autoFocus
                />
                {input && (
                  <button className="float-clear" onClick={handleClear}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  </button>
                )}
                {isColorInput && (
                  <label className="color-picker-btn" title="Pick a color">
                    <input ref={colorInputRef} type="color" value={colorPickerValue} onChange={handleColorPick} className="color-picker-input" />
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="2" y="2" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                      <rect x="4" y="4" width="6" height="6" rx="1" fill="currentColor" opacity="0.3"/>
                    </svg>
                  </label>
                )}
                {input.length > 0 && (
                  <span className="float-info" style={isColorInput ? { left: 48 } : undefined} title={`${new Blob([input]).size} bytes`}>
                    {input.length} chars · {input.split(/\s+/).filter(Boolean).length} words · {input.split('\n').length} lines
                  </span>
                )}
              </div>
            </div>

            <div className="convert-side">
              <div className={`textarea-area${lineNumbers ? ' with-gutter' : ''}`}>
                {lineNumbers && outputLineCount > 0 && (
                  <div className="line-gutter" ref={gutterRef}>
                    {Array.from({ length: outputLineCount }, (_, i) => (
                      <div key={i} className="line-num">{i + 1}</div>
                    ))}
                  </div>
                )}
                <textarea
                  ref={outputRef}
                  className="output mono"
                  value={output}
                  readOnly
                  placeholder={outputPlaceholder}
                  onDoubleClick={handleSelectOutput}
                  onScroll={lineNumbers ? handleOutputScroll : undefined}
                  aria-label="Conversion output"
                  aria-live="polite"
                  style={wrapOutput ? undefined : { whiteSpace: 'pre', overflowX: 'auto' }}
                />
                {output && (
                  <div className="float-actions">
                    <button className="float-icon" onClick={handleCopy} title="Copy" aria-label="Copy">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect x="4.5" y="4.5" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                        <path d="M9.5 4.5V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v5.5a1 1 0 0 0 1 1h1.5" stroke="currentColor" strokeWidth="1.2"/>
                      </svg>
                    </button>
                    {output !== '(conversion error)' && output.length > 500 && (
                      <button className="float-icon" onClick={handleDownload} title="Download" aria-label="Download">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M7 2v7M7 9L4.5 6.5M7 9l2.5-2.5M3 11h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    )}
                    {output !== '(conversion error)' && (
                      <button className="float-icon" onClick={handleUseAsInput} title="Use as input" aria-label="Use as input">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M10 4H4M4 4L6.5 6.5M4 4L6.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M4 10H10M10 10L7.5 7.5M10 10L7.5 12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    )}
                    <button
                      className={`float-icon${wrapOutput ? ' active' : ''}`}
                      onClick={() => setWrapOutput(w => !w)}
                      title={wrapOutput ? 'Word wrap on' : 'Word wrap off'}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 3h10M2 7h7a2 2 0 0 1 0 4H7M7 11L5 9M7 11l-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      className={`float-icon${lineNumbers ? ' active' : ''}`}
                      onClick={() => setLineNumbers(n => !n)}
                      title={lineNumbers ? 'Hide line numbers' : 'Show line numbers'}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <text x="1" y="5" fontSize="4.5" fill="currentColor" fontFamily="sans-serif">1</text>
                        <text x="1" y="9.5" fontSize="4.5" fill="currentColor" fontFamily="sans-serif">2</text>
                        <text x="1" y="14" fontSize="4.5" fill="currentColor" fontFamily="sans-serif">3</text>
                        <path d="M6 2v10" stroke="currentColor" strokeWidth="0.7" opacity="0.4"/>
                        <path d="M8 3.5h4M8 7h4M8 10.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                    </button>
                    {output !== '(conversion error)' && input.length <= 500 && (
                      <button className="float-icon" onClick={handleShare} title="Share conversion" aria-label="Share conversion">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M4.5 8.5l5-3M4.5 5.5l5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                          <circle cx="3.5" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
                          <circle cx="10.5" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
                          <circle cx="10.5" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
                        </svg>
                      </button>
                    )}
                  </div>
                )}
                {colorPreview && (
                  <div className="color-swatch" style={{ background: colorPreview }} />
                )}
                {output && output.startsWith('data:image/') && (
                  <div className="base64-preview">
                    <img src={output} alt="Base64 preview" />
                  </div>
                )}
                {output && output !== '(conversion error)' && (
                  <span className="float-info" title={`${new Blob([output]).size} bytes`}>
                    {output.length} chars · {output.split('\n').length} lines
                  </span>
                )}
              </div>
            </div>
          </div>
          {output && output !== '(conversion error)' && chainTargets.length > 0 && (
            <div className="chain-hint">
              Chain →
              {chainTargets.map(t => (
                <button
                  key={t.id}
                  className="chain-hint-btn"
                  onClick={() => { setFrom(to); setTo(t.id); setInput(output); setOutput('') }}
                >
                  {t.name}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* === TOOL MODE: text-to-text tools reuse dual textarea === */}
      {isTextTool && (
        <div className="convert-textareas">
          <div className="convert-side">
            <div className="textarea-area">
              <textarea
                ref={toolInputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label="Tool input text"
                placeholder={inputPlaceholder}
                spellCheck={false}
                autoFocus
              />
              {input && (
                <button className="float-clear" onClick={handleClear}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div className="convert-side">
            <div className="textarea-area">
              <textarea
                ref={toolOutputRef}
                className="output mono"
                value={output}
                readOnly
                placeholder={outputPlaceholder}
                onDoubleClick={handleSelectOutput}
                aria-label="Tool output text"
              />
              {output && !output.startsWith('(') && (
                <div className="float-actions">
                  <button className="float-icon" onClick={handleCopy} title="Copy" aria-label="Copy">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="4.5" y="4.5" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M9.5 4.5V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v5.5a1 1 0 0 0 1 1h1.5" stroke="currentColor" strokeWidth="1.2"/>
                    </svg>
                  </button>
                  {output.length > 20 && (
                    <button className="float-icon" onClick={handleSaveFile} title="Save" aria-label="Save">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 2v7M7 9L4.5 6.5M7 9l2.5-2.5M3 11h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              )}
              {output && output.length > 0 && (
                <span className="float-info">{output.length} chars</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* === TOOL MODE: generator (no input) === */}
      {isGenerator && (
        <div className="tool-panels">
          <div className="panel-label-row">
            <button className="pill-btn-sm" onClick={handleRegenerate}>Generate</button>
          </div>
          <div className="textarea-area">
            <textarea
              ref={toolOutputRef}
              className="output mono"
              value={output}
              readOnly
              placeholder="Result will appear here..."
              onDoubleClick={handleSelectOutput}
              aria-label="Tool output text"
            />
            {output && !output.startsWith('(') && (
              <div className="float-actions">
                <button className="float-icon" onClick={handleCopy} title="Copy" aria-label="Copy">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="4.5" y="4.5" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M9.5 4.5V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v5.5a1 1 0 0 0 1 1h1.5" stroke="currentColor" strokeWidth="1.2"/>
                  </svg>
                </button>
                {output.length > 20 && (
                  <button className="float-icon" onClick={handleSaveFile} title="Save" aria-label="Save">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 2v7M7 9L4.5 6.5M7 9l2.5-2.5M3 11h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
              </div>
            )}
            {output && output.length > 0 && (
              <span className="float-info">{output.length} chars</span>
            )}
          </div>
        </div>
      )}

      {/* === TOOL MODE: file/media converters === */}
      {acceptsFile && (
        <div className="tool-panels">
          <div className="panel">
            <div className="panel-label-row">
              <span className="panel-label">{t('workspaceTools.input')}</span>
              {(selectedFiles.length > 0 || input) && (
                <button type="button" className="pill-btn-sm" onClick={handleClear}>{t('workspaceTools.clear')}</button>
              )}
            </div>
            <FileDropZone
              accept={activeConverter.acceptTypes || '*'}
              multiple={multipleFiles}
              files={selectedFiles}
              onFilesChange={handleFilesChange}
            />
            {hasTextInput && (
              <input
                className="param-input"
                type="text"
                value={textParam}
                onChange={(event) => {
                  runtimeRef.current.cancel()
                  fileRunIdRef.current += 1
                  setProcessing(false)
                  setMediaResult(null)
                  setError(null)
                  setTextParam(event.target.value)
                }}
                aria-label={t('workspaceTools.parameters')}
                placeholder={activeConverter.textPlaceholder || 'Parameters...'}
              />
            )}
            {isMedia && selectedFiles.length > 0 && hasTextInput && !processing && (
              <button type="button" className="pill-btn convert-btn" onClick={() => handleMediaFiles(selectedFiles)}>
                {t('workspaceTools.convert')}
              </button>
            )}
          </div>

          {processing && (
            <ProgressStatus progress={progress} loadingRuntime={ffmpegStatus === 'downloading'} onCancel={handleCancel} />
          )}

          <ErrorNotice error={error} />
          <ResultActions record={mediaResult} onDiscard={handleDiscardResult} onCopied={() => toast(t('workspaceTools.copied'))} />
        </div>
      )}

      {!acceptsFile && <ErrorNotice error={error} />}
      {!acceptsFile && mediaResult && <ResultActions record={mediaResult} onDiscard={handleDiscardResult} onCopied={() => toast(t('workspaceTools.copied'))} />}
    </div>
  )
}

export default function ConvertPanel({ activeConverter, reuseRequest, onReuseConsumed, ...props }) {
  const [consumedReuseRequestId, setConsumedReuseRequestId] = useState(null)
  const pendingReuseRequest = activeConverter || reuseRequest?.id === consumedReuseRequestId
    ? null
    : reuseRequest
  const handleReuseConsumed = useCallback((id) => {
    setConsumedReuseRequestId(current => current === id ? current : id)
    onReuseConsumed?.(id)
  }, [onReuseConsumed])
  const sessionKey = activeConverter?.id ?? `format:${pendingReuseRequest?.id ?? consumedReuseRequestId ?? 0}`
  return <ConvertPanelSession key={sessionKey} {...props} activeConverter={activeConverter} initialInput={pendingReuseRequest?.value ?? ''} reuseRequestId={pendingReuseRequest?.id} onReuseConsumed={handleReuseConsumed} />
}
