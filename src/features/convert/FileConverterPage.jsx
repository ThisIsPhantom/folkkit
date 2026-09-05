import { useEffect,useRef,useState } from 'react'
import { useI18n } from '../../i18n/index.js'
import { createConversionQueue } from './queue.js'
import { convertFileItem,createZip } from './engine.js'
import { optimizeImageItem } from './imageOptimization.js'
import { formatFileSize } from './formatFileSize.js'
import { IMAGE_FORMATS,targetsFor } from './profiles.js'
import FileSettings from './FileSettings.jsx'
import './converter.css'

const MODES = new Set(['convert','optimize'])
const normalizeMode = value => MODES.has(value) ? value : 'convert'
const normalizeTarget = value => value === 'jpg' ? 'jpeg' : String(value || '').toLowerCase()
const runFileTask = (item,options) => item.task === 'optimize' ? optimizeImageItem(item,options) : convertFileItem(item,options)

function prepareItem(mode,preferredTarget) {
  return source => {
    const from = typeof source === 'string' ? source : source.from
    if (mode === 'optimize') return IMAGE_FORMATS.includes(from)
      ? { task:'optimize',target:from,allowedTargets:[from],settings:{ qualityPreset:'balanced' } }
      : { task:'optimize',target:'',allowedTargets:[],settings:{} }
    const allowedTargets = targetsFor(from)
    const target = allowedTargets.includes(preferredTarget) ? preferredTarget : (allowedTargets[0] || '')
    return { task:'convert',target,allowedTargets,settings:target === 'gif' ? { start:0,duration:5 } : {} }
  }
}

function comparisonText(original,result,tr) {
  if (result.keptOriginal) return tr('keptOriginal')
  if (result.blob.size < original.size) return `${tr('reducedBy')} ${Math.round((1 - result.blob.size / original.size) * 100)} %`
  if (result.blob.size > original.size) {
    const resized = result.sourceDimensions && result.outputDimensions && (result.sourceDimensions.width !== result.outputDimensions.width || result.sourceDimensions.height !== result.outputDimensions.height)
    return tr(resized ? 'largerAfterResize' : 'largerResult')
  }
  return tr('sameSize')
}

function ImageComparison({ item,result,tr,locale }) {
  const beforeImage = useRef(null)
  const afterImage = useRef(null)
  useEffect(() => {
    if (typeof URL.createObjectURL !== 'function') return undefined
    const before = URL.createObjectURL(item.file)
    const after = URL.createObjectURL(result.blob)
    const beforeNode = beforeImage.current
    const afterNode = afterImage.current
    beforeNode.src = before
    afterNode.src = after
    return () => {
      beforeNode.removeAttribute('src')
      afterNode.removeAttribute('src')
      URL.revokeObjectURL(before); URL.revokeObjectURL(after)
    }
  },[item.file,result.blob])
  return <figure className="converter-comparison">
    <div><figcaption><strong>{tr('before')}</strong><span>{formatFileSize(item.file.size,locale)}</span></figcaption><img ref={beforeImage} alt="" /></div>
    <div><figcaption><strong>{tr('after')}</strong><span>{formatFileSize(result.blob.size,locale)}</span></figcaption><img ref={afterImage} alt="" /></div>
  </figure>
}

