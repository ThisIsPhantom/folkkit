import {beforeAll,expect,test} from 'vitest'
import process from 'node:process'
import {getDocument} from 'pdfjs-dist/legacy/build/pdf.mjs'
import {exampleApplicationProject} from './applicationModel.js'
import {applyApplicationTemplate} from './applicationTemplates.js'
import {createApplicationFonts,layoutApplication} from './applicationLayout.js'
import {exportApplicationPdf} from './applicationPdf.js'
let fonts;beforeAll(async()=>{fonts=await createApplicationFonts()})
test('real text, ordered combined pages and safe link annotations',async()=>{
 const p=applyApplicationTemplate(exampleApplicationProject(),'resume','ats')
 const bytes=await exportApplicationPdf(p,['resume','letter'],fonts)
 const task=getDocument({data:bytes.slice(),useSystemFonts:true});const pdf=await task.promise
 expect(pdf.numPages).toBe(layoutApplication(p,'resume',fonts).pages.length+layoutApplication(p,'letter',fonts).pages.length)
 const page=await pdf.getPage(1);const content=await page.getTextContent();const text=content.items.map(i=>i.str).join(' ')
 expect(text).toContain('Mira Muster');expect(text.indexOf('Profil')).toBeLessThan(text.indexOf('Berufserfahrung'))
 expect((await page.getAnnotations()).some(a=>a.url==='https://example.com/')).toBe(true)
 const last=await pdf.getPage(pdf.numPages);expect((await last.getTextContent()).items.map(i=>i.str).join(' ')).toContain('Bewerbung als Software Engineer')
 await task.destroy()
})
test('blocking layout issues refuse PDF without leaking text',async()=>{
 const p=exampleApplicationProject();p.person.name='你好';await expect(exportApplicationPdf(p,['resume'],fonts)).rejects.toMatchObject({code:'unsupportedCharacters'})
})

test('local photo is embedded in exported PDF',async()=>{
 const {onePixelPngBase64}=await import('../../../tests/fixtures/coreFixtures.js')
 const p=exampleApplicationProject();p.photo={mime:'image/png',data:`data:image/png;base64,${onePixelPngBase64}`,width:1,height:1}
 const bytes=await exportApplicationPdf(p,['resume'],fonts)
 const {PDFDocument,PDFName}=await import('pdf-lib');const doc=await PDFDocument.load(bytes)
 expect(doc.getPage(0).node.Resources().lookup(PDFName.of('XObject')).keys().length).toBeGreaterThan(0)
})
test.each(['openSans','notoSans','notoSerif'])('%s uses embedded local fonts with independently readable PDF text',async family=>{
 const {readFile}=await import('node:fs/promises')
 const local=await createApplicationFonts([family],url=>readFile(process.cwd()+'/public'+url))
 const p=exampleApplicationProject();p.resume.design.font=family
 const bytes=await exportApplicationPdf(p,['resume'],local)
 const task=getDocument({data:bytes.slice(),useSystemFonts:false});const pdf=await task.promise
 const content=await (await pdf.getPage(1)).getTextContent();expect(content.items.map(i=>i.str).join(' ')).toContain('Mira Muster')
 expect(Object.values(content.styles).some(s=>s.fontFamily)).toBe(true);await task.destroy()
},15000)
