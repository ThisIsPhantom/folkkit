// Folkkit original application templates, September 2026.
export const applicationTemplates = Object.freeze([
 { id:'ats', name:'ATS Pur', font:'helvetica', accent:'#20272e', header:'plain' },
 { id:'modern', name:'Modern', font:'helvetica', accent:'#176e59', header:'accent' },
 { id:'editorial', name:'Editorial', font:'times', accent:'#584744', header:'editorial' },
 { id:'swiss', name:'Swiss Classic', font:'helvetica', accent:'#354b60', header:'classic' },
])
export function applicationDesign(templateId='modern') {
 const t = applicationTemplates.find(t=>t.id===templateId) || applicationTemplates[1]
 return {template:t.id,pageFormat:'a4',margins:{top:40,right:42,bottom:40,left:42},font:t.font,fontSize:10.5,lineHeight:1.35,paragraphGap:7,sectionGap:17,entryGap:10,dateWidth:100,accent:t.accent,textColor:'#20272e',header:t.header,photoSize:t.id==='ats'?36:68,photoShape:'round',showPhoto:t.id!=='ats'}
}
export function applyApplicationTemplate(project,kind,id) {
 if (!['resume','letter'].includes(kind)||!applicationTemplates.some(t=>t.id===id)) return project
 return {...project,[kind]:{...project[kind],design:applicationDesign(id)}}
}
