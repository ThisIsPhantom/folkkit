import {AUDIO_LIMITS,audioError} from './audioModel.js'
export function selectionGain(time,{start,end,fadeIn,fadeOut}) {
 if(time<start||time>=end)return 0
 return Math.min(1,fadeIn>0?(time-start)/fadeIn:1,fadeOut>0?(end-time)/fadeOut:1)
}
export function createAudioPlayback(blob,{createMedia=()=>document.createElement('audio'),createContext=()=>{const Context=globalThis.AudioContext||globalThis.webkitAudioContext;return Context?new Context():null},urlApi=URL,onState=()=>{},onTime=()=>{}}={}) {
 if(!blob?.size||blob.size>AUDIO_LIMITS.preview)throw audioError('resource_limit')
 const media=createMedia(),url=urlApi.createObjectURL(blob)
 let context,source,gain,timer,dead=false,generation=0,requested=false,selection
 media.preload='metadata';media.src=url
 const setGain=value=>{if(gain)gain.gain.value=value;else media.volume=value}
 const pause=()=>{requested=false;generation++;clearInterval(timer);media.pause();setGain(0);onState(false)}
 const tick=()=>{
  if(dead||!selection)return
  const time=media.currentTime;onTime(time)
  if(time>=selection.end){pause();return}
  setGain(selectionGain(time,selection))
 }
 const ended=()=>pause()
 media.addEventListener('ended',ended)
 async function play(settings) {
  if(dead)return
  const mine=++generation;requested=true;clearInterval(timer);selection={...settings}
  if(!context){context=createContext();if(context){source=context.createMediaElementSource(media);gain=context.createGain();source.connect(gain);gain.connect(context.destination)}}
  setGain(0)
  if(media.currentTime<settings.start||media.currentTime>=settings.end-0.02)media.currentTime=settings.start
  try {
   // Start the audio clock before the media element; Firefox can resume slowly.
   if(context)await context.resume()
   if(dead||mine!==generation)return
   await media.play()
   if(dead||mine!==generation){if(dead||!requested)media.pause();return}
   tick();timer=setInterval(tick,15);onState(true)
  }catch(error){if(!dead&&mine===generation){pause();throw error?.name==='NotSupportedError'?audioError('playback_unavailable'):error}}
 }
 function dispose() {
  if(dead)return
  dead=true;pause();media.removeEventListener('ended',ended);media.removeAttribute('src');media.load()
  source?.disconnect();gain?.disconnect();context?.close()?.catch(()=>{});urlApi.revokeObjectURL(url)
 }
 return {play,pause,dispose}
}
