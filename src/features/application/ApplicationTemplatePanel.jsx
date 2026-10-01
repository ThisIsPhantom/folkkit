import {useMemo} from 'react'
import {IconCheck,IconLayout} from '@tabler/icons-react'
import {useI18n} from '../../i18n/index.js'
import {applicationTemplates,applyApplicationTemplate} from './applicationTemplates.js'
import {exampleApplicationProject} from './applicationModel.js'
import {layoutApplication} from './applicationLayout.js'
import {ApplicationPageSvg} from './ApplicationPreview.jsx'
export default function ApplicationTemplatePanel({project,documentKind,fonts,onAction}){
 const {t,locale}=useI18n();const tr=k=>t(`studioApplication.${k}`)
 const previews=useMemo(()=>fonts?applicationTemplates.map(t=>layoutApplication(applyApplicationTemplate(exampleApplicationProject(locale),documentKind,t.id),documentKind,fonts).pages[0]):[],[fonts,locale,documentKind])
 return <div><div className="app-panel-heading"><IconLayout size={23} aria-hidden="true"/><h2>{tr('templatesTitle')}</h2><p>{tr('templatesHint')}</p></div><div className="app-template-grid">{applicationTemplates.map((template,i)=><button className={`app-template ${project[documentKind].design.template===template.id?'app-template--selected':''}`} key={template.id} onClick={()=>onAction({type:'template',kind:documentKind,templateId:template.id})} aria-pressed={project[documentKind].design.template===template.id}>
  <div className={`app-template__thumbnail app-template__thumbnail--${template.id}`}>{previews[i]&&<ApplicationPageSvg page={previews[i]} mini/>}{project[documentKind].design.template===template.id&&<span className="app-template__check"><IconCheck size={16} aria-hidden="true"/></span>}</div><strong>{template.name}</strong>{template.id==='ats'&&<span className="app-badge">{tr('recommended')}</span>}<small>{tr(`${template.id}Description`)}</small>
 </button>)}</div><p className="app-note">{tr('atsNote')}</p></div>
}
