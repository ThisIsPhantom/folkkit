import {expect,test} from 'vitest'
import {useState} from 'react'
import {screen,fireEvent} from '@testing-library/react'
import {renderWithProviders} from '../../test/renderWithProviders.jsx'
import {createApplicationProject,updateApplicationProject} from './applicationModel.js'
import ApplicationContentPanel from './ApplicationContentPanel.jsx'
function Harness({kind='resume',locale='de'}){const[p,set]=useState(()=>createApplicationProject(locale));return <><ApplicationContentPanel project={p} documentKind={kind} onAction={a=>set(v=>updateApplicationProject(v,a))} onSelectStyle={()=>{}}/><output data-testid="project">{JSON.stringify(p)}</output></>}
test.each(['de','en'])('contact and entry editing are external labelled fields (%s)',locale=>{
 renderWithProviders(<Harness locale={locale}/>,{locale})
 fireEvent.change(screen.getByLabelText(locale==='de'?'Vollständiger Name':'Full name'),{target:{value:'Mira'}})
 expect(JSON.parse(screen.getByTestId('project').textContent).person.name).toBe('Mira')
 const field=screen.getAllByLabelText(locale==='de'?'Beschreibung':'Description')[0]
 fireEvent.change(field,{target:{value:'Ein Profil'}})
 expect(JSON.parse(screen.getByTestId('project').textContent).resume.sections[0].entries[0].description).toBe('Ein Profil')
 fireEvent.click(screen.getAllByRole('button',{name:locale==='de'?'Eintrag duplizieren':'Duplicate entry'})[0])
 expect(JSON.parse(screen.getByTestId('project').textContent).resume.sections[0].entries).toHaveLength(2)
 expect(document.querySelector('[contenteditable="true"]')).toBeNull()
})
test('letter has labelled recipient, subject and paragraph fields',()=>{
 renderWithProviders(<Harness kind="letter"/>);fireEvent.change(screen.getByLabelText('Betreff'),{target:{value:'Bewerbung'}})
 fireEvent.change(screen.getByLabelText('Absatz 1'),{target:{value:'Mein Text'}})
 fireEvent.click(screen.getByRole('button',{name:'Absatz hinzufügen'}))
 const p=JSON.parse(screen.getByTestId('project').textContent);expect(p.letter.subject).toBe('Bewerbung');expect(p.letter.paragraphs).toHaveLength(2)
})
