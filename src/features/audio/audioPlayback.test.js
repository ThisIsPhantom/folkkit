import {expect,test,vi} from 'vitest'
import {createAudioPlayback,selectionGain} from './audioPlayback.js'
test('gain matches both fades and returns silence outside the selection',()=>{
 const s={start:2,end:5,fadeIn:1,fadeOut:1}
 expect(selectionGain(1,s)).toBe(0);expect(selectionGain(2.5,s)).toBe(0.5);expect(selectionGain(3.5,s)).toBe(1);expect(selectionGain(4.75,s)).toBe(0.25)
})
test('dispose during pending play pauses late completion and releases audio graph and URL',async()=>{
 let resolve;const pending=new Promise(r=>{resolve=r}),media={pause:vi.fn(),play:()=>pending,load:vi.fn(),removeAttribute:vi.fn(),addEventListener:vi.fn(),removeEventListener:vi.fn(),currentTime:0}
 const context={resume:async()=>{},close:vi.fn(async()=>{}),createMediaElementSource:()=>({connect:vi.fn(),disconnect:vi.fn()}),createGain:()=>({gain:{value:1},connect:vi.fn(),disconnect:vi.fn()}),destination:{}}
 const revoke=vi.fn(),player=createAudioPlayback(new Blob(['mp3']),{createMedia:()=>media,createContext:()=>context,urlApi:{createObjectURL:()=> 'blob:test',revokeObjectURL:revoke}})
 const playing=player.play({start:0,end:1,fadeIn:0,fadeOut:0});await Promise.resolve();player.dispose();resolve();await playing
 expect(media.pause.mock.calls.length).toBeGreaterThan(0);expect(context.close).toHaveBeenCalledOnce();expect(revoke).toHaveBeenCalledWith('blob:test')
})

test('browsers without Web Audio apply fades through media volume and stop at the selection end',async()=>{
 vi.useFakeTimers()
 const media={pause:vi.fn(),play:async()=>{},load:vi.fn(),removeAttribute:vi.fn(),addEventListener:vi.fn(),removeEventListener:vi.fn(),currentTime:0,volume:1}
 const player=createAudioPlayback(new Blob(['mp3']),{createMedia:()=>media,createContext:()=>null,urlApi:{createObjectURL:()=> 'blob:test',revokeObjectURL:()=>{}}})
 try{await player.play({start:0,end:1,fadeIn:.5,fadeOut:.5});media.currentTime=.25;vi.advanceTimersByTime(20);expect(media.volume).toBe(.5);media.currentTime=1;vi.advanceTimersByTime(20);expect(media.volume).toBe(0);expect(media.pause).toHaveBeenCalled()}finally{player.dispose();vi.useRealTimers()}
})

test('late completion of an older play request cannot pause a newer selection',async()=>{
 const first=deferredStart(),second=deferredStart(),media=[]
 const createMedia=()=>{const pending=media.length?second:first;const element={pause:vi.fn(),play:()=>pending.promise,load:vi.fn(),removeAttribute:vi.fn(),addEventListener:vi.fn(),removeEventListener:vi.fn(),currentTime:0,volume:1};media.push(element);return element}
 const player=createAudioPlayback(new Blob(['mp3']),{createMedia,createContext:()=>null,urlApi:{createObjectURL:()=> 'blob:test',revokeObjectURL:()=>{}}})
 try {
  const a=player.play({start:0,end:1,fadeIn:0,fadeOut:0});await Promise.resolve()
  const b=player.play({start:0,end:1,fadeIn:0,fadeOut:0});second.resolve();await b
  const pauses=media[1].pause.mock.calls.length;first.resolve();await a;await Promise.resolve()
  expect(media[1].pause).toHaveBeenCalledTimes(pauses)
 }finally{player.dispose()}
})

