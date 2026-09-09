import {StrictMode} from 'react'

import {expect,test,vi} from 'vitest'

import {render,screen,fireEvent,waitFor,act} from '@testing-library/react'

import {I18nContext} from '../../i18n/context.js'

import {translate} from '../../i18n/index.js'

import AudioEditorPage from './AudioEditorPage.jsx'

import messages from './messages.de.js'

const prepared={duration:2,peaks:[[-0.5,0.5]],preview:new Blob(['mp3']),from:'wav'}

const file=new File(['audio'],'sample.wav',{type:'audio/wav'})

const provider=child=><I18nContext.Provider value={{t:(key,vars)=>translate({studioAudio:messages},key,vars)}}>{child}</I18nContext.Provider>

test('StrictMode initial request completes once and editing supports undo',async()=>{

 const consumed=vi.fn(),prepare=vi.fn(async()=>prepared)

 render(provider(<StrictMode><AudioEditorPage fileRequest={{id:'one',file}} onFileRequestConsumed={consumed} prepare={prepare}/></StrictMode>))

 await screen.findByText('sample.wav')

 expect(consumed).toHaveBeenCalledWith('one');expect(prepare).toHaveBeenCalledOnce()

 const start=screen.getByLabelText('Start (Sekunden)');fireEvent.change(start,{target:{value:'0.4'}});fireEvent.blur(start)

 expect(start).toHaveValue(0.4);fireEvent.click(screen.getByRole('button',{name:'Rückgängig'}));expect(screen.getByLabelText('Start (Sekunden)')).toHaveValue(0)

})

test('reset and inactivity invalidate late prepare completion',async()=>{

 let resolve;const prepare=()=>new Promise(r=>{resolve=r})

 const view=render(provider(<AudioEditorPage prepare={prepare}/>))

 fireEvent.change(screen.getByLabelText('Audio auswählen'),{target:{files:[file]}})

 await waitFor(()=>expect(resolve).toBeTypeOf('function'))

 view.rerender(provider(<AudioEditorPage active={false} prepare={prepare}/>));resolve(prepared)

 await waitFor(()=>expect(screen.queryByText('sample.wav')).not.toBeInTheDocument())

})


test('replacement and reset discard late export results',async()=>{
 let resolve;const view=render(provider(<AudioEditorPage prepare={async()=>prepared} exporter={()=>new Promise(r=>{resolve=r})}/>))
 fireEvent.change(screen.getByLabelText('Audio auswählen'),{target:{files:[file]}});await screen.findByText('sample.wav')
 fireEvent.click(screen.getByRole('button',{name:'Audio exportieren'}));await waitFor(()=>expect(resolve).toBeTypeOf('function'))
 fireEvent.click(screen.getByRole('button',{name:'Zurücksetzen'}));resolve({blob:new Blob(['out']),name:'out.wav'})
 await waitFor(()=>expect(screen.queryByRole('link',{name:'Audiodatei herunterladen'})).not.toBeInTheDocument());view.unmount()
})

test('Escape in a precise time field discards the draft without adding history',async()=>{
 render(provider(<AudioEditorPage prepare={async()=>prepared}/>));fireEvent.change(screen.getByLabelText('Audio auswählen'),{target:{files:[file]}});await screen.findByText('sample.wav')
 const input=screen.getByLabelText('Start (Sekunden)');input.focus();fireEvent.change(input,{target:{value:'0.7'}});fireEvent.keyDown(input,{key:'Escape'})
 expect(screen.getByLabelText('Start (Sekunden)')).toHaveValue(0);expect(screen.getByRole('button',{name:'Rückgängig'})).toBeDisabled()
})

test('failed replacement preserves the original audio and edited selection',async()=>{
 let calls=0;render(provider(<AudioEditorPage prepare={async()=>{if(++calls===2)throw new Error('broken');return prepared}}/>))
 fireEvent.change(screen.getByLabelText('Audio auswählen'),{target:{files:[file]}});await screen.findByText('sample.wav')
 const input=screen.getByLabelText('Start (Sekunden)');fireEvent.change(input,{target:{value:'.4'}});fireEvent.blur(input)
 fireEvent.change(screen.getByLabelText('Audio auswählen'),{target:{files:[new File(['bad'],'broken.mp3')]}})
 await screen.findByRole('alert');expect(screen.getByText('sample.wav')).toBeVisible();expect(screen.getByLabelText('Start (Sekunden)')).toHaveValue(.4);expect(screen.getByRole('button',{name:'Rückgängig'})).toBeEnabled()
})


test('late playback errors keep editing available, clear on retry and ignore replaced or inactive players',async()=>{
 const callbacks=[]
 const playbackFactory=(_blob,options)=>{callbacks.push(options);return {play:async()=>options.onState(true),pause:()=>options.onState(false),dispose:vi.fn()}}
 const prepare=async()=>prepared
 const view=render(provider(<AudioEditorPage prepare={prepare} playbackFactory={playbackFactory}/>))
 fireEvent.change(screen.getByLabelText('Audio auswählen'),{target:{files:[file]}});await screen.findByText('sample.wav')
 fireEvent.click(screen.getByRole('button',{name:'Auswahl abspielen'}));await screen.findByRole('button',{name:'Pausieren'})
 act(()=>callbacks[0].onError({code:'playback_unavailable'}))
 expect(screen.getByRole('alert')).toHaveTextContent('Dieser Browser kann die Audiovorschau nicht abspielen.');expect(screen.getByRole('button',{name:'Audio exportieren'})).toBeEnabled();expect(screen.getByLabelText('Start (Sekunden)')).toBeEnabled()
 fireEvent.click(screen.getByRole('button',{name:'Auswahl abspielen'}));await screen.findByRole('button',{name:'Pausieren'});expect(screen.queryByRole('alert')).not.toBeInTheDocument()
 fireEvent.change(screen.getByLabelText('Audio auswählen'),{target:{files:[new File(['audio'],'replacement.wav')]}});await screen.findByText('replacement.wav')
 fireEvent.click(screen.getByRole('button',{name:'Auswahl abspielen'}));await screen.findByRole('button',{name:'Pausieren'})
 act(()=>callbacks[0].onError({code:'playback_unavailable'}));expect(screen.queryByRole('alert')).not.toBeInTheDocument()
 view.rerender(provider(<AudioEditorPage active={false} prepare={prepare} playbackFactory={playbackFactory}/>))
 act(()=>callbacks[1].onError({code:'playback_unavailable'}));expect(screen.queryByRole('alert')).not.toBeInTheDocument()
 view.unmount();act(()=>callbacks[1].onError({code:'playback_unavailable'}))
})