export default function FileConverterPage({ initialMode='convert',onModeChange,initialTarget='',initialCombine=false,active=true }) {
  const { t,locale } = useI18n()
  const tr = key => t(`studioConvert.${key}`)
  const requestedMode = normalizeMode(initialMode)
  const requestedTarget = normalizeTarget(initialTarget)
  const [localMode,setLocalMode] = useState(requestedMode)
  const mode = onModeChange ? requestedMode : localMode
  const [queue] = useState(() => createConversionQueue({ convert:runFileTask }))
  const [state,setState] = useState(() => queue.snapshot())
  const [dragging,setDragging] = useState(false)
  const [error,setError] = useState(null)
  const [common,setCommon] = useState('')
  const [combine,setCombine] = useState(Boolean(initialCombine))
  const [zipping,setZipping] = useState(false)
  const zipController = useRef(null)
  const downloads = useRef(new Map())
  const modeRef = useRef(mode)
  const targetRef = useRef(requestedTarget)
  const appliedConfiguration = useRef(`${mode}:${requestedTarget}`)

  useEffect(() => {
    const unsubscribe = queue.subscribe(setState)
    const urls = downloads.current
    return () => {
      unsubscribe(); queue.dispose(); zipController.current?.abort()
      for (const [url,timer] of urls) { clearTimeout(timer); URL.revokeObjectURL(url) }
      urls.clear()
    }
  },[queue])
  useEffect(() => {
    modeRef.current = mode
    targetRef.current = requestedTarget
    const key = `${mode}:${requestedTarget}`
    if (appliedConfiguration.current === key) return
    if (state.running) { queue.cancel(); return }
    if (state.adding) return
    queue.reset(prepareItem(mode,requestedTarget))
    appliedConfiguration.current = key
  },[mode,requestedTarget,queue,state.running,state.adding])
  useEffect(() => {
    if (!active) { queue.cancel(); zipController.current?.abort() }
  },[active,queue])

  const add = async files => {
    setError(null)
    try {
      await queue.add(files,prepareItem(modeRef.current,targetRef.current))
      const snapshot = queue.snapshot()
      if (modeRef.current === 'convert' && targetRef.current && snapshot.items.every(item => item.allowedTargets?.includes(targetRef.current) && item.target === targetRef.current)) setCommon(targetRef.current)
    } catch (failure) { setError(failure.code || 'conversion_failed') }
  }
  const download = (blob,name) => {
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url; anchor.download = name; anchor.click()
    downloads.current.set(url,setTimeout(() => { URL.revokeObjectURL(url); downloads.current.delete(url) },30000))
  }
  const zip = async entries => {
    setZipping(true); setError(null); zipController.current = new AbortController()
    try { download(await createZip(entries,zipController.current.signal),'folkkit-files.zip') }
    catch (failure) { if (!zipController.current.signal.aborted) setError(failure.code || 'conversion_failed') }
    finally { setZipping(false); zipController.current = null }
  }
  const selectMode = next => {
    if (next === mode || state.running || state.adding) return
    if (onModeChange) onModeChange(next)
    else setLocalMode(next)
  }
  const commonTargets = state.items.length ? (state.items[0].allowedTargets || targetsFor(state.items[0].from)).filter(target => state.items.every(item => (item.allowedTargets || targetsFor(item.from)).includes(target))) : []
  const results = state.items.flatMap(item => item.results)
  const canCombine = mode === 'convert' && state.items.length > 1 && state.items.every(item => IMAGE_FORMATS.includes(item.from) && item.target === 'pdf')
  const setTarget = (item,target) => queue.configure(item.id,{ target,settings:target === 'gif' ? { start:0,duration:5 } : {} })
  const accept = mode === 'optimize' ? '.png,.jpg,.jpeg,.webp' : '.png,.jpg,.jpeg,.webp,.pdf,.mp3,.wav,.flac,.ogg,.mp4,.webm,.mov'
  const picker = label => <label className="converter-file-label">{label}<input name="converter-files" type="file" multiple aria-label={label} disabled={state.running || state.adding} accept={accept} onChange={event => { add(event.target.files); event.target.value = '' }} /></label>
  const dropProps = {
    onDragOver:event => { event.preventDefault(); if (!state.running) setDragging(true) },
    onDragLeave:() => setDragging(false),
    onDrop:event => { event.preventDefault(); setDragging(false); if (!state.running) add(event.dataTransfer.files) },
  }

  return <section className="file-converter studio-page" aria-labelledby="convert-title" hidden={!active}>
    <nav className="converter-modes" aria-label={tr('modeLabel')}>
      <button type="button" aria-pressed={mode === 'convert'} disabled={state.running || state.adding} onClick={() => selectMode('convert')}>{tr('modeConvert')}</button>
      <button type="button" aria-pressed={mode === 'optimize'} disabled={state.running || state.adding} onClick={() => selectMode('optimize')}>{tr('modeOptimize')}</button>
    </nav>
    <header className="converter-heading"><h1 id="convert-title">{tr(mode === 'optimize' ? 'optimizeTitle' : 'title')}</h1><p>{tr(mode === 'optimize' ? 'optimizeSubtitle' : 'subtitle')}</p></header>
    {state.items.length === 0 ? <div className={`converter-drop${dragging ? ' is-dragging' : ''}`} {...dropProps}>
      <span className="converter-drop-icon" aria-hidden="true">↥</span><strong>{tr('drop')}</strong>
      {picker(tr('choose'))}
      <p>{tr(mode === 'optimize' ? 'optimizeDropHint' : 'dropHint')}</p><details className="converter-limits"><summary>{tr('limitsLabel')}</summary><small>{tr('limits')}</small></details>
    </div> : <div className={`converter-add-more${dragging ? ' is-dragging' : ''}`} {...dropProps}>{picker(tr('add'))}<small>{tr(mode === 'optimize' ? 'optimizeDropHint' : 'dropHint')}</small></div>}
    {error && <p role="alert" className="converter-error">{tr(`errors.${error}`)}</p>}
    {state.items.length > 0 && <div className="converter-workspace">
      <div className="converter-toolbar"><h2>{tr('files')} <span>{state.items.length}</span></h2>
        {mode === 'convert' && <label>{tr('commonTarget')}<select name="converter-common-target" value={commonTargets.includes(common) ? common : ''} disabled={state.running} onChange={event => { setCommon(event.target.value); if (event.target.value) for (const item of state.items) setTarget(item,event.target.value) }}><option value="">{tr('individual')}</option>{commonTargets.map(target => <option key={target} value={target}>{target.toUpperCase()}</option>)}</select></label>}
        <button className="converter-subtle" type="button" disabled={state.running} onClick={() => { queue.clear(); setCommon(''); setCombine(Boolean(initialCombine)) }}>{tr('clear')}</button>
      </div>
      {canCombine && <label className="converter-combine"><input name="converter-combine" type="checkbox" checked={combine} disabled={state.running} onChange={event => { setCombine(event.target.checked); for (const item of state.items) queue.configure(item.id,{}) }} />{tr('combine')}</label>}
      <ol className="converter-files">{state.items.map((item,index) => <li key={item.id} className="converter-file" data-status={item.status}>
        <div className="converter-file-main"><span className="converter-format" aria-hidden="true">{item.from?.toUpperCase() || '?'}</span>
          <div className="converter-file-name"><strong>{item.file.name}</strong><small>{formatFileSize(item.file.size,locale)}</small></div>
          {mode === 'convert' && <label className="converter-target"><span>{tr('target')}</span><select name={`file-${item.id}-target`} aria-label={`${tr('target')}: ${item.file.name}`} value={item.target} disabled={state.running || !item.from} onChange={event => { setCommon(''); setTarget(item,event.target.value) }}>{!item.from && <option value="">{tr('unknown')}</option>}{(item.allowedTargets || targetsFor(item.from)).map(target => <option key={target} value={target}>{target.toUpperCase()}</option>)}</select></label>}
          <span className="converter-status" aria-live="polite">{tr(`status.${item.status}`)}</span>
          <button className="converter-subtle converter-remove" type="button" disabled={state.running} aria-label={`${tr('remove')}: ${item.file.name}`} onClick={() => queue.remove(item.id)}>×</button>
        </div>
        {item.status !== 'unsupported' && item.from && <FileSettings item={item} disabled={state.running} onChange={settings => queue.configure(item.id,{ settings })} />}
        {item.status === 'unsupported' && <p className="converter-error">{tr('optimizeUnsupported')}</p>}
        {item.status === 'running' && <progress aria-label={tr('status.running')} max="100" value={item.progress ?? undefined} />}
        {item.error && <p className="converter-error">{tr(`errors.${item.error}`)}</p>}
        <div className="converter-row-actions">{canCombine && <><button type="button" disabled={state.running || index === 0} onClick={() => queue.move(item.id,-1)}>{tr('moveUp')}</button><button type="button" disabled={state.running || index === state.items.length - 1} onClick={() => queue.move(item.id,1)}>{tr('moveDown')}</button></>}
          {['error','cancelled'].includes(item.status) && item.from && <button type="button" disabled={state.running} onClick={() => queue.retry(item.id)}>{tr('retry')}</button>}
          {item.combinedWith && <small>{tr('combined')}</small>}
        </div>
        {item.results.map(result => <div className="converter-result" key={result.name}>
          <div className="converter-result-summary"><span><small>{tr('result')}</small><strong>{result.name}</strong></span><span>{formatFileSize(result.blob.size,locale)}</span></div>
          {IMAGE_FORMATS.includes(item.from) && result.blob.type.startsWith('image/') && <><ImageComparison item={item} result={result} tr={tr} locale={locale} /><p className="converter-size-result">{comparisonText(item.file,result,tr)}</p></>}
          <button type="button" aria-label={`${tr('downloadResult')}: ${result.name}`} onClick={() => download(result.blob,result.name)}>{tr('download')}</button>
        </div>)}
        {item.results.length > 1 && <button type="button" disabled={zipping} onClick={() => zip(item.results)}>{tr('downloadZip')}</button>}
      </li>)}</ol>
      <div className="converter-start"><p>{tr('local')}</p>{state.running ? <button type="button" onClick={() => queue.cancel()}>{tr(mode === 'optimize' ? 'cancelOptimize' : 'cancel')}</button> : <button type="button" className="converter-primary" disabled={state.adding || !state.items.some(item => item.status === 'ready')} onClick={() => queue.start({ combineImages:canCombine && combine })}>{tr(mode === 'optimize' ? 'optimize' : 'convert')}</button>}{results.length > 0 && <button type="button" disabled={zipping || state.running} onClick={() => zip(results)}>{tr(zipping ? 'creatingZip' : 'downloadZip')}</button>}</div>
    </div>}
  </section>
}
