import {PDFDocument,StandardFonts} from 'pdf-lib'
import {applicationLimits} from './applicationModel.js'
export const applicationFontNames={helvetica:StandardFonts.Helvetica,'helvetica-bold':StandardFonts.HelveticaBold,'helvetica-italic':StandardFonts.HelveticaOblique,times:StandardFonts.TimesRoman,'times-bold':StandardFonts.TimesRomanBold,'times-italic':StandardFonts.TimesRomanItalic,courier:StandardFonts.Courier,'courier-bold':StandardFonts.CourierBold,'courier-italic':StandardFonts.CourierOblique}
const localFamilies={openSans:'OpenSans',notoSans:'NotoSans',notoSerif:'NotoSerif',sourceSans:'SourceSans3',sourceSerif:'SourceSerif4'}
export async function createApplicationFonts(families=[],load=async url=>{const response=await fetch(url);if(!response.ok)throw new Error('fontLoadFailed');return new Uint8Array(await response.arrayBuffer())}){
 const doc=await PDFDocument.create();const fonts=Object.fromEntries(await Promise.all(Object.entries(applicationFontNames).map(async([key,name])=>[key,await doc.embedFont(name)])))
 const selected=[...new Set(families)].filter(key=>localFamilies[key])
 if(selected.length){const {default:fontkit}=await import('@pdf-lib/fontkit');doc.registerFontkit(fontkit)}
 for(const family of selected)for(const [weight,suffix] of [['','Regular'],['-bold','Bold'],['-italic','Italic']]){
  const bytes=new Uint8Array(await load(`/fonts/application/${localFamilies[family]}-${suffix}.ttf`));const font=await doc.embedFont(bytes,{subset:true});font.applicationBytes=bytes;fonts[family+weight]=font
 }
 return fonts
}
export function safeApplicationLink(value,kind='website'){
 try {const v=String(value).trim();if(!v)return undefined
  if(kind==='email')return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)?`mailto:${v}`:undefined
  if(kind==='phone')return /^[+\d ()-]+$/.test(v)?`tel:${v.replace(/[ ()]/g,'')}`:undefined
  const u=new URL(/^https?:\/\//i.test(v)?v:`https://${v}`);return ['https:','http:'].includes(u.protocol)&&!u.username&&!u.password&&!/[\s]/.test(v)&&!/^\w+:(?!\/\/)/.test(v)?u.href:undefined
 }catch{return undefined}
}
export function layoutApplication(project,kind,fonts){
 const d=project[kind].design;const m={...d.margins}
 const [width,height]=d.pageFormat==='letter'?[612,792]:[595.28,841.89]
 const characterSets=new Map(Object.entries(fonts).filter(([,font])=>font.applicationBytes).map(([key,font])=>[key,new Set(font.getCharacterSet())]))
 const pages=[],issues=[];let page,y=m.top,stopped=false
 function issue(code,target){if(!issues.some(i=>i.code===code&&i.target===target))issues.push({code,target,blocking:true})}
 function newPage(){const index=page?pages.indexOf(page)+1:0;if(index===applicationLimits.pages){issue('pageLimit',kind);stopped=true;return}if(pages[index])page=pages[index];else {page={width,height,runs:[],lines:[],images:[]};pages.push(page)}y=m.top}
 newPage()
 let available=width-m.left-m.right,activeLane='full'
 function fontKey(weight){return weight&&weight!=='regular'?`${d.font}-${weight}`:d.font}
 function measure(text,size,key,target){try{const font=fonts[key];if(font.applicationBytes){const supported=characterSets.get(key);if([...text].some(c=>!supported.has(c.codePointAt(0))))throw new Error('unsupported')}return font.widthOfTextAtSize(text,size)}catch{issue('unsupportedCharacters',target);return 0}}
 function wrap(text,w,size,key,target){
  const lines=[]
  for(const para of String(text).replace(/\r/g,'').split('\n')){
   if(!para.trim()){lines.push('');continue}
   let line=''
   for(const word of para.trim().split(/\s+/)){
    const joined=line?`${line} ${word}`:word
    if(measure(joined,size,key,target)<=w){line=joined;continue}
    if(line){lines.push(line);line=''}
    if(measure(word,size,key,target)<=w){line=word;continue}
    let part='';for(const char of word){if(part&&measure(part+char,size,key,target)>w){lines.push(part);part=''}part+=char}line=part
   }
   if(line)lines.push(line)
  }
  return lines
 }
 function paragraphLines(value,w,size,key,target,paragraphs=false){
  const chunks=paragraphs?String(value).replace(/\r/g,'').split('\n'):[value]
  return chunks.flatMap((chunk,i)=>wrap(chunk,w,size,key,target).map((line,j)=>({line,before:paragraphs&&i>0&&j===0&&chunk.trim()&&!( /^[•*-]\s/.test(chunk)&&/^[•*-]\s/.test(chunks[i-1]))?d.paragraphGap:0})))
 }
 function ensure(h){if(y+h>height-m.bottom&&y>m.top)newPage()}
 function text(text,opts={}){
  if(!text?.trim()||stopped)return
  const size=opts.size||d.fontSize,key=fontKey(opts.weight),x=opts.x??m.left,w=opts.width??available,target=opts.entryId||opts.sectionId||kind
  const lines=paragraphLines(text,w,size,key,target,opts.paragraphs),lineHeight=size*d.lineHeight
  for(const {line,before} of lines){ensure(lineHeight+before);if(stopped)return;if(y>m.top)y+=before
   if(line){const length=measure(line,size,key,target);let xx=x;if(opts.align==='center')xx+=(w-length)/2;else if(opts.align==='right')xx+=w-length
    page.runs.push({text:line,x:xx,y:y+size,font:key,size,color:opts.color||d.textColor,width:length,link:opts.link,sectionId:opts.sectionId,entryId:opts.entryId})}
   y+=lineHeight
  }
 }
 function rule(color=d.accent,thickness=1,gap=5){ensure(gap+thickness);if(stopped)return;page.lines.push({x1:m.left,y1:y,x2:width-m.right,y2:y,width:thickness,color});y+=gap}
 function gap(n){y+=n}
 const photo=project.photo&&d.showPhoto?project.photo:null
 const reserve=photo?d.photoSize+18+(d.photoOffsetX||0):0
 const headerX=photo&&d.photoPosition==='left'?m.left+reserve:m.left
 const headerY=y
 if(photo)page.images.push({x:d.photoPosition==='left'?m.left+(d.photoOffsetX||0):width-m.right-d.photoSize-(d.photoOffsetX||0),y:y+(d.photoOffsetY||0),width:d.photoSize,height:d.photoSize,shape:d.photoShape,photo})
 text(project.person.name,{size:Math.min(28,d.fontSize*2.35),weight:'bold',color:d.accent,x:headerX,width:available-reserve})
 gap(3);text(project.person.title,{size:d.fontSize+1,x:headerX,width:available-reserve})
 gap(7)
 const contactKeys=['email','phone','address','website','linkedin','citizenship']
 for(const key of contactKeys)if(project.person[key])text(project.person[key],{size:Math.max(8,d.fontSize-1),x:headerX,width:available-reserve,link:safeApplicationLink(project.person[key],key)})
 if(photo)y=Math.max(y,headerY+d.photoSize+(d.photoOffsetY||0))
 gap(12);if(d.header==='accent'||d.header==='classic')rule(d.accent,d.header==='accent'?2:1,8)
 function entryGeometry(s,e){
  const date=[e.start,e.end].filter(Boolean).join(' – '),isColumn=activeLane==='full'&&d.layout!=='two'&&d.template!=='ats'&&['experience','education','projects','engagement'].includes(s.type)&&Boolean(date||e.location)
  const ex=isColumn?m.left+d.dateWidth+12:m.left,ew=isColumn?available-d.dateWidth-12:available
  const title=[e.title,e.organization].filter(Boolean).join(' · '),subtitle=isColumn?'':[date,e.location].filter(Boolean).join(' | ')
  const size=e.style.fontSize||d.fontSize,key=fontKey(e.style.weight)
  const count=(value,font)=>value.trim()?wrap(value,ew,size,font,e.id).length:0
  const descriptionLines=e.description.trim()?paragraphLines(e.description,ew,size,key,e.id,true):[]
  const mainHeight=(count(title,fontKey('bold'))+descriptionLines.length+count(subtitle,key))*size*d.lineHeight+descriptionLines.reduce((sum,l)=>sum+l.before,0)
  const sideSize=Math.max(8,size-1),sideCount=value=>value.trim()?wrap(value,d.dateWidth,sideSize,fontKey(),e.id).length:0
  const sideHeight=isColumn?(sideCount(date)+sideCount(e.location))*sideSize*d.lineHeight:0
  const estimate=Math.max(mainHeight,sideHeight)+d.entryGap+(e.style.before||0)+(e.style.after||0)
  return {date,isColumn,ex,ew,title,subtitle,size,estimate}
 }
 function styledText(value,style={},opts={}){gap(style.before||0);text(value,{...opts,size:style.fontSize||opts.size,weight:style.weight||opts.weight,color:style.color||opts.color,align:style.align||opts.align});gap(style.after||0)}
 if(kind==='letter'){
  gap(12);text([project.letter.place,project.letter.date].filter(Boolean).join(', '),{align:'right',size:d.fontSize-1})
  gap(18);text(project.letter.recipient);gap(22);ensure(d.fontSize*d.lineHeight*3)
  text(project.letter.subject,{weight:'bold',size:d.fontSize+1});gap(20);text(project.letter.salutation);gap(d.paragraphGap)
  for(const p of project.letter.paragraphs){styledText(p.text,p.style,{entryId:p.id});gap(d.paragraphGap)}
  gap(8);ensure(d.fontSize*d.lineHeight*2+8);text(project.letter.closing);gap(8);text(project.person.name,{weight:'bold'})
 }else{
  const fullLeft=m.left,fullRight=m.right,fullWidth=available
  const cursor=()=>({page,y})
  const restore=c=>{page=c.page;y=c.y}
  const later=(a,b)=>pages.indexOf(a.page)>pages.indexOf(b.page)?a:pages.indexOf(a.page)<pages.indexOf(b.page)?b:{page:a.page,y:Math.max(a.y,b.y)}
  let leftCursor=cursor(),rightCursor=cursor()
  for(const s of project.resume.sections){
   if(stopped)break;if(!s.visible)continue
   const form=['spacer','rule','pageBreak'].includes(s.type)
   const entries=s.entries.filter(e=>e.visible&&[e.title,e.organization,e.location,e.start,e.end,e.description].some(x=>x.trim()))
   if(!form&&!entries.length)continue
   const lane=s.type==='pageBreak'?'full':s.column&&s.column!=='auto'?s.column:d.layout!=='two'?'full':s.type==='profile'?'full':['skills','languages','education'].includes(s.type)?'right':'left'
   activeLane=lane
   m.left=fullLeft;m.right=fullRight;available=fullWidth
   if(s.newBand){const start=later(leftCursor,rightCursor);leftCursor=start;rightCursor=start}
   {
    if(lane==='full')restore(later(leftCursor,rightCursor))
    else {
     restore(lane==='left'?leftCursor:rightCursor)
     const gap=d.columnGap??24,leftWidth=(fullWidth-gap)*(d.leftColumnWidth??60)/100
     if(lane==='left'){available=leftWidth;m.right=width-fullLeft-leftWidth}
     else {m.left=fullLeft+leftWidth+gap;available=fullWidth-leftWidth-gap}
    }
   }
   const saveCursor=()=>{if(lane==='full'){leftCursor=cursor();rightCursor=cursor()}else if(lane==='left')leftCursor=cursor();else rightCursor=cursor()}
   if(form){
    if(s.type==='pageBreak'){if(page.runs.length||page.lines.length||page.images.length)newPage()}
    else if(s.type==='spacer'){ensure(s.style.after??18);gap(s.style.after??18)}
    else {gap(s.style.before||0);rule(s.style.color||d.accent,s.style.ruleWidth??1,s.style.ruleGap??5);gap(s.style.after||0)}
    saveCursor();continue
   }
   gap(d.sectionGap+(s.style.before||0));const headingSize=s.style.fontSize||d.fontSize+1.5
   const headingHeight=wrap(s.title,available,headingSize,fontKey(s.style.weight||'bold'),s.id).length*headingSize*d.lineHeight+4+(d.template!=='ats'||s.style.ruleWidth?(s.style.ruleGap??5):0)+(s.style.after||0)
   const firstEstimate=entryGeometry(s,entries[0]).estimate,usableHeight=height-m.top-m.bottom
   ensure(headingHeight+(firstEstimate+headingHeight<=usableHeight?firstEstimate:d.fontSize*d.lineHeight*2))
   text(s.style.uppercase?s.title.toUpperCase():s.title,{size:headingSize,weight:s.style.weight||'bold',color:s.style.color||d.accent,align:s.style.align,sectionId:s.id})
   gap(4);if(d.template!=='ats'||s.style.ruleWidth)rule(s.style.color||d.accent,s.style.ruleWidth??.7,s.style.ruleGap??5)
   gap(s.style.after||0)
   for(const [entryIndex,e] of entries.entries()){
    if(stopped)break
    const {date,isColumn,ex,ew,title,subtitle,size,estimate}=entryGeometry(s,e)
    if(estimate<=usableHeight&&(entryIndex!==0||estimate+headingHeight<=usableHeight))ensure(estimate)
    gap(e.style.before||0);const startY=y,startPage=page;let sideEnd={page,y}
    if(isColumn){text(date,{x:m.left,width:d.dateWidth,size:Math.max(8,size-1),entryId:e.id,sectionId:s.id});text(e.location,{x:m.left,width:d.dateWidth,size:Math.max(8,size-1),entryId:e.id,sectionId:s.id});sideEnd={page,y};page=startPage;y=startY}
    text(title,{x:ex,width:ew,size,weight:'bold',color:e.style.color,entryId:e.id,sectionId:s.id})
    if(subtitle)text(subtitle,{x:ex,width:ew,size:Math.max(8,size-1),entryId:e.id,sectionId:s.id})
    text(e.description,{x:ex,width:ew,size,weight:e.style.weight,color:e.style.color,align:e.style.align,entryId:e.id,sectionId:s.id,paragraphs:true})
    if(isColumn){const sideIndex=pages.indexOf(sideEnd.page),mainIndex=pages.indexOf(page);if(sideIndex>mainIndex){page=sideEnd.page;y=sideEnd.y}else if(sideIndex===mainIndex)y=Math.max(y,sideEnd.y)}
    gap(d.entryGap+(e.style.after||0))
   }
   saveCursor()
  }
 }
 return {pages,issues}
}
