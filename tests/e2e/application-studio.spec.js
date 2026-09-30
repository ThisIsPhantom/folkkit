import {test,expect} from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import {readFile} from 'node:fs/promises'
import {Buffer} from 'node:buffer'
import {getDocument} from 'pdfjs-dist/legacy/build/pdf.mjs'

async function useExample(page){await page.goto('/application');await expect(page.getByRole('tab',{name:'Inhalt',exact:true})).toBeVisible();await previewView(page);await page.getByRole('button',{name:'Mit Beispiel ausprobieren'}).click();await expect(page.locator('.app-preview text').first()).toHaveText('Mira Muster')}
async function editView(page){const button=page.getByRole('button',{name:'Bearbeiten',exact:true});if(await button.isVisible())await button.click()}
async function previewView(page){const button=page.getByRole('button',{name:'Vorschau',exact:true});if(await button.isVisible())await button.click()}

test('two content columns, photo geometry and embedded fonts survive project and PDF export @matrix',async({page})=>{
 await useExample(page);await editView(page)
 const {onePixelPngBase64}=await import('../fixtures/coreFixtures.js')
 await page.locator('input[accept="image/png,image/jpeg,image/webp"]').setInputFiles({name:'photo.png',mimeType:'image/png',buffer:Buffer.from(onePixelPngBase64,'base64')})
 await expect(page.getByRole('button',{name:'Foto entfernen'})).toBeVisible()
 await page.getByRole('button',{name:'Foto gestalten'}).click()
 await page.getByLabel('Fotoposition').selectOption('left')
 for(const [label,value] of [['Fotogrösse','145'],['Fotoabstand vom Seitenrand','9'],['Fotoabstand nach unten','16']]){await page.getByLabel(label,{exact:true}).fill(value);await page.getByLabel(label,{exact:true}).press('Tab')}
 await page.getByLabel('Spaltenlayout').selectOption('two')
 await previewView(page)
 await expect(page.locator('.app-preview image').first()).toHaveAttribute('x','51')
 await expect(page.locator('.app-preview image').first()).toHaveAttribute('y','56')
 await expect(page.locator('.app-preview image').first()).toHaveAttribute('width','145')
 const x=async name=>Number(await page.locator('.app-preview text').filter({hasText:new RegExp(`^${name}$`)}).first().getAttribute('x'))
 expect(await x('Ausbildung')).toBeGreaterThan(await x('Berufserfahrung')+200)
 await editView(page)
 for(const [family,css] of [['openSans','Application Open Sans'],['notoSans','Application Noto Sans'],['notoSerif','Application Noto Serif']]){
  await page.getByLabel('Schrift',{exact:true}).selectOption(family);await previewView(page)
  await expect(page.locator('.app-preview text').first()).toHaveAttribute('font-family',css)
  await page.evaluate(()=>document.fonts.ready);await editView(page)
 }
 const jsonDownload=page.waitForEvent('download');await page.getByRole('button',{name:'Projekt speichern',exact:true}).click();const json=await jsonDownload;const jsonPath=await json.path();const project=JSON.parse(await readFile(jsonPath,'utf8'))
 expect(project.resume.design).toMatchObject({layout:'two',photoPosition:'left',photoSize:145,font:'notoSerif'})
 const pdfDownload=page.waitForEvent('download');await page.getByRole('button',{name:'PDF herunterladen',exact:true}).click();const file=await pdfDownload
 const task=getDocument({data:new Uint8Array(await readFile(await file.path())),useSystemFonts:false});const pdf=await task.promise;const items=(await (await pdf.getPage(1)).getTextContent()).items
 expect(items.map(i=>i.str).join(' ')).toContain('Mira Muster')
 expect(items.find(i=>i.str==='Ausbildung').transform[4]).toBeGreaterThan(items.find(i=>i.str==='Berufserfahrung').transform[4]+200)
 await task.destroy()
 page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Neues Projekt'}).click()
 await page.locator('input[accept=".json,application/json"]').setInputFiles(jsonPath)
 await expect(page.getByLabel('Spaltenlayout')).toHaveValue('two');await expect(page.getByLabel('Fotogrösse')).toHaveValue('145')
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
})

test('application editor, templates, project roundtrip and real PDF @matrix',async({page})=>{
 await useExample(page);await editView(page)
 await page.getByLabel('Vollständiger Name',{exact:true}).fill('Mira Browser')
 await page.getByRole('tab',{name:'Vorlagen'}).click();await page.getByRole('button',{name:/ATS Pur/}).click()
 await page.getByRole('tab',{name:'Gestaltung'}).click();await page.getByLabel('Textgrösse',{exact:true}).fill('11')
 await page.getByRole('tab',{name:'Inhalt',exact:true}).click();await expect(page.getByLabel('Vollständiger Name')).toHaveValue('Mira Browser')
 const jsonDownload=page.waitForEvent('download');await page.getByRole('button',{name:'Projekt speichern',exact:true}).click();const json=await jsonDownload;const jsonPath=await json.path();const saved=JSON.parse(await readFile(jsonPath,'utf8'));expect(saved.person.name).toBe('Mira Browser');expect(saved.resume.design.template).toBe('ats')
 await previewView(page);await expect(page.locator('.app-preview text').first()).toHaveText('Mira Browser');await editView(page)
 await page.getByRole('button',{name:'Anschreiben',exact:true}).click();await page.getByLabel('Betreff',{exact:true}).fill('Bewerbung Browserprüfung')
 const pdfDownload=page.waitForEvent('download');await page.getByRole('button',{name:'PDF herunterladen',exact:true}).click();const downloaded=await pdfDownload;const task=getDocument({data:new Uint8Array(await readFile(await downloaded.path())),useSystemFonts:true});const pdf=await task.promise;const content=await (await pdf.getPage(1)).getTextContent();expect(content.items.map(i=>i.str).join(' ')).toContain('Bewerbung Browserprüfung');await task.destroy()
 page.once('dialog',dialog=>dialog.accept());await page.getByRole('button',{name:'Neues Projekt',exact:true}).click();await expect(page.getByLabel('Vollständiger Name')).toHaveValue('')
 await page.locator('input[type=file][accept=".json,application/json"]').setInputFiles(jsonPath);await expect(page.getByLabel('Vollständiger Name')).toHaveValue('Mira Browser')
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
})