function deferredStart() {
 let resolve
 const promise=new Promise(done=>{resolve=done})
 return {promise,resolve}
}
function startupFixture({resume=async()=>{},nativePlay=async()=>{}}={}) {
 const media=[]
 const makeMedia=()=>{const item={pause:vi.fn(),play:vi.fn(nativePlay),load:vi.fn(),removeAttribute:vi.fn(),addEventListener:vi.fn(),removeEventListener:vi.fn(),currentTime:0,volume:1};media.push(item);return item}
 const source={connect:vi.fn(),disconnect:vi.fn()},gain={gain:{value:1},connect:vi.fn(),disconnect:vi.fn()}
 const context={resume:vi.fn(resume),close:vi.fn(async()=>{}),createMediaElementSource:vi.fn(()=>source),createGain:vi.fn(()=>gain),destination:{}}
 const onState=vi.fn(),urlApi={createObjectURL:()=> 'blob:startup',revokeObjectURL:vi.fn()}
 const player=createAudioPlayback(new Blob(['mp3']),{createMedia:makeMedia,createContext:()=>context,urlApi,onState})
 return {player,media,context,source,gain,onState,urlApi}
}
const selection={start:2,end:5,fadeIn:1,fadeOut:1}

test('a never-resolving Web Audio start falls back after two seconds without binding the media element',async()=>{
 vi.useFakeTimers();const f=startupFixture({resume:()=>new Promise(()=>{})})
 try {
  const playing=f.player.play(selection)
  await vi.advanceTimersByTimeAsync(1999);expect(f.media[0].play).not.toHaveBeenCalled();expect(f.context.createMediaElementSource).not.toHaveBeenCalled()
  await vi.advanceTimersByTimeAsync(1);await playing
  expect(f.context.close).toHaveBeenCalledOnce();expect(f.context.createMediaElementSource).not.toHaveBeenCalled();expect(f.media.at(-1).play).toHaveBeenCalledOnce();expect(f.media.at(-1).currentTime).toBe(2)
  f.media.at(-1).currentTime=2.5;await vi.advanceTimersByTimeAsync(20);expect(f.media.at(-1).volume).toBe(.5)
  f.media.at(-1).currentTime=5;await vi.advanceTimersByTimeAsync(20);expect(f.media.at(-1).volume).toBe(0);expect(f.onState).toHaveBeenLastCalledWith(false)
 } finally {f.player.dispose();vi.useRealTimers()}
})

test('late resume after fallback cannot create or reconnect Web Audio nodes',async()=>{
 vi.useFakeTimers();const resumed=deferredStart(),f=startupFixture({resume:()=>resumed.promise})
 try {
  const playing=f.player.play(selection);await vi.advanceTimersByTimeAsync(2000);await playing
  const native=f.media.at(-1),pauses=native.pause.mock.calls.length
  resumed.resolve();await vi.advanceTimersByTimeAsync(20)
  expect(f.context.createMediaElementSource).not.toHaveBeenCalled();expect(native.pause).toHaveBeenCalledTimes(pauses);expect(f.onState).toHaveBeenLastCalledWith(true)
 } finally {f.player.dispose();vi.useRealTimers()}
})

test('cancelling suspended startup settles promptly and cannot start fallback or late playback',async()=>{
 vi.useFakeTimers();const resumed=deferredStart(),f=startupFixture({resume:()=>resumed.promise})
 try {
  let settled=false;const playing=f.player.play(selection).then(()=>{settled=true})
  f.player.pause();await vi.advanceTimersByTimeAsync(0);expect(settled).toBe(true)
  resumed.resolve();await vi.advanceTimersByTimeAsync(2500);await playing
  expect(f.media.every(item=>item.play.mock.calls.length===0)).toBe(true);expect(f.context.createMediaElementSource).not.toHaveBeenCalled();expect(f.context.close).toHaveBeenCalledOnce()
 } finally {f.player.dispose();vi.useRealTimers()}
})

test('native startup also times out and late completion cannot affect a retry',async()=>{
 vi.useFakeTimers();const pending=deferredStart();let calls=0
 const f=startupFixture({nativePlay:()=>++calls===1?pending.promise:Promise.resolve()})
 try {
  const first=f.player.play(selection);const rejected=expect(first).rejects.toMatchObject({code:'playback_unavailable'})
  await vi.advanceTimersByTimeAsync(2000);await rejected
  await f.player.play(selection);const replacement=f.media.at(-1),pauses=replacement.pause.mock.calls.length
  expect(f.media.length).toBe(2);pending.resolve();await vi.advanceTimersByTimeAsync(20)
  expect(replacement.pause).toHaveBeenCalledTimes(pauses);expect(f.onState).toHaveBeenLastCalledWith(true)
 } finally {f.player.dispose();vi.useRealTimers()}
})

