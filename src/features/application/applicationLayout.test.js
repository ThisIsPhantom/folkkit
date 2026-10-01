import {beforeAll,expect,test} from 'vitest'
import {createApplicationProject,exampleApplicationProject,updateApplicationProject} from './applicationModel.js'
import {applyApplicationTemplate} from './applicationTemplates.js'
import {createApplicationFonts,layoutApplication} from './applicationLayout.js'
let fonts;beforeAll(async()=>{fonts=await createApplicationFonts()})
test('two content columns place skills beside experience and preserve overflowing text',()=>{
 const p=exampleApplicationProject();p.resume.design.layout='two';p.resume.design.columnGap=24;p.resume.design.leftColumnWidth=60
 p.resume.sections[2].visible=false
 const job=p.resume.sections[1],skills=p.resume.sections[3];job.column='left';skills.column='right'
 job.entries[0].description=Array.from({length:700},(_,i)=>`Job${i}`).join(' ')
 skills.entries[0].description=Array.from({length:350},(_,i)=>`Skill${i}`).join(' ')
 const l=layoutApplication(p,'resume',fonts);expect(l.issues).toEqual([])
 const runs=l.pages.flatMap(page=>page.runs),left=runs.filter(r=>r.sectionId===job.id),right=runs.filter(r=>r.sectionId===skills.id)
 expect(Math.min(...right.map(r=>r.x))).toBeGreaterThan(Math.max(...left.map(r=>r.x+r.width)))
 expect(right[0].y).toBe(left[0].y)
 const words=runs.flatMap(r=>r.text.split(/\s+/));for(const prefix of ['Job','Skill'])for(let i=0;i<(prefix==='Job'?700:350);i++)expect(words.filter(w=>w===prefix+i)).toHaveLength(1)
})
test('photo position, offset and enlarged size reserve header space',()=>{
 const p=exampleApplicationProject();p.photo={data:'unused'};Object.assign(p.resume.design,{showPhoto:true,photoSize:145,photoPosition:'left',photoOffsetX:9,photoOffsetY:16})
 const l=layoutApplication(p,'resume',fonts),image=l.pages[0].images[0],name=l.pages[0].runs[0]
 expect(image).toMatchObject({x:51,y:56,width:145,height:145});expect(name.x).toBeGreaterThan(image.x+image.width)
 const profile=l.pages[0].runs.find(r=>r.sectionId);expect(profile.y).toBeGreaterThan(image.y+image.height)
})
test.each(['ats','modern','editorial','swiss'])('%s layout has bounded runs and accurate page dimensions',id=>{
 const p=applyApplicationTemplate(exampleApplicationProject(), 'resume', id)
 for(const kind of ['resume','letter']){
  const l=layoutApplication(p,kind,fonts);expect(l.issues).toEqual([]);expect(l.pages[0].width).toBe(595.28)
  for(const page of l.pages)for(const r of page.runs){expect(r.x).toBeGreaterThanOrEqual(42);expect(r.x+r.width).toBeLessThanOrEqual(page.width-42+.01);expect(r.y).toBeLessThanOrEqual(page.height-40)}
 }
 p.resume.design.pageFormat='letter';expect(layoutApplication(p,'resume',fonts).pages[0].width).toBe(612)
})
test('long entries split without truncation and headings keep content',()=>{
 const p=createApplicationProject();p.person.name='Mira';p.resume.sections[0].entries[0].description=Array.from({length:2000},(_,i)=>`word${i}`).join(' ')
 const l=layoutApplication(p,'resume',fonts);expect(l.pages.length).toBeGreaterThan(1);expect(l.issues).toEqual([])
 const text=l.pages.flatMap(p=>p.runs.map(r=>r.text)).join(' ')
 for(let i=0;i<2000;i++)expect(text.split(/\s/).filter(w=>w===`word${i}`)).toHaveLength(1)
 const first=l.pages[0].runs.findIndex(r=>r.text==='Profil');expect(l.pages[0].runs[first+1].text).toContain('word0')
})
test('form elements affect only geometry and manual break starts new page',()=>{
 let p=exampleApplicationProject();p=updateApplicationProject(p,{type:'addSection',sectionType:'pageBreak'});p=updateApplicationProject(p,{type:'addSection',sectionType:'custom',title:'Extra'})
 const s=p.resume.sections.at(-1);p=updateApplicationProject(p,{type:'entry',sectionId:s.id,entryId:s.entries[0].id,field:'description',value:'Final page'})
 const l=layoutApplication(p,'resume',fonts);expect(l.pages.at(-1).runs.some(r=>r.text==='Final page')).toBe(true);expect(l.pages).toHaveLength(2)
})
test('unbroken words wrap, unicode is explicit and page budget is enforced',()=>{
 const p=createApplicationProject();p.resume.sections[0].entries[0].description='https://example.com/'+ 'long'.repeat(200)
 let l=layoutApplication(p,'resume',fonts);expect(l.issues).toEqual([]);expect(l.pages.flatMap(p=>p.runs).filter(r=>r.entryId).map(r=>r.text).join('')).toBe(p.resume.sections[0].entries[0].description)
 p.resume.sections[0].entries[0].description='你好';l=layoutApplication(p,'resume',fonts);expect(l.issues.some(i=>i.code==='unsupportedCharacters'&&i.blocking)).toBe(true)
 p.resume.sections[0].entries[0].description='word\n'.repeat(2000);l=layoutApplication(p,'resume',fonts);expect(l.issues.some(i=>i.code==='pageLimit')).toBe(true);expect(l.pages.length).toBeLessThanOrEqual(20)
})

