import {expect,test} from 'vitest'
import {createApplicationProject} from './applicationModel.js'
import {getApplicationTextBlocks,checkApplicationProject} from './applicationTextTools.js'
test('local checklist and keyword comparison do not invent suitability',()=>{
 const p=createApplicationProject();p.resume.sections[0].entries[0].description='React [Ergebnis]'
 const before=JSON.stringify(p);expect(getApplicationTextBlocks('de','profile').length).toBeGreaterThan(1);expect(JSON.stringify(p)).toBe(before)
 const result=checkApplicationProject(p,'REACT TypeScript')
 expect(result.issues.map(i=>i.code)).toEqual(expect.arrayContaining(['missingName','missingEmail','placeholder','missingSubject']))
 expect(result.keywords).toEqual([{word:'react',found:true},{word:'typescript',found:false}]);expect(result).not.toHaveProperty('score')
})
