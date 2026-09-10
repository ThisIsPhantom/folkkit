import { useEffect, useRef, useState } from 'react'
import {
  IconArrowBackUp, IconArrowForwardUp, IconCrop, IconDownload, IconFlipHorizontal,
  IconFlipVertical, IconPhotoPlus, IconRotateClockwise, IconTrash, IconTypography,
} from '@tabler/icons-react'
import { useI18n } from '../../i18n/index.js'
import ImageCanvas from './ImageCanvas.jsx'
import { downloadImage, exportImage } from './imageClient.js'
import { loadImageFile } from './imageFiles.js'
import {
  addElement, applyCrop, centreElement, commitHistory, commitResourceElement, createHistory, createImageState,
  mirrorState, redoHistory, releaseUnreferencedResources, removeElement, rotateState,
  transformedBounds, undoHistory, updateCropField, updateElement,
} from './imageModel.js'
import { paintImageDocument } from './imageRenderer.js'
import './imageEditor.css'

const IMAGE_ACCEPT = 'image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp'
const ratios = [{ key: 'cropFree', value: null }, { key: 'cropSquare', value: 1 }, { key: 'cropFourThree', value: 4 / 3 }, { key: 'cropSixteenNine', value: 16 / 9 }]

function nextId(prefix) {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`}`
}

function errorCode(error) {
  return ['invalid_file', 'unsupported_type', 'type_mismatch', 'resource_limit', 'watermark_budget', 'element_limit', 'text_limit', 'invalid_crop', 'invalid_settings', 'unsupported_browser', 'cancelled'].includes(error?.code) ? error.code : 'invalid_file'
}

function exportName(name, format) {
  const base = String(name || 'image').replace(/\.[^.]+$/, '').replace(/[^\p{L}\p{N}._-]+/gu, '-') || 'image'
  return `${base}-folkkit.${format === 'jpeg' ? 'jpg' : format}`
}

