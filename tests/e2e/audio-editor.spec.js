import {test,expect} from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import {readFileSync,writeFileSync} from 'node:fs'
import {spawnSync} from 'node:child_process'
import process from 'node:process'
import {Buffer} from 'node:buffer'
import {fileURLToPath} from 'node:url'
import {createOfflinePreview} from './helpers/offline-preview.mjs'
import {builtModulePath} from './helpers/builtArtifact.js'
const fixture=type=>fileURLToPath(new URL(`./file-converter-fixtures/sample.${type}`,import.meta.url))
const ffmpeg=process.env.FOLKKIT_TEST_FFMPEG||'ffmpeg',ffprobe=process.env.FOLKKIT_TEST_FFPROBE||'ffprobe'
let server
test.beforeEach(async()=>{server=await createOfflinePreview()})
test.afterEach(async()=>{await server.close()})
async function open(page,locale='en') {
 await page.addInitScript(locale=>{localStorage.setItem('folkkit:locale',locale)},locale)
 await page.goto(server.url+'/audio');await expect(page.getByRole('heading',{name:locale==='en'?'Trim audio':'Audio zuschneiden'})).toBeVisible()
}
async function field(page,name,value) {const input=page.getByLabel(name,{exact:true});await input.fill(String(value));await input.press('Tab')}
async function load(page,type='wav') {
 await page.getByLabel('Choose audio',{exact:true}).setInputFiles(fixture(type))
 await expect(page.locator('.audio-wave, .audio-editor [role=alert]')).toBeVisible({timeout:90000});await expect(page.locator('.audio-wave')).toBeVisible()
 await expect(page.locator('.audio-editor [role=alert]')).toHaveCount(0)
}
function probe(path,to) {
 const result=spawnSync(ffprobe,['-v','error','-show_streams','-show_format','-of','json',path],{encoding:'utf8',windowsHide:true});expect(result.status,result.stderr).toBe(0)
 const data=JSON.parse(result.stdout);expect(data.streams[0].codec_name).toBe({wav:'pcm_s16le',mp3:'mp3',flac:'flac',ogg:'vorbis'}[to]);expect(Math.abs(Number(data.format.duration)-0.6)).toBeLessThan(0.09)
 const decoded=spawnSync(ffmpeg,['-v','error','-i',path,'-ac','1','-ar','44100','-f','f32le','-'],{windowsHide:true});expect(decoded.status,decoded.stderr?.toString()).toBe(0)
 const bytes=decoded.stdout;const rms=(start,end)=>{let sum=0,count=0;for(let i=Math.floor(start*44100);i<Math.min(Math.floor(end*44100),bytes.length/4);i++){sum+=bytes.readFloatLE(i*4)**2;count++}return Math.sqrt(sum/count)}
 const center=rms(.25,.35);expect(center).toBeGreaterThan(.01);expect(rms(0,.025)).toBeLessThan(center*.3);expect(rms(.575,.6)).toBeLessThan(center*.35)
}
for(const from of ['wav','mp3','flac','ogg'])test(`audio real ${from} input to all four outputs including same format`,async({page},info)=>{
 test.setTimeout(180000);await open(page);const original=readFileSync(fixture(from));await load(page,from)
 await field(page,'Start (seconds)',.2);await field(page,'End (seconds)',.8);await field(page,'Fade in (seconds)',.15);await field(page,'Fade out (seconds)',.15)
 for(const to of ['wav','mp3','flac','ogg']) {
  await page.getByLabel('Output format',{exact:true}).selectOption(to);await page.getByRole('button',{name:'Export audio',exact:true}).click()
  await expect(page.getByRole('link',{name:'Download audio file'})).toBeVisible({timeout:90000})
  const promise=page.waitForEvent('download');await page.getByRole('link',{name:'Download audio file'}).click();const download=await promise,path=info.outputPath(`${from}-to-${to}.${to}`);await download.saveAs(path);probe(path,to)
 }
 expect(readFileSync(fixture(from))).toEqual(original)
})
async function nativePlaybackAvailable(page) {
 // Windows Playwright WebKit can expose canPlayType while lacking all native decoders.
 // Probe an independently generated MP3 through a real user gesture before judging playback.
 await page.evaluate(bytes=>{
  const button=document.createElement('button');button.id='audio-capability-check';button.textContent='Check native audio'
  globalThis.audioNativeResult=null
  button.onclick=async()=>{const audio=document.createElement('audio'),url=URL.createObjectURL(new Blob([Uint8Array.from(bytes)],{type:'audio/mpeg'}));audio.src=url
   try{await audio.play();globalThis.audioNativeResult=true}catch{globalThis.audioNativeResult=false}finally{audio.pause();audio.removeAttribute('src');audio.load();URL.revokeObjectURL(url)}}
  document.body.append(button)
 },Array.from(readFileSync(fixture('mp3'))))
 await page.locator('#audio-capability-check').click();await page.waitForFunction(()=>globalThis.audioNativeResult!==null)
 const supported=await page.evaluate(()=>globalThis.audioNativeResult);await page.locator('#audio-capability-check').evaluate(element=>element.remove());return supported
}
test('@matrix audio gestures playback cancel themes and accessibility under production CSP',async({page},info)=>{
 test.setTimeout(180000);const violations=[],external=[]
 await page.addInitScript(()=>{globalThis.audioCsp=[];document.addEventListener('securitypolicyviolation',event=>globalThis.audioCsp.push(event.violatedDirective))})
 page.on('request',request=>{if(/^https?:/.test(request.url())&&!request.url().startsWith(server.url))external.push(request.url())})
 page.on('pageerror',error=>violations.push(error.message));await open(page);const nativePlayback=await nativePlaybackAvailable(page);await load(page)
 await field(page,'Start (seconds)',.2);await field(page,'End (seconds)',.8)
 await page.getByRole('button',{name:'Play selection',exact:true}).click()
 if(nativePlayback){await expect(page.getByRole('button',{name:'Pause',exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Play selection',exact:true})).toBeVisible({timeout:3000})}
 else {await expect(page.locator('.audio-editor [role=alert]')).toContainText('This browser cannot play the audio preview.');await info.attach('native-playback-unavailable',{body:'Independent MP3 fixture fails in native HTMLAudioElement. Editing and export remain tested.',contentType:'text/plain'})}
 const start=page.getByRole('slider',{name:'Selection start'});await start.focus();await start.press('ArrowRight');await expect(start).toHaveAttribute('aria-valuenow','0.21')
 await page.getByRole('button',{name:'Undo',exact:true}).click();await expect(start).toHaveAttribute('aria-valuenow','0.2')
 if(info.project.name.includes('mobile')) {
  await start.scrollIntoViewIfNeeded();const box=await start.boundingBox(),session=await page.context().newCDPSession(page),x=box.x+box.width/2,y=box.y+box.height/2
  await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1}]});await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+40,y,id:1}]});await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await session.detach()
  expect(Number(await start.getAttribute('aria-valuenow'))).toBeGreaterThan(.2);await page.getByRole('button',{name:'Undo',exact:true}).click();await expect(start).toHaveAttribute('aria-valuenow','0.2')
 }else {
  const box=await start.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+60,box.y+box.height/2);await page.keyboard.press('Escape');await page.mouse.up();await expect(start).toHaveAttribute('aria-valuenow','0.2')
 }
 for(const theme of ['light','dark']){
  await page.evaluate(async theme=>{document.documentElement.setAttribute('data-theme',theme);await Promise.all(document.getAnimations().map(animation=>animation.finished.catch(()=>{})))},theme)
  expect((await new AxeBuilder({page}).include('.audio-editor').analyze()).violations).toEqual([])
 }
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
 await page.getByRole('button',{name:'Export audio',exact:true}).click();await page.getByRole('button',{name:'Cancel',exact:true}).press('Enter');await expect(page.getByRole('link',{name:'Download audio file'})).toHaveCount(0)
 await page.getByRole('button',{name:'Export audio',exact:true}).click();await expect(page.getByRole('link',{name:'Download audio file'})).toBeVisible({timeout:90000})
 expect(await page.evaluate(()=>globalThis.audioCsp)).toEqual([]);expect(violations).toEqual([]);expect(external).toEqual([])
 // Capture only after application CSP checks: WebKit's screenshot helper injects its own stylesheet.
 for(const theme of ['light','dark']){await page.evaluate(async theme=>{document.documentElement.setAttribute('data-theme',theme);await Promise.all(document.getAnimations().map(animation=>animation.finished.catch(()=>{})))},theme);await page.evaluate(()=>scrollTo(0,0));await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(0);await page.screenshot({path:info.outputPath(`audio-${theme}.png`),fullPage:true,caret:'initial'})}
})
test('full-band opposite-phase stereo waveform stays visible',async({page})=>{
 test.setTimeout(120000);await open(page)
 const moduleUrl=builtModulePath('audioEngine')
 const result=await page.evaluate(async moduleUrl=>{
  const rate=44100,n=rate*2,bytes=new Uint8Array(44+n*4),view=new DataView(bytes.buffer),write=(offset,text)=>bytes.set(new TextEncoder().encode(text),offset)
  write(0,'RIFF');view.setUint32(4,bytes.length-8,true);write(8,'WAVEfmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,2,true);view.setUint32(24,rate,true);view.setUint32(28,rate*4,true);view.setUint16(32,4,true);view.setUint16(34,16,true);write(36,'data');view.setUint32(40,n*4,true)
  for(let i=0;i<n;i++){const value=Math.round(.8*32767*Math.sin(2*Math.PI*8000*i/rate));view.setInt16(44+i*4,value,true);view.setInt16(46+i*4,-value,true)}
  const {prepareAudio}=await import(moduleUrl);const result=await prepareAudio(new File([bytes],'antiphase.wav',{type:'audio/wav'}));return {count:result.peaks.length,min:Math.min(...result.peaks.map(p=>p[0])),max:Math.max(...result.peaks.map(p=>p[1])),preview:result.preview.size}
 },moduleUrl)
 expect(result.count).toBeGreaterThan(1900);expect(result.count).toBeLessThanOrEqual(2048);expect(result.min).toBeLessThan(-.7);expect(result.max).toBeGreaterThan(.7);expect(result.preview).toBeGreaterThan(1000)
})
test('@matrix audio home-only cold offline UI and warm offline editing',async({page,context})=>{
 test.setTimeout(180000);await page.addInitScript(()=>localStorage.setItem('folkkit:locale','en'));await page.goto(server.url+'/');await page.evaluate(async()=>{await navigator.serviceWorker.ready});await page.reload()
 await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true)
 const initial=await page.evaluate(async()=>{const keys=await caches.keys();const urls=[];for(const key of keys)for(const request of await(await caches.open(key)).keys())urls.push(request.url);return urls})
 expect(initial.some(url=>url.includes('ffmpeg-core'))).toBe(false)
 // Another server instance gives a real cold failure without disabling Blob reads.
 const coldServer=server;server=await createOfflinePreview();coldServer.setOffline()
 try{
  await page.goto(coldServer.url+'/audio');await expect(page.getByRole('heading',{name:'Trim audio'})).toBeVisible()
  await page.getByLabel('Choose audio',{exact:true}).setInputFiles(fixture('wav'));await expect(page.locator('.audio-editor [role=alert]')).toContainText('The audio runtime is unavailable.',{timeout:30000})
 }finally{await coldServer.close()}
 const warm=await context.newPage();await open(warm);await load(warm)
 await warm.evaluate(async()=>{await navigator.serviceWorker.ready});await warm.reload();await expect.poll(()=>warm.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true)
 server.setOffline();await warm.reload();await load(warm);await field(warm,'End (seconds)',.6);await warm.getByRole('button',{name:'Export audio',exact:true}).click();await expect(warm.getByRole('link',{name:'Download audio file'})).toBeVisible({timeout:90000});await warm.close()
})

