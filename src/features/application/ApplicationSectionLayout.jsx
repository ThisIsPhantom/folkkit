import {useI18n} from '../../i18n/index.js'

export default function ApplicationSectionLayout({section,onAction}) {
 const {t}=useI18n();const tr=key=>t(`studioApplication.${key}`)
 const change=(field,value)=>onAction({type:'section',sectionId:section.id,field,value})
 return <div className="app-section-layout">
  <label className="app-field"><span>{tr('sectionWidth')}</span><select value={section.column||'auto'} onChange={e=>change('column',e.target.value)}>
   {['auto','full','left','right'].map(id=><option key={id} value={id}>{tr({auto:'documentDefault',full:'fullWidth',left:'leftHalf',right:'rightHalf'}[id])}</option>)}
  </select></label>
  {section.type!=='pageBreak'&&<label className="app-check"><input type="checkbox" checked={!!section.newBand} onChange={e=>change('newBand',e.target.checked)}/>{tr('newBand')}</label>}
  <p className="app-note">{tr('sectionLayoutHint')}</p>
 </div>
}
