import {expect,test,vi} from 'vitest'
import {fireEvent,render,screen,waitFor} from '@testing-library/react'
import {I18nContext} from '../../i18n/context.js'
import FileConverterPage from './FileConverterPage.jsx'
import messages from './messages.en.js'
const {convertDocumentFile}=vi.hoisted(()=>({convertDocumentFile:vi.fn(async()=>[{name:'document.html',blob:new Blob(['<p>Result</p>'],{type:'text/html'}),warnings:['external_resources_omitted','unknown_payload']}])}))
vi.mock('../documents/documentEngine.js',()=>({convertDocumentFile}))
test('offers real document targets, waits for start, shows bounded warnings and downloads',async()=>{
  const t=key=>key.split('.').slice(1).reduce((node,part)=>node?.[part],messages)||key
  render(<I18nContext.Provider value={{t,locale:'en'}}><FileConverterPage initialTarget="html" /></I18nContext.Provider>)
  const file=new File(['# Hello'],'document.md',{type:'text/markdown'})
  fireEvent.change(screen.getByLabelText('Choose files'),{target:{files:[file]}})
  await waitFor(()=>expect(screen.getByText('Ready')).toBeVisible())
  expect(screen.getByLabelText('Output format: document.md')).toHaveValue('html')
  expect(screen.queryByText('Settings')).not.toBeInTheDocument()
  expect(screen.getByText(messages.documentLayout)).toBeVisible()
  expect(convertDocumentFile).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole('button',{name:'Convert files',exact:true}))
  await waitFor(()=>expect(screen.getByRole('button',{name:'Download result: document.html'})).toBeVisible())
  expect(convertDocumentFile).toHaveBeenCalledWith(file,'markdown','html',expect.objectContaining({signal:expect.any(AbortSignal)}))
  expect(screen.getByText(messages.warnings.external_resources_omitted)).toBeVisible()
  expect(screen.queryByText(/unknown_payload/)).not.toBeInTheDocument()
  expect(document.querySelector('iframe')).toBeNull()
})


test('hands the original image to the registered editor without starting conversion', async()=>{
  const t=key=>key.split('.').slice(1).reduce((node,part)=>node?.[part],messages)||key
  const open=vi.fn()
  render(<I18nContext.Provider value={{t,locale:'en'}}><FileConverterPage editorKinds={['image']} onOpenEditor={open} /></I18nContext.Provider>)
  const file=new File([Uint8Array.of(137,80,78,71,13,10,26,10)],'original.png',{type:'image/png'})
  fireEvent.change(screen.getByLabelText('Choose files'),{target:{files:[file]}})
  await waitFor(()=>expect(screen.getByText('Ready')).toBeVisible())
  fireEvent.click(screen.getByRole('button',{name:'Edit original: original.png'}))
  expect(open).toHaveBeenCalledWith('image',file)
  expect(screen.getByText('Ready')).toBeVisible()
})
