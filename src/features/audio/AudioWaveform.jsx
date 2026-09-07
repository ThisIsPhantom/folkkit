import {useEffect,useRef,useState} from 'react'
import {editAudioState} from './audioModel.js'
export default function AudioWaveform({peaks,state,onCommit,t,disabled=false,zoom=false,position=0}) {
 const gesture=useRef(null),[draft,setDraft]=useState(null)
 const shown=draft||state,viewStart=zoom?state.start:0,viewEnd=zoom?state.end:state.duration,span=viewEnd-viewStart
 const percent=value=>Math.max(0,Math.min(100,(value-viewStart)/span*100))
 const visible=peaks.map((peak,i)=>({peak,time:(i+0.5)/peaks.length*state.duration})).filter(({time})=>time>=viewStart&&time<=viewEnd)
 const path=visible.map(({peak,time})=>{const x=percent(time)*10;return `M${x.toFixed(2)},${(70-peak[0]*62).toFixed(2)}V${(70-peak[1]*62).toFixed(2)}`}).join(' ')
 function cancel() {gesture.current=null;setDraft(null)}
 useEffect(()=>{const escape=event=>{if(event.key==='Escape'){gesture.current=null;setDraft(null)}};window.addEventListener('keydown',escape);return()=>window.removeEventListener('keydown',escape)},[])
 function move(event) {
  const current=gesture.current;if(!current||current.id!==event.pointerId)return
  const rect=event.currentTarget.getBoundingClientRect(),time=viewStart+(event.clientX-rect.left)/rect.width*span
  current.next=editAudioState(current.original,{[current.edge]:Math.round(time*1000)/1000});setDraft(current.next)
 }
 function down(event) {
  if(disabled||gesture.current||event.button!==0)return
  const edge=event.target.closest('[data-edge]')?.dataset.edge
  if(!edge)return
  event.preventDefault();event.currentTarget.setPointerCapture(event.pointerId)
  gesture.current={id:event.pointerId,edge,original:state,next:state}
 }
 function up(event) {
  const current=gesture.current;if(!current||current.id!==event.pointerId)return
  move(event);const next=current.next;cancel();onCommit(next)
 }
 function key(event,edge) {
  if(event.key==='Escape'){cancel();return}
  const delta=event.shiftKey?0.1:0.01
  let value
  if(['ArrowRight','ArrowUp'].includes(event.key))value=state[edge]+delta
  else if(['ArrowLeft','ArrowDown'].includes(event.key))value=state[edge]-delta
  else if(event.key==='Home')value=edge==='start'?0:state.start+0.05
  else if(event.key==='End')value=edge==='end'?state.duration:state.end-0.05
  else return
  event.preventDefault();onCommit(editAudioState(state,{[edge]:value}))
 }
 return <figure className="audio-wave"><figcaption>{t('waveform')}</figcaption>
  <div className="audio-wave-track" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={event=>{if(gesture.current?.id===event.pointerId)cancel()}} onLostPointerCapture={event=>{if(gesture.current?.id===event.pointerId)cancel()}} onKeyDown={event=>{if(event.key==='Escape')cancel()}}>
   <svg viewBox="0 0 1000 140" preserveAspectRatio="none" aria-hidden="true"><path d={path}/></svg>
   <div className="audio-wave-selection" ref={element=>{if(element){element.style.left=`${percent(shown.start)}%`;element.style.width=`${percent(shown.end)-percent(shown.start)}%`}}}/>
   {['start','end'].map(edge=><button key={edge} type="button" role="slider" data-edge={edge} className="audio-wave-handle" ref={element=>{if(element)element.style.left=`${percent(shown[edge])}%`}} aria-label={t(edge+'Handle')} aria-valuemin={edge==='start'?0:shown.start+0.05} aria-valuemax={edge==='end'?state.duration:shown.end-0.05} aria-valuenow={shown[edge]} aria-valuetext={`${shown[edge].toFixed(3)} s`} disabled={disabled} onKeyDown={event=>key(event,edge)}><span/></button>)}
   {position>viewStart&&position<viewEnd&&<div className="audio-wave-playhead" ref={element=>{if(element)element.style.left=`${percent(position)}%`}}/>}
  </div><p className="audio-help">{t('waveHelp')}</p>
 </figure>
}
