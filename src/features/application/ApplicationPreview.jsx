import {useId} from 'react'
import {useI18n} from '../../i18n/index.js'
export function ApplicationPageSvg({page,onSelectStyle,mini=false}){
 const id=useId().replace(/:/g,'');const {t}=useI18n()
 const groups=new Map()
 for(const r of page.runs){const key=r.entryId||r.sectionId||'header';if(!groups.has(key))groups.set(key,[]);groups.get(key).push(r)}
 return <svg viewBox={`0 0 ${page.width} ${page.height}`} xmlns="http://www.w3.org/2000/svg" aria-hidden={mini||undefined} role={mini?undefined:'group'} aria-label={mini?undefined:t('studioApplication.preview')}>
  <rect width={page.width} height={page.height} fill="white"/>
  {page.images.map((i,index)=><g key={index}><defs><clipPath id={`${id}-${index}`}>{i.shape==='round'?<circle cx={i.x+i.width/2} cy={i.y+i.height/2} r={i.width/2}/>:<rect x={i.x} y={i.y} width={i.width} height={i.height}/>}</clipPath></defs><image href={i.photo.data} x={i.x} y={i.y} width={i.width} height={i.height} clipPath={`url(#${id}-${index})`}/></g>)}
  {page.lines.map((l,i)=><line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.color} strokeWidth={l.width}/>)}
  {[...groups].map(([key,runs])=>{const first=runs[0],interactive=onSelectStyle&&(first.sectionId||first.entryId);const select=()=>onSelectStyle(first.sectionId?{sectionId:first.sectionId,entryId:first.entryId}:{kind:'letter',id:first.entryId});return <g key={key} role={interactive?'button':undefined} tabIndex={interactive?0:undefined} aria-label={interactive?`${t('studioApplication.editStyle')}: ${first.text.slice(0,60)}`:undefined} onClick={interactive?select:undefined} onKeyDown={interactive?e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select()}}:undefined} className={interactive?'app-preview__selectable':undefined}>
   {runs.map((r,i)=><text key={i} x={r.x} y={r.y} fill={r.color} fontFamily={r.font.startsWith('openSans')?'Application Open Sans':r.font.startsWith('notoSans')?'Application Noto Sans':r.font.startsWith('notoSerif')?'Application Noto Serif':r.font.startsWith('courier')?'Courier New, monospace':r.font.startsWith('times')?'Times New Roman, serif':'Arial, Helvetica, sans-serif'} fontSize={r.size} fontWeight={r.font.endsWith('-bold')?'bold':'normal'} fontStyle={r.font.endsWith('-italic')?'italic':'normal'} textLength={r.width||undefined} lengthAdjust="spacingAndGlyphs">{r.text}</text>)}
  </g>})}
 </svg>
}
export default function ApplicationPreview({layout,zoom,onSelectStyle}){
 const {t}=useI18n()
 return <div className={`app-preview app-preview--zoom-${zoom==='fit'?'fit':Math.round(zoom*100)}`} data-testid="application-preview">{layout?.pages.map((page,i)=><figure className="app-paper" key={i}><ApplicationPageSvg page={page} onSelectStyle={onSelectStyle}/><figcaption>{t('studioApplication.page',{number:i+1,total:layout.pages.length})}</figcaption></figure>)}</div>
}