export default function ImageEditorPage({
  active = true,
  fileRequest,
  onFileRequestConsumed,
  loadFile = loadImageFile,
  renderPreview = paintImageDocument,
  exporter = exportImage,
  confirmDiscard = message => window.confirm(message),
}) {
  const { t } = useI18n()
  const [source, setSource] = useState(null), [history, setHistory] = useState(null)
  const [resources, setResources] = useState(() => new Map())
  const [busy, setBusy] = useState(null), [error, setError] = useState(null), [notice, setNotice] = useState(null)
  const [textDraft, setTextDraft] = useState(''), [format, setFormat] = useState('png'), [quality, setQuality] = useState(90)
  const [cropAspect, setCropAspect] = useState(null)
  const resourcesRef = useRef(new Map()), sourceRef = useRef(null), historyRef = useRef(null)
  const operationRef = useRef(null), watermarkRef = useRef(null), controlGestureRef = useRef(null)
  const seenRequestRef = useRef(null), documentGenerationRef = useRef(0), opacityPointerRef = useRef(null), opacityInputRef = useRef(null)
  const imageDocument = history?.present
  const selected = imageDocument?.elements.find(element => element.id === imageDocument.selectedId) || null

  function clearResources() {
    const next = new Map(); resourcesRef.current = next; setResources(next)
  }

  function abortOperation() {
    const operation = operationRef.current
    if (!operation) return
    operationRef.current = null
    operation.controller.abort()
    setBusy(current => current?.id === operation.id ? null : current)
  }

  function beginOperation(kind) {
    abortOperation()
    const operation = { id: nextId('operation'), kind, controller: new AbortController() }
    operationRef.current = operation; setBusy({ id: operation.id, kind })
    return operation
  }

  function finishOperation(operation) {
    if (operationRef.current !== operation) return false
    operationRef.current = null
    setBusy(current => current?.id === operation.id ? null : current)
    return true
  }

  function abortWatermark() {
    const operation = watermarkRef.current
    watermarkRef.current = null
    operation?.controller.abort()
  }

  function setCurrentHistory(next) {
    historyRef.current = next; setHistory(next)
  }

  function setCurrentResources(next) {
    resourcesRef.current = next; setResources(next)
  }

  function releaseOpacityCapture(pointer) {
    if (pointer?.target.hasPointerCapture?.(pointer.id)) pointer.target.releasePointerCapture(pointer.id)
  }

  function blockOpacityPointer() {
    const pointer = opacityPointerRef.current
    if (!pointer) return
    // Keep the owner until physical release, even after Escape or an independent commit.
    pointer.blocked = true
    releaseOpacityCapture(pointer)
  }

  function completeControlGesture() {
    blockOpacityPointer()
    const gesture = controlGestureRef.current
    if (!gesture) return
    controlGestureRef.current = null
    if (!gesture.changed || gesture.generation !== documentGenerationRef.current || !historyRef.current) return
    const next = commitHistory(gesture.base, historyRef.current.present)
    const retained = new Map(resourcesRef.current)
    releaseUnreferencedResources(next, retained)
    setCurrentHistory(next); setCurrentResources(retained)
  }

  function cancelControlGesture() {
    blockOpacityPointer()
    const gesture = controlGestureRef.current
    if (!gesture) return
    controlGestureRef.current = null
    if (gesture.generation === documentGenerationRef.current) setCurrentHistory(gesture.base)
  }

  function invalidateDocument() {
    documentGenerationRef.current += 1
    abortWatermark()
  }

  async function acceptFile(file) {
    if (!file) return false
    completeControlGesture()
    if (historyRef.current?.present.dirty && !confirmDiscard(t('studioImage.discardConfirm'))) return false
    invalidateDocument()
    const operation = beginOperation('load')
    setError(null); setNotice(null)
    try {
      const loaded = await loadFile(file, { role: 'original', signal: operation.controller.signal })
      if (operation.controller.signal.aborted || operationRef.current !== operation) { loaded.bitmap?.close?.(); return false }
      sourceRef.current?.bitmap?.close?.(); sourceRef.current = loaded
      const nextHistory = createHistory(createImageState(loaded))
      clearResources(); setSource(loaded); setCurrentHistory(nextHistory)
      setCropAspect(null); setTextDraft(''); return true
    } catch (caught) {
      if (!operation.controller.signal.aborted) setError(errorCode(caught))
      return false
    } finally {
      finishOperation(operation)
    }
  }

  useEffect(() => {
    if (!active || !fileRequest?.id || fileRequest.id === seenRequestRef.current) return
    let live = true
    const id = fileRequest.id, file = fileRequest.file
    queueMicrotask(async () => {
      if (!live || seenRequestRef.current === id) return
      await acceptFile(file)
      if (!live || seenRequestRef.current === id) return
      seenRequestRef.current = id
      onFileRequestConsumed?.(id)
    })
    return () => { live = false }
    // The request id is the handoff boundary. Other values are read from the render that introduced it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, fileRequest?.id])

  useEffect(() => {
    if (!active) { abortOperation(); abortWatermark(); cancelControlGesture() }
    // Cancellation reads current operation refs and must run only when activity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  useEffect(() => () => {
    documentGenerationRef.current += 1
    operationRef.current?.controller.abort(); watermarkRef.current?.controller.abort()
    operationRef.current = null; watermarkRef.current = null; controlGestureRef.current = null
    sourceRef.current?.bitmap?.close?.(); resourcesRef.current.clear()
  }, [])

  function replacePresent(next) {
    const current = historyRef.current
    if (!current) return
    setCurrentHistory({ ...current, present: typeof next === 'function' ? next(current.present) : next })
  }

  function commit(updater) {
    completeControlGesture()
    setError(null); setNotice(null)
    const current = historyRef.current
    if (!current) return
    try {
      const next = commitHistory(current, updater(current.present))
      const retained = new Map(resourcesRef.current)
      releaseUnreferencedResources(next, retained)
      setCurrentHistory(next); setCurrentResources(retained)
    } catch (caught) { setError(errorCode(caught)) }
  }

  function beginOpacityPointer(event, id) {
    if (!active || opacityPointerRef.current || event.button !== 0 || event.isPrimary === false) {
      event.preventDefault()
      return
    }
    // Finish the previous focused control before this pointer owns the range.
    event.currentTarget.focus({ preventScroll: true })
    completeControlGesture()
    opacityPointerRef.current = { id: event.pointerId, target: event.currentTarget, blocked: false }
    beginControlGesture(id, 'opacity')
    // Keep the native range's own capture; overriding it prevents WebKit thumb dragging.
  }

  function changeOpacity(event, id) {
    const gesture = controlGestureRef.current
    if (!active || opacityPointerRef.current?.blocked || gesture?.key !== 'opacity' || gesture.id !== id) {
      const element = historyRef.current?.present.elements.find(item => item.id === id)
      if (element) event.currentTarget.value = String(Math.round(element.opacity * 100))
      return
    }
    previewControlGesture(id, 'opacity', { opacity: Number(event.target.value) / 100 })
  }

  useEffect(() => {
    const finish = event => {
      const pointer = opacityPointerRef.current
      if (!pointer || event.pointerId !== pointer.id) return
      opacityPointerRef.current = null
      releaseOpacityCapture(pointer)
      if (!pointer.blocked) {
        if (event.type === 'pointercancel') cancelControlGesture()
        else completeControlGesture()
      }
    }
    document.addEventListener('pointerup', finish)
    document.addEventListener('pointercancel', finish)
    return () => {
      document.removeEventListener('pointerup', finish)
      document.removeEventListener('pointercancel', finish)
      const pointer = opacityPointerRef.current
      opacityPointerRef.current = null
      releaseOpacityCapture(pointer)
    }
    // Document listeners survive capture release and read only current gesture refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const input = opacityInputRef.current
    if (!input) return undefined
    // Native range touch actions also need cancellation: pointerdown alone is insufficient.
    const guardTouch = event => {
      const pointer = opacityPointerRef.current
      if (!pointer || pointer.blocked || event.touches.length > 1) event.preventDefault()
    }
    input.addEventListener('touchstart', guardTouch, { passive: false })
    input.addEventListener('touchmove', guardTouch, { passive: false })
    return () => {
      input.removeEventListener('touchstart', guardTouch)
      input.removeEventListener('touchmove', guardTouch)
    }
  }, [selected?.id])

  function beginControlGesture(id, key) {
    if (controlGestureRef.current) return
    const current = historyRef.current
    if (current) controlGestureRef.current = { id, key, generation: documentGenerationRef.current, base: current, changed: false }
  }

  function previewControlGesture(id, key, changes) {
    beginControlGesture(id, key)
    const gesture = controlGestureRef.current, current = historyRef.current
    if (!gesture || !current || gesture.id !== id || gesture.key !== key || gesture.generation !== documentGenerationRef.current) return
    try {
      gesture.changed = true
      setCurrentHistory({ ...current, present: updateElement(current.present, id, changes) })
    } catch (caught) { setError(errorCode(caught)) }
  }

  function moveHistory(action) {
    completeControlGesture()
    if (historyRef.current) setCurrentHistory(action(historyRef.current))
  }

  useEffect(() => {
    if (!active) return undefined
    const escape = (event) => {
      if (event.key === 'Escape' && controlGestureRef.current) {
        event.preventDefault()
        // A handled range Escape must not also deselect its element in ImageCanvas.
        if (opacityPointerRef.current) event.stopImmediatePropagation()
        cancelControlGesture()
      }
    }
    document.addEventListener('keydown', escape, true)
    return () => document.removeEventListener('keydown', escape, true)
    // Escape reads the current gesture ref; changing render callbacks must not replace the listener mid-gesture.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  function setAspect(value) {
    setCropAspect(value)
    if (!imageDocument || value == null) return
    let width = imageDocument.width, height = Math.round(width / value)
    if (height > imageDocument.height) { height = imageDocument.height; width = Math.round(height * value) }
    replacePresent(current => ({ ...current, cropDraft: { x: Math.floor((current.width - width) / 2), y: Math.floor((current.height - height) / 2), width, height } }))
  }

  function cropField(key, value) {
    replacePresent(current => ({ ...current, cropDraft: updateCropField(current.cropDraft, current, cropAspect, key, value) }))
  }

  function addText() {
    const text = textDraft.trim()
    if (!text || !imageDocument) return
    const fontSize = Math.max(12, Math.min(48, Math.round(imageDocument.width / 18)))
    const width = Math.min(imageDocument.width * 0.7, Math.max(fontSize * 4, text.length * fontSize * 0.58))
    const height = Math.min(imageDocument.height, fontSize * 1.4)
    commit(current => addElement(current, { id: nextId('text'), type: 'text', text, x: (current.width - width) / 2, y: (current.height - height) / 2, width, height, fontSize, color: '#111111', opacity: 1 }))
    setTextDraft('')
  }

  async function addWatermark(file) {
    if (!file || !historyRef.current) return
    abortWatermark()
    const operation = { controller: new AbortController(), generation: documentGenerationRef.current }
    watermarkRef.current = operation
    setError(null); setNotice(null)
    let loaded
    try {
      loaded = await loadFile(file, { role: 'watermark', signal: operation.controller.signal })
      if (operation.controller.signal.aborted || watermarkRef.current !== operation || operation.generation !== documentGenerationRef.current) return
      const id = nextId('watermark'), candidate = { id, file, name: file.name, width: loaded.width, height: loaded.height }
      completeControlGesture()
      const current = historyRef.current
      if (!current) return
      const currentDocument = current.present
      const scale = Math.min(1, currentDocument.width * 0.28 / loaded.width, currentDocument.height * 0.28 / loaded.height)
      const width = Math.max(1, Math.round(loaded.width * scale)), height = Math.max(1, Math.round(loaded.height * scale))
      const result = commitResourceElement(current, resourcesRef.current, candidate, { id: nextId('image'), x: (currentDocument.width - width) / 2, y: (currentDocument.height - height) / 2, width, height, opacity: 0.75 })
      if (watermarkRef.current !== operation || operation.generation !== documentGenerationRef.current) return
      setCurrentHistory(result.history); setCurrentResources(result.resources)
    } catch (caught) {
      if (!operation.controller.signal.aborted && watermarkRef.current === operation && operation.generation === documentGenerationRef.current) setError(errorCode(caught))
    } finally {
      loaded?.bitmap?.close?.()
      if (watermarkRef.current === operation) watermarkRef.current = null
    }
  }

  function duplicateWatermark(resource) {
    if (!resource || !historyRef.current) return
    completeControlGesture()
    try {
      const current = historyRef.current, currentDocument = current.present
      const scale = Math.min(1, currentDocument.width * 0.28 / resource.width, currentDocument.height * 0.28 / resource.height)
      const width = Math.max(1, Math.round(resource.width * scale)), height = Math.max(1, Math.round(resource.height * scale))
      const result = commitResourceElement(current, resourcesRef.current, resource, { id: nextId('image'), x: (currentDocument.width - width) / 2, y: (currentDocument.height - height) / 2, width, height, opacity: 0.75 })
      setCurrentHistory(result.history); setCurrentResources(result.resources); setError(null); setNotice(null)
    } catch (caught) { setError(errorCode(caught)) }
  }

  function reset() {
    if (!source) return
    cancelControlGesture()
    invalidateDocument(); abortOperation(); clearResources(); setCurrentHistory(createHistory(createImageState(source))); setCropAspect(null); setError(null); setNotice(null)
  }

  async function exportCurrent() {
    if (!source || !historyRef.current || busy) return
    completeControlGesture()
    const snapshot = historyRef.current.present
    const operation = beginOperation('export')
    setError(null); setNotice(null)
    try {
      const blob = await exporter({ source: source.file, document: snapshot, resources: resourcesRef.current, format, quality: Number(quality) / 100, signal: operation.controller.signal })
      if (operation.controller.signal.aborted || operationRef.current !== operation) return
      downloadImage(blob, exportName(source.file.name, format)); setNotice('exported')
      const current = historyRef.current
      if (current?.present === snapshot) setCurrentHistory({ ...current, present: { ...snapshot, dirty: false } })
    } catch (caught) { if (!operation.controller.signal.aborted) setError(errorCode(caught)) }
    finally { finishOperation(operation) }
  }

  const fileInput = (
    <input id="image-editor-file" className="image-file-input" name="image" type="file" accept={IMAGE_ACCEPT} disabled={Boolean(busy)} aria-label={t('studioImage.choose')} onChange={(event) => { const chosen = event.target.files?.[0]; event.target.value = ''; acceptFile(chosen) }} />
  )

  const busyStatus = busy && <div className="image-busy" role="status"><span>{t(busy.kind === 'load' ? 'studioImage.working' : 'studioImage.exporting')}</span><button type="button" onClick={abortOperation}>{t('studioImage.cancel')}</button></div>

  if (!source || !imageDocument) {
    return (
      <section className="studio-page image-editor" aria-labelledby="image-editor-title">
        <header className="image-editor-heading"><h1 id="image-editor-title">{t('studioImage.title')}</h1><p>{t('studioImage.intro')}</p></header>
        <section className="image-empty" onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); acceptFile(event.dataTransfer.files?.[0]) }}>
          <IconPhotoPlus aria-hidden="true" size={36} />{fileInput}<label className="studio-primary image-file-label" htmlFor="image-editor-file">{t('studioImage.choose')}</label>
          <strong>{t('studioImage.drop')}</strong><p>{t('studioImage.limits')}</p>
        </section>
        {busyStatus}
        {error && <p role="alert">{t(`studioImage.errors.${error}`)}</p>}
      </section>
    )
  }

  const bounds = selected ? transformedBounds(selected) : null
  const reusableWatermark = selected?.type === 'image'
    ? resources.get(selected.resourceId)
    : [...resources.values()].at(-1)
  return (
    <section className="studio-page image-editor" aria-labelledby="image-editor-title">
      <header className="image-editor-heading">
        <h1 id="image-editor-title">{t('studioImage.title')}</h1>
        <div className="image-file-summary"><strong>{source.file.name}</strong><span>{t('studioImage.dimensions', imageDocument)}</span>{imageDocument.dirty && <span className="image-unsaved">{t('studioImage.unsaved')}</span>}</div>
      </header>
      <div className="image-toolbar" aria-label={t('studioImage.transform')}>
        {fileInput}<label className="image-file-label" htmlFor="image-editor-file">{t('studioImage.replace')}</label>
        <button type="button" onClick={() => moveHistory(undoHistory)} disabled={!history.past.length || Boolean(busy)}><IconArrowBackUp aria-hidden="true" />{t('studioImage.undo')}</button>
        <button type="button" onClick={() => moveHistory(redoHistory)} disabled={!history.future.length || Boolean(busy)}><IconArrowForwardUp aria-hidden="true" />{t('studioImage.redo')}</button>
        <button type="button" onClick={reset} disabled={Boolean(busy)}>{t('studioImage.reset')}</button>
      </div>
      <div className="image-editor-layout">
        <section className="image-preview-panel">
          <ImageCanvas active={active} document={imageDocument} source={source.bitmap} resources={resources} selectedId={imageDocument.selectedId} onSelect={id => replacePresent(current => ({ ...current, selectedId: id }))} onElementCommit={(id, changes) => commit(current => updateElement(current, id, changes))} cropDraft={imageDocument.cropDraft} cropAspect={cropAspect} onCropDraft={crop => replacePresent(current => ({ ...current, cropDraft: crop }))} showCrop renderPreview={renderPreview} t={t} />
        </section>
        <div className="image-inspector">
          <section className="image-export-panel"><h2>{t('studioImage.export')}</h2><div className="image-field-grid">
            <label>{t('studioImage.format')}<select name="image-format" value={format} onChange={event => setFormat(event.target.value)}><option value="png">PNG</option><option value="jpeg">JPEG</option><option value="webp">WebP</option></select></label>
            {format !== 'png' && <label>{t('studioImage.quality')}<input name="image-quality" type="range" min="10" max="100" value={quality} onChange={event => setQuality(event.target.value)} /></label>}
          </div><button type="button" className="studio-primary image-download" disabled={Boolean(busy)} onClick={exportCurrent}><IconDownload aria-hidden="true" />{t('studioImage.download', { format: format === 'jpeg' ? 'JPEG' : format.toUpperCase() })}</button>
          </section>
          <details open><summary><IconCrop aria-hidden="true" />{t('studioImage.crop')}</summary><div className="image-panel-body">
            <p>{t('studioImage.cropHint')}</p>
            <div className="image-choice-row" role="group" aria-label={t('studioImage.cropAspect')}>{ratios.map(item => <button type="button" key={item.key} aria-pressed={cropAspect === item.value} onClick={() => setAspect(item.value)}>{t(`studioImage.${item.key}`)}</button>)}</div>
            <div className="image-field-grid">
              {[['x', 'cropX'], ['y', 'cropY'], ['width', 'cropWidth'], ['height', 'cropHeight']].map(([key, label]) => <label key={key}>{t(`studioImage.${label}`)}<input name={`crop-${key}`} type="number" min="0" step="1" value={imageDocument.cropDraft[key]} onChange={event => cropField(key, event.target.value)} /></label>)}
            </div>
            <button type="button" className="studio-primary" onClick={() => commit(current => applyCrop(current, current.cropDraft))}>{t('studioImage.applyCrop')}</button>
          </div></details>
          <details open><summary><IconRotateClockwise aria-hidden="true" />{t('studioImage.transform')}</summary><div className="image-panel-body image-action-grid">
            <button type="button" onClick={() => commit(current => rotateState(current, 1))}><IconRotateClockwise aria-hidden="true" />{t('studioImage.rotateRight')}</button>
            <button type="button" onClick={() => commit(current => mirrorState(current, 'horizontal'))}><IconFlipHorizontal aria-hidden="true" />{t('studioImage.mirrorHorizontal')}</button>
            <button type="button" onClick={() => commit(current => mirrorState(current, 'vertical'))}><IconFlipVertical aria-hidden="true" />{t('studioImage.mirrorVertical')}</button>
          </div></details>
          <details open><summary><IconTypography aria-hidden="true" />{t('studioImage.elements')}</summary><div className="image-panel-body">
            <label>{t('studioImage.textContent')}<textarea name="image-text-draft" maxLength="500" placeholder={t('studioImage.textPlaceholder')} value={textDraft} onChange={event => setTextDraft(event.target.value)} /></label>
            <button type="button" onClick={addText} disabled={!textDraft.trim()}><IconTypography aria-hidden="true" />{t('studioImage.addText')}</button>
            <input id="image-watermark-file" className="image-file-input" name="watermark" type="file" accept={IMAGE_ACCEPT} onChange={event => { const file = event.target.files?.[0]; event.target.value = ''; addWatermark(file) }} />
            <label className="image-file-label" htmlFor="image-watermark-file"><IconPhotoPlus aria-hidden="true" />{t('studioImage.addWatermark')}</label>
            {reusableWatermark && <button type="button" onClick={() => duplicateWatermark(reusableWatermark)}>{t('studioImage.duplicateWatermark')}</button>}
            <p>{t('studioImage.watermarkLimits')}</p>
            <div className="image-element-list">{imageDocument.elements.length ? imageDocument.elements.map(element => {
              const name = element.type === 'text' ? t('studioImage.textElement', { text: element.text.slice(0, 36) }) : t('studioImage.imageElement', { name: resources.get(element.resourceId)?.name || '' })
              return <button type="button" key={element.id} aria-pressed={imageDocument.selectedId === element.id} onClick={() => replacePresent(current => ({ ...current, selectedId: element.id }))}>{name}</button>
            }) : <p>{t('studioImage.noElements')}</p>}</div>
          </div></details>
          {selected && bounds && <details open><summary>{t('studioImage.properties')}</summary><div className="image-panel-body image-field-grid">
            {selected.type === 'text' && <><label className="image-field-wide">{t('studioImage.textContent')}<textarea name="selected-text" maxLength="500" value={selected.text} onChange={event => commit(current => updateElement(current, selected.id, { text: event.target.value }))} /></label><label>{t('studioImage.fontSize')}<input name="font-size" type="number" min="6" max="512" value={selected.fontSize} onChange={event => commit(current => updateElement(current, selected.id, { fontSize: Number(event.target.value) }))} /></label><label>{t('studioImage.color')}<input name="text-color" type="color" value={selected.color} onFocus={() => beginControlGesture(selected.id, 'color')} onChange={event => previewControlGesture(selected.id, 'color', { color: event.target.value })} onBlur={completeControlGesture} onKeyDown={event => { if (event.key === 'Escape') cancelControlGesture(); else beginControlGesture(selected.id, 'color') }} /></label></>}
            <label>{t('studioImage.opacity')}<input ref={opacityInputRef} name="opacity" type="range" min="0" max="100" value={Math.round(selected.opacity * 100)} onPointerDown={event => beginOpacityPointer(event, selected.id)} onChange={event => changeOpacity(event, selected.id)} onLostPointerCapture={event => { if (opacityPointerRef.current?.id === event.pointerId && !opacityPointerRef.current.blocked) cancelControlGesture() }} onKeyDown={event => { if (event.key === 'Escape') cancelControlGesture(); else if (opacityPointerRef.current) event.preventDefault(); else beginControlGesture(selected.id, 'opacity') }} onKeyUp={() => { if (!opacityPointerRef.current) completeControlGesture() }} onBlur={() => { if (!opacityPointerRef.current) completeControlGesture() }} /></label>
            {[['x', 'x'], ['y', 'y'], ['width', 'width'], ['height', 'height']].map(([key, label]) => <label key={key}>{t(`studioImage.${label}`)}<input name={`element-${key}`} type="number" min={key === 'width' || key === 'height' ? 1 : undefined} value={Math.round(bounds[key])} onChange={event => commit(current => updateElement(current, selected.id, { [key]: Number(event.target.value) }))} /></label>)}
            <button type="button" onClick={() => commit(current => centreElement(current, selected.id))}>{t('studioImage.centre')}</button>
            <button type="button" className="image-danger" onClick={() => commit(current => removeElement(current, selected.id))}><IconTrash aria-hidden="true" />{t('studioImage.remove')}</button>
          </div></details>}
        </div>
      </div>
      {busyStatus}
      {error && <p role="alert" className="image-message">{t(`studioImage.errors.${error}`)}</p>}
      {notice && <p role="status" className="image-message">{t(`studioImage.${notice}`)}</p>}
    </section>
  )
}
