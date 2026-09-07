import {expect,test,vi} from 'vitest'
import {createAudioEngine} from './audioEngine.js'
function harness({duration=1,code=0,outputDuration=1,stalled=false}={}) {
 const listeners=new Set(),files=new Map();let calls=0
 const ff={on:(event,fn)=>{if(event==='log')listeners.add(fn)},off:(event,fn)=>listeners.delete(fn),writeFile:async(name,data)=>files.set(name,data),deleteFile:async name=>files.delete(name),readFile:async name=>files.get(name),exec:async args=>{
  if(!args.includes('-af')) { const d=++calls===1?duration:outputDuration;for(const fn of listeners)fn({message:`Duration: 00:00:${d.toFixed(2)}, Stream #0:0: Audio: pcm_s16le`});return 1 }
  if(stalled)return new Promise(()=>{})
  files.set(args.at(-1),new Uint8Array([1,2,3]));return code
 }}
 const runtime={get:async()=>ff,terminate:vi.fn()}
 const engine=createAudioEngine({runtimeFactory:()=>runtime,detect:async()=> 'wav',read:async()=>new Uint8Array([1])})
 return {engine,runtime,files}
}
const file={name:'source.wav',size:30},settings={from:'wav',to:'wav',start:0,end:1,fadeIn:0,fadeOut:0}
test('export rejects truncation, processing errors and oversized duration and releases private runtime',async()=>{
 for(const options of [{duration:1801},{code:1},{outputDuration:0.4}]) {
  const {engine,runtime,files}=harness(options)
  await expect(engine.exportAudio(file,settings)).rejects.toThrow()
  expect(runtime.terminate).toHaveBeenCalled();expect(files.size).toBe(0)
 }
})
test('cancelled operation rejects promptly even if WASM promise never settles',async()=>{
 const {engine,runtime}=harness({stalled:true});const controller=new AbortController()
 const work=engine.exportAudio(file,settings,{signal:controller.signal});await new Promise(r=>setTimeout(r,10));controller.abort()
 await expect(work).rejects.toMatchObject({code:'cancelled'});expect(runtime.terminate).toHaveBeenCalled()
})
test('original source and format are validated, then successful export returns bytes',async()=>{
 const {engine}=harness()
 const result=await engine.exportAudio(file,settings)
 expect(result.name).toBe('source-folkkit.wav');expect(result.blob.size).toBe(3)
 await expect(engine.exportAudio(file,{...settings,from:'mp3'})).rejects.toThrow('type_mismatch')
})
