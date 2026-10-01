import {createElement,useCallback,useEffect,useReducer,useRef,useState} from 'react'
import {IconFileCv,IconMail,IconDownload,IconFolderOpen,IconDeviceFloppy,IconArrowBackUp,IconArrowForwardUp,IconPlus,IconFileText,IconLayout,IconAdjustmentsHorizontal,IconWriting,IconPhoto,IconTrash,IconArrowUpRight} from '@tabler/icons-react'
import {useI18n} from '../../i18n/index.js'
import {createApplicationProject,exampleApplicationProject,updateApplicationProject} from './applicationModel.js'
import {createApplicationHistory,applicationHistoryReducer} from './applicationHistory.js'
import {createApplicationFonts,layoutApplication} from './applicationLayout.js'
import {readApplicationProject,readApplicationPhoto,serializeApplicationProject,downloadApplicationBlob} from './applicationFiles.js'
import {exportApplicationPdf} from './applicationPdf.js'
import {applicationTemplates} from './applicationTemplates.js'
import ApplicationContentPanel from './ApplicationContentPanel.jsx'
import ApplicationDesignPanel from './ApplicationDesignPanel.jsx'
import ApplicationTemplatePanel from './ApplicationTemplatePanel.jsx'
import ApplicationTextPanel from './ApplicationTextPanel.jsx'
import ApplicationPreview from './ApplicationPreview.jsx'
import './application-studio.css'
const tabs=[['content',IconFileText],['templates',IconLayout],['design',IconAdjustmentsHorizontal],['textTools',IconWriting]]
export default function ApplicationStudioPage({active=true}){
 const {t,locale}=useI18n();const tr=k=>t(`studioApplication.${k}`)
 const [history,dispatch]=useReducer(applicationHistoryReducer,locale,l=>createApplicationHistory(createApplicationProject(l)))
 const project=history.present
 const [kind,setKind]=useState('resume'),[tab,setTab]=useState('content'),[selection,setSelection]=useState(null),[fonts,setFonts]=useState(null),[layout,setLayout]=useState(null),[zoom,setZoom]=useState('fit'),[mobile,setMobile]=useState('edit'),[error,setError]=useState(''),[status,setStatus]=useState(''),[busy,setBusy]=useState(false),[isExample,setIsExample]=useState(false)
 const fileInput=useRef(null),photoInput=useRef(null),revision=useRef(0),mounted=useRef(true)
 useEffect(()=>{const scope=revision;mounted.current=true;return()=>{mounted.current=false;scope.current++}},[])
 const resumeFont=project.resume.design.font,letterFont=project.letter.design.font
 useEffect(()=>{let cancelled=false;createApplicationFonts([resumeFont,letterFont]).then(f=>{if(!cancelled)setFonts(f)}).catch(()=>{if(!cancelled)setError('layoutError')});return()=>{cancelled=true}},[resumeFont,letterFont])
 useEffect(()=>{if(!fonts||!fonts[project[kind].design.font]||!active)return;const timeout=setTimeout(()=>{try{setLayout(layoutApplication(project,kind,fonts))}catch{setError('layoutError')}},60);return()=>clearTimeout(timeout)},[project,kind,fonts,active])
 const action=useCallback((a,group)=>{
  if(a.type==='endGroup'){dispatch(a);return}
  revision.current++;setError('');setStatus('')
  const next=updateApplicationProject(project,a)
  if(next===project&&a.type!=='resetDesign')setError('invalidProject')
  else dispatch({type:'commit',project:next,group})
 },[project])
 useEffect(()=>{
  if(!active)return
  const key=e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();revision.current++;dispatch({type:e.shiftKey?'redo':'undo'});setError('')}}
  window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)
 },[active])
 function resetProject(next,example=false){revision.current++;dispatch({type:'reset',project:next});setSelection(null);setError('');setStatus('');setIsExample(example)}
 function example(){if((project.person.name||history.past.length)&&!window.confirm(tr('exampleConfirm')))return;resetProject(exampleApplicationProject(locale),true)}
 function selectStyle(value){setSelection(value);setTab('design');setMobile('edit');requestAnimationFrame(()=>document.getElementById('app-tab-design')?.focus())}
 async function importProject(e){const file=e.target.files?.[0];e.target.value='';if(!file)return;if((project.person.name||history.past.length)&&!window.confirm(tr('replaceConfirm')))return
  const token=++revision.current;setBusy(true);setError('');setStatus('importBusy')
  try{const p=await readApplicationProject(file);if(mounted.current&&token===revision.current){resetProject(p);setStatus('opened')}}catch(e){if(mounted.current&&token===revision.current)setError(e.code||'invalidProject')}finally{if(mounted.current){setBusy(false);if(token!==revision.current)setStatus('')}}
 }
 async function importPhoto(e){const file=e.target.files?.[0];e.target.value='';if(!file)return;const token=++revision.current;setBusy(true);setError('');setStatus('photoBusy')
  try{const photo=await readApplicationPhoto(file);if(mounted.current&&token===revision.current){dispatch({type:'commit',project:updateApplicationProject(project,{type:'photo',photo})});setStatus('')}}catch(e){if(mounted.current&&token===revision.current)setError(e.code||'invalidPhoto')}finally{if(mounted.current){setBusy(false);setStatus('')}}
 }
 function save(){try{downloadApplicationBlob(serializeApplicationProject(project),'folkkit-bewerbung.json');setStatus('saved');setError('')}catch(e){setError(e.code||'invalidProject')}}
 async function exportPdf(kinds){if(!fonts||busy)return;const snapshot=project;setBusy(true);setError('');setStatus('working');try{const bytes=await exportApplicationPdf(snapshot,kinds,fonts);if(mounted.current){downloadApplicationBlob(new Blob([bytes],{type:'application/pdf'}),kinds.length===2?'bewerbung.pdf':`${kind==='resume'?'lebenslauf':'anschreiben'}.pdf`);setStatus('exported')}}catch(e){if(mounted.current)setError(e.code||'exportFailed')}finally{if(mounted.current)setBusy(false)}}
 const template=applicationTemplates.find(t=>t.id===project[kind].design.template)
 const hasContent=Boolean(project.photo)||Object.values(project.person).some(Boolean)||project.resume.sections.some(s=>s.entries.some(e=>e.description||e.title))||project.letter.paragraphs.some(p=>p.text)
 const fontsReady=fonts&&fonts[resumeFont]&&fonts[letterFont]
 const stale=layout===null
 const issues=layout?.issues||[]
 const onUndo=type=>{revision.current++;dispatch({type});setError('');setStatus('')}
 return <div className="application-studio studio-page">
  <header className="app-heading"><div><span className="app-eyebrow">{tr('eyebrow')}</span><h1>{tr('title')}<span className="app-heading__mark"><IconArrowUpRight size={23} aria-hidden="true"/></span></h1><p>{tr('description')}</p></div><div className="app-project-actions"><button className="app-secondary" onClick={()=>fileInput.current?.click()} disabled={busy}><IconFolderOpen size={17} aria-hidden="true"/>{tr('openProject')}</button><button className="app-secondary" onClick={save}><IconDeviceFloppy size={17} aria-hidden="true"/>{tr('saveProject')}</button><button className="app-icon-button" title={tr('reset')} aria-label={tr('reset')} onClick={()=>{if(window.confirm(tr('resetConfirm')))resetProject(createApplicationProject(locale))}}><IconPlus size={19} aria-hidden="true"/></button></div></header>
  <input ref={fileInput} type="file" accept=".json,application/json" hidden onChange={importProject}/><input ref={photoInput} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={importPhoto}/>
  <div className="app-workbench">
   <div className="app-workbench__bar"><div className="app-document-switch" role="group" aria-label={tr('title')}>
    {[['resume',IconFileCv],['letter',IconMail]].map(([id,icon])=><button key={id} aria-pressed={kind===id} onClick={()=>{setKind(id);setSelection(null)}}>{createElement(icon,{size:19,'aria-hidden':true})}{tr(id)}</button>)}
   </div><div className="app-export-actions"><div className="app-undo-group"><button className="app-icon-button" aria-label={tr('undo')} title={tr('undo')} disabled={!history.past.length} onClick={()=>onUndo('undo')}><IconArrowBackUp size={20} aria-hidden="true"/></button><button className="app-icon-button" aria-label={tr('redo')} title={tr('redo')} disabled={!history.future.length} onClick={()=>onUndo('redo')}><IconArrowForwardUp size={20} aria-hidden="true"/></button></div><button className="app-primary" onClick={()=>exportPdf([kind])} disabled={!fontsReady||busy||issues.some(i=>i.blocking)}><IconDownload size={17} aria-hidden="true"/>{tr('download')}</button><button className="app-secondary app-combined" onClick={()=>exportPdf(['resume','letter'])} disabled={!fontsReady||busy}>{tr('combined')}</button></div></div>
   <div className="app-mobile-switch" role="group" aria-label={tr('preview')}>{['edit','preview'].map(id=><button key={id} aria-pressed={mobile===id} onClick={()=>setMobile(id)}>{tr(id)}</button>)}</div>
   <div className={`app-workspace app-workspace--${mobile}`}>
    <aside className="app-editor" aria-label={tr('edit')}>
     <div className="app-tabs" role="tablist" aria-label={tr('edit')}>{tabs.map(([id,icon])=><button id={`app-tab-${id}`} key={id} role="tab" aria-selected={tab===id} aria-controls="app-panel" tabIndex={tab===id?0:-1} onClick={()=>setTab(id)} onKeyDown={e=>{if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();const i=tabs.findIndex(t=>t[0]===id);const next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;setTab(tabs[next][0]);document.getElementById(`app-tab-${tabs[next][0]}`)?.focus()}}}>{createElement(icon,{size:17,'aria-hidden':true})}{tr(id)}</button>)}</div>
     <div id="app-panel" role="tabpanel" aria-labelledby={`app-tab-${tab}`} className="app-panel">
      {isExample&&<p className="app-example-note">{tr('exampleNote')}</p>}
      {tab==='content'&&<><ApplicationContentPanel project={project} documentKind={kind} onAction={action} onSelectStyle={selectStyle}/><section className="app-card app-photo-card"><h3>{tr('photo')}</h3><button className="app-text-button" onClick={()=>{setTab('design');requestAnimationFrame(()=>document.getElementById('app-photo-settings')?.scrollIntoView({block:'start'}))}}>{tr('designPhoto')}</button><div className="app-card__body"><div className="app-photo-control">{project.photo?<img src={project.photo.data} alt={tr('photo')}/>:<span><IconPhoto size={25} aria-hidden="true"/></span>}<div><button className="app-secondary" onClick={()=>photoInput.current?.click()} disabled={busy}>{tr('addPhoto')}</button><small>{tr('photoHint')}</small></div>{project.photo&&<button className="app-icon-button" aria-label={tr('removePhoto')} onClick={()=>action({type:'photo',photo:null})}><IconTrash size={17} aria-hidden="true"/></button>}</div></div></section><button className="app-text-button" onClick={example}>{tr('example')}</button></>}
      {tab==='design'&&<ApplicationDesignPanel project={project} documentKind={kind} selection={selection} onAction={action}/>}
      {tab==='templates'&&<ApplicationTemplatePanel project={project} documentKind={kind} fonts={fonts} onAction={action}/>}
      {tab==='textTools'&&<ApplicationTextPanel project={project} documentKind={kind} onAction={action}/>}
     </div><div className="app-editor-footer"><IconDeviceFloppy size={15} aria-hidden="true"/><p>{tr('localHint')}</p></div>
    </aside>
    <section className="app-preview-area" aria-label={tr('preview')}>
     <div className="app-preview-toolbar"><div><span className="app-live">{tr('live')}</span><span>{template?.name} <b>·</b> {project[kind].design.pageFormat.toUpperCase()}</span></div><label className="app-zoom"><span>{tr('zoom')}</span><select value={zoom} onChange={e=>setZoom(e.target.value==='fit'?'fit':Number(e.target.value))}><option value="fit">{tr('fit')}</option><option value={.65}>65%</option><option value={.8}>80%</option><option value={1}>100%</option><option value={1.25}>125%</option><option value={1.5}>150%</option></select></label></div>
     <div className="app-preview-scroll">{!hasContent?<div className="app-empty-paper"><div className="app-empty-paper__lines" aria-hidden="true"><i/><i/><i/></div><div><span className="app-eyebrow">FOLKKIT STUDIO</span><h2>{tr('emptyTitle')}</h2><p>{tr('emptyBody')}</p><button className="app-primary" onClick={example}>{tr('emptyAction')}<IconArrowUpRight size={17} aria-hidden="true"/></button></div><span className="app-empty-paper__footer">{template?.name} / {project[kind].design.pageFormat.toUpperCase()}</span></div>:<ApplicationPreview layout={layout} zoom={zoom} onSelectStyle={selectStyle}/>}</div>
     <div className="app-preview-footer"><span>{layout?t('studioApplication.pageCount',{count:layout.pages.length}):tr('working')}</span><span>{tr('intro')}</span></div>
    </section>
   </div>
  </div>
  <div className="app-status" role="status" aria-live="polite">{status?tr(status):busy||stale?tr('working'):tr('ready')}</div>
  {error&&<p className="app-error" role="alert">{tr(error)}</p>}
  {issues.map(i=><div className="app-error" role="alert" key={`${i.code}-${i.target}`}>{tr(i.code)}{i.target&&!['resume','letter'].includes(i.target)&&<button className="app-text-button" onClick={()=>{const s=project.resume.sections.find(s=>s.id===i.target||s.entries.some(e=>e.id===i.target));selectStyle(s?{sectionId:s.id,entryId:s.id===i.target?undefined:i.target}:{kind:'letter',id:i.target})}}>{tr('errorTarget')}</button>}</div>)}
  {project[kind].design.template!=='ats'&&<p className="app-ats-note">{tr('columnsNote')}</p>}
 </div>
}
