// Folkkit original application templates, September 2026.
export const applicationFontFamilies = ['helvetica','times','courier','openSans','notoSans','notoSerif','sourceSans','sourceSerif']
export const applicationTemplates = Object.freeze([
 { id:'ats', name:'ATS Pur', font:'helvetica', accent:'#20272e', header:'plain' },
 { id:'modern', name:'Modern', font:'helvetica', accent:'#176e59', header:'accent' },
 { id:'editorial', name:'Editorial', font:'times', accent:'#584744', header:'editorial' },
 { id:'swiss', name:'Swiss Classic', font:'helvetica', accent:'#354b60', header:'classic' },
 { id:'folio', name:'Folio', font:'sourceSerif', accent:'#634535', header:'editorial', settings:{margins:{top:48,right:52,bottom:48,left:52},fontSize:11,lineHeight:1.4,sectionGap:21,entryGap:12,photoShape:'rectangle',photoSize:62} },
 { id:'compact', name:'Compact', font:'sourceSans', accent:'#29544c', header:'classic', settings:{layout:'two',leftColumnWidth:62,columnGap:28,fontSize:10,lineHeight:1.3,sectionGap:14,entryGap:8,photoSize:56} },
])
export function applicationDesign(templateId='modern') {
 const t = applicationTemplates.find(t=>t.id===templateId) || applicationTemplates[1]
 return {template:t.id,pageFormat:'a4',margins:{top:40,right:42,bottom:40,left:42},font:t.font,fontSize:10.5,lineHeight:1.35,paragraphGap:7,sectionGap:17,entryGap:10,dateWidth:100,accent:t.accent,textColor:'#20272e',header:t.header,photoSize:t.id==='ats'?36:68,photoShape:'round',photoPosition:'right',photoOffsetX:0,photoOffsetY:0,layout:'single',columnGap:24,leftColumnWidth:60,showPhoto:t.id!=='ats',...structuredClone(t.settings||{})}
}
export function applyApplicationTemplate(project,kind,id) {
 if (!['resume','letter'].includes(kind)||!applicationTemplates.some(t=>t.id===id)) return project
 return {...project,[kind]:{...project[kind],design:applicationDesign(id)}}
}