test('section headings never become orphaned by entry keep-together',()=>{
 const p=createApplicationProject();p.person.name='Mira';p.resume.design.sectionGap=0;p.resume.design.entryGap=0
 p.resume.sections[0].entries[0].description='line\n'.repeat(40)
 p.resume.sections[1].entries[0].title='NEXT ENTRY'
 p.resume.sections[1].entries[0].description='Description\n'.repeat(12)
 const l=layoutApplication(p,'resume',fonts)
 const page=l.pages.find(page=>page.runs.some(r=>r.text==='Berufserfahrung'))
 expect(page.runs.some(r=>r.text==='NEXT ENTRY')).toBe(true)
})

test('overflowing side columns finish before the following section starts',()=>{
 const p=createApplicationProject();p.person.name='Mira';p.resume.design.dateWidth=60
 p.resume.sections[1].entries[0].title='FIRST JOB';p.resume.sections[1].entries[0].location=Array.from({length:70},(_,i)=>`City${i}`).join('\n');p.resume.sections[1].entries[0].description='Main description'
 p.resume.sections[2].entries[0].title='SECOND SECTION'
 const l=layoutApplication(p,'resume',fonts);const lastSide=l.pages.flatMap((page,index)=>page.runs.filter(r=>r.text==='City69').map(r=>({...r,page:index})))[0]
 const next=l.pages.flatMap((page,index)=>page.runs.filter(r=>r.text==='Ausbildung').map(r=>({...r,page:index})))[0]
 expect(next.page>lastSide.page||next.page===lastSide.page&&next.y>lastSide.y).toBe(true)
})

test('resume paragraph spacing changes description geometry without content loss',()=>{
 const p=createApplicationProject();p.resume.sections[0].entries[0].description='First paragraph\nSecond paragraph'
 p.resume.design.paragraphGap=7;const first=layoutApplication(p,'resume',fonts)
 p.resume.design.paragraphGap=60;const second=layoutApplication(p,'resume',fonts)
 const find=l=>l.pages.flatMap(p=>p.runs).find(r=>r.text==='Second paragraph').y
 expect(find(second)-find(first)).toBe(53)
 expect(second.pages.flatMap(p=>p.runs).filter(r=>r.entryId).map(r=>r.text)).toEqual(['First paragraph','Second paragraph'])
})
