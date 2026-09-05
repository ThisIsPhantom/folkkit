import { useCallback, useEffect, useRef, useState } from 'react'
import { useI18n } from '../../i18n/index.js'
import { PdfWorkerClient } from './pdfClient.js'
import { downloadPdf, readPdfFile, readPdfImage } from './pdfFiles.js'
import PdfCanvas from './PdfCanvas.jsx'
import PdfThumbnail from './PdfThumbnail.jsx'
import { prepareStroke, toPdfVector, toViewPoint } from './pdfGeometry.js'
import './pdfEditor.css'

const noop = () => {}
const tools = ['select', 'text', 'image', 'highlight', 'underline', 'draw', 'note', 'rectangle', 'ellipse', 'line', 'signature']
export default function PdfEditorPage({ onDirtyChange = noop }) {
  const { t: translate } = useI18n()
  const t = useCallback((key, vars) => translate(`studioPdf.${key}`, vars), [translate])
  const client = useRef(null)
  const opening = useRef(null)
  const original = useRef(null)
  const checkpoint = useRef(null)
  const generation = useRef(0)
  const mounted = useRef(true)
  const activeOperation = useRef('')
  const invalidate = useCallback(() => { generation.current += 1 }, [])
  const fileInput = useRef(null)
  const mergeInput = useRef(null)
  const imageInput = useRef(null)
  const [documentState, setDocumentState] = useState(null)
  const [pageIndex, setPageIndex] = useState(0)
  const [version, setVersion] = useState(0)
  const [frame, setFrame] = useState(null)
  const [objects, setObjects] = useState([])
  const [selected, setSelected] = useState(null)
  const [tool, setTool] = useState('select')
  const [busy, setBusy] = useState(false)
  const [recovering, setRecovering] = useState(false)
  const [error, setError] = useState('')
  const [zoom, setZoom] = useState(100)
  const [text, setText] = useState('')
  const [color, setColor] = useState('#202124')
  const [size, setSize] = useState(16)
  const [stroke, setStroke] = useState(2)
  const [position, setPosition] = useState({ x: 40, y: 60, width: 160, height: 80 })
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const pageCount = documentState?.pages.length || 0
  const page = documentState?.pages[pageIndex]
  const dirty = documentState?.dirty || false

  useEffect(() => { onDirtyChange(dirty) }, [dirty, onDirtyChange])
  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false; invalidate(); client.current?.dispose(); opening.current?.dispose(); original.current = null; checkpoint.current = null; onDirtyChange(false) }
  }, [onDirtyChange, invalidate])
  useEffect(() => {
    if (!dirty) return
    const guard = event => { event.preventDefault(); event.returnValue = '' }
    window.addEventListener('beforeunload', guard)
    return () => window.removeEventListener('beforeunload', guard)
  }, [dirty])
  useEffect(() => {
    if (!pageCount || !client.current) return
    let active = true
    const worker = client.current
    Promise.all([worker.render(pageIndex, { scale: Math.min(300 / 72, zoom / 100 * 2) }), worker.objects(pageIndex)]).then(([nextFrame, nextObjects]) => {
      if (active) { setFrame(nextFrame); setObjects(nextObjects) }
    }).catch(reason => { if (active) setError(reason.code || 'invalid_file') })
    return () => { active = false }
  }, [pageIndex, pageCount, version, zoom])

  function clearSelection() { setSelected(null); setObjects([]); setFrame(null); setResults(null) }
  function isCurrent(id) { return mounted.current && generation.current === id }
  function selectPage(index) { if (index === pageIndex) return; clearSelection(); setPageIndex(index) }
  function errorCode(reason) { return ['resource_limit', 'unsupported_text', 'unsupported_structure', 'last_page', 'cancelled', 'unsupported_browser'].includes(reason?.code) ? reason.code : 'invalid_file' }
  async function openFile(file) {
    if (!file || busy || (dirty && !window.confirm(t('discard')))) return
    const id = ++generation.current; activeOperation.current = 'open'
    setBusy(true); setError('')
    let next
    try {
      const bytes = await readPdfFile(file)
      if (!isCurrent(id)) return
      next = new PdfWorkerClient(); opening.current = next
      const state = await next.open(bytes)
      const saved = await next.checkpoint()
      if (!isCurrent(id)) { next.dispose(); return }
      client.current?.dispose(); client.current = next; opening.current = null
      checkpoint.current = saved
      original.current = bytes
      clearSelection(); setPageIndex(0); setDocumentState(state); setVersion(value => value + 1)
    } catch (reason) { next?.dispose(); if (isCurrent(id)) setError(errorCode(reason)) }
    finally { if (isCurrent(id)) { opening.current = null; setBusy(false); activeOperation.current = '' } }
  }
  async function change(method, ...args) {
    if (!client.current || busy) return
    const id = ++generation.current; activeOperation.current = 'change'
    const worker = client.current
    setBusy(true); setError('')
    try {
      const next = method === 'undo' || method === 'redo' ? await worker[method]() : await worker.change(method, ...args)
      const saved = await worker.checkpoint()
      if (!isCurrent(id)) return
      checkpoint.current = saved
      clearSelection(); setDocumentState(next); setPageIndex(index => Math.min(index, next.pages.length - 1)); setVersion(value => value + 1)
    } catch (reason) { if (isCurrent(id)) setError(errorCode(reason)) }
    finally { if (isCurrent(id)) { setBusy(false); activeOperation.current = '' } }
  }
  async function cancel() {
    if (recovering) return
    const id = ++generation.current
    if (activeOperation.current === 'open') {
      opening.current?.dispose(); opening.current = null; setBusy(false); setError('cancelled'); activeOperation.current = ''; return
    }
    client.current?.dispose(); clearSelection()
    if (!checkpoint.current) { client.current = null; setDocumentState(null); setBusy(false); return }
    setRecovering(true); setBusy(true); activeOperation.current = 'restore'
    const restored = new PdfWorkerClient(); client.current = restored
    try {
      const state = await restored.restore(checkpoint.current)
      if (isCurrent(id)) { setDocumentState(state); setVersion(value => value + 1); setError('cancelled') }
    } catch (reason) { if (isCurrent(id)) setError(errorCode(reason)) }
    finally { if (isCurrent(id)) { setRecovering(false); setBusy(false); activeOperation.current = '' } }
  }
  function closeDocument() {
    if (dirty && !window.confirm(t('discard'))) return
    generation.current++; client.current?.dispose(); client.current = null; original.current = null; checkpoint.current = null
    clearSelection(); setDocumentState(null); setError('')
  }
  async function exportPdf(extract = false) {
    const id = ++generation.current; activeOperation.current = 'export'
    setBusy(true); setError('')
    try {
      const bytes = extract ? await client.current.extract([pageIndex]) : await client.current.save()
      if (!isCurrent(id)) return
      downloadPdf(bytes, extract ? `folkkit-page-${pageIndex + 1}.pdf` : 'folkkit-edited.pdf')
      if (!extract) {
        const state = await client.current.markSaved()
        const saved = await client.current.checkpoint()
        if (isCurrent(id)) { checkpoint.current = saved; setDocumentState(state) }
      }
    } catch (reason) { if (isCurrent(id)) setError(errorCode(reason)) }
    finally { if (isCurrent(id)) { setBusy(false); activeOperation.current = '' } }
  }
  function chooseObject(object) { setSelected(object); setText(object.text || '') }
  function chooseTool(next) { setTool(next); setSelected(null); if (next === 'highlight') setColor('#f0c929') }
  function place(points) {
    const [[x, y]] = points
    if (tool === 'text') { if (text.trim()) change('addText', pageIndex, { text, x, y, size, color }) }
    else if (tool === 'note') { if (text.trim()) change('addNote', pageIndex, { text, x, y }) }
    else if (!['select', 'image'].includes(tool)) {
      const adjusted = points
      if (Math.hypot(adjusted.at(-1)[0] - x, adjusted.at(-1)[1] - y) > 1 || adjusted.length > 2) change('addDrawing', pageIndex, { kind: tool, points: adjusted, color, width: stroke })
    }
  }
  function insertAtCoordinates() {
    const points = [[position.x, position.y], [position.x + position.width, position.y + position.height]]
    place(tool === 'underline' ? prepareStroke(points.map(point => toViewPoint(point, page)), page, tool) : points)
  }
  function moveSelection(dx, dy) {
    const [pdfX, pdfY] = toPdfVector([dx, dy], page)
    change('transformObject', pageIndex, selected.index, { dx: pdfX, dy: pdfY })
  }
  async function insertImage(file) {
    if (!file || busy) return
    const id = ++generation.current; activeOperation.current = 'image'
    setBusy(true); setError('')
    try {
      const image = await readPdfImage(file)
      if (!isCurrent(id)) return
      const next = await client.current.change('addImage', pageIndex, { ...image, x: position.x, y: position.y, displayWidth: position.width, displayHeight: position.width * image.height / image.width })
      const saved = await client.current.checkpoint()
      if (!isCurrent(id)) return
      checkpoint.current = saved
      clearSelection(); setDocumentState(next); setVersion(value => value + 1)
    } catch (reason) { if (isCurrent(id)) setError(errorCode(reason)) }
    finally { if (isCurrent(id)) { setBusy(false); activeOperation.current = '' } }
  }
  async function mergeFile(file) {
    if (!file || busy) return
    const id = ++generation.current; activeOperation.current = 'merge'
    setBusy(true); setError('')
    try {
      const bytes = await readPdfFile(file)
      if (!isCurrent(id)) return
      const next = await client.current.change('merge', bytes)
      const saved = await client.current.checkpoint()
      if (!isCurrent(id)) return
      checkpoint.current = saved
      clearSelection(); setDocumentState(next); setVersion(value => value + 1)
    } catch (reason) { if (isCurrent(id)) setError(errorCode(reason)) }
    finally { if (isCurrent(id)) { setBusy(false); activeOperation.current = '' } }
  }
  async function search(event) {
    event.preventDefault()
    if (!query.trim() || busy) return
    const id = ++generation.current; activeOperation.current = 'search'
    setBusy(true); setError('')
    try {
      const found = []
      for (let index = 0; index < pageCount && found.length < 100; index++) {
        if (!isCurrent(id)) return
        for (const object of await client.current.objects(index)) if (object.text?.toLocaleLowerCase().includes(query.toLocaleLowerCase())) found.push({ page: index, text: object.text.slice(0, 100), index: object.index })
      }
      if (isCurrent(id)) setResults(found.slice(0, 100))
    } catch (reason) { if (isCurrent(id)) setError(errorCode(reason)) }
    finally { if (isCurrent(id)) { setBusy(false); activeOperation.current = '' } }
  }
  const button = (key, action, disabled = false) => <button type="button" onClick={action} disabled={busy || disabled}>{t(key)}</button>
  return <section className="studio-page pdf-editor" aria-labelledby="pdf-title">
    <header className="pdf-heading"><div><h1 id="pdf-title">{t('title')}</h1><p>{t('intro')}</p></div>{button('choose', () => fileInput.current.click())}</header>
    <input className="pdf-file-input" ref={fileInput} type="file" accept="application/pdf,.pdf" aria-label={t('choose')} onChange={event => { openFile(event.target.files[0]); event.target.value = '' }} />
    <input className="pdf-file-input" ref={mergeInput} type="file" accept="application/pdf,.pdf" aria-label={t('merge')} onChange={event => { mergeFile(event.target.files[0]); event.target.value = '' }} />
    <input className="pdf-file-input" ref={imageInput} type="file" accept="image/png,image/jpeg,image/webp" aria-label={t('image')} onChange={event => { insertImage(event.target.files[0]); event.target.value = '' }} />
    {error && <p role="alert" className="pdf-error">{t(`errors.${error}`)}</p>}
    {error && checkpoint.current && client.current?.disposed && button('recover', cancel)}
    {busy && <div className="pdf-progress" role="status"><span>{t('working')}</span><button type="button" onClick={cancel} disabled={recovering}>{t('cancel')}</button></div>}
    {!documentState ? <div className="pdf-empty" onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); openFile(event.dataTransfer.files[0]) }}>
      <svg className="pdf-empty-icon" width="72" height="88" viewBox="0 0 72 88" aria-hidden="true"><path d="M10 2h34l18 18v66H10z"/><path d="M44 2v20h18M22 40h28M22 51h28M22 62h18"/></svg>
      <h2>{t('drop')}</h2><p>{t('limits')}</p>{button('choose', () => fileInput.current.click())}
      {original.current && button('original', () => downloadPdf(original.current, 'folkkit-original.pdf'))}
    </div> : <>
      <div className="pdf-document-bar">
        <div className="pdf-button-row">{button('undo', () => change('undo'), !documentState.canUndo)}{button('redo', () => change('redo'), !documentState.canRedo)}<span className="pdf-dirty" role="status">{dirty ? t('unsaved') : ''}</span></div>
        <div className="pdf-button-row">{button('original', () => downloadPdf(original.current, 'folkkit-original.pdf'))}{button('download', () => exportPdf())}{button('close', closeDocument)}</div>
      </div>
      <div className="pdf-tool-strip" role="toolbar" aria-label={t('tools')}>{tools.map(item => <button key={item} type="button" aria-pressed={tool === item} disabled={busy} onClick={() => chooseTool(item)}>{t(item)}</button>)}</div>
      <div className="pdf-layout">
        <section className="pdf-pages" aria-label={t('pages')}>
          <h2>{t('pages')} <span>{pageCount}</span></h2>
          <div className="pdf-page-list">{documentState.pages.map((item, index) => <button key={index} type="button" aria-current={pageIndex === index ? 'page' : undefined} disabled={busy} onClick={() => selectPage(index)}><span className="pdf-page-mini" aria-hidden="true"><PdfThumbnail client={client.current} index={index} page={item} revision={version} /></span><span>{t('page', { number: index + 1 })}</span><small>{Math.round(item.width)} × {Math.round(item.height)}</small></button>)}</div>
          <div className="pdf-page-actions">{button('previous', () => change('pageAction', 'move', pageIndex, pageIndex - 1), pageIndex === 0)}{button('next', () => change('pageAction', 'move', pageIndex, pageIndex + 1), pageIndex === pageCount - 1)}{button('rotate', () => change('pageAction', 'rotate', pageIndex))}{button('duplicate', () => change('pageAction', 'duplicate', pageIndex))}{button('deletePage', () => change('pageAction', 'delete', pageIndex), pageCount === 1)}{button('extract', () => exportPdf(true))}{button('blank', () => change('pageAction', 'blank', pageIndex + 1))}{button('merge', () => mergeInput.current.click())}</div>
        </section>
        <div className="pdf-work-area">
          <div className="pdf-view-controls"><form onSubmit={search}><label className="pdf-search"><span>{t('search')}</span><input type="search" value={query} maxLength={200} onChange={event => setQuery(event.target.value)} /></label><button type="submit" disabled={busy || !query.trim()}>{t('searchAction')}</button></form><label>{t('zoom')}<select value={zoom} onChange={event => setZoom(Number(event.target.value))} disabled={busy}>{[50, 75, 100, 125, 150, 200].map(value => <option key={value} value={value}>{value}%</option>)}</select></label></div>
          {results && <div className="pdf-search-results" role="status"><p>{results.length ? t('matches', { count: results.length }) : t('noResults')}</p>{results.map((result, index) => <button type="button" key={index} onClick={() => selectPage(result.page)}>{t('page', { number: result.page + 1 })}: {result.text}</button>)}</div>}
          {page && <PdfCanvas frame={frame} page={page} objects={objects} selected={selected} onSelect={chooseObject} tool={tool} onPlace={place} disabled={busy || !frame} t={t} zoom={zoom} />}
          <p className="pdf-canvas-hint">{t('addHint')}</p>
        </div>
        <section className="pdf-inspector" aria-label={t('tools')}>
          <h2>{t(tool)}</h2>
          {tool === 'select' && <><p>{selected ? (selected.type === 'text' ? t(selected.editable ? 'textHint' : 'unsupportedText') : t('objectImage')) : t('selectHint')}</p>{!objects.some(item => item.type === 'text') && <p>{t('scan')}</p>}</>}
          {(tool === 'text' || tool === 'note' || selected?.type === 'text') && <><label htmlFor="pdf-text-content">{t('content')}</label><textarea id="pdf-text-content" rows={4} value={text} maxLength={4000} disabled={busy || (selected && !selected.editable)} onChange={event => setText(event.target.value)} />{selected?.type === 'text' && button('apply', () => change('replaceText', pageIndex, selected.index, text), !selected.editable)}{tool !== 'note' && <p className="pdf-small">{t('fontHint')}</p>}</>}
          {selected && <><div className="pdf-transform-controls">{[['moveLeft', -10, 0], ['moveRight', 10, 0], ['moveUp', 0, -10], ['moveDown', 0, 10]].map(([label, dx, dy]) => <button type="button" key={label} disabled={busy || !selected.editable} onClick={() => moveSelection(dx, dy)}>{t(label)}</button>)}{button('grow', () => change('transformObject', pageIndex, selected.index, { scale: 1.1 }), !selected.editable)}{button('shrink', () => change('transformObject', pageIndex, selected.index, { scale: 0.9 }), !selected.editable)}</div>{button('removeObject', () => change('removeObject', pageIndex, selected.index))}</>}
          {tool !== 'select' && <>
            {!['note', 'image'].includes(tool) && <label>{t('color')}<input type="color" value={color} onChange={event => setColor(event.target.value)} /></label>}
            {tool === 'text' && <label>{t('fontSize')}<input type="number" value={size} min={4} max={200} onChange={event => setSize(Number(event.target.value))} /></label>}
            {!['text', 'note', 'image'].includes(tool) && <label>{t('stroke')}<input type="number" min={1} max={100} value={stroke} onChange={event => setStroke(Number(event.target.value))} /></label>}
            <div className="pdf-coordinate-fields">{['x', 'y', 'width', 'height'].map(key => <label key={key}>{t(key)}<input type="number" min={key === 'width' || key === 'height' ? 1 : 0} max={20000} value={position[key]} onChange={event => setPosition(current => ({ ...current, [key]: Number(event.target.value) }))} /></label>)}</div>
            <p className="pdf-small">{t('placement')}</p>
            {tool === 'image' ? <>{button('image', () => imageInput.current.click())}{button('signatureImage', () => imageInput.current.click())}<p className="pdf-small">{t('signatureHint')}</p></> : button('insert', insertAtCoordinates, ['text', 'note'].includes(tool) && !text.trim())}
            {tool === 'signature' && <p className="pdf-small">{t('signatureHint')}</p>}
          </>}
        </section>
      </div>
    </>}
  </section>
}
