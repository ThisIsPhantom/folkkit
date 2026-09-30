import {expect,test} from 'vitest'
import {exampleApplicationProject,applicationLimits} from './applicationModel.js'
import {readApplicationProject,serializeApplicationProject,inspectApplicationPhoto,readApplicationBlob} from './applicationFiles.js'
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
