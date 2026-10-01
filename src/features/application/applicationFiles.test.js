import {expect,test,vi,afterEach} from 'vitest'
import {exampleApplicationProject,applicationLimits} from './applicationModel.js'
import {readApplicationProject,serializeApplicationProject,inspectApplicationPhoto,readApplicationBlob,readApplicationPhoto} from './applicationFiles.js'
afterEach(()=>{vi.restoreAllMocks();vi.unstubAllGlobals();vi.useRealTimers()})
function photoHeader(width,height){const bytes=new Uint8Array(24);bytes.set([137,80,78,71,13,10,26,10]);const v=new DataView(bytes.buffer);v.setUint32(16,width);v.setUint32(20,height);return bytes}
test('smartphone photo dimensions fit the bounded upload budget with distinct errors',()=>{
 expect(inspectApplicationPhoto(photoHeader(4032,3024),24)).toMatchObject({width:4032,height:3024})
 expect(inspectApplicationPhoto(photoHeader(6000,4000),24)).toMatchObject({width:6000,height:4000})
 expect(()=>inspectApplicationPhoto(photoHeader(6000,4001),24)).toThrowError(expect.objectContaining({code:'photoPixelLimit'}))
 expect(()=>inspectApplicationPhoto(new Uint8Array(24),24)).toThrowError(expect.objectContaining({code:'unsupportedPhoto'}))
})
test('photo decode failure releases its URL and reports a decode error',async()=>{
 vi.stubGlobal('Image',class{set src(value){if(value)queueMicrotask(()=>this.onerror?.())}})
 vi.spyOn(URL,'createObjectURL').mockReturnValue('blob:photo');const revoke=vi.spyOn(URL,'revokeObjectURL')
 await expect(readApplicationPhoto({size:24,arrayBuffer:async()=>photoHeader(100,100).buffer})).rejects.toMatchObject({code:'photoDecodeFailed'})
 expect(revoke).toHaveBeenCalledWith('blob:photo')
})
test('a stalled photo decoder times out and releases its URL',async()=>{
 vi.useFakeTimers();vi.stubGlobal('Image',class{})
 vi.spyOn(URL,'createObjectURL').mockReturnValue('blob:photo');const revoke=vi.spyOn(URL,'revokeObjectURL')
 const result=expect(readApplicationPhoto({size:24,arrayBuffer:async()=>photoHeader(100,100).buffer})).rejects.toMatchObject({code:'photoDecodeFailed'})
 await vi.advanceTimersByTimeAsync(10000);await result;expect(revoke).toHaveBeenCalledWith('blob:photo')
})
test.each([[0,100,'invalidPhoto'],[6000,4001,'photoPixelLimit']])('decoded dimensions %i x %i are independently checked',async(width,height,code)=>{
 vi.stubGlobal('Image',class{naturalWidth=width;naturalHeight=height;set src(value){if(value)queueMicrotask(()=>this.onload?.())}})
 vi.spyOn(URL,'createObjectURL').mockReturnValue('blob:photo');const revoke=vi.spyOn(URL,'revokeObjectURL')
 await expect(readApplicationPhoto({size:24,arrayBuffer:async()=>photoHeader(100,100).buffer})).rejects.toMatchObject({code})
 expect(revoke).toHaveBeenCalledWith('blob:photo')
})
test('a smartphone photo is cropped locally into a bounded 512px project image',async()=>{
 vi.stubGlobal('Image',class{naturalWidth=4032;naturalHeight=3024;set src(value){if(value)queueMicrotask(()=>this.onload?.())}})
 vi.spyOn(URL,'createObjectURL').mockReturnValue('blob:photo');const drawImage=vi.fn()
 vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue({drawImage});vi.spyOn(HTMLCanvasElement.prototype,'toDataURL').mockReturnValue('data:image/png;base64,normalised')
 expect(await readApplicationPhoto({size:24,arrayBuffer:async()=>photoHeader(4032,3024).buffer})).toEqual({mime:'image/png',data:'data:image/png;base64,normalised',width:512,height:512})
 expect(drawImage).toHaveBeenCalledWith(expect.anything(),504,0,3024,3024,0,0,512,512)
})
test('versioned local project roundtrip and file budget before read',async()=>{
 const p=exampleApplicationProject();const blob=serializeApplicationProject(p)
 const result=await readApplicationProject({size:100,text:async()=>readApplicationBlob(blob)});expect(result).toEqual(p)
 await expect(readApplicationProject({size:applicationLimits.file+1,text:()=>{throw Error('must not read')}})).rejects.toMatchObject({code:'fileLimit'})
 await expect(readApplicationProject({size:20,text:async()=>'invalid'})).rejects.toMatchObject({code:'invalidProject'})
})
test('photo headers reject huge images before decode',()=>{
 const bytes=new Uint8Array(24);bytes.set([137,80,78,71,13,10,26,10]);const v=new DataView(bytes.buffer);v.setUint32(16,5000);v.setUint32(20,5000)
 expect(()=>inspectApplicationPhoto(bytes,24)).toThrow();expect(()=>inspectApplicationPhoto(new Uint8Array(5),5)).toThrow()
 v.setUint32(16,100);v.setUint32(20,100);expect(inspectApplicationPhoto(bytes,24)).toMatchObject({kind:'png',width:100,height:100})
})

test('a photo that has dimensions but cannot decode is rejected before project replacement',async()=>{
 const p=exampleApplicationProject();const bytes=new Uint8Array(24);bytes.set([137,80,78,71,13,10,26,10]);new DataView(bytes.buffer).setUint32(16,1);new DataView(bytes.buffer).setUint32(20,1)
 p.photo={mime:'image/png',data:'data:image/png;base64,'+btoa(String.fromCharCode(...bytes)),width:1,height:1}
 const original=globalThis.Image
 globalThis.Image=class{set src(value){void value;queueMicrotask(()=>this.onerror?.())}}
 try{await expect(readApplicationProject({size:1000,text:async()=>JSON.stringify(p)})).rejects.toMatchObject({code:'invalidPhoto'})}finally{globalThis.Image=original}
})