test('a resumed context is connected only after readiness and uses gain fades normally',async()=>{
 const resumed=deferredStart(),f=startupFixture({resume:()=>resumed.promise})
 try {
  const playing=f.player.play(selection);expect(f.context.createMediaElementSource).not.toHaveBeenCalled()
  resumed.resolve();await playing
  expect(f.context.createMediaElementSource).toHaveBeenCalledOnce();expect(f.media[0].volume).toBe(1);expect(f.gain.gain.value).toBe(0);expect(f.onState).toHaveBeenLastCalledWith(true)
 } finally {f.player.dispose()}
})

test('fallback disposal releases the element and URL once without waiting for resume',async()=>{
 vi.useFakeTimers();const f=startupFixture({resume:()=>new Promise(()=>{})})
 try {
  const playing=f.player.play(selection);await vi.advanceTimersByTimeAsync(2000);await playing
  f.player.dispose();f.player.dispose()
  expect(f.context.close).toHaveBeenCalledOnce();expect(f.media.at(-1).removeAttribute).toHaveBeenCalledWith('src');expect(f.urlApi.revokeObjectURL).toHaveBeenCalledOnce()
  const stateCalls=f.onState.mock.calls.length;await vi.advanceTimersByTimeAsync(2500);expect(f.onState).toHaveBeenCalledTimes(stateCalls)
 } finally {f.player.dispose();vi.useRealTimers()}
})


test('fallback after a previously working graph replaces the permanently bound element',async()=>{
 vi.useFakeTimers();let attempts=0
 const f=startupFixture({resume:()=>++attempts===1?Promise.resolve():new Promise(()=>{})})
 try {
  await f.player.play(selection);f.media[0].currentTime=3;f.player.pause()
  const retry=f.player.play(selection);await vi.advanceTimersByTimeAsync(2000);await retry
  expect(f.media).toHaveLength(2);expect(f.media[0].removeAttribute).toHaveBeenCalledWith('src');expect(f.media[1].currentTime).toBe(3);expect(f.media[1].volume).toBe(1)
  expect(f.context.createMediaElementSource).toHaveBeenCalledOnce();expect(f.source.disconnect).toHaveBeenCalledOnce();expect(f.context.close).toHaveBeenCalledOnce()
 }finally{f.player.dispose();vi.useRealTimers()}
})

test('a rejected context start falls back immediately to working native playback',async()=>{
 const f=startupFixture({resume:async()=>{throw new Error('device unavailable')}})
 try {
  await f.player.play(selection)
  expect(f.context.createMediaElementSource).not.toHaveBeenCalled();expect(f.context.close).toHaveBeenCalledOnce();expect(f.media[0].play).toHaveBeenCalledOnce();expect(f.onState).toHaveBeenLastCalledWith(true)
 }finally{f.player.dispose()}
})


function cueFixture() {
 const track={mode:'disabled',cues:[],addCue(cue){this.cues.push(cue)},removeCue(cue){this.cues=this.cues.filter(item=>item!==cue)}}
 const media=new EventTarget()
 Object.assign(media,{currentTime:0,paused:true,volume:1,ended:false,play:async()=>{media.paused=false},pause:()=>{media.paused=true},load:()=>{},removeAttribute:()=>{},addTextTrack:vi.fn(()=>track)})
 const onState=vi.fn(),player=createAudioPlayback(new Blob(['mp3']),{createMedia:()=>media,createContext:()=>null,urlApi:{createObjectURL:()=> 'blob:cue',revokeObjectURL:()=>{}},onState})
 return {track,media,onState,player}
}

