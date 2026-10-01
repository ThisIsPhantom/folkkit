import {expect,test,vi} from 'vitest'
import {screen,waitFor} from '@testing-library/react'
import {readFile} from 'node:fs/promises'
import process from 'node:process'
import {renderWithProviders} from '../../test/renderWithProviders.jsx'
import ApplicationTemplatePanel from './ApplicationTemplatePanel.jsx'
import {exampleApplicationProject} from './applicationModel.js'
import * as layout from './applicationLayout.js'

test('missing local font keeps standard thumbnails usable and reopening retries real metrics',async()=>{
 const fonts=await layout.createApplicationFonts()
 const create=layout.createApplicationFonts
 const spy=vi.spyOn(layout,'createApplicationFonts').mockRejectedValueOnce(new Error('offline'))
 try{
  const first=renderWithProviders(<ApplicationTemplatePanel project={exampleApplicationProject()} documentKind="resume" fonts={fonts} onAction={()=>{}}/>)
  await screen.findByRole('status')
  expect(document.querySelectorAll('.app-template__thumbnail > svg')).toHaveLength(4)
  expect(screen.getByRole('button',{name:/Folio/})).not.toBeDisabled()
  first.unmount()
  spy.mockImplementation(families=>create(families,url=>readFile(process.cwd()+'/public'+url)))
  renderWithProviders(<ApplicationTemplatePanel project={exampleApplicationProject()} documentKind="resume" fonts={fonts} onAction={()=>{}}/>)
  await waitFor(()=>expect(document.querySelectorAll('.app-template__thumbnail > svg')).toHaveLength(6))
  for(const name of ['folio','compact']){
   const runs=document.querySelectorAll(`.app-template__thumbnail--${name} text`)
   expect(runs.length).toBeGreaterThan(0)
   expect([...runs].every(run=>Number(run.getAttribute('textLength'))>0)).toBe(true)
  }
 }finally{spy.mockRestore()}
})

