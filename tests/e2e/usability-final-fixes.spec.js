import { expect, test } from '@playwright/test'
import { PDFDocument, StandardFonts } from 'pdf-lib'
import QRCode from 'qrcode'
import jsQR from 'jsqr'
import { PNG } from 'pngjs'
import { readFile } from 'node:fs/promises'
import { Buffer } from 'node:buffer'
import { withJpegOrientation } from './file-converter-fixtures/exif.mjs'

test.setTimeout(90000)
for (const orientation of [6,8]) for (const fallback of [false,true]) test(`QR EXIF ${orientation} ${fallback ? 'HTML fallback' : 'worker'} accepts upright images @matrix`, async ({page}) => {
  if (fallback) await page.addInitScript(() => {
    window.createImageBitmap = undefined
    const post = Worker.prototype.postMessage
    Worker.prototype.postMessage = function(message,...args) {
      if (message.type === 'decode-file') { queueMicrotask(() => this.dispatchEvent(new MessageEvent('message',{data:{type:'fallback'}}))); return }
      return post.call(this,message,...args)
    }
  })
  await page.goto('/qr?mode=read')
  const png = await QRCode.toDataURL('QR EXIF local regression',{width:240,margin:4})
  const jpeg = await page.evaluate(async png => {
    const image = new Image(); image.src = png; await image.decode()
    const canvas = document.createElement('canvas'); canvas.width=360; canvas.height=240
    const context = canvas.getContext('2d'); context.fillStyle='white'; context.fillRect(0,0,360,240); context.drawImage(image,60,0)
    return Array.from(new Uint8Array(await (await new Promise(resolve => canvas.toBlob(resolve,'image/jpeg',0.95))).arrayBuffer()))
  },png)
  const bytes = Array.from(withJpegOrientation(Uint8Array.from(jpeg),orientation))
  await page.locator('#qr-reader-file').setInputFiles({name:'qr.jpg',mimeType:'image/jpeg',buffer:Buffer.from(bytes)})
  await expect(page.locator('.qr-reader-result pre')).toHaveText('QR EXIF local regression')
  await expect(page.locator('.qr-error')).toHaveCount(0)
})

async function openPdf(page) {
  await page.addInitScript(() => localStorage.setItem('folkkit:locale','en'))
  await page.goto('/pdf')
  const pdf = await PDFDocument.create(), font = await pdf.embedFont(StandardFonts.Helvetica)
  for (const text of ['Alpha','Bravo','Charlie']) pdf.addPage([300,220]).drawText(text,{font,size:20,x:40,y:130})
  await page.getByLabel('Choose PDF',{exact:true}).setInputFiles({name:'history.pdf',mimeType:'application/pdf',buffer:Buffer.from(await pdf.save())})
  await expect(page.getByRole('button',{name:/^Text object 1: Alpha/})).toBeVisible({timeout:45000})
}
async function selectedIndices(page) { return page.locator('.pdf-page-check input').evaluateAll(inputs => inputs.flatMap((input,index) => input.checked ? [index] : [])) }
test('PDF history restores selected and displayed logical page after reorder and deletion', async ({page}) => {
  await openPdf(page)
  await page.getByRole('button',{name:'Move page later',exact:true}).click()
  await expect.poll(() => selectedIndices(page)).toEqual([1])
  await expect(page.getByRole('button',{name:/^Text object 1: Alpha/})).toBeVisible()
  await page.getByRole('button',{name:'Undo',exact:true}).click()
  await expect.poll(() => selectedIndices(page)).toEqual([0])
  await expect(page.getByRole('button',{name:/^Text object 1: Alpha/})).toBeVisible()
  await page.getByRole('button',{name:'Redo',exact:true}).click()
  await expect.poll(() => selectedIndices(page)).toEqual([1])
  await expect(page.getByRole('button',{name:/^Text object 1: Alpha/})).toBeVisible()
  await page.getByRole('button',{name:'Delete page',exact:true}).click()
  await expect(page.locator('.pdf-page-card')).toHaveCount(2)
  await page.getByRole('button',{name:'Undo',exact:true}).click()
  await expect.poll(() => selectedIndices(page)).toEqual([1])
  await expect(page.getByRole('button',{name:/^Text object 1: Alpha/})).toBeVisible()
})
for (const focus of ['Search text','Text content']) test(`PDF Escape cancels gesture while focus stays in ${focus} @matrix`, async ({page}) => {
  await openPdf(page)
  const object = page.getByRole('button',{name:/^Text object 1: Alpha/})
  await object.click()
  const rect = object.locator('rect'), before = await rect.getAttribute('x')
  await expect(page.getByLabel(focus,{exact:true})).toBeVisible()
  await page.getByLabel(focus,{exact:true}).focus()
  await object.scrollIntoViewIfNeeded()
  await expect(page.getByLabel(focus,{exact:true})).toBeFocused()
  const box = await object.boundingBox()
  await page.mouse.move(box.x+box.width/2,box.y+box.height/2); await page.mouse.down()
  await page.mouse.move(box.x+box.width/2+25,box.y+box.height/2+10)
  await page.keyboard.press('Escape'); await page.mouse.up()
  await expect(rect).toHaveAttribute('x',before)
  await expect(page.getByRole('button',{name:'Undo',exact:true})).toBeDisabled()
})

test('Wi-Fi PNG independently decodes exact edge spaces and reserved delimiters', async ({page}) => {
  await page.goto('/qr')
  await page.getByRole('radio',{name:'WLAN',exact:true}).click()
  await page.getByLabel('Netzwerkname',{exact:true}).fill(' Guest; ')
  await page.getByLabel('Passwort',{exact:true}).fill(' password: ')
  const download = page.waitForEvent('download')
  await page.getByRole('button',{name:'PNG herunterladen',exact:true}).click()
  const png = PNG.sync.read(await readFile(await (await download).path()))
  expect(jsQR(new Uint8ClampedArray(png.data),png.width,png.height).data).toBe('WIFI:T:WPA;S: Guest\\; ;P: password\\: ;;')
})
