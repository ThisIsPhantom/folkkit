import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../../i18n/index.js'
import { createConversionQueue } from './queue.js'
import { convertFileItem, createZip } from './engine.js'
import { IMAGE_FORMATS, targetsFor } from './profiles.js'
import FileSettings from './FileSettings.jsx'
import './converter.css'

export default function FileConverterPage() {
  const { t } = useI18n()
  const tr = key => t(`studioConvert.${key}`)
  const [queue] = useState(() => createConversionQueue({ convert: convertFileItem }))
  const [state, setState] = useState(() => queue.snapshot())
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState(null)
  const [common, setCommon] = useState('')
  const [combine, setCombine] = useState(false)
  const [zipping, setZipping] = useState(false)
  const zipController = useRef(null)
  const downloads = useRef(new Map())
  useEffect(() => {
    const unsubscribe = queue.subscribe(setState)
    const urls = downloads.current
    return () => {
      unsubscribe(); queue.dispose(); zipController.current?.abort()
      for (const [url, timer] of urls) { clearTimeout(timer); URL.revokeObjectURL(url) }
      urls.clear()
    }
  }, [queue])
  const add = async files => {
    setError(null); setCommon('')
    try { await queue.add(files) } catch (failure) { setError(failure.code || 'conversion_failed') }
  }
  const download = (blob, name) => {
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url; anchor.download = name; anchor.click()
    downloads.current.set(url, setTimeout(() => { URL.revokeObjectURL(url); downloads.current.delete(url) }, 30000))
  }
  const zip = async entries => {
    setZipping(true); setError(null); zipController.current = new AbortController()
    try { download(await createZip(entries, zipController.current.signal), 'folkkit-files.zip') }
    catch (failure) { if (!zipController.current.signal.aborted) setError(failure.code || 'conversion_failed') }
    finally { setZipping(false); zipController.current = null }
  }
  const commonTargets = state.items.length ? targetsFor(state.items[0].from).filter(target => state.items.every(item => targetsFor(item.from).includes(target))) : []
  const results = state.items.flatMap(item => item.results)
  const canCombine = state.items.length > 1 && state.items.every(item => IMAGE_FORMATS.includes(item.from) && item.target === 'pdf')
  const setTarget = (item, target) => queue.configure(item.id, { target, settings: target === 'gif' ? { start: 0, duration: 5 } : {} })
  return <section className="file-converter studio-page" aria-labelledby="convert-title">
    <header className="converter-heading"><h1 id="convert-title">{tr('title')}</h1><p>{tr('subtitle')}</p></header>
    <div className={`converter-drop${dragging ? ' is-dragging' : ''}`} onDragOver={event => { event.preventDefault(); if (!state.running) setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={event => { event.preventDefault(); setDragging(false); if (!state.running) add(event.dataTransfer.files) }}>
      <span className="converter-drop-icon" aria-hidden="true">↥</span><strong>{tr('drop')}</strong>
      <label className="converter-file-label">{tr('choose')}<input type="file" multiple aria-label={tr('choose')} disabled={state.running || state.adding} accept=".png,.jpg,.jpeg,.webp,.pdf,.mp3,.wav,.flac,.ogg,.mp4,.webm,.mov" onChange={event => { add(event.target.files); event.target.value = '' }} /></label>
      <p>{tr('dropHint')}</p><details className="converter-limits"><summary>{tr('limitsLabel')}</summary><small>{tr('limits')}</small></details>
    </div>
    {error && <p role="alert" className="converter-error">{tr(`errors.${error}`)}</p>}
    {state.items.length > 0 && <div className="converter-workspace">
      <div className="converter-toolbar"><h2>{tr('files')} <span>{state.items.length}</span></h2>
        <label>{tr('commonTarget')}<select value={common} disabled={state.running} onChange={event => { setCommon(event.target.value); if (event.target.value) for (const item of state.items) setTarget(item, event.target.value) }}><option value="">{tr('individual')}</option>{commonTargets.map(target => <option key={target} value={target}>{target.toUpperCase()}</option>)}</select></label>
        <button className="converter-subtle" type="button" disabled={state.running} onClick={() => queue.clear()}>{tr('clear')}</button>
      </div>
      {canCombine && <label className="converter-combine"><input type="checkbox" checked={combine} disabled={state.running} onChange={event => { setCombine(event.target.checked); for (const item of state.items) queue.configure(item.id, {}) }} />{tr('combine')}</label>}
      <ol className="converter-files">{state.items.map((item, index) => <li key={item.id} className="converter-file" data-status={item.status}>
        <div className="converter-file-main"><span className="converter-format" aria-hidden="true">{item.from?.toUpperCase() || '?'}</span>
          <div className="converter-file-name"><strong>{item.file.name}</strong><small>{(item.file.size / 1024 / 1024).toFixed(2)} MiB</small></div>
          <label className="converter-target"><span>{tr('target')}</span><select aria-label={`${tr('target')}: ${item.file.name}`} value={item.target} disabled={state.running || !item.from} onChange={event => { setCommon(''); setTarget(item, event.target.value) }}>{!item.from && <option value="">{tr('unknown')}</option>}{targetsFor(item.from).map(target => <option key={target} value={target}>{target.toUpperCase()}</option>)}</select></label>
          <span className="converter-status" aria-live="polite">{tr(`status.${item.status}`)}</span>
          <button className="converter-subtle" type="button" disabled={state.running} aria-label={`${tr('remove')}: ${item.file.name}`} onClick={() => queue.remove(item.id)}>×</button>
        </div>
        {item.from && <FileSettings item={item} disabled={state.running} onChange={settings => queue.configure(item.id, { settings })} />}
        {item.status === 'running' && <progress aria-label={tr('status.running')} max="100" value={item.progress ?? undefined} />}
        {item.error && <p className="converter-error">{tr(`errors.${item.error}`)}</p>}
        <div className="converter-row-actions">{canCombine && <><button type="button" disabled={state.running || index === 0} onClick={() => queue.move(item.id, -1)}>{tr('moveUp')}</button><button type="button" disabled={state.running || index === state.items.length - 1} onClick={() => queue.move(item.id, 1)}>{tr('moveDown')}</button></>}
          {['error','cancelled'].includes(item.status) && item.from && <button type="button" disabled={state.running} onClick={() => queue.retry(item.id)}>{tr('retry')}</button>}
          {item.combinedWith && <small>{tr('combined')}</small>}
          {item.results.map(result => <button type="button" key={result.name} onClick={() => download(result.blob, result.name)}>{tr('download')}{item.results.length > 1 ? ` · ${result.name}` : ''}</button>)}
          {item.results.length > 1 && <button type="button" disabled={zipping} onClick={() => zip(item.results)}>{tr('downloadZip')}</button>}
        </div>
      </li>)}</ol>
      <div className="converter-start"><p>{tr('local')}</p>{state.running ? <button type="button" onClick={() => queue.cancel()}>{tr('cancel')}</button> : <button type="button" className="converter-primary" disabled={state.adding || !state.items.some(item => item.status === 'ready')} onClick={() => queue.start({ combineImages: canCombine && combine })}>{tr('convert')}</button>}{results.length > 0 && <button type="button" disabled={zipping || state.running} onClick={() => zip(results)}>{tr(zipping ? 'creatingZip' : 'downloadZip')}</button>}</div>
    </div>}
  </section>
}
