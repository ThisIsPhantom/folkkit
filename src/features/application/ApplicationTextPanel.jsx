import {useState} from 'react'
import {IconWriting,IconCheck,IconPlus} from '@tabler/icons-react'
import {useI18n} from '../../i18n/index.js'
import {getApplicationTextBlocks,checkApplicationProject} from './applicationTextTools.js'
export default function ApplicationTextPanel({project,documentKind,onAction}){
 const {t,locale}=useI18n();const tr=k=>t(`studioApplication.${k}`)
 const [target,setTarget]=useState('profile'),[selected,setSelected]=useState(0),[destination,setDestination]=useState(''),[job,setJob]=useState('')
 const type=documentKind==='letter'?'letter':target,blocks=getApplicationTextBlocks(locale,type),block=blocks[selected]||blocks[0]
 const destinations=documentKind==='letter'?project.letter.paragraphs.map((p,i)=>({id:p.id,label:t('studioApplication.paragraph',{number:i+1})})):project.resume.sections.filter(s=>!['spacer','rule','pageBreak'].includes(s.type)).flatMap(s=>s.entries.map((e,i)=>({id:e.id,sectionId:s.id,label:`${s.title} · ${e.title||i+1}`})))
 const to=destinations.find(d=>d.id===destination)||destinations.find(d=>documentKind==='resume'&&project.resume.sections.find(s=>s.id===d.sectionId)?.type===target)||destinations[0]
 const check=checkApplicationProject(project,job)
 function insert(){if(!to)return;if(documentKind==='letter'){const p=project.letter.paragraphs.find(p=>p.id===to.id);onAction({type:'paragraph',id:p.id,value:[p.text,block.text].filter(Boolean).join('\n\n')})}else{const e=project.resume.sections.find(s=>s.id===to.sectionId).entries.find(e=>e.id===to.id);onAction({type:'entry',sectionId:to.sectionId,entryId:to.id,field:'description',value:[e.description,block.text].filter(Boolean).join('\n')})}}
 return <div><div className="app-panel-heading"><IconWriting size={23} aria-hidden="true"/><h2>{tr('blocksTitle')}</h2><p>{tr('blocksHint')}</p></div>
  <section className="app-card"><div className="app-card__body">{documentKind==='resume'&&<label className="app-field"><span>{tr('blockTarget')}</span><select value={target} onChange={e=>{setTarget(e.target.value);setSelected(0);setDestination('')}}>{['profile','experience'].map(k=><option value={k} key={k}>{tr(k)}</option>)}</select></label>}
   <div className="app-block-options">{blocks.map((b,i)=><button className={block.id===b.id?'app-block--active':''} key={b.id} aria-pressed={block.id===b.id} onClick={()=>setSelected(i)}>{b.label}</button>)}</div><div className="app-block-preview"><span>{tr('blockPreview')}</span><p>{block.text}</p></div>
   <label className="app-field"><span>{tr('insertTarget')}</span><select value={to?.id||''} onChange={e=>setDestination(e.target.value)}>{destinations.map(d=><option key={d.id} value={d.id}>{d.label}</option>)}</select></label>
   <button className="app-primary" disabled={!to} onClick={insert}><IconPlus size={17} aria-hidden="true"/>{tr('applyBlock')}</button>{!to&&<p>{tr('noTextTarget')}</p>}
  </div></section>
  <section className="app-card"><h3>{tr('checklist')}</h3><div className="app-card__body">{check.issues.length?<ul className="app-checklist">{check.issues.map(i=><li key={i.code}>{tr(i.code)}</li>)}</ul>:<p className="app-success"><IconCheck size={18} aria-hidden="true"/>{tr('allGood')}</p>}</div></section>
  <section className="app-card"><h3>{tr('keywordTitle')}</h3><div className="app-card__body"><label className="app-field"><span>{tr('jobText')}</span><textarea rows={5} value={job} onChange={e=>setJob(e.target.value)} maxLength={20000}/></label><p className="app-note">{tr('keywordHint')}</p><div className="app-keywords">{check.keywords.map(k=><span className={k.found?'app-keyword--found':''} key={k.word} title={tr(k.found?'found':'notFound')}>{k.found?'✓ ':''}{k.word}</span>)}</div></div></section>
 </div>
}
