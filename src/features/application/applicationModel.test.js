import { expect, test } from 'vitest'
import { createApplicationProject, validateApplicationProject, updateApplicationProject } from './applicationModel.js'
import { applyApplicationTemplate, applicationTemplates } from './applicationTemplates.js'

test('four designs preserve every content field and stable ID', () => {
 const project = createApplicationProject('de', '2026-09-30')
 project.person.name = 'Mira Muster'; project.resume.sections[0].entries[0].description = 'Mein Profil'
 expect(applicationTemplates).toHaveLength(4)
 for (const {id} of applicationTemplates) {
  const result = applyApplicationTemplate(project, 'resume', id)
  expect(result.person).toEqual(project.person)
  expect(result.resume.sections).toEqual(project.resume.sections)
  expect(result.letter).toEqual(project.letter)
  expect(validateApplicationProject(result).ok).toBe(true)
 }
})
test('duplicate, visibility and ordering preserve content', () => {
 let p = createApplicationProject('en', '2026-09-30'); const s = p.resume.sections[1]
 p = updateApplicationProject(p,{type:'duplicateEntry',sectionId:s.id,entryId:s.entries[0].id})
 expect(p.resume.sections[1].entries).toHaveLength(2)
 expect(p.resume.sections[1].entries[0].id).not.toBe(p.resume.sections[1].entries[1].id)
 p = updateApplicationProject(p,{type:'entry',sectionId:s.id,entryId:s.entries[0].id,field:'visible',value:false})
 expect(p.resume.sections[1].entries[0].visible).toBe(false)
 const first = p.resume.sections[1].entries[0]
 p = updateApplicationProject(p,{type:'moveEntry',sectionId:s.id,entryId:first.id,direction:1})
 expect(p.resume.sections[1].entries[1]).toEqual(first)
 p = updateApplicationProject(p,{type:'addSection',sectionType:'spacer'})
 expect(p.resume.sections.at(-1).entries).toEqual([])
})
test('strict import rejects oversized content, duplicate IDs, invalid geometry and remote photo', () => {
 const p = createApplicationProject('de', '2026-09-30')
 for (const mutate of [q=>q.version=2,q=>q.person.name='x'.repeat(100001),q=>q.resume.design.margins.top=NaN,q=>q.resume.sections[1].id=q.resume.sections[0].id,q=>q.photo={mime:'image/png',data:'https://evil.test/image',width:1,height:1},q=>q.resume.sections[0].entries=Array.from({length:101},(_,i)=>({...q.resume.sections[0].entries[0],id:`e${i}`}))]) {
  const q = structuredClone(p); mutate(q); expect(validateApplicationProject(q).ok).toBe(false)
 }
 p.evil='ignore'; expect(validateApplicationProject(p).project).not.toHaveProperty('evil')
})

test('imported photo cannot lie about decoded dimensions',()=>{
 const p=createApplicationProject();const bytes=new Uint8Array(24);bytes.set([137,80,78,71,13,10,26,10]);new DataView(bytes.buffer).setUint32(16,5000);new DataView(bytes.buffer).setUint32(20,5000)
 p.photo={mime:'image/png',data:'data:image/png;base64,'+btoa(String.fromCharCode(...bytes)),width:1,height:1}
 expect(validateApplicationProject(p).ok).toBe(false)
})

test('duplicate section preserves content and form with fresh section and entry IDs',()=>{
 const p=createApplicationProject();const s=p.resume.sections[0];s.style={before:20};s.entries[0].description='My content'
 const q=updateApplicationProject(p,{type:'duplicateSection',sectionId:s.id})
 expect(q.resume.sections).toHaveLength(p.resume.sections.length+1)
 const copy=q.resume.sections[1];expect(copy.id).not.toBe(s.id);expect(copy.entries[0].id).not.toBe(s.entries[0].id);expect(copy.style).toEqual(s.style);expect(copy.entries[0].description).toBe('My content')
})
test('old projects receive layout defaults and new photo/layout options roundtrip',()=>{
 const p=createApplicationProject();for(const kind of ['resume','letter'])for(const key of ['layout','columnGap','leftColumnWidth','photoPosition','photoOffsetX','photoOffsetY'])delete p[kind].design[key]
 const old=validateApplicationProject(p);expect(old.ok).toBe(true);expect(old.project.resume.design.layout).toBe('single')
 let next=updateApplicationProject(old.project,{type:'design',field:'layout',value:'two'})
 next=updateApplicationProject(next,{type:'design',field:'photoSize',value:160});expect(next.resume.design.photoSize).toBe(160)
 next.resume.sections[0].column='right';expect(validateApplicationProject(next).project.resume.sections[0].column).toBe('right')
 next.resume.design.photoOffsetY=-1;expect(validateApplicationProject(next).ok).toBe(false)
})
