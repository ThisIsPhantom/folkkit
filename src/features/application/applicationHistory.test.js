import {expect,test} from 'vitest'
import {createApplicationHistory,applicationHistoryReducer as reduce} from './applicationHistory.js'
test('grouped typing, undo, redo and divergent edits',()=>{
 let h=createApplicationHistory({text:''})
 h=reduce(h,{type:'commit',project:{text:'a'},group:'field'})
 h=reduce(h,{type:'commit',project:{text:'ab'},group:'field'})
 expect(h.past).toHaveLength(1)
 h=reduce(h,{type:'undo'});expect(h.present.text).toBe('')
 h=reduce(h,{type:'redo'});expect(h.present.text).toBe('ab')
 h=reduce(h,{type:'undo'});h=reduce(h,{type:'commit',project:{text:'new'}});expect(h.future).toHaveLength(0)
 const count=h.past.length;h=reduce(h,{type:'commit',project:{text:'new'}});expect(h.past).toHaveLength(count)
 for(let i=0;i<60;i++)h=reduce(h,{type:'commit',project:{text:String(i)}})
 expect(h.past).toHaveLength(50)
 h=reduce(h,{type:'reset',project:{text:''}});expect(h.past).toEqual([]);expect(h.future).toEqual([])
})
