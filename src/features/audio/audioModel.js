import { validateMediaProbe } from '../convert/profiles.js'
export const AUDIO_LIMITS = Object.freeze({ input:100*1024*1024, output:64*1024*1024, preview:30*1024*1024, analysis:512*1024, duration:1800, buckets:2048, timeout:120000 })
export const AUDIO_FORMATS = Object.freeze(['mp3','wav','flac','ogg'])
export const AUDIO_MIME = Object.freeze({mp3:'audio/mpeg',wav:'audio/wav',flac:'audio/flac',ogg:'audio/ogg'})
export function audioError(code) { return Object.assign(new Error(code),{code}) }
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value))
const rounded=value=>Math.round(value*1000)/1000
export function validateAudioFile(file) {
 if(!file || !Number.isSafeInteger(file.size) || file.size<=0) throw audioError('invalid_file')
 if(file.size>AUDIO_LIMITS.input) throw audioError('too_large')
}
export function validateAudioProbe(from,probe) {
 if(!AUDIO_FORMATS.includes(from)) throw audioError('unsupported_type')
 if(!Number.isFinite(probe.duration)||probe.duration<0.05||probe.duration>AUDIO_LIMITS.duration) throw audioError('resource_limit')
 return validateMediaProbe(from,from,probe)
}
export function createAudioState(duration) {
 if(!Number.isFinite(duration)||duration<0.05||duration>AUDIO_LIMITS.duration) throw audioError('resource_limit')
 return {duration,start:0,end:duration,fadeIn:0,fadeOut:0}
}
export function editAudioState(state,patch) {
 for(const [key,value] of Object.entries(patch)) if(!['start','end','fadeIn','fadeOut'].includes(key)||!Number.isFinite(value)) throw audioError('invalid_settings')
 const value={...state,...patch}
 const startMax='end' in patch?state.duration-0.05:Math.min(state.duration-0.05,state.end-0.05)
 value.start=clamp(rounded(value.start),0,startMax)
 value.end=clamp(rounded(value.end),value.start+0.05,state.duration)
 const length=value.end-value.start
 value.fadeIn=clamp(rounded(value.fadeIn),0,Math.min(10,length))
 value.fadeOut=clamp(rounded(value.fadeOut),0,Math.max(0,Math.min(10,length-value.fadeIn)))
 return value
}
export function createHistory(present) { return {past:[],present,future:[]} }
export function commitHistory(history,present) {
 if(JSON.stringify(history.present)===JSON.stringify(present)) return history
 return {past:[...history.past,history.present].slice(-30),present,future:[]}
}
export function undoHistory(h) { return h.past.length ? {past:h.past.slice(0,-1),present:h.past.at(-1),future:[h.present,...h.future]} : h }
export function redoHistory(h) { return h.future.length ? {past:[...h.past,h.present].slice(-30),present:h.future[0],future:h.future.slice(1)} : h }
export function waveformWindow(duration) { return Math.max(1,Math.ceil(duration*44100/AUDIO_LIMITS.buckets)) }
export function parseWaveform(bytes,duration,window) {
 if(!bytes?.length||bytes.length>AUDIO_LIMITS.analysis) throw audioError('resource_limit')
 const text=new TextDecoder('utf-8',{fatal:true}).decode(bytes), peaks=[]
 const blocks=text.trim().split(/(?=frame:)/).filter(Boolean)
 if(blocks.length>AUDIO_LIMITS.buckets) throw audioError('resource_limit')
 for(let i=0;i<blocks.length;i++) {
  const block=blocks[i], frame=block.match(/^frame:(\d+)\s+pts:\S+\s+pts_time:([\d.e+-]+)/)
  const mins=[...block.matchAll(/lavfi\.astats\.Overall\.Min_level=([^\r\n]+)/g)],maxs=[...block.matchAll(/lavfi\.astats\.Overall\.Max_level=([^\r\n]+)/g)]
  const min=Number(mins[0]?.[1]),max=Number(maxs[0]?.[1]),time=Number(frame?.[2])
  if(!frame||Number(frame[1])!==i||mins.length!==1||maxs.length!==1||!Number.isFinite(min)||!Number.isFinite(max)||min>max||!Number.isFinite(time)||Math.abs(time-i*window/44100)>0.02) throw audioError('invalid_file')
  peaks.push([clamp(min,-1,1),clamp(max,-1,1)])
 }
 // Demuxer duration may differ by a few codec frames, but never accept a partial analysis.
 if(!peaks.length||(peaks.length*window/44100)<duration-0.08) throw audioError('resource_limit')
 return peaks
}

export function parseWaveformAnalysis(bytes,duration,window) {
 const peaks=parseWaveform(bytes,duration,window)
 const samples=[...new TextDecoder().decode(bytes).matchAll(/lavfi\.astats\.Overall\.Number_of_samples=([^\r\n]+)/g)].map(match=>Number(match[1]))
 if(samples.length!==peaks.length||samples.some((count,i)=>!Number.isInteger(count)||count<1||count>window||(i<samples.length-1&&count!==window)))throw audioError('invalid_file')
 const actual=samples.reduce((sum,count)=>sum+count,0)/44100
 if(actual<0.05||actual>AUDIO_LIMITS.duration||Math.abs(actual-duration)>0.08)throw audioError('resource_limit')
 return {peaks,duration:actual}
}
export function buildAudioArgs(from,to,settings,duration) {
 if(!AUDIO_FORMATS.includes(from)||!AUDIO_FORMATS.includes(to)) throw audioError('unsupported_type')
 const {start,end,fadeIn=0,fadeOut=0,bitrate=192}=settings
 if(![start,end,fadeIn,fadeOut].every(Number.isFinite)||start<0||end>duration||end-start<0.049999||fadeIn<0||fadeOut<0||fadeIn>10||fadeOut>10||fadeIn+fadeOut>end-start+1e-9||![128,192,256,320].includes(Number(bitrate))) throw audioError('invalid_settings')
 const filter=[`atrim=start=${start}:end=${end}`,'asetpts=PTS-STARTPTS',...(fadeIn>0?[`afade=t=in:st=0:d=${fadeIn}`]:[]),...(fadeOut>0?[`afade=t=out:st=${rounded(end-start-fadeOut)}:d=${fadeOut}`]:[])].join(',')
 const encoders={mp3:['-c:a','libmp3lame','-b:a',`${Number(bitrate)}k`],wav:['-c:a','pcm_s16le'],flac:['-c:a','flac','-compression_level','5'],ogg:['-c:a','libvorbis','-q:a','5']}
 return ['-hide_banner','-nostdin','-protocol_whitelist','file,pipe','-i',`audio-input.${from}`,'-map','0:a:0','-vn','-map_metadata','-1','-map_chapters','-1','-af',filter,'-ac','2','-ar','44100',...encoders[to],'-threads','1','-t',String(end-start),'-fs',String(AUDIO_LIMITS.output),'-f',to,`audio-output.${to}`]
}
