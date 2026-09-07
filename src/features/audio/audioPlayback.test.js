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
 let firstResolve,secondResolve;const first=new Promise(r=>{firstResolve=r}),second=new Promise(r=>{secondResolve=r});let count=0
 const media={pause:vi.fn(),play:()=>++count===1?first:second,load:vi.fn(),removeAttribute:vi.fn(),addEventListener:vi.fn(),removeEventListener:vi.fn(),currentTime:0,volume:1}
 const player=createAudioPlayback(new Blob(['mp3']),{createMedia:()=>media,createContext:()=>null,urlApi:{createObjectURL:()=> 'blob:test',revokeObjectURL:()=>{}}})
 try{const a=player.play({start:0,end:1,fadeIn:0,fadeOut:0}),b=player.play({start:0,end:1,fadeIn:0,fadeOut:0});secondResolve();await b;firstResolve();await a;expect(media.pause).not.toHaveBeenCalled()}finally{player.dispose()}
})
