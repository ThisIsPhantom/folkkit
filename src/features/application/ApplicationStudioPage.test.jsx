import {expect,test,vi} from 'vitest'
import {screen,fireEvent,waitFor} from '@testing-library/react'
import {renderWithProviders} from '../../test/renderWithProviders.jsx'
import ApplicationStudioPage from './ApplicationStudioPage.jsx'
test('external content appears in preview and template/design changes preserve it',async()=>{
 renderWithProviders(<ApplicationStudioPage active/>);
 fireEvent.change(screen.getByLabelText('Vollständiger Name'),{target:{value:'Mira Test'}})
 await waitFor(()=>expect(document.querySelector('.app-preview text')?.textContent).toBe('Mira Test'))
 fireEvent.click(screen.getByRole('tab',{name:'Vorlagen'}));fireEvent.click(screen.getByRole('button',{name:/ATS Pur/}))
 expect(document.querySelector('.app-preview text').textContent).toBe('Mira Test')
 fireEvent.click(screen.getByRole('tab',{name:'Gestaltung'}));fireEvent.change(screen.getByLabelText('Textgrösse'),{target:{value:'12'}})
 fireEvent.click(screen.getByRole('tab',{name:'Inhalt'}));expect(screen.getByLabelText('Vollständiger Name')).toHaveValue('Mira Test')
 fireEvent.click(screen.getByRole('button',{name:'Rückgängig'}));expect(screen.getByLabelText('Vollständiger Name')).toHaveValue('Mira Test')
 expect(document.querySelector('[contenteditable="true"]')).toBeNull()
})
test('examples are explicit and reset clears content with a warning',async()=>{
 vi.spyOn(window,'confirm').mockReturnValue(true);renderWithProviders(<ApplicationStudioPage active/>);
 expect(screen.getByLabelText('Vollständiger Name')).toHaveValue('')
 fireEvent.click(screen.getByRole('button',{name:'Mit Beispiel ausprobieren'}));expect(screen.getByLabelText('Vollständiger Name')).toHaveValue('Mira Muster')
 fireEvent.click(screen.getByRole('button',{name:'Neues Projekt'}));expect(screen.getByLabelText('Vollständiger Name')).toHaveValue('')
 expect(window.confirm).toHaveBeenCalled();window.confirm.mockRestore()
})

test('section-specific appearance and visibility preserve description content',async()=>{
 renderWithProviders(<ApplicationStudioPage active/>);
 fireEvent.change(screen.getAllByLabelText('Beschreibung')[0],{target:{value:'Meine konkrete Erfahrung'}})
 fireEvent.click(screen.getAllByRole('button',{name:'Form bearbeiten',exact:true})[0])
 expect(screen.getByRole('tab',{name:'Gestaltung'})).toHaveAttribute('aria-selected','true')
 fireEvent.change(screen.getByLabelText('Abstand davor'),{target:{value:'25'}})
 fireEvent.click(screen.getByRole('tab',{name:'Inhalt',exact:true}));expect(screen.getAllByLabelText('Beschreibung')[0]).toHaveValue('Meine konkrete Erfahrung')
 fireEvent.click(screen.getAllByLabelText('Im Dokument anzeigen')[0])
 await waitFor(()=>expect(document.querySelector('.app-preview')?.textContent||'').not.toContain('Meine konkrete Erfahrung'))
 fireEvent.click(screen.getAllByLabelText('Im Dokument anzeigen')[0]);await waitFor(()=>expect(document.querySelector('.app-preview')?.textContent).toContain('Meine konkrete Erfahrung'))
})

test('a late project import cannot overwrite subsequent typing',async()=>{
 const files=await import('./applicationFiles.js');let resolve
 const deferred=new Promise(r=>{resolve=r});const spy=vi.spyOn(files,'readApplicationProject').mockReturnValue(deferred)
 renderWithProviders(<ApplicationStudioPage active/>);
 fireEvent.change(document.querySelector('input[accept=".json,application/json"]'),{target:{files:[new File(['{}'],'project.json',{type:'application/json'})]}})
 fireEvent.change(screen.getByLabelText('Vollständiger Name'),{target:{value:'My newer edit'}})
 const {exampleApplicationProject}=await import('./applicationModel.js');resolve(exampleApplicationProject())
 await waitFor(()=>expect(screen.getByRole('button',{name:'Projekt öffnen'})).not.toBeDisabled())
 expect(screen.getByLabelText('Vollständiger Name')).toHaveValue('My newer edit');spy.mockRestore()
})

test('inactive studio does not recompute preview until activated',async()=>{
 const view=renderWithProviders(<ApplicationStudioPage active/>);
 fireEvent.change(screen.getByLabelText('Vollständiger Name'),{target:{value:'Before'}})
 await waitFor(()=>expect(document.querySelector('.app-preview text')?.textContent).toBe('Before'))
 view.rerender(<ApplicationStudioPage active={false}/>);fireEvent.change(screen.getByLabelText('Vollständiger Name'),{target:{value:'After'}})
 await new Promise(r=>setTimeout(r,90));expect(document.querySelector('.app-preview text')?.textContent).toBe('Before')
 view.rerender(<ApplicationStudioPage active/>);await waitFor(()=>expect(document.querySelector('.app-preview text')?.textContent).toBe('After'))
})

test('numeric fields accept partial drafts and commit valid multi-digit values',()=>{
 renderWithProviders(<ApplicationStudioPage active/>);fireEvent.click(screen.getByRole('tab',{name:'Gestaltung'}));const input=screen.getByLabelText('Oben')
 fireEvent.change(input,{target:{value:''}});expect(input).toHaveValue(null)
 fireEvent.change(input,{target:{value:'1'}});expect(input).toHaveValue(1)
 fireEvent.change(input,{target:{value:'18'}});fireEvent.blur(input);expect(screen.getByLabelText('Oben')).toHaveValue(18)
 fireEvent.change(screen.getByLabelText('Oben'),{target:{value:'2'}});fireEvent.blur(screen.getByLabelText('Oben'));expect(screen.getByRole('alert').textContent).toContain('18')
})
