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
  addElement, applyCrop, centreElement, commitHistory, createHistory, createImageState,
  mirrorState, redoHistory, referencedResourceBytes, releaseUnreferencedResources,
  removeElement, rotateState, transformedBounds, undoHistory, updateElement,
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
  const resourcesRef = useRef(new Map()), sourceRef = useRef(null), operationRef = useRef(null), seenRequestRef = useRef(null)
  const imageDocument = history?.present
  const selected = imageDocument?.elements.find(element => element.id === imageDocument.selectedId) || null

  function clearResources() {
    resourcesRef.current.clear(); setResources(new Map())
  }

  function abortOperation() {
    operationRef.current?.abort(); operationRef.current = null
  }

  async function acceptFile(file) {
    if (!file) return false
    if (imageDocument?.dirty && !confirmDiscard(t('studioImage.discardConfirm'))) return false
    abortOperation()
    const controller = new AbortController(); operationRef.current = controller
    setBusy('load'); setError(null); setNotice(null)
    try {
      const loaded = await loadFile(file, { role: 'original', signal: controller.signal })
      if (controller.signal.aborted || operationRef.current !== controller) { loaded.bitmap?.close?.(); return false }
      sourceRef.current?.bitmap?.close?.(); sourceRef.current = loaded
      clearResources(); setSource(loaded); setHistory(createHistory(createImageState(loaded)))
      setCropAspect(null); setTextDraft(''); return true
    } catch (caught) {
      if (!controller.signal.aborted) setError(errorCode(caught))
      return false
    } finally {
      if (operationRef.current === controller) { operationRef.current = null; setBusy(null) }
    }
  }

  useEffect(() => {
    if (!fileRequest?.id || fileRequest.id === seenRequestRef.current) return
    seenRequestRef.current = fileRequest.id
    Promise.resolve(acceptFile(fileRequest.file)).finally(() => onFileRequestConsumed?.(fileRequest.id))
    // The request id is the handoff boundary. Other values are read from the render that introduced it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileRequest?.id])

  useEffect(() => {
    if (!active) abortOperation()
  }, [active])

  useEffect(() => () => {
    abortOperation(); sourceRef.current?.bitmap?.close?.(); resourcesRef.current.clear()
  }, [])

  function replacePresent(next) {
    setHistory(current => current ? { ...current, present: typeof next === 'function' ? next(current.present) : next } : current)
  }

  function commit(updater) {
    setError(null); setNotice(null)
    if (!history) return
    try {
      const next = commitHistory(history, updater(history.present))
      setHistory(next)
      setResources((current) => {
        const retained = new Map(current)
        releaseUnreferencedResources(next, retained)
        resourcesRef.current = retained
        return retained
      })
    } catch (caught) { setError(errorCode(caught)) }
  }

  function setAspect(value) {
    setCropAspect(value)
    if (!imageDocument || value == null) return
    let width = imageDocument.width, height = Math.round(width / value)
    if (height > imageDocument.height) { height = imageDocument.height; width = Math.round(height * value) }
    replacePresent(current => ({ ...current, cropDraft: { x: Math.floor((current.width - width) / 2), y: Math.floor((current.height - height) / 2), width, height } }))
  }

  function cropField(key, value) {
    const number = Math.round(Number(value))
    replacePresent(current => {
      if (!Number.isFinite(number)) return current
      const draft = { ...current.cropDraft, [key]: number }
      draft.width = Math.max(1, Math.min(draft.width, current.width - Math.max(0, draft.x)))
      draft.height = Math.max(1, Math.min(draft.height, current.height - Math.max(0, draft.y)))
      draft.x = Math.max(0, Math.min(draft.x, current.width - draft.width))
      draft.y = Math.max(0, Math.min(draft.y, current.height - draft.height))
      return { ...current, cropDraft: draft }
    })
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
    if (!file || !history) return
    setError(null); setNotice(null)
    try {
      const loaded = await loadFile(file, { role: 'watermark' })
      loaded.bitmap?.close?.()
      const id = nextId('watermark'), candidate = { id, file, name: file.name, width: loaded.width, height: loaded.height }
      referencedResourceBytes(history, resourcesRef.current, candidate)
      const scale = Math.min(1, imageDocument.width * 0.28 / loaded.width, imageDocument.height * 0.28 / loaded.height)
      const width = Math.max(1, Math.round(loaded.width * scale)), height = Math.max(1, Math.round(loaded.height * scale))
      const nextResources = new Map(resourcesRef.current); nextResources.set(id, candidate)
      resourcesRef.current = nextResources; setResources(nextResources)
      commit(current => addElement(current, { id: nextId('image'), type: 'image', resourceId: id, x: (current.width - width) / 2, y: (current.height - height) / 2, width, height, opacity: 0.75 }))
    } catch (caught) { setError(errorCode(caught)) }
  }

  function reset() {
    if (!source) return
    abortOperation(); clearResources(); setHistory(createHistory(createImageState(source))); setCropAspect(null); setError(null); setNotice(null)
  }

  async function exportCurrent() {
    if (!source || !imageDocument || busy) return
    abortOperation()
    const controller = new AbortController(); operationRef.current = controller
    setBusy('export'); setError(null); setNotice(null)
    try {
      const blob = await exporter({ source: source.file, document: imageDocument, resources: resourcesRef.current, format, quality: Number(quality) / 100, signal: controller.signal })
      if (controller.signal.aborted || operationRef.current !== controller) return
      downloadImage(blob, exportName(source.file.name, format)); setNotice('exported')
      replacePresent(current => ({ ...current, dirty: false }))
    } catch (caught) { if (!controller.signal.aborted) setError(errorCode(caught)) }
    finally { if (operationRef.current === controller) { operationRef.current = null; setBusy(null) } }
  }

  const fileInput = (
    <input id="image-editor-file" className="image-file-input" name="image" type="file" accept={IMAGE_ACCEPT} disabled={Boolean(busy)} aria-label={t('studioImage.choose')} onChange={(event) => { const chosen = event.target.files?.[0]; event.target.value = ''; acceptFile(chosen) }} />
  )

  if (!source || !imageDocument) {
    return (
      <section className="studio-page image-editor" aria-labelledby="image-editor-title">
        <header className="image-editor-heading"><h1 id="image-editor-title">{t('studioImage.title')}</h1><p>{t('studioImage.intro')}</p></header>
        <section className="image-empty" onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); acceptFile(event.dataTransfer.files?.[0]) }}>
          {fileInput}<IconPhotoPlus aria-hidden="true" size={36} /><label className="studio-primary image-file-label" htmlFor="image-editor-file">{t('studioImage.choose')}</label>
          <strong>{t('studioImage.drop')}</strong><p>{t('studioImage.limits')}</p>
        </section>
        {busy && <p role="status" className="studio-status">{t('studioImage.working')}</p>}
        {error && <p role="alert">{t(`studioImage.errors.${error}`)}</p>}
      </section>
    )
  }

  const bounds = selected ? transformedBounds(selected) : null
  return (
    <section className="studio-page image-editor" aria-labelledby="image-editor-title">
      <header className="image-editor-heading">
        <div><h1 id="image-editor-title">{t('studioImage.title')}</h1><p>{t('studioImage.intro')}</p></div>
        <div className="image-file-summary"><strong>{source.file.name}</strong><span>{t('studioImage.dimensions', imageDocument)}</span>{imageDocument.dirty && <span>{t('studioImage.unsaved')}</span>}</div>
      </header>
      <div className="image-toolbar" aria-label={t('studioImage.transform')}>
        {fileInput}<label className="image-file-label" htmlFor="image-editor-file">{t('studioImage.replace')}</label>
        <button type="button" onClick={() => setHistory(current => undoHistory(current))} disabled={!history.past.length || Boolean(busy)}><IconArrowBackUp aria-hidden="true" />{t('studioImage.undo')}</button>
        <button type="button" onClick={() => setHistory(current => redoHistory(current))} disabled={!history.future.length || Boolean(busy)}><IconArrowForwardUp aria-hidden="true" />{t('studioImage.redo')}</button>
        <button type="button" onClick={reset} disabled={Boolean(busy)}>{t('studioImage.reset')}</button>
      </div>
      <div className="image-editor-layout">
        <section className="image-preview-panel">
          <ImageCanvas active={active} document={imageDocument} source={source.bitmap} resources={resources} selectedId={imageDocument.selectedId} onSelect={id => replacePresent(current => ({ ...current, selectedId: id }))} onElementCommit={(id, changes) => commit(current => updateElement(current, id, changes))} cropDraft={imageDocument.cropDraft} onCropDraft={crop => replacePresent(current => ({ ...current, cropDraft: crop }))} showCrop renderPreview={renderPreview} t={t} />
        </section>
        <div className="image-inspector">
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
            <p>{t('studioImage.watermarkLimits')}</p>
            <div className="image-element-list">{imageDocument.elements.length ? imageDocument.elements.map(element => {
              const name = element.type === 'text' ? t('studioImage.textElement', { text: element.text.slice(0, 36) }) : t('studioImage.imageElement', { name: resources.get(element.resourceId)?.name || '' })
              return <button type="button" key={element.id} aria-pressed={imageDocument.selectedId === element.id} onClick={() => replacePresent(current => ({ ...current, selectedId: element.id }))}>{name}</button>
            }) : <p>{t('studioImage.noElements')}</p>}</div>
          </div></details>
          {selected && bounds && <details open><summary>{t('studioImage.properties')}</summary><div className="image-panel-body image-field-grid">
            {selected.type === 'text' && <><label className="image-field-wide">{t('studioImage.textContent')}<textarea name="selected-text" maxLength="500" value={selected.text} onChange={event => commit(current => updateElement(current, selected.id, { text: event.target.value }))} /></label><label>{t('studioImage.fontSize')}<input name="font-size" type="number" min="6" max="512" value={selected.fontSize} onChange={event => commit(current => updateElement(current, selected.id, { fontSize: Number(event.target.value) }))} /></label><label>{t('studioImage.color')}<input name="text-color" type="color" value={selected.color} onChange={event => commit(current => updateElement(current, selected.id, { color: event.target.value }))} /></label></>}
            <label>{t('studioImage.opacity')}<input name="opacity" type="range" min="0" max="100" value={Math.round(selected.opacity * 100)} onChange={event => commit(current => updateElement(current, selected.id, { opacity: Number(event.target.value) / 100 }))} /></label>
            {[['x', 'x'], ['y', 'y'], ['width', 'width'], ['height', 'height']].map(([key, label]) => <label key={key}>{t(`studioImage.${label}`)}<input name={`element-${key}`} type="number" min={key === 'width' || key === 'height' ? 1 : undefined} value={Math.round(bounds[key])} onChange={event => commit(current => updateElement(current, selected.id, { [key]: Number(event.target.value) }))} /></label>)}
            <button type="button" onClick={() => commit(current => centreElement(current, selected.id))}>{t('studioImage.centre')}</button>
            <button type="button" className="image-danger" onClick={() => commit(current => removeElement(current, selected.id))}><IconTrash aria-hidden="true" />{t('studioImage.remove')}</button>
          </div></details>}
          <section className="image-export-panel"><h2>{t('studioImage.export')}</h2><div className="image-field-grid">
            <label>{t('studioImage.format')}<select name="image-format" value={format} onChange={event => setFormat(event.target.value)}><option value="png">PNG</option><option value="jpeg">JPEG</option><option value="webp">WebP</option></select></label>
            {format !== 'png' && <label>{t('studioImage.quality')}<input name="image-quality" type="range" min="10" max="100" value={quality} onChange={event => setQuality(event.target.value)} /></label>}
          </div><button type="button" className="studio-primary image-download" disabled={Boolean(busy)} onClick={exportCurrent}><IconDownload aria-hidden="true" />{t('studioImage.download', { format: format === 'jpeg' ? 'JPEG' : format.toUpperCase() })}</button>
          </section>
        </div>
      </div>
      {busy && <div className="image-busy" role="status"><span>{t(busy === 'load' ? 'studioImage.working' : 'studioImage.exporting')}</span><button type="button" onClick={abortOperation}>{t('studioImage.cancel')}</button></div>}
      {error && <p role="alert" className="image-message">{t(`studioImage.errors.${error}`)}</p>}
      {notice && <p role="status" className="image-message">{t(`studioImage.${notice}`)}</p>}
    </section>
  )
}