test('a native selection cue stops the lifecycle without any progress timer tick',async()=>{
 vi.useFakeTimers();vi.stubGlobal('VTTCue',class {constructor(start,end,text){this.startTime=start;this.endTime=end;this.text=text;this.pauseOnExit=false}})
 const f=cueFixture()
 try {
  await f.player.play({start:.2,end:.8,fadeIn:0,fadeOut:0})
  expect(f.media.addTextTrack).toHaveBeenCalledWith('metadata');expect(f.track.mode).toBe('hidden');expect(f.track.cues).toHaveLength(1)
  expect(f.track.cues[0]).toMatchObject({startTime:.2,endTime:.8,pauseOnExit:true})
  f.media.currentTime=.8;f.media.paused=true;f.media.dispatchEvent(new Event('pause'))
  expect(f.onState).toHaveBeenLastCalledWith(false);expect(f.track.cues).toHaveLength(0)
  expect(vi.getTimerCount()).toBe(0)
 }finally{f.player.dispose();vi.unstubAllGlobals();vi.useRealTimers()}
})

test('cue retries reuse one track and discard old cues and native pause listeners',async()=>{
 vi.useFakeTimers();vi.stubGlobal('VTTCue',class {constructor(start,end,text){this.startTime=start;this.endTime=end;this.text=text;this.pauseOnExit=false}})
 const f=cueFixture()
 try {
  await f.player.play({start:.2,end:.8,fadeIn:0,fadeOut:0});const oldCue=f.track.cues[0]
  f.player.pause();expect(f.track.cues).toHaveLength(0)
  await f.player.play({start:.1,end:.6,fadeIn:0,fadeOut:0})
  expect(f.media.addTextTrack).toHaveBeenCalledOnce();expect(f.track.cues).toHaveLength(1);expect(f.track.cues[0]).not.toBe(oldCue);expect(f.track.cues[0].endTime).toBe(.6)
  // An old queued pause event cannot stop a newer, actively playing attempt.
  f.media.dispatchEvent(new Event('pause'));expect(f.onState).toHaveBeenLastCalledWith(true)
  f.player.dispose();expect(f.track.cues).toHaveLength(0)
  const calls=f.onState.mock.calls.length;f.media.paused=true;f.media.dispatchEvent(new Event('pause'));expect(f.onState).toHaveBeenCalledTimes(calls)
 }finally{f.player.dispose();vi.unstubAllGlobals();vi.useRealTimers()}
})


test('cancelling pending native play removes its armed cue before a late result arrives',async()=>{
 vi.useFakeTimers();vi.stubGlobal('VTTCue',class {constructor(start,end,text){this.startTime=start;this.endTime=end;this.text=text;this.pauseOnExit=false}})
 const f=cueFixture(),pending=deferredStart()
 f.media.play=()=>{f.media.paused=false;return pending.promise}
 try {
  const playing=f.player.play({start:.2,end:.8,fadeIn:0,fadeOut:0});await Promise.resolve()
  expect(f.track.cues).toHaveLength(1)
  f.player.pause();await playing;expect(f.track.cues).toHaveLength(0)
  const calls=f.onState.mock.calls.length;pending.resolve();await Promise.resolve();f.media.dispatchEvent(new Event('pause'))
  expect(f.onState).toHaveBeenCalledTimes(calls);expect(f.media.paused).toBe(true)
 }finally{f.player.dispose();vi.unstubAllGlobals();vi.useRealTimers()}
})


test('the native boundary is armed before seeking into the selection',async()=>{
 vi.useFakeTimers();vi.stubGlobal('VTTCue',class {constructor(start,end,text){this.startTime=start;this.endTime=end;this.text=text;this.pauseOnExit=false}})
 const f=cueFixture();let time=0,unarmedSeeks=0
 Object.defineProperty(f.media,'currentTime',{get:()=>time,set:value=>{if(value>0&&f.track.cues.length===0)unarmedSeeks++;time=value}})
 try {
  await f.player.play({start:.2,end:.8,fadeIn:0,fadeOut:0})
  expect(unarmedSeeks).toBe(0);expect(f.media.currentTime).toBe(.2)
 }finally{f.player.dispose();vi.unstubAllGlobals();vi.useRealTimers()}
})


