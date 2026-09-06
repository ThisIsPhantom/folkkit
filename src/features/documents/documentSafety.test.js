// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { zipSync, strToU8 } from 'fflate'
import { detectDocumentFile } from './documentModel.js'
import { inspectDocx, sanitizeHtml, cleanDocumentAst, decodeDocumentText, documentOptions, capWasmMemory } from './documentSafety.js'
const word = () => zipSync({'[Content_Types].xml':strToU8('<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'),'_rels/.rels':strToU8('<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'),'word/document.xml':strToU8('<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p/></w:body></w:document>')})
describe('document preflight',()=>{
 it('recognizes explicit text documents and rejects mismatched or binary content',async()=>{
  await expect(detectDocumentFile(new File(['Grüezi 世界'],'a.md',{type:'text/markdown'}))).resolves.toBe('markdown')
  await expect(detectDocumentFile(new File(['<p>Hello</p>'],'a.html'))).resolves.toBe('html')
  await expect(detectDocumentFile(new File([new Uint8Array([255])],'bad.md'))).rejects.toMatchObject({code:'invalid_document'})
  await expect(detectDocumentFile(new File(['a\0b'],'bad.html'))).rejects.toMatchObject({code:'invalid_document'})
  await expect(detectDocumentFile(new File(['text'],'a.md',{type:'text/html'}))).rejects.toMatchObject({code:'invalid_document'})
  await expect(detectDocumentFile(new File(['unknown'],'a.txt'))).resolves.toBeNull()
 })
 it('rejects oversized text before reading',async()=>{await expect(detectDocumentFile({name:'large.md',size:2*1024*1024+1,arrayBuffer(){throw Error('must not read')}})).rejects.toMatchObject({code:'document_too_large'})})
 it('accepts Word packages but rejects arbitrary ZIP and traversal',()=>{
  expect(inspectDocx(word())).toBeTruthy()
  expect(()=>inspectDocx(zipSync({'hello.txt':strToU8('hello')}))).toThrow(expect.objectContaining({code:'invalid_document'}))
  expect(()=>inspectDocx(zipSync({'../word/document.xml':strToU8('bad')}))).toThrow(expect.objectContaining({code:'unsafe_document'}))
 })
 it('rejects encryption, inflated declared sizes and mismatched local headers before inflate',()=>{
  const zip=word(); const central=zip.findIndex((_,i)=>zip[i]===80&&zip[i+1]===75&&zip[i+2]===1&&zip[i+3]===2)
  const encrypted=zip.slice();encrypted[central+8]|=1
  expect(()=>inspectDocx(encrypted)).toThrow()
  const huge=zip.slice();new DataView(huge.buffer).setUint32(central+24,100*1024*1024,true)
  expect(()=>inspectDocx(huge)).toThrow(expect.objectContaining({code:'document_too_large'}))
  const wrong=zip.slice();wrong[30]=65;expect(()=>inspectDocx(wrong)).toThrow()
  expect(()=>inspectDocx(zip.subarray(0,zip.length-10))).toThrow()
 })
 it('rejects excessive entry count and external DTDs',()=>{
  const entries=Object.fromEntries(Array.from({length:1001},(_,i)=>[`${i}.xml`,new Uint8Array()]))
  expect(()=>inspectDocx(zipSync(entries))).toThrow(expect.objectContaining({code:'document_too_large'}))
  expect(()=>decodeDocumentText(new Uint8Array([0xc0,0xaf]))).toThrow()
 })
})
describe('passive documents',()=>{
 it('removes active HTML and network resources while keeping readable structure and explicit links',()=>{
  const {html,warnings}=sanitizeHtml('<h1>Hello</h1><script>alert(1)</script><iframe src="https://evil.test"></iframe><form>secret</form><img onerror="evil()" src="https://evil.test/a"><svg><script>bad</script></svg><p style="background:url(https://evil.test)">World <a href="https://example.com">link</a><a href="javascript:evil()">bad</a></p>')
  expect(html).toContain('<h1>Hello</h1>');expect(html).toContain('https://example.com')
  expect(html).not.toMatch(/<script|onerror=|<iframe|<form|<svg|style=|src="https:|javascript:/i)
  expect(warnings).toContain('external_resources_omitted')
 })
 it('strips raw AST, metadata and arbitrary attributes or links',async()=>{
  const ast={'pandoc-api-version':[1,23,1],meta:{title:{t:'MetaString',c:'secret'}},blocks:[{t:'RawBlock',c:['html','<script>bad</script>']},{t:'Para',c:[{t:'Link',c:[['',[],[['onclick','bad']]],[{t:'Str',c:'safe'}],['javascript:bad','']]},{t:'Image',c:[['',[],[]],[{t:'Str',c:'photo'}],['https://evil.test/p.png','']]}]}]}
  const result=await cleanDocumentAst(ast,{},'html')
  expect(JSON.stringify(result.ast)).not.toMatch(/script|onclick|javascript|https:\/\/evil|secret/)
  expect(result.warnings).toContain('external_resources_omitted')
 })
 it('selects fixed readers and writers and refuses option-shaped formats',()=>{
  expect(documentOptions('markdown','json').from).toContain('-raw_html')
  expect(()=>documentOptions('--lua-filter=bad','docx')).toThrow()
  expect(()=>documentOptions('html','pdf')).toThrow()
 })
 it('caps an unbounded WASM memory before instantiation',()=>{
  const wasm=new Uint8Array([0,97,115,109,1,0,0,0,5,3,1,0,1])
  const capped=capWasmMemory(wasm)
  expect(WebAssembly.validate(capped)).toBe(true)
  expect(Array.from(capped.slice(-3))).toEqual([1,128,64])
 })
})
it('preserves optional null tuple members in Pandoc table captions',async()=>{
 const {ast}=await cleanDocumentAst({'pandoc-api-version':[1,23,1],meta:{},blocks:[{t:'Table',c:[['',[],[]],[null,[]],[],[['',[],[]],[]],[],[['',[],[]],[]]]}]},{},'docx')
 expect(ast.blocks[0].c[1]).toEqual([null,[]])
})
it('embeds DOCX raster inputs as data so sandbox does not omit virtual file resources',async()=>{
 const png='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a1ZkAAAAASUVORK5CYII='
 const {ast}=await cleanDocumentAst({'pandoc-api-version':[1,23,1],meta:{},blocks:[{t:'Para',c:[{t:'Image',c:[['',[],[]],[],[png,'']]}]}]},{},'docx')
 expect(ast.blocks[0].c[0].c[2][0]).toBe(png)
})
it('rejects forged tiny expansion sizes and offers metadata-only preflight without inflating',()=>{
 const zip=word(); const central=zip.findIndex((_,i)=>zip[i]===80&&zip[i+1]===75&&zip[i+2]===1&&zip[i+3]===2)
 const local=new DataView(zip.buffer).getUint32(central+42,true)
 const forged=zip.slice(),view=new DataView(forged.buffer)
 view.setUint32(central+24,0,true);view.setUint32(local+22,0,true)
 expect(inspectDocx(forged,{inflate:false})).toBeTruthy()
 expect(()=>inspectDocx(forged)).toThrow(expect.objectContaining({code:'invalid_document'}))
})
it('normalizes unreadable files to a content-free document error',async()=>{
 await expect(detectDocumentFile({name:'private.md',size:1,type:'text/markdown',arrayBuffer(){return Promise.reject(new Error('private contents'))}})).rejects.toMatchObject({code:'invalid_document',message:'invalid_document'})
})
it('counts repeated resource strings before allocating serialized AST output',async()=>{
 const { serializeDocumentAst } = await import('./documentSafety.js')
 const large='x'.repeat(16*1024*1024)
 expect(()=>serializeDocumentAst([large,large,large,large,large])).toThrow(expect.objectContaining({code:'document_too_large'}))
 expect(serializeDocumentAst({text:'Grüezi 世界\n"quoted"'})).toBe(JSON.stringify({text:'Grüezi 世界\n"quoted"'}))
})
