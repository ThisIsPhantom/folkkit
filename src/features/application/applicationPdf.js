import {PDFDocument,PDFName,PDFString,rgb,pushGraphicsState,popGraphicsState,moveTo,appendBezierCurve,clip,endPath} from 'pdf-lib'
import {applicationFontNames,layoutApplication} from './applicationLayout.js'
import {validateApplicationProject} from './applicationModel.js'
import {applicationError} from './applicationFiles.js'
const color=hex=>rgb(...[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255))
function circle(x,y,r){const k=r*.55228475;return [pushGraphicsState(),moveTo(x+r,y),appendBezierCurve(x+r,y+k,x+k,y+r,x,y+r),appendBezierCurve(x-k,y+r,x-r,y+k,x-r,y),appendBezierCurve(x-r,y-k,x-k,y-r,x,y-r),appendBezierCurve(x+k,y-r,x+r,y-k,x+r,y),clip(),endPath()]}
export async function exportApplicationPdf(project,kinds,metrics){
 if(!validateApplicationProject(project).ok)throw applicationError('invalidProject')
 if(!Array.isArray(kinds)||!kinds.length||kinds.some(k=>!['resume','letter'].includes(k)))throw applicationError('invalidProject')
 const layouts=kinds.map(kind=>layoutApplication(project,kind,metrics));const issue=layouts.flatMap(l=>l.issues).find(i=>i.blocking);if(issue)throw applicationError(issue.code)
 try{
  const doc=await PDFDocument.create();doc.setCreator('Folkkit');doc.setProducer('Folkkit · local application studio')
  const fonts=Object.fromEntries(await Promise.all(Object.entries(applicationFontNames).map(async([key,name])=>[key,await doc.embedFont(name)])))
  const photo=project.photo?await (project.photo.mime==='image/jpeg'?doc.embedJpg(project.photo.data):doc.embedPng(project.photo.data)):null
  for(const layout of layouts)for(const data of layout.pages){
   const page=doc.addPage([data.width,data.height]);const annotations=[]
   for(const r of data.runs){page.drawText(r.text,{x:r.x,y:data.height-r.y,size:r.size,font:fonts[r.font],color:color(r.color)})
    if(r.link){const annotation=doc.context.obj({Type:'Annot',Subtype:'Link',Rect:[r.x,data.height-r.y-2,r.x+r.width,data.height-r.y+r.size],Border:[0,0,0],A:{Type:'Action',S:'URI',URI:PDFString.of(r.link)}});annotations.push(doc.context.register(annotation))}}
   if(annotations.length)page.node.set(PDFName.of('Annots'),doc.context.obj(annotations))
   for(const l of data.lines)page.drawLine({start:{x:l.x1,y:data.height-l.y1},end:{x:l.x2,y:data.height-l.y2},thickness:l.width,color:color(l.color)})
   for(const i of data.images){const yy=data.height-i.y-i.height;if(i.shape==='round')page.pushOperators(...circle(i.x+i.width/2,yy+i.height/2,i.width/2));page.drawImage(photo,{x:i.x,y:yy,width:i.width,height:i.height});if(i.shape==='round')page.pushOperators(popGraphicsState())}
  }
  return await doc.save()
 }catch{throw applicationError('exportFailed')}
}