function decoderErrorFixture() {
 const media=[],errorCallbacks=[],onError=vi.fn(),onState=vi.fn()
 const createMedia=()=>{
  const element=new EventTarget(),track={mode:'disabled',cues:[],addCue(cue){this.cues.push(cue)},removeCue(cue){this.cues=this.cues.filter(item=>item!==cue)}}
  const add=element.addEventListener.bind(element)
  element.addEventListener=(type,callback,...args)=>{if(type==='error')errorCallbacks.push(callback);add(type,callback,...args)}
  Object.assign(element,{currentTime:0,paused:true,ended:false,error:null,volume:1,track,play:async()=>{element.paused=false},pause:()=>{element.paused=true},load:vi.fn(),removeAttribute:vi.fn(),addTextTrack:()=>track})
  media.push(element);return element
 }
 const player=createAudioPlayback(new Blob(['mp3']),{createMedia,createContext:()=>null,urlApi:{createObjectURL:()=> 'blob:decoder',revokeObjectURL:()=>{}},onError,onState})
 return {player,media,errorCallbacks,onError,onState}
}

test('decode errors after successful play stop once and release the defective channel and cue',async()=>{
 vi.useFakeTimers();vi.stubGlobal('VTTCue',class {constructor(start,end){this.startTime=start;this.endTime=end;this.pauseOnExit=false}})
 const f=decoderErrorFixture()
 try {
  await f.player.play({start:.2,end:.8,fadeIn:0,fadeOut:0});const media=f.media[0]
  expect(f.onState).toHaveBeenLastCalledWith(true);expect(media.track.cues).toHaveLength(1)
  media.error={code:3};media.currentTime=.6;media.dispatchEvent(new Event('error'));media.dispatchEvent(new Event('error'))
  expect(f.onError).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({code:'playback_unavailable'}));expect(f.onState).toHaveBeenLastCalledWith(false)
  expect(media.paused).toBe(true);expect(media.track.cues).toHaveLength(0);expect(media.removeAttribute).toHaveBeenCalledWith('src');expect(vi.getTimerCount()).toBe(0)
 }finally{f.player.dispose();vi.unstubAllGlobals();vi.useRealTimers()}
})

test.each(['pause','ended'])('an existing decoder error is reported before a native %s removes listeners',async event=>{
 const f=decoderErrorFixture()
 try {
  await f.player.play({start:.2,end:.8,fadeIn:0,fadeOut:0});const media=f.media[0]
  media.error={code:3};media.ended=true;media.paused=true;media.dispatchEvent(new Event(event));media.dispatchEvent(new Event('error'))
  expect(f.onError).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({code:'playback_unavailable'}))
 }finally{f.player.dispose()}
})

test('old decode callbacks cannot affect a healthy retry',async()=>{
 const f=decoderErrorFixture()
 try {
  const selection={start:.2,end:.8,fadeIn:0,fadeOut:0}
  await f.player.play(selection);const oldError=f.errorCallbacks[0],old=f.media[0]
  old.error={code:3};old.currentTime=.6;old.dispatchEvent(new Event('error'))
  await f.player.play(selection);expect(f.media).toHaveLength(2);expect(f.media[1].currentTime).toBe(.2)
  oldError();old.dispatchEvent(new Event('error'))
  expect(f.onError).toHaveBeenCalledOnce();expect(f.onState).toHaveBeenLastCalledWith(true);expect(f.media[1].paused).toBe(false)
 }finally{f.player.dispose()}
})


test('start and progress checks do not overlook an already assigned MediaError',async()=>{
 vi.useFakeTimers()
 const starting=decoderErrorFixture(),playing=decoderErrorFixture()
 try {
  const first=starting.player.play({start:.2,end:.8,fadeIn:0,fadeOut:0})
  starting.media[0].error={code:3};await first
  expect(starting.onError).toHaveBeenCalledOnce();expect(starting.onState).toHaveBeenLastCalledWith(false)
  await playing.player.play({start:.2,end:.8,fadeIn:0,fadeOut:0});playing.media[0].error={code:3}
  await vi.advanceTimersByTimeAsync(15)
  expect(playing.onError).toHaveBeenCalledOnce();expect(playing.onState).toHaveBeenLastCalledWith(false)
 }finally{starting.player.dispose();playing.player.dispose();vi.useRealTimers()}
})
