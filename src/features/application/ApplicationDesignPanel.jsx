import {useId,useState} from 'react'
import {IconAdjustmentsHorizontal,IconRotateClockwise} from '@tabler/icons-react'
import {applicationFontFamilies} from './applicationTemplates.js'
import {useI18n} from '../../i18n/index.js'
function NumberControl({label,value,min,max,step=1,onChange}){
 const {t}=useI18n(),id=useId();const [invalid,setInvalid]=useState(false)
 function commit(input){const v=input.valueAsNumber;if(!Number.isFinite(v)||v<min||v>max){setInvalid(true);return}setInvalid(false);input.value=String(v);onChange(v)}
 return <label className="app-field app-number-field"><span>{label}</span><input key={value} type="number" min={min} max={max} step={step} defaultValue={value} aria-invalid={invalid||undefined} aria-describedby={invalid?id:undefined} onChange={()=>setInvalid(false)} onBlur={e=>commit(e.target)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();commit(e.currentTarget)}if(e.key==='Escape'){e.currentTarget.value=String(value);setInvalid(false)}}}/>{invalid&&<small id={id} role="alert">{t('studioApplication.numberRange',{min,max})}</small>}</label>
}
export default function ApplicationDesignPanel({project,documentKind,selection,onAction}){
 const {t}=useI18n();const tr=k=>t(`studioApplication.${k}`);const d=project[documentKind].design
 const section=project.resume.sections.find(s=>s.id===selection?.sectionId)
 const target=selection?.kind==='letter'?project.letter.paragraphs.find(p=>p.id===selection.id):selection?.entryId?section?.entries.find(e=>e.id===selection.entryId):section
 const set=(field,value)=>onAction({type:'design',kind:documentKind,field,value})
 const setStyle=(field,value)=>onAction({type:'style',...selection,field,value})
 const number=(field,min,max,step=1)=><NumberControl key={field} label={tr(field)} value={d[field]} min={min} max={max} step={step} onChange={v=>set(field,v)}/>
 const select=(field,options)=><label className="app-field" key={field}><span>{tr(field)}</span><select aria-label={tr(field)} value={d[field]} onChange={e=>set(field,e.target.value)}>{options.map(([id,key])=><option key={id} value={id}>{tr(key)}</option>)}</select></label>
 const color=(field,label,value,change)=><label className="app-field app-colour-field"><span>{tr(label)}</span><div><input aria-label={tr(label)} type="color" value={value} onChange={e=>change(e.target.value)}/><span>{value.toUpperCase()}</span></div></label>
 return <div className="app-design-panel"><div className="app-panel-heading"><IconAdjustmentsHorizontal size={23} aria-hidden="true"/><h2>{tr('designTitle')}</h2><p>{tr('designHint')}</p></div>
  {documentKind==='resume'&&<section className="app-card"><h3>{tr('layout')}</h3><div className="app-card__body app-fields">{select('layout',[['single','singleColumn'],['two','twoColumns']])}{d.layout==='two'&&<>{number('columnGap',12,48)}{number('leftColumnWidth',35,65)}<p className="app-note">{tr('twoColumnsHint')}</p></>}</div></section>}
  <section className="app-card"><h3>{tr('global')}</h3><div className="app-card__body app-fields">
   <label className="app-field"><span>{tr('pageFormat')}</span><select value={d.pageFormat} onChange={e=>set('pageFormat',e.target.value)}><option value="a4">A4</option><option value="letter">Letter</option></select></label>
   {select('font',applicationFontFamilies.map(id=>[id,id]))}{number('fontSize',8,18,.5)}{number('lineHeight',1,2,.05)}{number('paragraphGap',0,60)}{number('sectionGap',0,60)}{number('entryGap',0,60)}{documentKind==='resume'&&number('dateWidth',60,150)}
   {color('accent','accent',d.accent,v=>set('accent',v))}{color('textColor','textColor',d.textColor,v=>set('textColor',v))}
   {select('header',[['plain','plain'],['accent','accentHeader'],['editorial','editorialHeader'],['classic','classic']])}
  </div></section>
  <section className="app-card"><h3>{tr('margins')}</h3><div className="app-card__body app-fields">{['top','right','bottom','left'].map(side=><NumberControl label={tr(side)} value={d.margins[side]} min={18} max={90} key={side} onChange={value=>onAction({type:'design',kind:documentKind,field:'margins',side,value})}/>)}</div></section>
  <section id="app-photo-settings" className="app-card"><h3>{tr('photo')}</h3><div className="app-card__body"><label className="app-check"><input type="checkbox" checked={d.showPhoto} onChange={e=>set('showPhoto',e.target.checked)}/>{tr('showPhoto')}</label><div className="app-fields">{number('photoSize',24,180)}{select('photoPosition',[['left','left'],['right','right']])}{number('photoOffsetX',0,48)}{number('photoOffsetY',0,90)}{select('photoShape',[['round','round'],['rectangle','rectangle']])}</div></div></section>
  <section className="app-card app-selected-card"><h3>{tr('selected')}<small>{target?.title||section?.title||tr(target?'body':'noSelection')}</small></h3><div className="app-card__body">{target?<>
   {documentKind==='resume'&&section&&!selection.entryId&&d.layout==='two'&&<label className="app-field"><span>{tr('sectionColumn')}</span><select value={section.column||'auto'} onChange={e=>onAction({type:'section',sectionId:section.id,field:'column',value:e.target.value})}>{['auto','full','left','right'].map(id=><option value={id} key={id}>{tr(id==='full'?'fullWidth':id)}</option>)}</select></label>}
   <div className="app-fields">{[['fontSize',8,28,target.style.fontSize||d.fontSize],['before',0,60,target.style.before||0],['after',0,60,target.style.after||0],...(!selection.entryId&&!selection.id?[['ruleWidth',0,3,target.style.ruleWidth??.7],['ruleGap',0,20,target.style.ruleGap??5]]:[])].map(([field,min,max,value])=><NumberControl label={tr(field)} value={value} min={min} max={max} step={field==='ruleWidth'?.1:1} key={field} onChange={v=>setStyle(field,v)}/>)}
    {['weight','align'].map(field=><label className="app-field" key={field}><span>{tr(field)}</span><select value={target.style[field]||(field==='weight'?'regular':'left')} onChange={e=>setStyle(field,e.target.value)}>{(field==='weight'?['regular','bold','italic']:['left','center','right']).map(v=><option key={v} value={v}>{tr(v)}</option>)}</select></label>)}
    {color('color','color',target.style.color||d.accent,v=>setStyle('color',v))}
   </div>{!selection.entryId&&!selection.id&&<label className="app-check"><input type="checkbox" checked={!!target.style.uppercase} onChange={e=>setStyle('uppercase',e.target.checked)}/>{tr('uppercase')}</label>}
   <button className="app-text-button" onClick={()=>onAction({type:'style',...selection,reset:true})}>{tr('resetStyle')}</button>
  </>:<p className="app-muted">{tr('selectHint')}</p>}</div></section>
  <p className="app-note">{tr('points')} {tr('colorHint')}</p><button className="app-secondary" onClick={()=>onAction({type:'resetDesign',kind:documentKind})}><IconRotateClockwise size={17} aria-hidden="true"/>{tr('resetDesign')}</button>
 </div>
}
