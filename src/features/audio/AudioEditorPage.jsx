import {useEffect,useRef,useState} from 'react'
import {useI18n} from '../../i18n/index.js'
import {IconPlayerPlay,IconPlayerPause,IconDownload,IconArrowBackUp,IconArrowForwardUp} from '@tabler/icons-react'
import AudioWaveform from './AudioWaveform.jsx'
import {createAudioPlayback} from './audioPlayback.js'
import {AUDIO_FORMATS,audioError,createAudioState,editAudioState,createHistory,commitHistory,undoHistory,redoHistory} from './audioModel.js'
import './audioEditor.css'
async function loadEngine() {try{return await import('./audioEngine.js')}catch{throw audioError('media_runtime_unavailable')}}
const prepareDefault=async(...args)=>(await loadEngine()).prepareAudio(...args)
const exportDefault=async(...args)=>(await loadEngine()).exportAudio(...args)
function TimeField({label,value,onCommit,max,disabled}) {
 const [draft,setDraft]=useState(String(value)),cancelled=useRef(false)
 return <label>{label}<input type="number" min="0" max={max} step="0.001" value={draft} disabled={disabled} onChange={event=>setDraft(event.target.value)} onBlur={()=>{const number=Number(draft);if(!cancelled.current&&draft.trim()&&Number.isFinite(number))onCommit(number);cancelled.current=false;setDraft(String(value))}} onKeyDown={event=>{if(event.key==='Enter')event.currentTarget.blur();if(event.key==='Escape'){cancelled.current=true;setDraft(String(value));event.currentTarget.blur()}}}/></label>
}
export default function AudioEditorPage({active=true,fileRequest,onFileRequestConsumed,prepare=prepareDefault,exporter=exportDefault,playbackFactory=createAudioPlayback}) {
 const {t:translate}=useI18n(),t=(key,vars)=>translate(`studioAudio.${key}`,vars)
 const [source,setSource]=useState(null),[history,setHistory]=useState(null),[busy,setBusy]=useState(null),[error,setError]=useState(null),[progress,setProgress]=useState(0)
 const [format,setFormat]=useState('mp3'),[bitrate,setBitrate]=useState(192),[result,setResult]=useState(null),[playing,setPlaying]=useState(false),[position,setPosition]=useState(0),[zoom,setZoom]=useState(false)
 const op=useRef(null),player=useRef(null),alive=useRef(false),isActive=useRef(active),seen=useRef(null),playGeneration=useRef(0)
 const downloadLink=useRef(null)
 const state=history?.present
 function stopPlayback(dispose=false) {playGeneration.current++;player.current?.pause();if(dispose){player.current?.dispose();player.current=null}setPlaying(false);setPosition(0)}
 function cancelWork() {const old=op.current;op.current=null;old?.abort();setBusy(null)}
 function reset() {cancelWork();stopPlayback(true);setSource(null);setHistory(null);setResult(null);setError(null);setZoom(false)}
 function failure(error) {const code=error?.code;setError(['invalid_file','too_large','resource_limit','unsupported_type','type_mismatch','unsupported_codec','no_audio','invalid_settings','conversion_failed','media_runtime_unavailable','cancelled'].includes(code)?code:'conversion_failed')}
 async function load(file) {
  if(!file||!isActive.current)return
  cancelWork();stopPlayback(true);setError(null);const controller=new AbortController();op.current=controller;setBusy('preparing');setProgress(0)
  try {
   const prepared=await prepare(file,{signal:controller.signal,onProgress:value=>{if(op.current===controller)setProgress(value)}})
   if(!alive.current||!isActive.current||op.current!==controller)return
   setSource({...prepared,file});setHistory(createHistory(createAudioState(prepared.duration)));setFormat(prepared.from||'mp3');setResult(null);setZoom(false)
  }catch(error){if(alive.current&&op.current===controller)failure(error)}
  finally{if(op.current===controller){op.current=null;setBusy(null)}}
 }
 useEffect(()=>{
  alive.current=true
  return ()=>{alive.current=false;op.current?.abort();op.current=null;player.current?.dispose();player.current=null}
 },[])
 useEffect(()=>{
  isActive.current=active
  if(!active){op.current?.abort();op.current=null;playGeneration.current++;player.current?.pause();queueMicrotask(()=>{if(alive.current&&!isActive.current){setBusy(null);setPlaying(false);setPosition(0)}})}
 },[active])
 useEffect(()=>{
  let valid=true
  // Deferral gives StrictMode's simulated cleanup ownership before consuming a request.
  queueMicrotask(()=>{if(valid&&active&&fileRequest&&seen.current!==fileRequest.id){seen.current=fileRequest.id;void load(fileRequest.file);onFileRequestConsumed?.(fileRequest.id)}})
  return ()=>{valid=false}
  // load reads the current request only; future callback identities must not reload a file.
  // eslint-disable-next-line react-hooks/exhaustive-deps
 },[active,fileRequest?.id])
 useEffect(()=>{
  if(!result)return
  const url=URL.createObjectURL(result.blob);if(downloadLink.current)downloadLink.current.href=url
  return ()=>URL.revokeObjectURL(url)
 },[result])
 function commit(next) {stopPlayback();setResult(null);setHistory(h=>commitHistory(h,next))}
 async function play() {
  if(!source||!active||busy)return
  if(playing){stopPlayback();return}
  const mine=++playGeneration.current
  setError(null)
  try {
   if(!player.current){
    let instance
    const current=()=>alive.current&&isActive.current&&player.current===instance
    instance=playbackFactory(source.preview,{
     onState:value=>{if(current())setPlaying(value)},
     onTime:value=>{if(current())setPosition(value)},
     onError:()=>{if(current()){setPlaying(false);setError('playback_unavailable')}},
    })
    player.current=instance
   }
   await player.current.play(state)
  }catch(error){if(alive.current&&isActive.current&&playGeneration.current===mine)setError(error?.code==='playback_unavailable'?'playback_unavailable':'playback')}
 }
 async function save() {
  if(!source||!state||!active||busy)return
  stopPlayback();setResult(null);setError(null)
  const controller=new AbortController();op.current=controller;setBusy('exporting');setProgress(0)
  try {
   const next=await exporter(source.file,{...state,from:source.from,to:format,bitrate},{signal:controller.signal,onProgress:value=>{if(op.current===controller)setProgress(value)}})
   if(alive.current&&isActive.current&&op.current===controller)setResult(next)
  }catch(error){if(alive.current&&op.current===controller)failure(error)}
  finally{if(op.current===controller){op.current=null;setBusy(null)}}
 }
 return <section className="audio-editor studio-page" aria-labelledby="audio-title">
  <header><h1 id="audio-title">{t('title')}</h1><p>{t('intro')}</p></header>
  <div className="audio-file-row"><label className="audio-file-label">{t('choose')}<input type="file" accept="audio/mpeg,audio/wav,audio/flac,audio/ogg,.mp3,.wav,.flac,.ogg" onChange={event=>{void load(event.target.files?.[0]);event.target.value=''}} disabled={!active}/></label>{(source||busy)&&<button onClick={reset}>{t('reset')}</button>}</div>
  <p className="audio-help">{t('limits')}</p>
  {busy&&<div role="status" className="audio-status"><span>{t(busy)} {progress}%</span><button onClick={cancelWork}>{t('cancel')}</button></div>}
  {error&&<p role="alert">{t(`errors.${error}`)}</p>}
  {!source&&!busy&&<div className="audio-empty">{t('empty')}</div>}
  {source&&state&&<>
   <p className="audio-filename">{source.file.name}</p>
   <AudioWaveform key={`${active}-${busy}`} peaks={source.peaks} state={state} onCommit={commit} t={t} disabled={!!busy||!active} zoom={zoom} position={position}/>
   <div className="audio-toolbar"><button onClick={play} disabled={!!busy||!active}>{playing?<IconPlayerPause aria-hidden="true"/>:<IconPlayerPlay aria-hidden="true"/>}{t(playing?'pause':'play')}</button><strong>{t('selection',{duration:(state.end-state.start).toFixed(3)})}</strong><button disabled={!!busy} onClick={()=>setZoom(value=>!value)}>{t(zoom?'unzoom':'zoom')}</button><button disabled={!!busy} onClick={()=>commit(createAudioState(state.duration))}>{t('whole')}</button><button aria-label={t('undo')} disabled={!!busy||!history.past.length} onClick={()=>{stopPlayback();setResult(null);setHistory(undoHistory)}}><IconArrowBackUp aria-hidden="true"/></button><button aria-label={t('redo')} disabled={!!busy||!history.future.length} onClick={()=>{stopPlayback();setResult(null);setHistory(redoHistory)}}><IconArrowForwardUp aria-hidden="true"/></button></div>
   <div className="audio-fields">{['start','end','fadeIn','fadeOut'].map(key=><TimeField key={`${key}-${state[key]}`} label={t(key)} value={state[key]} max={key.startsWith('fade')?Math.min(10,state.end-state.start):state.duration} disabled={!!busy} onCommit={value=>commit(editAudioState(state,{[key]:value}))}/>)}</div>
   <p className="audio-help">{t('local')}</p>
   <div className="audio-export"><label>{t('format')}<select aria-label={t('format')} value={format} disabled={!!busy} onChange={event=>{setFormat(event.target.value);setResult(null)}}>{AUDIO_FORMATS.map(value=><option key={value} value={value}>{value.toUpperCase()}</option>)}</select></label>{format==='mp3'&&<label>{t('bitrate')}<select aria-label={t('bitrate')} value={bitrate} disabled={!!busy} onChange={event=>{setBitrate(Number(event.target.value));setResult(null)}}>{[128,192,256,320].map(value=><option key={value} value={value}>{value} kbit/s</option>)}</select></label>}<button className="audio-primary" onClick={save} disabled={!!busy||!active}><IconDownload aria-hidden="true"/>{t('export')}</button></div>
   {result&&<div className="audio-result"><p role="status">{t('ready')}</p><a ref={downloadLink} download={result.name}>{t('download')}</a></div>}
  </>}
 </section>
}
