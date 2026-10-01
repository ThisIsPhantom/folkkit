import ApplicationSectionLayout from './ApplicationSectionLayout.jsx'
import {useId,useState} from 'react'
import {IconUser,IconBriefcase,IconSchool,IconLanguage,IconCode,IconFolder,IconHeart,IconAlignLeft,IconPlus,IconChevronUp,IconChevronDown,IconCopy,IconTrash,IconAdjustmentsHorizontal} from '@tabler/icons-react'
import {useI18n} from '../../i18n/index.js'
import {applicationSectionTypes} from './applicationModel.js'
const icons={profile:IconAlignLeft,experience:IconBriefcase,education:IconSchool,skills:IconCode,languages:IconLanguage,projects:IconFolder,engagement:IconHeart}
export function ApplicationField({label,value,onChange,multiline=false,hint,...props}){
 const hintId=useId()
 return <label className={`app-field ${multiline?'app-field--wide':''}`}><span>{label}</span>{multiline?<textarea aria-label={label} aria-describedby={hint?hintId:undefined} value={value} onChange={e=>onChange(e.target.value)} rows={5} {...props}/>:<input aria-label={label} aria-describedby={hint?hintId:undefined} value={value} onChange={e=>onChange(e.target.value)} {...props}/>} {hint&&<small id={hintId}>{hint}</small>}</label>
}
function Action({label,icon,onClick,disabled}){const Icon=icon;return <button type="button" className="app-icon-button" title={label} aria-label={label} onClick={onClick} disabled={disabled}><Icon size={17} aria-hidden="true"/></button>}
function EditorEntry({entry:e,section:s,index,onAction,onSelectStyle,t}){
 const field=(field,key)=> <ApplicationField key={field} label={t(`studioApplication.${key}`)} value={e[field]} onChange={value=>onAction({type:'entry',sectionId:s.id,entryId:e.id,field,value},`${e.id}-${field}`)} />
 const simple=['profile','skills','languages'].includes(s.type)
 return <div className={`app-entry ${!e.visible?'app-entry--hidden':''}`}>
  <div className="app-entry__top"><span className="app-entry__number">{String(index+1).padStart(2,'0')}</span><strong>{e.title||t('studioApplication.emptyEntry')}</strong><div className="app-entry__actions">
   <Action label={t('studioApplication.moveUp')} icon={IconChevronUp} disabled={index===0} onClick={()=>onAction({type:'moveEntry',sectionId:s.id,entryId:e.id,direction:-1})}/>
   <Action label={t('studioApplication.moveDown')} icon={IconChevronDown} disabled={index===s.entries.length-1} onClick={()=>onAction({type:'moveEntry',sectionId:s.id,entryId:e.id,direction:1})}/>
   <Action label={t('studioApplication.duplicateEntry')} icon={IconCopy} onClick={()=>onAction({type:'duplicateEntry',sectionId:s.id,entryId:e.id})}/>
   <Action label={t('studioApplication.deleteEntry')} icon={IconTrash} onClick={event=>{onAction({type:'deleteEntry',sectionId:s.id,entryId:e.id});requestAnimationFrame(()=>document.getElementById(`section-${s.id}`)?.focus());void event}}/>
  </div></div>
  {!simple&&<div className="app-fields">{field('title','entryTitle')}{field('organization','organization')}{field('location','location')}<div className="app-fields app-fields--dates">{field('start','start')}{field('end','end')}</div></div>}
  <ApplicationField label={t('studioApplication.descriptionField')} value={e.description} multiline hint={t('studioApplication.descriptionHint')} onChange={value=>onAction({type:'entry',sectionId:s.id,entryId:e.id,field:'description',value},`${e.id}-description`)}/>
  <div className="app-entry__bottom"><label className="app-check"><input type="checkbox" checked={e.visible} onChange={ev=>onAction({type:'entry',sectionId:s.id,entryId:e.id,field:'visible',value:ev.target.checked})}/>{t('studioApplication.visible')}</label><button className="app-text-button" onClick={()=>onSelectStyle({sectionId:s.id,entryId:e.id})}><IconAdjustmentsHorizontal size={15} aria-hidden="true"/>{t('studioApplication.editStyle')}</button></div>
 </div>
}
export default function ApplicationContentPanel({project,documentKind,onAction,onSelectStyle}){
 const {t}=useI18n();const tr=key=>t(`studioApplication.${key}`)
 const [sectionType,setSectionType]=useState('custom')
 return <div className="app-content-panel" onBlur={event=>{if(['INPUT','TEXTAREA'].includes(event.target.tagName))onAction({type:'endGroup'})}}>
  <details className="app-card app-contact-card" open><summary><IconUser size={20} aria-hidden="true"/><span>{tr('contacts')}<small>{tr('contactsHint')}</small></span><IconChevronDown size={17} aria-hidden="true"/></summary><div className="app-card__body app-fields">
   {['name','title','email','phone','address','website','linkedin','citizenship'].map(field=><ApplicationField key={field} label={tr(field==='title'?'titleField':field)} value={project.person[field]} onChange={value=>onAction({type:'person',field,value},`person-${field}`)}/>)}
  </div></details>
  {documentKind==='letter'?<>
   <section className="app-card"><h2>{tr('letter')}</h2><div className="app-card__body app-fields">
    {['recipient','date','place','subject','salutation','closing'].map(field=><ApplicationField key={field} label={tr(field)} value={project.letter[field]} multiline={field==='recipient'} onChange={value=>onAction({type:'letter',field,value},`letter-${field}`)}/>)}
   </div></section>
   <section className="app-card"><h2>{tr('body')}</h2><div className="app-card__body">
    {project.letter.paragraphs.map((p,i)=><div className="app-entry" key={p.id}>
     <div className="app-entry__actions"><Action label={tr('moveUp')} icon={IconChevronUp} disabled={i===0} onClick={()=>onAction({type:'moveParagraph',id:p.id,direction:-1})}/><Action label={tr('moveDown')} icon={IconChevronDown} disabled={i===project.letter.paragraphs.length-1} onClick={()=>onAction({type:'moveParagraph',id:p.id,direction:1})}/><Action label={tr('duplicateParagraph')} icon={IconCopy} onClick={()=>onAction({type:'duplicateParagraph',id:p.id})}/><Action label={tr('deleteParagraph')} icon={IconTrash} onClick={()=>onAction({type:'deleteParagraph',id:p.id})}/></div>
     <ApplicationField label={t('studioApplication.paragraph',{number:i+1})} value={p.text} multiline onChange={value=>onAction({type:'paragraph',id:p.id,value},p.id)}/><button className="app-text-button" onClick={()=>onSelectStyle({kind:'letter',id:p.id})}>{tr('editStyle')}</button>
    </div>)}
    <button className="app-secondary" onClick={()=>onAction({type:'addParagraph'})}><IconPlus size={17} aria-hidden="true"/>{tr('addParagraph')}</button>
   </div></section>
  </>:<>
   {project.resume.sections.map((s,i)=>{const Icon=icons[s.type]||IconAlignLeft;const form=['spacer','rule','pageBreak'].includes(s.type);return <details className="app-card app-section-card" key={s.id} open={i===0}><summary id={`section-${s.id}`}><Icon size={20} aria-hidden="true"/><span>{s.title||tr(s.type)}<small>{form?tr('designHint'):`${s.entries.length} · ${s.entries[0]?.title||''}`}</small></span><IconChevronDown size={17} aria-hidden="true"/></summary><div className="app-card__body">
    {!form&&<ApplicationField label={tr('heading')} value={s.title} onChange={value=>onAction({type:'section',sectionId:s.id,field:'title',value},s.id)}/>}
    {s.type!=='pageBreak'&&<ApplicationSectionLayout section={s} onAction={onAction}/>}
    <div className="app-section-tools"><label className="app-check"><input type="checkbox" checked={s.visible} onChange={e=>onAction({type:'section',sectionId:s.id,field:'visible',value:e.target.checked})}/>{tr('visible')}</label><button className="app-text-button" onClick={()=>onSelectStyle({sectionId:s.id})}><IconAdjustmentsHorizontal size={15} aria-hidden="true"/>{tr('editStyle')}</button></div>
    {!form&&s.entries.map((e,index)=><EditorEntry key={e.id} entry={e} section={s} index={index} onAction={onAction} onSelectStyle={onSelectStyle} t={t}/>)}
    <div className="app-section-tools">{!form&&<button className="app-secondary" onClick={()=>onAction({type:'addEntry',sectionId:s.id})}><IconPlus size={17} aria-hidden="true"/>{tr('addEntry')}</button>}<div className="app-entry__actions"><Action label={tr('moveUp')} icon={IconChevronUp} disabled={i===0} onClick={()=>onAction({type:'moveSection',sectionId:s.id,direction:-1})}/><Action label={tr('moveDown')} icon={IconChevronDown} disabled={i===project.resume.sections.length-1} onClick={()=>onAction({type:'moveSection',sectionId:s.id,direction:1})}/><Action label={tr('duplicateSection')} icon={IconCopy} onClick={()=>onAction({type:'duplicateSection',sectionId:s.id})}/><Action label={tr('deleteSection')} icon={IconTrash} onClick={()=>{onAction({type:'deleteSection',sectionId:s.id});requestAnimationFrame(()=>document.getElementById('app-add-section')?.focus())}}/></div></div>
   </div></details>})}
   <div className="app-add-section"><label className="app-field"><span>{tr('sectionType')}</span><select value={sectionType} onChange={e=>setSectionType(e.target.value)}>{applicationSectionTypes.map(k=><option value={k} key={k}>{tr(k)}</option>)}</select></label><button id="app-add-section" className="app-secondary" onClick={()=>onAction({type:'addSection',sectionType,title:tr(sectionType)})}><IconPlus size={18} aria-hidden="true"/>{tr('addSection')}</button></div>
  </>}
 </div>
}