test('application keyboard, accessibility, languages and privacy @matrix',async({page})=>{
 const requests=[];page.on('request',r=>requests.push({url:r.url(),body:r.postData()}));await useExample(page);await editView(page)
 await page.getByLabel('Vollständiger Name').fill('PRIVATE_APPLICATION_SENTINEL')
 await page.getByRole('tab',{name:'Inhalt',exact:true}).focus();await page.keyboard.press('ArrowRight');await expect(page.getByRole('tab',{name:'Vorlagen'})).toBeFocused()
 await page.getByRole('tab',{name:'Inhalt',exact:true}).click()
 const axe=await new AxeBuilder({page}).include('.application-studio').analyze();expect(axe.violations.filter(v=>['critical','serious'].includes(v.impact))).toEqual([])
 const english=page.getByRole('button',{name:'English',exact:true});await english.click();await expect(page.getByLabel('Full name')).toHaveValue('PRIVATE_APPLICATION_SENTINEL')
 await page.getByRole('button',{name:'Deutsch',exact:true}).click()
 const nav=page.getByRole('link',{name:'Rechner',exact:true});if(await nav.isVisible())await nav.click();else{await page.getByRole('button',{name:'Menü öffnen'}).click();await page.getByRole('navigation',{name:'Mobile Navigation'}).getByRole('link',{name:'Rechner',exact:true}).click()}
 await page.goBack();await editView(page);await expect(page.getByLabel('Vollständiger Name')).toHaveValue('PRIVATE_APPLICATION_SENTINEL')
 const storage=await page.evaluate(async()=>{
  const values=[JSON.stringify(localStorage),JSON.stringify(sessionStorage)]
  for(const name of await caches.keys()){const cache=await caches.open(name);for(const key of await cache.keys()){values.push(key.url);const response=await cache.match(key);if(/javascript|json|text\//.test(response?.headers.get('content-type')||''))values.push(await response.text())}}
  for(const {name} of await indexedDB.databases()){const db=await new Promise((resolve,reject)=>{const request=indexedDB.open(name);request.onsuccess=()=>resolve(request.result);request.onerror=reject});for(const store of db.objectStoreNames){const data=await new Promise((resolve,reject)=>{const request=db.transaction(store).objectStore(store).getAll();request.onsuccess=()=>resolve(request.result);request.onerror=reject});values.push(JSON.stringify(data))}db.close()}
  return values.join(' ')
 });expect(storage).not.toContain('PRIVATE_APPLICATION_SENTINEL')
 expect(requests.every(r=>new URL(r.url).origin===new URL(page.url()).origin)).toBe(true);expect(requests.some(r=>r.body?.includes('PRIVATE_APPLICATION_SENTINEL'))).toBe(false)
 await page.emulateMedia({reducedMotion:'reduce'});await page.getByRole('button',{name:'Dunkles Design',exact:true}).click();await previewView(page)
 await expect(page.locator('.app-paper svg > rect').first()).toHaveAttribute('fill','white')
})

test('long application text stays complete across exported pages',async({page})=>{
 await useExample(page);await editView(page)
 const description=page.getByLabel('Beschreibung',{exact:true}).first();const text=Array.from({length:1500},(_,i)=>`Beleg${i}`).join(' ');await description.fill(text)
 await previewView(page);await expect(page.locator('.app-paper')).not.toHaveCount(1);await editView(page)
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'PDF herunterladen',exact:true}).click();const file=await download
 const task=getDocument({data:new Uint8Array(await readFile(await file.path())),useSystemFonts:true});const pdf=await task.promise;let extracted='';for(let i=1;i<=pdf.numPages;i++)extracted+=(await (await pdf.getPage(i)).getTextContent()).items.map(x=>x.str).join(' ')+' '
 expect(pdf.numPages).toBeGreaterThan(1);expect(extracted).toContain('Beleg0');expect(extracted).toContain('Beleg1499');expect(extracted.match(/\bBeleg123\b/g)).toHaveLength(1);await task.destroy()
})

test('preview zoom increases document width and left edge stays reachable @matrix',async({page})=>{
 await useExample(page);await previewView(page)
 const paper=page.locator('.app-paper').first();const before=(await paper.boundingBox()).width
 await page.getByLabel('Vorschau-Zoom').selectOption('1.5');const after=(await paper.boundingBox()).width
 expect(after).toBeGreaterThan(before*1.4)
 await page.locator('.app-preview-scroll').evaluate(el=>el.scrollLeft=0)
 const paperX=(await paper.boundingBox()).x,scrollX=(await page.locator('.app-preview-scroll').boundingBox()).x
 expect(paperX).toBeGreaterThanOrEqual(scrollX)
})
