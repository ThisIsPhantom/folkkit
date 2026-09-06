// @vitest-environment node
import { beforeEach, afterEach, it, expect, vi } from 'vitest'
import { convertDocumentFile } from './documentEngine.js'
import { configureDocumentWasi, assertRuntimeResponse } from './documentRuntime.js'
let workers
class TestWorker {
 constructor(){this.terminated=false;workers.push(this)}
 postMessage(data){this.input=data}
 terminate(){this.terminated=true}
 reply(data){this.onmessage?.({data})}
}
beforeEach(()=>{workers=[];vi.stubGlobal('Worker',TestWorker)})
afterEach(()=>{vi.unstubAllGlobals();vi.useRealTimers()})
it('returns a verified result then terminates and ignores late replies',async()=>{
 const pending=convertDocumentFile(new File(['# Hallo'],'a.md'),'markdown','html')
 expect(workers).toHaveLength(1)
 workers[0].reply({result:[{name:'a.html',blob:new Blob(['<h1>Hallo</h1>'],{type:'text/html'}),warnings:['layout_changed']}]})
 const result=await pending;expect(result[0].name).toBe('a.html');expect(workers[0].terminated).toBe(true)
 workers[0].reply({error:'invalid_document'});expect(result[0].warnings).toEqual(['layout_changed'])
})
it('aborts before startup and terminates active work',async()=>{
 const controller=new AbortController();controller.abort()
 await expect(convertDocumentFile(new File(['a'],'a.md'),'markdown','html',{signal:controller.signal})).rejects.toMatchObject({code:'cancelled'})
 expect(workers).toHaveLength(0)
 const active=new AbortController(),pending=convertDocumentFile(new File(['a'],'a.md'),'markdown','docx',{signal:active.signal})
 active.abort();await expect(pending).rejects.toMatchObject({code:'cancelled'});expect(workers[0].terminated).toBe(true)
})
it('terminates stuck workers after sixty seconds',async()=>{
 vi.useFakeTimers();const pending=convertDocumentFile(new File(['a'],'a.md'),'markdown','html');const check=expect(pending).rejects.toMatchObject({code:'document_timeout'})
 await vi.advanceTimersByTimeAsync(60_000);await check;expect(workers[0].terminated).toBe(true)
})
it('redacts engine diagnostics and rejects unsupported targets without spawning',async()=>{
 await expect(convertDocumentFile(new File(['a'],'a.md'),'markdown','pdf')).rejects.toMatchObject({code:'unsupported_type'});expect(workers).toHaveLength(0)
 const pending=convertDocumentFile(new File(['a'],'a.md'),'markdown','html');workers[0].reply({error:'private document contents'})
 await expect(pending).rejects.toMatchObject({code:'conversion_failed',message:'conversion_failed'})
})
it('prevents oversized WASI allocations before shim allocation',()=>{
 const allocation=vi.fn(),wasi={fds:[{file:{data:new Uint8Array(1)},file_pos:0n}],inst:{exports:{memory:{buffer:new ArrayBuffer(16)}}},wasiImport:{fd_allocate:allocation,fd_filestat_set_size:allocation,fd_write:allocation,fd_pwrite:allocation,path_open:allocation,path_create_directory:allocation}}
 configureDocumentWasi(wasi)
 expect(()=>wasi.wasiImport.fd_allocate(0,0n,100n*1024n*1024n)).toThrow(expect.objectContaining({code:'document_too_large'}));expect(allocation).not.toHaveBeenCalled()
 new DataView(wasi.inst.exports.memory.buffer).setUint32(4,100*1024*1024,true)
 expect(()=>wasi.wasiImport.fd_write(0,0,1,8)).toThrow(expect.objectContaining({code:'document_too_large'}));expect(allocation).not.toHaveBeenCalled()
})
it('bounds aggregate WASI file allocations even when each file is individually small',()=>{
 const allocate=vi.fn(),wasi={fds:[0,1,2,3].map(()=>({file:{data:new Uint8Array()},file_pos:0n})),inst:{exports:{memory:{buffer:new ArrayBuffer(16)}}},wasiImport:{fd_allocate:allocate,fd_filestat_set_size:allocate,fd_write:allocate,fd_pwrite:allocate,path_open:allocate,path_create_directory:allocate}}
 configureDocumentWasi(wasi)
 wasi.wasiImport.fd_allocate(0,0n,64n*1024n*1024n);wasi.wasiImport.fd_allocate(1,0n,64n*1024n*1024n)
 expect(()=>wasi.wasiImport.fd_allocate(2,0n,64n*1024n*1024n)).toThrow(expect.objectContaining({code:'document_too_large'}))
 expect(allocate).toHaveBeenCalledTimes(2)
})
it('reports unavailable runtime when an uncached worker cannot start offline',async()=>{
 const pending=convertDocumentFile(new File(['a'],'a.md'),'markdown','html')
 workers[0].onerror()
 await expect(pending).rejects.toMatchObject({code:'document_runtime_unavailable'})
 expect(workers[0].terminated).toBe(true)
})

it('accepts compressed wire lengths while rejecting wrong uncompressed runtime headers',()=>{
 for (const encoding of ['gzip','br']) expect(()=>assertRuntimeResponse(new Response('decoded body',{headers:{'Content-Encoding':encoding,'Content-Length':'12345'}}))).not.toThrow()
 expect(()=>assertRuntimeResponse(new Response('bad',{headers:{'Content-Length':'12345'}}))).toThrow(expect.objectContaining({code:'document_runtime_unavailable'}))
 expect(()=>assertRuntimeResponse(new Response('missing',{status:404}))).toThrow(expect.objectContaining({code:'document_runtime_unavailable'}))
 expect(()=>assertRuntimeResponse(new Response('body',{headers:{'Content-Length':'58580800'}}))).not.toThrow()
})
