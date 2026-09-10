import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import process from 'node:process'
import { Buffer } from 'node:buffer'
import { spawnSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { unzipSync } from 'fflate'
import { PNG } from 'pngjs'

const probeBinary = process.env.FOLKKIT_TEST_FFPROBE || 'ffprobe'
function probeImage(path) {
  const result = spawnSync(probeBinary,['-v','error','-show_streams','-of','json',path],{ encoding:'utf8',windowsHide:true })
  expect(result.status,result.stderr || result.error?.message).toBe(0)
  return JSON.parse(result.stdout).streams[0]
}

test('@matrix file converter drop, individual targets, local ZIP and accessible mobile controls', async ({ page }, testInfo) => {
  const requests = []
  const browserErrors = []
  page.on('request', request => requests.push({ url: request.url(), method: request.method(), body: request.postData() }))
  page.on('pageerror',error => browserErrors.push(error.message))
  page.on('console',message => { if (message.type() === 'error') browserErrors.push(message.text()) })
  await page.addInitScript(() => localStorage.setItem('folkkit:locale', 'en'))
  await page.goto('/convert')
  await expect(page.locator('.converter-drop')).toBeVisible()
  const png = Array.from(readFileSync(fileURLToPath(new URL('./file-converter-fixtures/sample.png', import.meta.url))))
  await page.evaluate(bytes => {
    const transfer = new DataTransfer()
    for (const name of ['drop-a.png','drop-b.png']) transfer.items.add(new File([new Uint8Array(bytes)], name, { type:'image/png' }))
    document.querySelector('.converter-drop').dispatchEvent(new DragEvent('drop', { bubbles:true, dataTransfer:transfer }))
  }, png)
  await expect(page.getByText('Ready', { exact:true })).toHaveCount(2)
  await page.getByLabel('Output for all files').selectOption('webp')
  await page.getByLabel('Output format: drop-b.png', { exact:true }).selectOption('jpeg')
  await page.getByRole('button', { name:'Convert files', exact:true }).click()
  await expect(page.getByText('Done', { exact:true })).toHaveCount(2)
  const jpegRow = page.locator('.converter-file').filter({ hasText:'drop-b.png' })
  await expect(jpegRow.getByText('The resulting file is larger than the original.',{ exact:true })).toBeVisible()
  const pending = page.waitForEvent('download')
  await page.getByRole('button', { name:'Download all as ZIP', exact:true }).click()
  const download = await pending
  const entries = unzipSync(readFileSync(await download.path()))
  expect(Object.keys(entries)).toEqual(['drop-a.webp','drop-b.jpg'])
  expect(String.fromCharCode(...entries['drop-a.webp'].subarray(0,4))).toBe('RIFF')
  expect(Array.from(entries['drop-b.jpg'].subarray(0,3))).toEqual([255,216,255])
  const origin = new URL(page.url()).origin
  expect(requests.every(request => new URL(request.url).origin === origin && ['GET','HEAD'].includes(request.method) && !request.body)).toBe(true)
  await page.evaluate(() => window.scrollTo({ top:0, behavior:'instant' }))
  await page.screenshot({ path:testInfo.outputPath('converter-desktop.png'), fullPage:true })
  await page.setViewportSize({ width:390, height:844 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  expect((await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa']).analyze()).violations).toEqual([])
  await page.evaluate(() => window.scrollTo({ top:0, behavior:'instant' }))
  await page.screenshot({ path:testInfo.outputPath('converter-mobile.png'), fullPage:true })
  await page.getByRole('button', { name:'Clear files', exact:true }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByText('drop-a.png', { exact:true })).toHaveCount(0)
  expect(browserErrors).toEqual([])
})

test('@matrix image optimizer keeps useful originals and produces independently readable resized images', async ({ page },testInfo) => {
  test.setTimeout(150000)
  const requests = []
  const browserErrors = []
  page.on('request',request => requests.push({ url:request.url(),method:request.method(),body:request.postData() }))
  page.on('pageerror',error => browserErrors.push(error.message))
  page.on('console',message => { if (message.type() === 'error') browserErrors.push(message.text()) })
  await page.addInitScript(() => localStorage.setItem('folkkit:locale','en'))
  await page.goto('/convert')
  await page.getByRole('button',{ name:'Make images smaller',exact:true }).click()
  const jpeg = fileURLToPath(new URL('./file-converter-fixtures/sample.jpg',import.meta.url))
  const jpegBytes = readFileSync(jpeg)
  const png = fileURLToPath(new URL('./file-converter-fixtures/sample.png',import.meta.url))

  await page.getByLabel('Choose files',{ exact:true }).setInputFiles({ name:'untyped.jpg',mimeType:'application/octet-stream',buffer:jpegBytes })
  await expect(page.getByText('Add files',{ exact:true })).toBeVisible()
  await expect(page.getByText('Drop your files here',{ exact:true })).toHaveCount(0)
  await page.getByText('Settings',{ exact:true }).click()
  await expect(page.getByRole('combobox',{ name:'Quality level',exact:true })).toHaveValue('balanced')
  await page.getByLabel('Maximum width (px)',{ exact:true }).fill('192')
  await page.getByRole('button',{ name:'Start optimization',exact:true }).click()
  await expect(page.getByText('Done',{ exact:true })).toBeVisible()
  await expect(page.getByText('These settings would not reduce the file size. The original is provided instead.',{ exact:true })).toBeVisible()
  await expect(page.locator('.converter-result-summary strong')).toHaveText('untyped.jpg')
  await expect(page.locator('.converter-comparison img')).toHaveCount(2)
  const originalDownload = page.waitForEvent('download')
  await page.getByRole('button',{ name:'Download result: untyped.jpg',exact:true }).click()
  const originalPath = testInfo.outputPath('optimizer-original.jpg')
  await (await originalDownload).saveAs(originalPath)
  expect(Buffer.compare(readFileSync(originalPath),jpegBytes)).toBe(0)

  async function resizedJpeg(preset,name) {
    await page.getByRole('button',{ name:'Clear files',exact:true }).click()
    await page.getByLabel('Choose files',{ exact:true }).setInputFiles(jpeg)
    await page.getByText('Settings',{ exact:true }).click()
    await page.getByLabel('Maximum width (px)',{ exact:true }).fill('48')
    await page.getByRole('combobox',{ name:'Quality level',exact:true }).selectOption(preset)
    await page.getByRole('button',{ name:'Start optimization',exact:true }).click()
    await expect(page.getByText('Done',{ exact:true })).toBeVisible()
    const pending = page.waitForEvent('download')
    await page.getByRole('button',{ name:'Download result: sample-smaller.jpg',exact:true }).click()
    const path = testInfo.outputPath(name)
    await (await pending).saveAs(path)
    return path
  }
  const compact = await resizedJpeg('small','optimizer-compact.jpg')
  const high = await resizedJpeg('high','optimizer-high.jpg')
  for (const path of [compact,high]) expect(probeImage(path)).toMatchObject({ width:48,height:32 })
  expect(Buffer.compare(readFileSync(compact),readFileSync(high))).not.toBe(0)
  expect(readFileSync(compact).length).toBeLessThanOrEqual(readFileSync(high).length)

  await page.getByRole('button',{ name:'Clear files',exact:true }).click()
  await page.getByLabel('Choose files',{ exact:true }).setInputFiles(png)
  await page.getByText('Settings',{ exact:true }).click()
  await page.getByLabel('Maximum width (px)',{ exact:true }).fill('48')
  await expect(page.getByRole('combobox',{ name:'Quality level',exact:true })).toHaveCount(0)
  await page.getByRole('button',{ name:'Start optimization',exact:true }).click()
  await expect(page.getByText('Done',{ exact:true })).toBeVisible()
  const pngDownload = page.waitForEvent('download')
  await page.getByRole('button',{ name:'Download result: sample-smaller.png',exact:true }).click()
  const pngPath = testInfo.outputPath('optimizer-alpha.png')
  await (await pngDownload).saveAs(pngPath)
  const decoded = PNG.sync.read(readFileSync(pngPath))
  expect([decoded.width,decoded.height]).toEqual([48,32])
  expect(decoded.data[(16 * decoded.width + 40) * 4 + 3]).toBeGreaterThan(100)
  expect(decoded.data[(16 * decoded.width + 40) * 4 + 3]).toBeLessThan(160)

  const origin = new URL(page.url()).origin
  expect(requests.every(request => (request.url.startsWith('blob:') || new URL(request.url).origin === origin) && ['GET','HEAD'].includes(request.method) && !request.body)).toBe(true)
  await page.setViewportSize({ width:390,height:844 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.locator('.converter-start').scrollIntoViewIfNeeded()
  await expect(page.locator('.converter-start')).toBeInViewport()
  await page.screenshot({ path:testInfo.outputPath('optimizer-mobile.png'),fullPage:true })
  expect(browserErrors).toEqual([])
})


test('@matrix converter batch settings preserve other profiles and completed cleanup keeps pending files', async ({ page }, testInfo) => {
  const requests = [], errors = []
  page.on('request', request => requests.push({ url:request.url(),method:request.method(),body:request.postData() }))
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(() => {
    localStorage.setItem('folkkit:locale','en')
    const revoke = URL.revokeObjectURL.bind(URL)
    window.releasedConverterUrls = []
    URL.revokeObjectURL = url => { window.releasedConverterUrls.push(url); revoke(url) }
  })
  await page.goto('/convert')
  const png = new PNG({ width:120,height:80 }); png.data.fill(180)
  const buffer = PNG.sync.write(png)
  const file = name => ({ name,mimeType:'image/png',buffer })
  await page.getByLabel('Choose files',{ exact:true }).setInputFiles([file('batch-a.png'),file('batch-b.png'),file('other.png'),{ name:'unsupported.xyz',mimeType:'application/octet-stream',buffer:Buffer.from('not a supported file') }])
  await expect(page.getByText('Ready',{ exact:true })).toHaveCount(3)
  const first = page.locator('.converter-file').filter({ has:page.getByText('batch-a.png',{ exact:true }) })
  const second = page.locator('.converter-file').filter({ has:page.getByText('batch-b.png',{ exact:true }) })
  const other = page.locator('.converter-file').filter({ has:page.getByText('other.png',{ exact:true }) })
  await page.getByLabel('Output format: other.png',{ exact:true }).selectOption('webp')
  await first.getByText('Settings',{ exact:true }).click()
  await first.getByLabel('Width (px)',{ exact:true }).fill('60')
  await first.getByLabel('Quality (%)',{ exact:true }).fill('80')
  await expect(second.getByLabel('Width (px)',{ exact:true })).toHaveValue('')
  await first.getByRole('button',{ name:'Apply to 1 other file',exact:true }).click()
  await expect(first.getByRole('status')).toHaveText('Settings applied.')
  await expect(second.getByLabel('Width (px)',{ exact:true })).toHaveValue('60')
  await expect(second.getByLabel('Quality (%)',{ exact:true })).toHaveValue('80')
  await expect(other.getByLabel('Width (px)',{ exact:true })).toHaveValue('')
  await expect(page.locator('.converter-result')).toHaveCount(0)
  await page.evaluate(() => window.scrollTo({ top:0,behavior:'instant' }))
  await page.screenshot({ path:testInfo.outputPath('batch-settings.png'),fullPage:true })
  await page.getByRole('button',{ name:'Convert files',exact:true }).click()
  await expect(page.getByText('Done',{ exact:true })).toHaveCount(3)
  await first.getByRole('button',{ name:'Apply to 1 other file',exact:true }).click()
  await expect(first.getByRole('status')).toHaveText('The matching files already use these settings.')
  await expect(page.getByText('Done',{ exact:true })).toHaveCount(3)
  const previews = await page.locator('.converter-comparison img').evaluateAll(nodes => nodes.map(node => node.src))
  const downloaded = page.waitForEvent('download')
  await page.getByRole('button',{ name:'Download all as ZIP',exact:true }).click()
  const entries = unzipSync(readFileSync(await (await downloaded).path()))
  expect(Object.keys(entries)).toEqual(['batch-a.jpg','batch-b.jpg','other.webp'])
  for (const [name,bytes] of Object.entries(entries)) {
    const path = testInfo.outputPath(name); writeFileSync(path,bytes)
    const info = probeImage(path)
    expect([info.width,info.height]).toEqual(name === 'other.webp' ? [120,80] : [60,40])
  }
  await page.getByLabel('Add files',{ exact:true }).setInputFiles(file('pending.png'))
  await expect(page.getByText('Ready',{ exact:true })).toHaveCount(1)
  await page.getByRole('button',{ name:'Deutsch',exact:true }).click()
  const cleanup = page.getByRole('button',{ name:'Fertige Aufträge entfernen',exact:true })
  await cleanup.focus(); await page.keyboard.press('Enter')
  const heading = page.getByRole('heading',{ name:'Dateien 2',exact:true })
  await expect(heading).toBeFocused()
  await expect.poll(async () => {
    const title = await heading.boundingBox(), header = await page.locator('.site-header').boundingBox()
    return title.y >= header.y + header.height - 1
  }, { message:'Queue focus remains visible below the site header' }).toBe(true)
  await expect(page.getByText('pending.png',{ exact:true })).toBeVisible()
  await expect(page.getByText('unsupported.xyz',{ exact:true })).toBeVisible()
  await expect(page.getByText('batch-a.png',{ exact:true })).toHaveCount(0)
  await expect(page.getByText('batch-b.png',{ exact:true })).toHaveCount(0)
  expect(await page.evaluate(urls => urls.every(url => window.releasedConverterUrls.includes(url)),previews)).toBe(true)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  expect((await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa']).analyze()).violations).toEqual([])
  const origin = new URL(page.url()).origin
  expect(requests.every(request => new URL(request.url).origin === origin && ['GET','HEAD'].includes(request.method) && !request.body)).toBe(true)
  expect(errors).toEqual([])
})
