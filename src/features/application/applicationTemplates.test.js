import {expect,test} from 'vitest'
import {readFile} from 'node:fs/promises'
import {createHash} from 'node:crypto'
import process from 'node:process'
import {getDocument} from 'pdfjs-dist/legacy/build/pdf.mjs'
import {applicationDesign,applicationTemplates,applyApplicationTemplate} from './applicationTemplates.js'
import {exampleApplicationProject,validateApplicationProject} from './applicationModel.js'
import {createApplicationFonts,layoutApplication} from './applicationLayout.js'
import {exportApplicationPdf} from './applicationPdf.js'

test('original templates preserve content and individual layout overrides',()=>{
 const p=exampleApplicationProject();p.resume.sections[0].column='right';p.resume.sections[0].newBand=true;p.resume.sections[0].style={fontSize:13}
 for(const template of applicationTemplates){
  const next=applyApplicationTemplate(p,'resume',template.id)
  expect(next.resume.sections).toBe(p.resume.sections);expect(next.person).toBe(p.person);expect(next.letter).toBe(p.letter)
  expect(validateApplicationProject(next).ok).toBe(true)
 }
 expect(applicationDesign('folio').margins.left).toBeGreaterThan(applicationDesign('compact').margins.left)
 expect(applicationDesign('compact').layout).toBe('two')
 const first=applicationDesign('folio');first.margins.left=90;expect(applicationDesign('folio').margins.left).toBe(52)
})

test.each(['folio','compact'])('%s has measured local preview text and independently readable PDF output',async id=>{
 const p=applyApplicationTemplate(exampleApplicationProject(),'resume',id)
 const fonts=await createApplicationFonts([p.resume.design.font],url=>readFile(process.cwd()+'/public'+url))
 const layout=layoutApplication(p,'resume',fonts)
 expect(layout.issues).toEqual([])
 expect(layout.pages.flatMap(page=>page.runs).filter(run=>run.text.trim()).every(run=>run.width>0)).toBe(true)
 const bytes=await exportApplicationPdf(p,['resume'],fonts)
 const task=getDocument({data:bytes.slice(),useSystemFonts:false})
 try{const pdf=await task.promise;const content=await(await pdf.getPage(1)).getTextContent();expect(content.items.map(item=>item.str).join(' ')).toContain('Mira Muster')}finally{await task.destroy()}
},15000)

test('Adobe font binaries match immutable upstream provenance',async()=>{
 const sources=JSON.parse(await readFile('scripts/application-font-sources.json','utf8'))
 expect(sources).toHaveLength(6)
 for(const source of sources){
  expect(source.url).toMatch(/^https:\/\/raw\.githubusercontent\.com\/adobe-fonts\/source-(sans|serif)\/[a-f0-9]{40}\/TTF\//)
  expect(createHash('sha256').update(await readFile(source.path)).digest('hex')).toBe(source.sha256)
 }
})
