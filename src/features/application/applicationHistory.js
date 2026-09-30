export function createApplicationHistory(project){return {past:[],present:project,future:[],group:null}}
export function applicationHistoryReducer(h,a){
 if(a.type==='reset')return createApplicationHistory(a.project)
 if(a.type==='endGroup')return {...h,group:null}
 if(a.type==='undo'&&h.past.length)return {past:h.past.slice(0,-1),present:h.past.at(-1),future:[h.present,...h.future],group:null}
 if(a.type==='redo'&&h.future.length)return {past:[...h.past,h.present].slice(-50),present:h.future[0],future:h.future.slice(1),group:null}
 if(a.type==='commit'&&JSON.stringify(a.project)!==JSON.stringify(h.present))return {past:a.group&&a.group===h.group?h.past:[...h.past,h.present].slice(-50),present:a.project,future:[],group:a.group||null}
 return h
}
