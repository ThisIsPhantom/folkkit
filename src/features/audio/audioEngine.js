import {createBrowserFFmpegRuntime,attachMediaProgress} from '../../converters/media.js'
import {mp3DecodedTiming} from './audioMp3Timing.js'
import {probeMedia} from '../convert/mediaEngine.js'
import {detectFile,readBytes} from '../convert/detection.js'
import {AUDIO_LIMITS,AUDIO_FORMATS,AUDIO_MIME,audioError,validateAudioFile,validateAudioProbe,parseWaveformAnalysis,waveformWindow,buildAudioArgs} from './audioModel.js'

export function createAudioEngine({runtimeFactory=createBrowserFFmpegRuntime,detect=detectFile,read=readBytes}={}) {
 async function run(file,settings,options={},prepare=false) {
  validateAudioFile(file)
  const {signal,onProgress}=options
  if(signal?.aborted) throw audioError('cancelled')
  const runtime=runtimeFactory(),names=[]
  let ff,timer,closed=false,detach=()=>{},rejectStop
  const stopPromise=new Promise((_resolve,reject)=>{rejectStop=reject})
  const stop=(code)=>{closed=true;runtime.terminate();rejectStop(audioError(code))}
  const abort=()=>stop('cancelled')
  const guard=()=>{if(closed||signal?.aborted)throw audioError('cancelled')}
  signal?.addEventListener('abort',abort,{once:true})
  timer=setTimeout(()=>stop('resource_limit'),AUDIO_LIMITS.timeout)
  const work=async()=>{
   const from=await detect(file);guard()
   if(!AUDIO_FORMATS.includes(from))throw audioError('unsupported_type')
   if(settings?.from&&settings.from!==from)throw audioError('type_mismatch')
   ff=await runtime.get();guard()
   const input=`audio-input.${from}`;names.push(input)
   const bytes=await read(file);guard()
   // writeFile transfers the input buffer, so verify complete MP3 frames first.
   const mp3Timing=prepare&&from==='mp3'?mp3DecodedTiming(bytes):null
   await ff.writeFile(input,bytes);guard()
   const {duration}=validateAudioProbe(from,await probeMedia(ff,input));guard()
   detach=attachMediaProgress(ff,value=>{if(!closed)onProgress?.(Math.max(0,Math.min(99,value)))})
   if(prepare) {
    const timing=mp3Timing&&Math.abs(mp3Timing.encodedSamples/mp3Timing.sampleRate-duration)<=.011?mp3Timing:null
    const window=waveformWindow(duration),analysis='audio-waveform.txt',preview='audio-preview.mp3';names.push(analysis,preview)
    // Preserve every channel and the full audio band before taking extrema.
    // The time bound and fixed window size also bound metadata written in WASM.
    const filter=`atrim=end=${duration},asetpts=PTS-STARTPTS,aformat=sample_fmts=fltp:sample_rates=44100,asetnsamples=n=${window}:p=0,astats=metadata=1:reset=1:measure_perchannel=none:measure_overall=Min_level+Max_level+Number_of_samples,ametadata=mode=print:file=${analysis}`
    const code=await ff.exec(['-hide_banner','-nostdin','-protocol_whitelist','file,pipe','-t',String(duration),'-i',input,'-map','0:a:0','-af',filter,'-threads','1','-f','null','-'],AUDIO_LIMITS.timeout);guard()
    if(code!==0)throw audioError('conversion_failed')
    const {peaks,duration:actualDuration}=parseWaveformAnalysis(await ff.readFile(analysis),duration,window,timing);guard()
    const args=buildAudioArgs(from,'mp3',{start:0,end:actualDuration,bitrate:128},duration);args[args.indexOf('-fs')+1]=String(AUDIO_LIMITS.preview);args[args.length-1]=preview
    if(await ff.exec(args,AUDIO_LIMITS.timeout)!==0)throw audioError('conversion_failed');guard()
    const data=await ff.readFile(preview);guard()
    if(!data.length||data.length>=AUDIO_LIMITS.preview)throw audioError('resource_limit')
    await checkDuration(ff,preview,actualDuration);guard()
    return {duration:actualDuration,peaks,preview:new Blob([data],{type:AUDIO_MIME.mp3}),from}
   }
   const args=buildAudioArgs(from,settings.to,settings,duration),output=args.at(-1);names.push(output)
   if(await ff.exec(args,AUDIO_LIMITS.timeout)!==0)throw audioError('conversion_failed');guard()
   const data=await ff.readFile(output);guard()
   if(!data.length||data.length>=AUDIO_LIMITS.output)throw audioError('resource_limit')
   await checkDuration(ff,output,settings.end-settings.start);guard()
   const base=String(file.name||'audio').replace(/\.[^.]+$/,'').replace(/[^\p{L}\p{N}._-]+/gu,'-')||'audio'
   return {name:`${base}-folkkit.${settings.to}`,blob:new Blob([data],{type:AUDIO_MIME[settings.to]})}
  }
  try{return await Promise.race([work(),stopPromise])}
  catch(error){if(signal?.aborted)throw audioError('cancelled');throw error}
  finally {
   clearTimeout(timer);signal?.removeEventListener('abort',abort);detach()
   const wasClosed=closed;closed=true
   if(ff&&!wasClosed)for(const name of names){try{await ff.deleteFile(name)}catch{/* Missing after early failure. */}}
   runtime.terminate()
  }
 }
 return {prepareAudio:(file,options)=>run(file,null,options,true),exportAudio:(file,settings,options)=>run(file,settings,options)}
}
async function checkDuration(ff,name,expected) {
 const probe=await probeMedia(ff,name)
 if(!Number.isFinite(probe.duration)||probe.duration<=0||Math.abs(probe.duration-expected)>0.12)throw audioError('resource_limit')
}
export const {prepareAudio,exportAudio}=createAudioEngine()
