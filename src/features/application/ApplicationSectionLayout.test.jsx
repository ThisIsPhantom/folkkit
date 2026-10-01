import {expect,test,vi} from 'vitest'
import {screen,fireEvent} from '@testing-library/react'
import {renderWithProviders} from '../../test/renderWithProviders.jsx'
import ApplicationSectionLayout from './ApplicationSectionLayout.jsx'

test('a section can choose either column and start a fresh area without a global switch',()=>{
 const onAction=vi.fn()
 renderWithProviders(<ApplicationSectionLayout section={{id:'section',column:'auto',newBand:false}} onAction={onAction}/> )
 fireEvent.change(screen.getByLabelText('Abschnittsbreite'),{target:{value:'right'}})
 expect(onAction).toHaveBeenCalledWith({type:'section',sectionId:'section',field:'column',value:'right'})
 fireEvent.click(screen.getByLabelText('Neuen Spaltenbereich beginnen'))
 expect(onAction).toHaveBeenCalledWith({type:'section',sectionId:'section',field:'newBand',value:true})
})