test('real private and legacy FFmpeg runtimes survive cancellation in both directions',async({page})=>{
 test.setTimeout(120000);await open(page)
 const result=await page.evaluate(async({engineUrl,mediaUrl,bytes})=>{
  const engine=await import(engineUrl),media=await import(mediaUrl),file=new File([Uint8Array.from(bytes)],'sample.wav',{type:'audio/wav'})
  await media.getFFmpeg();let killedLegacy=false
  try {
   const prepared=await engine.prepareAudio(file,{onProgress:()=>{if(!killedLegacy){killedLegacy=true;media.terminateMediaExecution()}}})
   const legacy=await media.getFFmpeg(),controller=new AbortController();let cancelled=false
   try{await engine.prepareAudio(file,{signal:controller.signal,onProgress:()=>controller.abort()})}catch(error){cancelled=error.code==='cancelled'}
   return {killedLegacy,preview:prepared.preview.size,cancelled,legacySame:legacy===await media.getFFmpeg(),legacyWorks:await legacy.exec(['-version'])}
  }finally{media.terminateMediaExecution()}
 },{engineUrl:builtModulePath('audioEngine'),mediaUrl:builtModulePath('media'),bytes:Array.from(readFileSync(fixture('wav')))})
 expect(result.killedLegacy).toBe(true);expect(result.preview).toBeGreaterThan(1000);expect(result.cancelled).toBe(true);expect(result.legacySame).toBe(true);expect(result.legacyWorks).toBe(0)
})

