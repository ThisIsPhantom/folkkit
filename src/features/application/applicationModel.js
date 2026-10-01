import {inspectLogoHeader} from '../qr/qrModel.js'
import { applicationDesign, applyApplicationTemplate, applicationFontFamilies, applicationTemplates } from './applicationTemplates.js'
export const applicationLimits = Object.freeze({ file:5*1024*1024, pixels:12*1000*1000, photoPixels:24*1000*1000, entries:100, characters:100000, pages:20 })
export const applicationSectionTypes = ['profile','experience','education','skills','languages','projects','engagement','custom','spacer','rule','pageBreak']
const personFields = ['name','title','email','phone','address','website','linkedin','instagram','citizenship']
const entryFields = ['title','organization','location','start','end','description']
export function applicationId() { return globalThis.crypto.randomUUID() }
export function emptyApplicationEntry() { return {id:applicationId(),...Object.fromEntries(entryFields.map(k=>[k,''])),visible:true,style:{}} }
const titles = { de:['Profil','Berufserfahrung','Ausbildung','Kenntnisse','Sprachen','Projekte','Engagement & Verantwortung'], en:['Profile','Work experience','Education','Skills','Languages','Projects','Engagement & responsibility'] }
export function createApplicationProject(locale='de',date=new Date().toLocaleDateString('sv-SE',{timeZone:'Europe/Zurich'})) {
 return {version:1,person:Object.fromEntries(personFields.map(k=>[k,''])),photo:null,resume:{design:applicationDesign(),sections:applicationSectionTypes.slice(0,7).map((type,i)=>({id:applicationId(),type,column:'auto',newBand:false,title:titles[locale==='en'?'en':'de'][i],visible:true,entries:[emptyApplicationEntry()],style:{}}))},letter:{recipient:'',date,place:'',subject:'',salutation:locale==='en'?'Dear hiring team,':'Sehr geehrte Damen und Herren',paragraphs:[{id:applicationId(),text:'',style:{}}],closing:locale==='en'?'Kind regards':'Freundliche Grüsse',design:applicationDesign()}}
}
function contrast(hex) {
 const c=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4)
 return 1.05/(c[0]*.2126+c[1]*.7152+c[2]*.0722+.05)
}
const styleRanges = {fontSize:[8,28],before:[0,60],after:[0,60],ruleWidth:[0,3],ruleGap:[0,20]}
export function validateApplicationProject(value) {
 const issues=[]; let chars=0,entries=0; const ids=new Set()
 const bad=target=>{issues.push({code:'invalidProject',target,blocking:true});return null}
 const string=(v,target)=>{if(typeof v!=='string') return bad(target)??'';chars+=v.length;return v}
 const number=(v,min,max,target)=>Number.isFinite(v)&&v>=min&&v<=max?v:bad(target)
 const color=(v,target)=>typeof v==='string'&&/^#[0-9a-f]{6}$/i.test(v)&&contrast(v)>=4.5?v:bad(target)
 const id=v=>{if(typeof v!=='string'||v.length>100||!v||ids.has(v))return bad('id');ids.add(v);return v}
 const boolean=v=>typeof v==='boolean'?v:bad('visibility')
 const style=v=>{
  if(!v||typeof v!=='object'||Array.isArray(v))return bad('style')??{}
  const out={}
  for(const [k,range] of Object.entries(styleRanges))if(k in v)out[k]=number(v[k],...range,k)
  for(const [k,opts] of Object.entries({weight:['regular','bold','italic'],align:['left','center','right']}))if(k in v)out[k]=opts.includes(v[k])?v[k]:bad(k)
  if('color'in v)out.color=color(v.color,'color')
  if('uppercase'in v)out.uppercase=boolean(v.uppercase)
  return out
 }
 const design=v=>{
  if(!v||!v.margins)return bad('design')
  const base=applicationDesign();const out={}
  for(const [k,opts] of Object.entries({template:applicationTemplates.map(t=>t.id),pageFormat:['a4','letter'],font:applicationFontFamilies,header:['plain','accent','editorial','classic'],photoShape:['round','rectangle']}))out[k]=opts.includes(v[k])?v[k]:bad(k)
  out.margins=Object.fromEntries(['top','right','bottom','left'].map(k=>[k,number(v.margins[k],18,90,k)]))
  for(const [k,r] of Object.entries({fontSize:[8,18],lineHeight:[1,2],paragraphGap:[0,60],sectionGap:[0,60],entryGap:[0,60],dateWidth:[60,150],photoSize:[24,180]}))out[k]=number(v[k],...r,k)
  for(const [k,opts] of Object.entries({layout:['single','two'],headerColumns:['one','two','three'],photoPosition:['left','right']}))out[k]=opts.includes(v[k]??base[k])?(v[k]??base[k]):bad(k)
  for(const [k,r] of Object.entries({columnGap:[12,48],leftColumnWidth:[35,65],photoOffsetX:[0,48],photoOffsetY:[0,90]}))out[k]=number(v[k]??base[k],...r,k)
  out.accent=color(v.accent,'accent');out.textColor=color(v.textColor,'textColor');out.showPhoto=boolean(v.showPhoto??base.showPhoto);out.showHeaderIcons=boolean(v.showHeaderIcons??base.showHeaderIcons);out.showSectionIcons=boolean(v.showSectionIcons??base.showSectionIcons)
  return out
 }
 try {
  if(!value||value.version!==1)return {ok:false,issues:[{code:'invalidProject',blocking:true}]}
  const person=Object.fromEntries(personFields.map(k=>[k,string(k==='instagram'?(value.person?.[k]??''):value.person?.[k],k)]))
  if(!Array.isArray(value.resume?.sections)||value.resume.sections.length>100)return {ok:false,issues:[{code:'invalidProject',blocking:true}]}
  const sections=value.resume.sections.map(s=>{
   if(!s||!applicationSectionTypes.includes(s.type)||!Array.isArray(s.entries)||s.entries.length>100){bad('section');return null}
   const es=s.entries.map(e=>{entries++;return {id:id(e.id),...Object.fromEntries(entryFields.map(k=>[k,string(e[k],k)])),visible:boolean(e.visible),style:style(e.style)}})
   return {id:id(s.id),type:s.type,newBand:boolean(s.newBand??false),column:['auto','full','left','right'].includes(s.column??'auto')?(s.column??'auto'):bad('column'),title:string(s.title,'heading'),visible:boolean(s.visible),entries:es,style:style(s.style)}
  })
  const l=value.letter
  if(!Array.isArray(l?.paragraphs)||l.paragraphs.length>100)return {ok:false,issues:[{code:'invalidProject',blocking:true}]}
  const letter={...Object.fromEntries(['recipient','date','place','subject','salutation','closing'].map(k=>[k,string(l[k],k)])),paragraphs:l.paragraphs.map(p=>({id:id(p.id),text:string(p.text,'paragraph'),style:style(p.style)})),design:design(l.design)}
  let photo=null
  if(value.photo!==null) {
   const p=value.photo
   if(!p||!['image/png','image/jpeg'].includes(p.mime)||typeof p.data!=='string'||!p.data.startsWith(`data:${p.mime};base64,`)||!/^data:image\/(png|jpeg);base64,[A-Za-z0-9+/]+={0,2}$/.test(p.data)||p.data.length>applicationLimits.file*4/3+100||!Number.isInteger(p.width)||!Number.isInteger(p.height)||p.width<1||p.height<1||p.width*p.height>applicationLimits.pixels)bad('photo')
   else {const raw=atob(p.data.split(',')[1]);const bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));const info=inspectLogoHeader(bytes,bytes.length);if(!info||info.width!==p.width||info.height!==p.height||`image/${info.kind}`!==p.mime)bad('photo');else photo={mime:p.mime,data:p.data,width:p.width,height:p.height}}
  }
  const project={version:1,person,photo,resume:{sections,design:design(value.resume.design)},letter}
  if(chars>applicationLimits.characters||entries>applicationLimits.entries)bad('limit')
  return issues.length?{ok:false,issues}:{ok:true,project,issues:[]}
 }catch{return {ok:false,issues:[{code:'invalidProject',blocking:true}]}}
}
function moved(list,id,direction) {const i=list.findIndex(e=>e.id===id),j=i+direction;if(i<0||j<0||j>=list.length)return list;const next=[...list];[next[i],next[j]]=[next[j],next[i]];return next}
export function updateApplicationProject(project,a) {
 const p=structuredClone(project);const kind=['resume','letter'].includes(a.kind)?a.kind:'resume'
 const s=p.resume.sections.find(s=>s.id===a.sectionId)
 const e=s?.entries.find(e=>e.id===a.entryId)
 if(a.type==='person'&&personFields.includes(a.field))p.person[a.field]=a.value
 else if(a.type==='letter'&&['recipient','date','place','subject','salutation','closing'].includes(a.field))p.letter[a.field]=a.value
 else if(a.type==='paragraph'){const para=p.letter.paragraphs.find(p=>p.id===a.id);if(para)para.text=a.value}
 else if(a.type==='addParagraph')p.letter.paragraphs.push({id:applicationId(),text:a.text||'',style:{}})
 else if(a.type==='deleteParagraph')p.letter.paragraphs=p.letter.paragraphs.filter(p=>p.id!==a.id)
 else if(a.type==='moveParagraph')p.letter.paragraphs=moved(p.letter.paragraphs,a.id,a.direction)
 else if(a.type==='duplicateParagraph'){const i=p.letter.paragraphs.findIndex(p=>p.id===a.id);if(i>=0)p.letter.paragraphs.splice(i+1,0,{...p.letter.paragraphs[i],id:applicationId()})}
 else if(a.type==='section'&&s&&['title','visible','column','newBand'].includes(a.field))s[a.field]=a.value
 else if(a.type==='entry'&&e&&[...entryFields,'visible'].includes(a.field))e[a.field]=a.value
 else if(a.type==='addEntry'&&s)s.entries.push(emptyApplicationEntry())
 else if(a.type==='duplicateEntry'&&e){const i=s.entries.indexOf(e);s.entries.splice(i+1,0,{...e,id:applicationId()})}
 else if(a.type==='deleteEntry'&&s)s.entries=s.entries.filter(e=>e.id!==a.entryId)
 else if(a.type==='moveEntry'&&s)s.entries=moved(s.entries,a.entryId,a.direction)
 else if(a.type==='duplicateSection'&&s){const i=p.resume.sections.indexOf(s);p.resume.sections.splice(i+1,0,{...s,id:applicationId(),entries:s.entries.map(e=>({...e,id:applicationId()}))})}
 else if(a.type==='moveSection')p.resume.sections=moved(p.resume.sections,a.sectionId,a.direction)
 else if(a.type==='deleteSection')p.resume.sections=p.resume.sections.filter(s=>s.id!==a.sectionId)
 else if(a.type==='addSection'&&applicationSectionTypes.includes(a.sectionType))p.resume.sections.push({id:applicationId(),type:a.sectionType,column:'auto',newBand:false,title:a.title||'',visible:true,entries:['spacer','rule','pageBreak'].includes(a.sectionType)?[]:[emptyApplicationEntry()],style:a.sectionType==='spacer'?{after:18}:{}})
 else if(a.type==='design'){if(a.field==='margins'&&['top','right','bottom','left'].includes(a.side))p[kind].design.margins[a.side]=a.value;else if(Object.hasOwn(p[kind].design,a.field))p[kind].design[a.field]=a.value}
 else if(a.type==='style'){
  const target=a.kind==='letter'?p.letter.paragraphs.find(p=>p.id===a.id):(e||s)
  if(target){if(a.reset)target.style={};else target.style={...target.style,[a.field]:a.value}}
 }
 else if(a.type==='template'||a.type==='resetDesign')return applyApplicationTemplate(project,kind,a.templateId||project[kind].design.template)
 else if(a.type==='photo')p.photo=a.photo
 const valid=validateApplicationProject(p)
 return valid.ok?valid.project:project
}
export function exampleApplicationProject(locale='de', date) {
 const p=createApplicationProject(locale,date);const en=locale==='en'
 p.person={...p.person,name:'Mira Muster',title:en?'Software Engineer · Digital solutions':'Software Engineer · Digitale Lösungen',email:'mira@example.com',phone:'+41 79 000 00 00',address:en?'Zürich, Switzerland':'Zürich, Schweiz',website:'example.com',linkedin:'',citizenship:''}
 p.resume.sections[0].entries[0].description=en?'Software engineer with a focus on useful products, reliable systems and clear collaboration. I turn complex requirements into practical digital solutions.':'Software Engineer mit Fokus auf nützliche Produkte, zuverlässige Systeme und klare Zusammenarbeit. Ich übersetze komplexe Anforderungen in praxistaugliche digitale Lösungen.'
 p.resume.sections[1].entries[0]={...emptyApplicationEntry(),title:'Software Engineer',organization:'Beispiel AG',location:'Zürich',start:'2023',end:en?'Present':'heute',description:en?'• Developed accessible web applications with React and TypeScript.\n• Automated recurring workflows and improved test coverage.\n• Worked closely with product and design teams.':'• Entwicklung barrierearmer Webanwendungen mit React und TypeScript.\n• Automatisierung wiederkehrender Abläufe und Ausbau der Testabdeckung.\n• Enge Zusammenarbeit mit Produkt- und Designteams.'}
 p.resume.sections[2].entries[0]={...emptyApplicationEntry(),title:en?'BSc Computer Science':'BSc Informatik',organization:'Beispiel Hochschule',location:'Zürich',start:'2019',end:'2023',description:''}
 p.resume.sections[3].entries[0].description='React · TypeScript · Python · SQL · Git · Docker'
 p.resume.sections[4].entries[0].description=en?'German — Native\nEnglish — Fluent':'Deutsch — Muttersprache\nEnglisch — Fliessend'
 p.resume.sections[5].entries[0]={...emptyApplicationEntry(),title:en?'Digital service portal':'Digitales Serviceportal',description:en?'Designed and implemented a self-service portal with a small interdisciplinary team.':'Konzeption und Umsetzung eines Self-Service-Portals in einem kleinen interdisziplinären Team.'}
 p.letter.recipient='Beispiel AG\nRecruiting\n8000 Zürich';p.letter.subject=en?'Application for Software Engineer':'Bewerbung als Software Engineer'
 p.letter.paragraphs=[{id:applicationId(),text:en?'Your focus on useful digital products aligns with my work. I would like to contribute my experience in web development and automation to your team.':'Ihr Fokus auf nützliche digitale Produkte passt zu meiner Arbeitsweise. Meine Erfahrung in Webentwicklung und Automatisierung möchte ich gerne in Ihr Team einbringen.',style:{}},{id:applicationId(),text:en?'At Beispiel AG, I develop web applications and collaborate closely with product and design. Clear requirements, reliable tests and accessible interfaces guide my work.':'Bei der Beispiel AG entwickle ich Webanwendungen und arbeite eng mit Produkt und Design zusammen. Klare Anforderungen, verlässliche Tests und zugängliche Oberflächen stehen dabei im Mittelpunkt.',style:{}},{id:applicationId(),text:en?'I look forward to discussing how I can contribute to your projects.':'Gerne bespreche ich in einem persönlichen Gespräch, wie ich Ihre Projekte unterstützen kann.',style:{}}]
 return p
}
