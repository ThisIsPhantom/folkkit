import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import process from 'node:process'
import { Buffer } from 'node:buffer'
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
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
  const png = fileURLToPath(new URL('./file-converter-fixtures/sample.png',import.meta.url))

  await page.getByLabel('Choose files',{ exact:true }).setInputFiles(jpeg)
  await expect(page.getByText('Add files',{ exact:true })).toBeVisible()
  await expect(page.getByText('Drop your files here',{ exact:true })).toHaveCount(0)
  await page.getByText('Settings',{ exact:true }).click()
  await expect(page.getByRole('combobox',{ name:'Quality level',exact:true })).toHaveValue('balanced')
  await page.getByLabel('Maximum width (px)',{ exact:true }).fill('192')
  await page.getByRole('button',{ name:'Start optimization',exact:true }).click()
  await expect(page.getByText('Done',{ exact:true })).toBeVisible()
  await expect(page.getByText('The re-encoded file would be larger. The original is provided instead.',{ exact:true })).toBeVisible()
  await expect(page.locator('.converter-result-summary strong')).toHaveText('sample.jpg')
  await expect(page.locator('.converter-comparison img')).toHaveCount(2)
  const originalDownload = page.waitForEvent('download')
  await page.getByRole('button',{ name:'Download result: sample.jpg',exact:true }).click()
  const originalPath = testInfo.outputPath('optimizer-original.jpg')
  await (await originalDownload).saveAs(originalPath)
  expect(Buffer.compare(readFileSync(originalPath),readFileSync(jpeg))).toBe(0)

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