test('8000 Hz mono converter MP3 result opens in audio editor with exact decoded duration',async({page})=>{
 test.setTimeout(120000);await open(page)
 const result=await page.evaluate(async({engineUrl,convertUrl})=>{
  const rate=8000,count=rate*8,bytes=new Uint8Array(44+count*2),view=new DataView(bytes.buffer),write=(offset,text)=>bytes.set(new TextEncoder().encode(text),offset)
  write(0,'RIFF');view.setUint32(4,bytes.length-8,true);write(8,'WAVEfmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,rate,true);view.setUint32(28,rate*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);write(36,'data');view.setUint32(40,count*2,true)
  for(let i=0;i<count;i++)view.setInt16(44+i*2,Math.round(.5*32767*Math.sin(2*Math.PI*440*i/rate)),true)
  const file=new File([bytes],'low-rate.wav',{type:'audio/wav'}),{convertMediaFile}=await import(convertUrl),{prepareAudio}=await import(engineUrl)
  const mp3=await convertMediaFile(file,{from:'wav',to:'mp3'},{}),prepared=await prepareAudio(new File([mp3],'converted.mp3',{type:'audio/mpeg'}))
  return {duration:prepared.duration,windows:prepared.peaks.length,peak:Math.max(...prepared.peaks.map(peak=>peak[1])),bytes:mp3.size}
 },{engineUrl:builtModulePath('audioEngine'),convertUrl:builtModulePath('mediaEngine')})
 expect(Math.abs(result.duration-8)).toBeLessThan(.01);expect(result.windows).toBeLessThanOrEqual(2048);expect(result.peak).toBeGreaterThan(.2);expect(result.bytes).toBeGreaterThan(1000)
})

test('real MPEG-2.5 MP3 at 8000 Hz preserves gapless duration and exports',async({page},info)=>{
 test.setTimeout(120000);await open(page)
 const result=await page.evaluate(async({engineUrl,mediaUrl,probeUrl})=>{
  const {createBrowserFFmpegRuntime}=await import(mediaUrl),{prepareAudio,exportAudio}=await import(engineUrl),runtime=createBrowserFFmpegRuntime(),{probeMedia}=await import(probeUrl)
  let encoded,decodedSamples,containerDuration
  try{
   const ff=await runtime.get(),rate=8000,count=rate*8,bytes=new Uint8Array(44+count*2),view=new DataView(bytes.buffer),write=(offset,text)=>bytes.set(new TextEncoder().encode(text),offset)
   write(0,'RIFF');view.setUint32(4,bytes.length-8,true);write(8,'WAVEfmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,rate,true);view.setUint32(28,rate*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);write(36,'data');view.setUint32(40,count*2,true)
   for(let i=0;i<count;i++)view.setInt16(44+i*2,Math.round(.5*32767*Math.sin(2*Math.PI*440*i/rate)),true)
   await ff.writeFile('real8k.wav',bytes)
   if(await ff.exec(['-i','real8k.wav','-ac','1','-ar','8000','-c:a','libmp3lame','-b:a','32k','real8k.mp3'])!==0)throw new Error('fixture encoding failed')
   containerDuration=(await probeMedia(ff,'real8k.mp3')).duration
   encoded=await ff.readFile('real8k.mp3')
   if(await ff.exec(['-i','real8k.mp3','-ac','1','-ar','8000','-f','s16le','decoded.pcm'])!==0)throw new Error('fixture decoding failed')
   decodedSamples=(await ff.readFile('decoded.pcm')).length/2
  }finally{runtime.terminate()}
  const input=new File([encoded],'real8k.mp3',{type:'audio/mpeg'}),prepared=await prepareAudio(input)
  const output=await exportAudio(input,{from:'mp3',to:'wav',start:1,end:2,fadeIn:0,fadeOut:0})
  return {encoded:Array.from(encoded),output:Array.from(new Uint8Array(await output.blob.arrayBuffer())),decodedSamples,containerDuration,duration:prepared.duration,windows:prepared.peaks.length,peak:Math.max(...prepared.peaks.map(peak=>peak[1])),previewBytes:prepared.preview.size}
 },{engineUrl:builtModulePath('audioEngine'),mediaUrl:builtModulePath('media'),probeUrl:builtModulePath('mediaEngine')})
 expect(result.containerDuration).toBe(8.21);expect(result.decodedSamples).toBe(64000);expect(Math.abs(result.duration-8)).toBeLessThan(.001);expect(result.windows).toBeLessThanOrEqual(2048);expect(result.peak).toBeGreaterThan(.2);expect(result.previewBytes).toBeGreaterThan(1000)
 const inputPath=info.outputPath('real8k.mp3'),outputPath=info.outputPath('trim.wav')
 writeFileSync(inputPath,Buffer.from(result.encoded));writeFileSync(outputPath,Buffer.from(result.output))
 const inputProbe=spawnSync(ffprobe,['-v','error','-show_streams','-show_format','-of','json',inputPath],{encoding:'utf8',windowsHide:true})
 expect(inputProbe.status,inputProbe.stderr).toBe(0)
 const inputMetadata=JSON.parse(inputProbe.stdout);expect(inputMetadata.streams[0]).toMatchObject({codec_name:'mp3',sample_rate:'8000',channels:1});expect(Number(inputMetadata.format.duration)).toBeGreaterThanOrEqual(8)
 const decoded=spawnSync(ffmpeg,['-v','error','-i',inputPath,'-ac','1','-ar','8000','-f','s16le','-'],{windowsHide:true})
 expect(decoded.status,decoded.stderr?.toString()).toBe(0);expect(decoded.stdout.length/2).toBe(64000)
 const outputProbe=spawnSync(ffprobe,['-v','error','-show_streams','-show_format','-of','json',outputPath],{encoding:'utf8',windowsHide:true})
 expect(outputProbe.status,outputProbe.stderr).toBe(0)
 const outputMetadata=JSON.parse(outputProbe.stdout);expect(outputMetadata.streams[0].codec_name).toBe('pcm_s16le');expect(Number(outputMetadata.format.duration)).toBe(1)
 await info.attach('verified-mpeg25-timing',{body:JSON.stringify({browserContainerDuration:result.containerDuration,nativeDuration:inputMetadata.format.duration,decodedSamples:result.decodedSamples,preparedDuration:result.duration,windows:result.windows,previewBytes:result.previewBytes,outputDuration:outputMetadata.format.duration}),contentType:'application/json'})
})
