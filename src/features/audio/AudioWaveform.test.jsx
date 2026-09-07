import {expect,test,vi} from 'vitest'
import {render,screen,fireEvent} from '@testing-library/react'
import AudioWaveform from './AudioWaveform.jsx'
const state={duration:10,start:0,end:10,fadeIn:0,fadeOut:0}
test('direct gesture commits once and ignores foreign pointers; Escape and cancellation discard drafts',()=>{
 const commit=vi.fn();render(<AudioWaveform peaks={[[-0.8,0.8]]} state={state} onCommit={commit} t={key=>key}/>)
 const track=document.querySelector('.audio-wave-track'),handle=screen.getByRole('slider',{name:'startHandle'})
 track.setPointerCapture=vi.fn();track.getBoundingClientRect=()=>({left:0,width:100})
 const pointer=(target,type,id,x)=>{const event=new Event(type,{bubbles:true});Object.assign(event,{pointerId:id,clientX:x,button:0});fireEvent(target,event)}
 pointer(handle,'pointerdown',1,0);pointer(track,'pointermove',1,20);pointer(track,'pointerup',2,80);expect(commit).not.toHaveBeenCalled()
 pointer(track,'pointerup',1,30);expect(commit).toHaveBeenCalledOnce();expect(commit.mock.calls[0][0].start).toBe(3)
 commit.mockClear();pointer(handle,'pointerdown',3,0);pointer(track,'pointermove',3,40);pointer(track,'pointercancel',3,40);pointer(track,'pointerup',3,40);expect(commit).not.toHaveBeenCalled()
 pointer(handle,'pointerdown',4,0);pointer(track,'pointermove',4,40);fireEvent.keyDown(window,{key:'Escape'});pointer(track,'pointerup',4,40);expect(commit).not.toHaveBeenCalled()
})
