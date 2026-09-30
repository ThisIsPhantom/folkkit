import {applicationLimits,validateApplicationProject} from './applicationModel.js'
import {inspectLogoHeader} from '../qr/qrModel.js'
export function applicationError(code){return Object.assign(new Error(code),{code})}
export function readApplicationBlob(blob){
 if(typeof blob.text==='function')return blob.text()
 return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(applicationError('invalidProject'));r.readAsText(blob)})
}
export async function readApplicationProject(file){
 if(file.size>applicationLimits.file)throw applicationError('fileLimit')
 try{const result=validateApplicationProject(JSON.parse(await readApplicationBlob(file)));if(!result.ok)throw applicationError('invalidProject');if(result.project.photo)await validateImportedPhoto(result.project.photo);return result.project}catch(e){throw applicationError(e.code||'invalidProject')}
}
export function serializeApplicationProject(project){
 const result=validateApplicationProject(project);if(!result.ok)throw applicationError('invalidProject')
 const blob=new Blob([JSON.stringify(result.project,null,2)],{type:'application/json'});if(blob.size>applicationLimits.file)throw applicationError('fileLimit');return blob
}
export function inspectApplicationPhoto(bytes,size){
 if(size>applicationLimits.file)throw applicationError('fileLimit')
 const info=inspectLogoHeader(bytes,size);if(!info||info.width<1||info.height<1||info.width*info.height>applicationLimits.pixels)throw applicationError('invalidPhoto')
 return info
}
function arrayBuffer(file){if(file.arrayBuffer)return file.arrayBuffer();return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(applicationError('invalidPhoto'));r.readAsArrayBuffer(file)})}
export async function readApplicationPhoto(file){
 if(file.size>applicationLimits.file)throw applicationError('fileLimit')
 const bytes=new Uint8Array(await arrayBuffer(file));const info=inspectApplicationPhoto(bytes,file.size)
 const blob=new Blob([bytes],{type:`image/${info.kind==='jpeg'?'jpeg':info.kind}`});const url=URL.createObjectURL(blob)
 try{
  const image=new Image();await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(applicationError('invalidPhoto'));image.src=url})
  if(image.naturalWidth*image.naturalHeight>applicationLimits.pixels)throw applicationError('invalidPhoto')
  const canvas=document.createElement('canvas');canvas.width=canvas.height=512
  const side=Math.min(image.naturalWidth,image.naturalHeight);canvas.getContext('2d').drawImage(image,(image.naturalWidth-side)/2,(image.naturalHeight-side)/2,side,side,0,0,512,512)
  return {mime:'image/png',data:canvas.toDataURL('image/png'),width:512,height:512}
 }catch(e){throw applicationError(e.code||'invalidPhoto')}finally{URL.revokeObjectURL(url)}
}
export function downloadApplicationBlob(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.hidden=true;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}

async function validateImportedPhoto(photo){
 const image=new Image()
 await new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>{image.onload=null;image.onerror=null;image.src='';reject(applicationError('invalidPhoto'))},5000)
  const done=error=>{clearTimeout(timer);image.onload=null;image.onerror=null;if(error)reject(applicationError('invalidPhoto'));else resolve()}
  image.onload=()=>done(image.naturalWidth!==photo.width||image.naturalHeight!==photo.height)
  image.onerror=()=>done(true);image.src=photo.data
 })
}
